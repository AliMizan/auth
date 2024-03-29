"use server"
import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwofactorToken, generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

import * as z from "zod";

export const login = async (values:z.infer<typeof LoginSchema>) => {
      const validatedFields = LoginSchema.safeParse(values);

      if(!validatedFields.success){
        return {error:"Invalid fields "};
      }

      const {email,password ,code} =validatedFields.data;

      const existingUser = await getUserByEmail(email)

      if(!existingUser || !existingUser.email || !existingUser.password){
        return {error:"Email does not exist"}
      }

    if(!existingUser.emailVerified){
      const verificationToken = await generateVerificationToken(existingUser.email)

      
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      )

      return {success:"Confirmation Email Sent"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){
      if(code){
        const twofactorToken = await getTwoFactorTokenByEmail(existingUser.email);
        if(!twofactorToken) {
          return {error:"Invalid Code"}
        }

        if(twofactorToken.token !== code){
          return {error:"Invalid Code"}
        }

        const hasExpired = new Date(twofactorToken.expires) < new Date();

        if(hasExpired){
          return {error:"Token Expired"}
        }
        await db.twoFactorToken.delete({
          where:{
            id:twofactorToken.id
          }
        })

        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if(existingConfirmation){
          await db.twofactorConfirmation.delete({
            where:{
              id:existingConfirmation.id
            }
          })
        }

        await db.twofactorConfirmation.create({
          data:{
            userId:existingUser.id,
          }
        })


      }else{
      const twofactorToken = await generateTwofactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twofactorToken.email,twofactorToken.token)
      return {twoFactor : true};
      }
    }



      try {
        await signIn("credentials",{
          email,
          password,
          redirectTo:DEFAULT_LOGIN_REDIRECT,
        })
      } catch (error) {
        if(error instanceof AuthError){
          switch(error.type){
            case "CredentialsSignin":
              return {error:"Invalid Credentials"}
              default : 
              return {error:"Something Went Wrong"}
          }
        }
        throw error;
      }


}