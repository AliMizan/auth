"use client"

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { CardWrapper } from "./card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
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
import {  useState, useTransition } from "react";
import { register } from "@/actions/register";
import { useRouter } from "next/navigation";


const RegisterForm = () => {
  const { toast } = useToast();
  const router = useRouter()
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition();


  const form  = useForm<z.infer<typeof RegisterSchema>>({
    resolver:zodResolver(RegisterSchema),
    defaultValues:{
      name:"",
      email:"",
      password:""
    }
  });

  const onSubmit  = (values:z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if(data.existingUser === null){
          toast({
            variant:"default",
            title: "Redirecting To Login Page",
            
            
          })

          setTimeout(() => router.push("/auth/login"),5000)
        }
      })
    })
    

  }   

  return (
    <CardWrapper
     headerLabel="Create An Account" 
     backButtonHref="/auth/login"
     backButtonLabel="Already have an account ?"
     showSocial >
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4  " >
          <FormField 
            control={form.control} 
            name="name"
            render={({field}) => (
              <FormItem>``
                <FormLabel>
                  Name
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Your Name" disabled={isPending} />
                </FormControl>
                <FormMessage/>
              </FormItem>
             )}/>
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
            Create An Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default RegisterForm;