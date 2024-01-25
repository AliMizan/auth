import * as z from "zod";

export const LoginSchema = z.object({
    email:z.string().email({message:"email is required"}),
    password:z.string().min(1,{
        message:"Password is Required"
    })
});


export const RegisterSchema = z.object({
    name:z.string().min(1,{message:"Name is Required"}),
    email:z.string().email({message:"email is required"}),
    password:z.string().min(6,{
        message:"Minimum 6 characters are Required"
    })
});

