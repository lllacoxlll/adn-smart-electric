import { GetStartedButton } from "@/components/get-started-button";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-dvh flex-col">
      <div className="bg-[url(/bulb.jpg)] bg-center bg-no-repeat bg-cover flex justify-center gap-8 flex-col items-center w-dvw h-dvh">
        <h1 className="text-6xl font-bold text-white">ADN Smart Electric</h1>

        <GetStartedButton />
      </div>
    </div>
  )
}
