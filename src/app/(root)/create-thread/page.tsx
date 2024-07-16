
import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export default async function CreateThreadPage(){
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarding) redirect('/onboarding')
    
    return (
        <>
            <h1 className="text-white">Create thread</h1>
            <PostThread userId = {userInfo._id}/>

        </>
    )
}