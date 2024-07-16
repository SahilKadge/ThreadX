import * as z from 'zod';

export const userValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(2, {message:'name should be greater than 2 character'}).max(30),
    username: z.string().min(2, {message:'username should be greater than 2 character'}).max(30),
    bio: z.string().min(2, {message:'bio should be greater than 2 character'}).max(1000),
})