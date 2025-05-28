'use client'

import Image from "next/image";

export default function Navbar() {
  const handleSignUp = () => {
    alert("Feature not available yet!");
  }

  return (
    <nav className="flex justify-between items-center py-4 px-5 md:px-10 absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
      <Image
        src="/logo.png"
        width={120}
        height={100}
        alt="Netflix Logo"
        className="z-30"
      />
      <a
        href="#"
        onClick={handleSignUp}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-colors duration-200 z-30"
      >
        Sign Up
      </a>
    </nav>
  )
}