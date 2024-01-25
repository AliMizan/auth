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
import { startTransition, useState, useTransition } from "react";


const LoginForm = () => {
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,setIsPending] = useTransition();


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
        setError(data.error);
        setSuccess(data.success)
      })
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
            <FormField 
            control={form.control} 
            name="email"
            render={({field}) => (
              <FormItem>``
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
                <FormMessage/>
              </FormItem>
             )}/>
          </div>
          <FormError message={error} />
          <FormSuccess message={success}/>
          <Button type="submit"
          className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm