"use server"

import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  
   
}
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
  
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarding: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
export async function fetchUser(userId: string){
  try{
    connectToDB();
    return await User.findOne({id: userId})
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })

  }catch(error: any){
    throw new Error(`Fail to fetch user: ${error.message}`)
  }
}

export async function fetchUserPost(userId: string){
  connectToDB();
  try{
    const threads = await User.findOne({id: userId})
      .populate({
        path: 'threads',
        model: Thread,
        populate:{
          path: 'children',
          model: Thread,
          populate:{
            path: 'author',
            model: User,
            select: 'name image id',
          }
        }
      })
      return threads;
  }catch(error:any){
    console.log(`No thread found ${error}`)
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}:{
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize: number;
  sortBy?: SortOrder;


}){
  connectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString,"i");
    const query: FilterQuery<typeof User> = {
      id : {$ne: userId}
    }
    if(searchString.trim() !== ''){
      query.$or = [
        {username : {$regex : regex}},
        {name: {$regex: regex}}

      ]
    }
    const sortOptions = { createdAt : sortBy};

    const userQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const totalUserCount = await User.countDocuments(query);
    const users = await userQuery.exec();

    const isNext = totalUserCount > skipAmount + users.length;
    return {users, isNext}
  }catch(error: any){
    console.log(`error will fetching users ${error}`)
  }
}

interface Activity {
  _id: string;
  parentId: string;
  author: {
    image: string;
    name: string;
  };
}
export async function getActivity(userId: string): Promise<Activity[]> {
  connectToDB();
  try {
    // find all threads created by user
    const userThreads = await Thread.find({ author: userId });
    // collect all the child thread ids (replies) from the 'children' field 
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    });
    return replies;
  } catch (error: any) {
    console.log(`error fetching activity ${error}`);
    return [];
  }
}
