"use server" // we cannot access database without it 
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { communityTabs } from "@/constants";

interface Params {
    text: string,
    author: string,
    communityId: null,
    path: string,
}
export async function createThread({text, author, communityId, path}: Params){
    try{
        connectToDB();
        const createThread = await Thread.create({
            text,
            author,
            community: null,
        });
        //update user model
        await User.findByIdAndUpdate(author, {
            $push: {threads: createThread._id}
        })
        revalidatePath(path);
    }catch(error: any){
        console.log(`error creating a thread ${error}`)
    }
}

export async function fetchThread(pageNumber = 1, pageSize = 20){
    connectToDB()
    // calculate the number of post to skip 
    const skipAmount = (pageNumber - 1)*pageSize;
    // Fetch the posts that have no parents (top-level threads ...)
    const postsQuery = Thread.find({parentId: {$in : [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User})
    .populate({
        path: 'children',
        populate:{
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalPostsCount = await Thread.countDocuments({parentId:{$in:[null, undefined]}})
    const posts = await postsQuery.exec();
    const isNext = (totalPostsCount) > (skipAmount + posts.length);
    return {posts , isNext}

}

export async function fetchThreadById(id:string){
    connectToDB();
    try{
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: "children",
            populate:[
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"

                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();
        return thread;
    }catch(error: any){
        console.log(`Error will fetching comments ${error}`)
    }

}

// so a the above funciton is peroforming function like this 
// 1 it removes author and replace it with user -> User{_id id name image}
// 2 then it transform it children which is similar to thread 
// children: {
//     author ->  User{_id id name image}
//     children (as it is similar to thread) -> thread which transform as this  {
//                                                         author -> user{_id id name image}
//                                                     }
// } 

// so basically my thread post is like this 
// post(parent) {
//     comments(child similar to parent ) { 
//         comments (child)
//     }
// }

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId:string,
    path:string,
){
    connectToDB()
    try{
        //Find the orignal thread by its id 
        const orignalThread = await Thread.findById(threadId);
        if(!orignalThread){
            throw new Error('Thread not found')
        }
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })
        // Save the new thread 
        const savedCommentThread = await commentThread.save();
        // update the orignal thread to add new comment 
        orignalThread.children.push(savedCommentThread._id);

        //Save the orignal thread 
        await orignalThread.save();
        
        revalidatePath(path);
    }catch(error:any){
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}