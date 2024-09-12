"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Briefcase, LogOut, PenBox } from "lucide-react";
import { ModeToggle } from "./ui/theme-toggle-button";
import { UserState } from "@/context/user-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/app/db/apiAuth";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";

const Navbar = () => {
  const { user, fetchUser } = UserState();
  const { loading, fn: fnLogout } = useFetch(logout);
  const router = useRouter();

  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center mb-2">
        <Link className="flex items-center justify-center" href="/">
          <Briefcase className="h-6 sm:h-8 w-6 sm:w-8 mr-2" />
          <span className="font-bold text-xl hidden sm:inline">HireHub</span>
        </Link>
        {!loading && (
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            {user?.user_metadata.role === "recruiter" && (
              <Link href="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="sm:mr-2"></PenBox>
                  <p className="hidden sm:block">Post a job</p>
                </Button>
              </Link>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={user.user_metadata.profile_pic}
                      className="object-contain"
                    ></AvatarImage>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="text-lg">{`Hi, ${user?.user_metadata.name}`}</DropdownMenuLabel>
                  <hr />
                  <Link href="/my-jobs">
                    <DropdownMenuItem>My Jobs</DropdownMenuItem>
                  </Link>
                  {user?.user_metadata?.role === "candidate" && (
                    <Link href="/saved-jobs">
                      {" "}
                      <DropdownMenuItem>Saved Jobs</DropdownMenuItem>{" "}
                    </Link>
                  )}
                  <DropdownMenuItem
                    className="text-red-400"
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser();
                        router.push("/");
                      });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4"></LogOut>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            )}
            <ModeToggle />
          </nav>
        )}
      </header>

      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Navbar;
