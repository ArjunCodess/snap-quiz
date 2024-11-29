"use client";

import Link from "next/link";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="sticky inset-x-0 top-0 bg-background text-foreground z-[10] h-fit border-b py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:scale-110 hover:rotate-2 hover:shadow-lg dark:border-white dark:hover:shadow-white/20 duration-300 ease-out">
            SnapQuiz
          </p>
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;