import { CallNowButton } from '@/components/call-now-button'
import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <nav className="fixed self-start px-8 py-6 flex items-center justify-between w-full border-b bg-black/10 backdrop-blur-sm border-black/5 shadow-md z-1">
      {/* <div className="bg-white/100 rounded-md">
        <Link href="/">
          <Image src="/adn_logo1.svg" alt="adn logo" height={100} width={100}/>
        </Link>
      </div> */}
      <div className="bg-white/100 rounded-md shadow-white shadow-md">
        <Link href="/">
          <Image src="/adn-logo-2.png" alt="adn logo" width="150" height="150" />
        </Link>
      </div>
      <CallNowButton />
    </nav>
  )
}
