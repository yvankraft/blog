"use client";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen grid items-center justify-center">
      <Link href="/" className="btn-primary absolute top-10 left-4">
        /home
      </Link>
      <h1 className="title">Forgot Password</h1>
    </div>
  );
}
