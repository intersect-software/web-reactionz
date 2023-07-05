"use client";
import logo from "@/public/brand.svg";
import Image from "next/image";
import Link from "next/link";

export default function HeaderStatic() {
  return (
    <nav className="staticNavLinks">
      <Link href="/">
        <Image src={logo} width={200} height={50} alt="Web Reactionz logo" />
      </Link>

      <div>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/blog">Blog</Link>
      </div>
    </nav>
  );
}
