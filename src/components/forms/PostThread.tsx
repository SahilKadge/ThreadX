"use client"
import { useUploadThing } from '@/lib/uploadthings';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { Input } from "../ui/input"
import { Textarea } from '../ui/textarea';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import { updateUser } from '@/lib/actions/user.actions';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.actions';
import { useOrganization } from "@clerk/nextjs";

export default function PostThread({userId}:{userId: string}) {
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues:{
      thread: "",
      accountId: userId,
    }
  })
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };
  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex flex-col w-full gap-3 '>
              <FormLabel className="text-base-semibold text-light-2 content-center">
                Content
              </FormLabel>
              <FormControl className='border border-dark-5 bg-dark-4 text-light-1'>
                <Textarea 
                rows={15}
                placeholder='Write a content to your post'
                {...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>Submit a post</Button>
      </form>
    </Form>
  )
}
