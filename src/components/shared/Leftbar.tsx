"use client";
import { sidebarLinks } from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
export const Leftbar = () => {
  // const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

            if(link.route === '/profile') link.route = `${link.route}/${userId}`
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link hover:bg-primary-500 ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton redirectUrl="/sign-in">
            <div className="hover:bg-primary-500 leftsidebar_link flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Log Out</p>
            </div>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
            <Link href='/sign-in'><Button className="bg-primary-500"><p className="text-light-2 max-lg:hidden">Sign IN </p></Button></Link>
        </SignedOut>
      </div>
    </section>
  );
};
