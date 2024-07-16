"use client";
import { sidebarLinks } from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";


export const Bottombar = () => {
    // const router = useRouter();
    const pathname = usePathname();
  return (
    <section className='bottombar'>
        <div className='bottombar_container'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link hover:bg-primary-500 ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">{(link.label).split(/\s+/)[0]}</p>
            </Link>
          );
        })}
        </div>
    </section>
  )
}
