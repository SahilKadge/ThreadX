import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


interface Activity {
  _id: string;
  parentId: string;
  author: {
    image: string;
    name: string;
  };
}

export default async function ActivityPage(){
    const user = await currentUser();
    if (!user) redirect('/sign-in');
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarding) redirect('/onboarding');
    const activities : Activity[] = await getActivity(userInfo._id);
    console.log(activities)
    return (
        <>
      <h1 className='head-text'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activities.length > 0 ? (
          <>
            {activities.map((activity: Activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </>
  );
}