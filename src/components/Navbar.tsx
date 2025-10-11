import { CallNowButton } from "@/components/call-now-button"
import Image from "next/image"

export const Navbar = () => {
  return (
    <nav className="self-start px-8 py-6 flex items-center justify-between w-full border-b bg-black/10 backdrop-blur-sm border-black/5 shadow-md">
      <Image src="/adn-logo.svg" alt="adn logo" width="120" height="120" />
      <CallNowButton />
    </nav>
  )
}


