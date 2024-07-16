"use client"
import { addCommentToThread } from '@/lib/actions/thread.actions';
import { useUploadThing } from '@/lib/uploadthings';
import { CommentValidation } from '@/lib/validations/thread';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../ui/form"
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';
interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;

}
export const Comment =  ({
    threadId,
    currentUserImg,
    currentUserId,
}: Props) => {
    const { startUpload } = useUploadThing("media");
    const router =  useRouter();
    const pathname =  usePathname();
    const form = useForm({
      resolver: zodResolver(CommentValidation),
      defaultValues:{
        thread: "",
      }
    })
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
      await addCommentToThread( threadId, values.thread, JSON.parse(currentUserId), pathname);
      form.reset();
    }
    return (
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className='flex flex-row w-full content-center item-center gap-3 '>
                <FormLabel>
                  <Image src={currentUserImg}
                  alt='profile-image'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
                </FormLabel>
                <FormControl className='border border-dark-5 bg-dark-4 text-light-1'>
                  <Input 
                    type='text'
                    placeholder='Comment ....'
                    className='text-light-1 no-focus'
                    {...field}
                   />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type='submit' className='comment-form_btn'>Reply</Button>
        </form>
      </Form>
    )
  }
