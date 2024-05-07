'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { verifySchema } from "@/schemas/verifySchema"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';

const page = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code
      });

      toast({
        title: "Success",
        description: response.data.message
      });

      router.replace('sign-in');
    } catch (error) {
      console.error('Error in signup of user :: ', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed',
        description: axiosError.response?.data.message,
        variant: 'destructive'
      });
    }
  }

  return (
    <div className='flex flex-col justify-center items-center bg-gray-900 h-screen text-white '>
      <h1 className='mb-6 text-3xl '> Verify Your Account</h1>
      <div className='border p-4 rounded w-80'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} className='text-black' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='bg-blue-800'>Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page