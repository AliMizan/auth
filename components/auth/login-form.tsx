"use client"

import { CardWrapper } from "./card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import {  useState, useTransition } from "react";
import Link from "next/link";


const LoginForm = () => {
  const [showTwoFactor,setShowTwoFactor] = useState(false);
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition();


  const form  = useForm<z.infer<typeof LoginSchema>>({
    resolver:zodResolver(LoginSchema),
    defaultValues:{
      email:"",
      password:""
    }
  });

  const onSubmit  = (values:z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((data) => {
        if(data?.error){
          form.reset();
          setError(data.error)
        }

        if(data?.success){
          form.reset();
          setSuccess(data.success)
        }

        if(data?.twoFactor){
          setShowTwoFactor(true);
        }
      }).catch(() => setError("Something Went Wrong"))
    })
  }

  return (
    <CardWrapper
     headerLabel="Welcome" 
     backButtonHref="/auth/register"
     backButtonLabel="Don't Have an Account ?"
     showSocial >
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4" >
            {showTwoFactor && (
              <>
              <FormField 
            control={form.control} 
            name="code"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Two Factor Code
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="" disabled={isPending} />
                </FormControl>
                <FormMessage/>
              </FormItem>
             )}/>

              </>
            )}

            {!showTwoFactor &&
              (<>
              <FormField 
            control={form.control} 
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="abcd@gmail.com" disabled={isPending} />
                </FormControl>
                <FormMessage/>
              </FormItem>
             )}/>
             <FormField 
            control={form.control} 
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Password
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="*******" type="password" disabled={isPending}/>
                </FormControl>
                <Button size="sm" variant="link" asChild className="px-0 font-normal" >
                  <Link href="/auth/reset" >
                    Forgot Password ?
                  </Link>
                </Button>
                <FormMessage/>
              </FormItem>
             )}/>
             </>
             )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success}/>
          <Button type="submit"
          className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm