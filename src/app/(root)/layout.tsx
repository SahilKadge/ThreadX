import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Topbar } from "@/components/shared/Topbar";
import { Bottombar } from "@/components/shared/Bottombar";
import { Leftbar } from "@/components/shared/Leftbar";
import { Rightbar } from "@/components/shared/Rightbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads home page",
  description: "A nextjs application ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar/>
          <main className="flex flex-row">
            <Leftbar/>
            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>
            <Rightbar/>

          </main>
          <Bottombar/>
        </body>
      </html>
    </ClerkProvider>
  );
}
