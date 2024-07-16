import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { profileTabs } from "@/constants";

import Image from "next/image";
import ThreadTab from "@/components/shared/ThreadTab";
import { UserCard } from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";

export default async function SearchPage(){
    const user = await currentUser();
    if (!user) redirect('/sign-in');
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarding) redirect('/onboarding');
    
    // fetch users 
    const result = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
      }) || { users: [], isNext: false };
    return (
        <>
            <h1 className="head-text text-white mb-10 ">Search</h1>
            <div className='mt-5'>
                <Searchbar routeType='search' />
            </div>
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result"> No users</p>
                ):(
                    <>
                        {result.users.map((person) => (
                        <UserCard
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            username= {person.username}
                            imgUrl= {person.image}
                            personType ='User'
                        />
                        ))}
                    </>
                )}

            </div>
        </>
    )
}