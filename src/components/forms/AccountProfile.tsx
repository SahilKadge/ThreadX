"use client"
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { userValidation } from '@/lib/validations/user';
import {  usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthings';
import { updateUser } from '@/lib/actions/user.actions';
 


interface Props {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    
  };
btnTitle: string,
}
export const AccountProfile = ({user, btnTitle}: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media")
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues:{
      profile_photo: user?.image || "",
      name:  user?.name || "",
      username:  user?.username || "",
      bio:  user?.bio || "",

    }
  })

    const handleImage = (
      e: ChangeEvent<HTMLInputElement>,
      fieldChange: (value: string) => void
        ) => {
      e.preventDefault();

      const fileReader = new FileReader();

      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFiles(Array.from(e.target.files));

        if (!file.type.includes("image")) return;

        fileReader.onload = async (event) => {
          const imageDataUrl = event.target?.result?.toString() || "";
          fieldChange(imageDataUrl);
        };

        fileReader.readAsDataURL(file);
      }
    }

    const onSubmit = async (values: z.infer<typeof userValidation>) => {
      const blob = values.profile_photo;
      const hasImageChanged = isBase64Image(blob);
      

      if(hasImageChanged){
        const imgRes = await startUpload(files)
      
        if(imgRes && imgRes[0].url){
          values.profile_photo = imgRes[0].url
        }
      }
      await updateUser({
        name: values.name,
        path: pathname,
        username: values.username,
        userId: user.id,
        bio: values.bio,
        image: values.profile_photo,

      });
      if(pathname === '/profile/edit'){
        router.back();
      }else{
        router.push('/');
      }
      console.log(user.name)
  }

  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({field}) => (
            <FormItem className='flex item-center gap-4'>
              <FormLabel className="account-form_image-label ">
              {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain '
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input 
                type='file'
                accept='image/*'
                placeholder='upload a photo'
                className='account-form_image-input'
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleImage(e, field.onChange)}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        {/* second field  */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='flex flex-col w-full gap-3 '>
              <FormLabel className="text-base-semibold text-light-2 content-center">
                Name
              </FormLabel>
              <FormControl>
                <Input 
                type='text'
                placeholder='Your name'
                className='account-form_input'
                {...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        {/* third */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className="text-base-semibold text-light-2 content-center">
                Username
              </FormLabel>
              <FormControl >
                <Input 
                type='text'
                placeholder='Your Username'
                className='account-form_input'
                {...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        {/* forth */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className="text-base-semibold text-light-2 content-center">
                Bio
              </FormLabel>
              <FormControl >
                <Textarea 
                rows = {10}
                placeholder='Write your bio ...'
                className='account-form_input'
                {...field}
                 />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button className='bg-primary-500' type="submit">Submit</Button>
      </form>
    </Form>
  )
}
