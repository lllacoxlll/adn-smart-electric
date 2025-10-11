import { EmployeePortalLink } from '@/components/employee-portal-link'
import Image from 'next/image'
import { ContactUsCard } from '@/components/contact-us-card'
import { Navbar } from '@/components/Navbar'
import { ProjectsCarousel } from '@/components/projects-carousel'

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="bg-[url(/h-town.jpg)] bg-center bg-fixed bg-no-repeat bg-cover gap-8 flex-col justify-center items-center flex h-dvh w-dvw mb-20">
        <Navbar />

        <div className="h-dvh flex flex-col justify-center items-center gap-8 px-8">
          <h1 className="text-6xl text-white tracking-wider animate-pulse">ADN SMART ELECTRIC LLC</h1>
          <h3 className="text-3xl text-white animate-float">Professional Residential & Commercial Electrical Services</h3>
        </div>
      </div>

      <div className="pb-20 px-30 flex flex-col items-center">
        <Image src="/adn-logo.svg" alt="adn logo" width="200" height="200" className="pb-12" />

        <div className="h-[50vh] mx-20">
          <div className="relative bg-[#328ccf] h-[80%] w-[30%] border border-none rounded-tl-4xl rounded-br-4xl -skew-x-20 float-right">
            <div className="absolute -skew-x-20 top-20 left-20 right-0 z-1 w-[100%] h-[100%]">
              <Image src="/wiring.jpg" alt="electrical panel wiring" fill className="skew-x-35 rounded-tl-4xl rounded-br-4xl" />
            </div>
          </div>
          <p className="text-xl w-[60%]">
            <span className="text-[#ff1912]">ADN Smart Electric LLC</span> is a certified electrical company based in Spring, Texas and serving Houston, Texas and the surrounding areas. ADN Smart Electric specializes in residential and commercial services, with over 20 years of field experience. Choosing ADN Smart Electric will ensure that your electrical needs are fulfilled in a timely, safe, and efficient manner. <br />
            <br />
            Click the <q>Call Now</q> button at the top of this page or fill out the contact form below to get an estimate for our services.
          </p>
        </div>
      </div>

      <div className="m-8 pb-20 grid place-items-center">
        <div className="relative mb-8">
          <div className="bg-[#ff1912] h-[40px] w-[60px] border border-none rounded-tl-4xl rounded-br-4xl -skew-x-20 absolute left-0 right-25 mx-auto z-1"></div>
          <div className="bg-[#328ccf] h-[40px] w-[60px] border border-none rounded-tl-4xl rounded-br-4xl -skew-x-20 absolute left-0 right-25 top-4 mx-auto z-2"></div>
          <h2 className="relative text-3xl text-center pb-12 z-3">PROJECTS</h2>
        </div>

        <ProjectsCarousel />
      </div>

      <div className="m-8 px-8 pb-20 flex flex-col justify-center items-center">
        <div className="relative mb-8">
          <div className="bg-[#ff1912] h-[40px] w-[60px] border border-none rounded-tl-4xl rounded-br-4xl -skew-x-20 absolute left-0 right-25 mx-auto z-1"></div>
          <div className="bg-[#328ccf] h-[40px] w-[60px] border border-none rounded-tl-4xl rounded-br-4xl -skew-x-20 absolute left-0 right-25 top-4 mx-auto z-2"></div>
          <h2 className="relative text-3xl text-center pb-12 z-3">SERVICES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/solar.svg" alt="solar panel" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Solar panel installation</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/ceiling-lighting-svgrepo-com.svg" alt="ceiling light" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Lighting installation & replacement</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/fire-alarm-svgrepo-com.svg" alt="smoke detector" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Smoke detector installation</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/home-4-svgrepo-com.svg" alt="house" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Home automation & smart device wiring</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/generator-svgrepo-com.svg" alt="generator" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Generator installation & maintenance</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/panel-svgrepo-com.svg" alt="electrical panel" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Panel upgrades & breaker replacements</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/repair-svgrepo-com.svg" alt="repair tools" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Electrical troubleshooting & repairs</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/outlet-svgrepo-com.svg" alt="electrical outlet" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-blue">Outlet & switch installation or replacement</span>
          </div>
        </div>
      </div>

      <div className="bg-[url(/kitchen4.jpg)] bg-center bg-no-repeat bg-cover">
        <ContactUsCard />
      </div>

      <footer className="bg-black px-8 py-6 text-white flex justify-between">
        <p>&copy; Copyright 2025, ADN Smart Electric LLC</p>
        <EmployeePortalLink />
      </footer>
    </div>
  )
}
