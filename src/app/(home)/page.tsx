'use client'

import { EmployeePortalLink } from '@/components/employee-portal-link'
import Image from 'next/image'
import { ContactUsCard } from '@/components/contact-us-card'
import { ProjectsCarousel } from '@/components/projects-carousel'

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden gap-48">
      <div className="bg-[url(/h-town.jpg)] bg-center bg-fixed bg-no-repeat bg-cover gap-8 flex-col justify-center items-center flex h-dvh w-dvw">
        <div className="h-dvh flex flex-col justify-center items-center gap-8 px-8">
          <h1 className="text-6xl text-white tracking-wider">ADN SMART ELECTRIC LLC</h1>
          <h3 className="text-3xl text-white">Professional Residential & Commercial Electrical Services</h3>
        </div>
      </div>

      <div className="lg:px-30 flex flex-col items-center w-[100vw] gap-20">
        <h2 className="text-[#ff1912] text-4xl  self-start px-8">ABOUT US</h2>

        <div className="flex flex-col gap-12 px-8 lg:flex-row justify-between lg:gap-40 lg:mr-30 items-center">
          <p className="text-white text-2xl flex-1">
            <span className="text-[#ff1912]">ADN Smart Electric LLC</span> is a certified electrical company based in Spring, Texas and serving Houston, Texas and the surrounding areas. ADN Smart Electric specializes in residential and commercial services, with over 20 years of field experience. Choosing ADN Smart Electric will ensure that your electrical needs are fulfilled in a timely, safe, and efficient manner. <br />
            <br />
            Click the <q>Call Now</q> button at the top of this page or fill out the contact form below to get an estimate for our services.
          </p>

          <div className="relative w-full sm:w-[85%] min-h-[320px] lg:min-h-[420px] -skew-x-20 rounded-tl-4xl rounded-br-4xl bg-[#328ccf] flex-1 shadow-2xl shadow-[#328ccf]">
            <div className="relative w-full sm:w-[100%] min-h-[320px] lg:min-h-[420px] rounded-tl-4xl rounded-br-4xl bg-[#ff1912] flex-1 shadow-2xl top-10 left-10"></div>
            <Image src="/workvan.png" alt="electrical panel wiring" unoptimized fill className="object-contain absolute translate-x-10 translate-y-10 skew-x-20 z-10 overflow-visible" style={{ transformOrigin: 'top left', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      <div className="px-8">
        <h2 className="text-[#ff1912] text-4xl  self-start px-8 my-20">PROJECTS</h2>
        <div className="grid place-items-center">
          <ProjectsCarousel />
        </div>
      </div>

      <div className="px-8 flex flex-col justify-center items-center">
        <h2 className="text-[#ff1912] text-4xl  self-start px-8 my-20">SERVICES</h2>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-20">
          <div className="inset-shadow-sm/20 inset-shadow-white shadow-lg absolute inset-0 bg-gradient-to-t from-[#ff1912]/15 to-[#328ccf]/15 -z-10 rounded-2xl "></div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] inset-shadow-sm/20 inset-shadow-white shadow-lg relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/solar.svg" alt="solar panel" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Solar panel installation</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/ceiling-lighting-svgrepo-com.svg" alt="ceiling light" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Lighting installation & replacement</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/fire-alarm-svgrepo-com.svg" alt="smoke detector" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Smoke detector installation</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/home-4-svgrepo-com.svg" alt="house" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Home automation & smart device wiring</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/generator-svgrepo-com.svg" alt="generator" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Generator installation & maintenance</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/panel-svgrepo-com.svg" alt="electrical panel" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Panel upgrades & breaker replacements</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/repair-svgrepo-com.svg" alt="repair tools" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Electrical troubleshooting & repairs</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff1912] relative w-[70] h-[70] rounded-full aspect-square">
              <Image src="/outlet-svgrepo-com.svg" alt="electrical outlet" fill objectFit="cover" className="p-3" />
            </div>
            <span className="text-white">Outlet & switch installation or replacement</span>
          </div>
        </div>
      </div>

      <div className="bg-[url(/kitchen4.jpg)] bg-center bg-no-repeat bg-cover -mb-48">
        <ContactUsCard />
      </div>

      <footer className="bg-black px-8 py-6 text-white flex justify-between">
        <p>&copy; Copyright 2025, ADN Smart Electric LLC</p>
        <EmployeePortalLink />
      </footer>
    </div>
  )
}
