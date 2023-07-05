"use client";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "rsuite";
import logo from "@/public/brand.svg";
import Image from "next/image";
import Link from "next/link";

export default function NavBar({
  session,
  title,
}: {
  session: Session | null;
  title?: string;
}) {
  return (
    <nav>
      <div>
        <Link href="/">
          <Image src={logo} width={200} height={50} alt="Web Reactionz logo" />
        </Link>
        {!!title && <h3>{title}</h3>}
      </div>
      {session ? (
        <Button appearance="ghost" onClick={() => signOut()} className="navBtn">
          Logout
        </Button>
      ) : (
        <Button
          appearance="primary"
          onClick={() => signIn()}
          className="navBtn"
        >
          Login
        </Button>
      )}
    </nav>
  );
}
