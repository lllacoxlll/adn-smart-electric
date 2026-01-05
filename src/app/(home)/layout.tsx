export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <html className="font-[Montserrat] bg-gradient-to-r from-[#01202e] to-[#045874]" lang="en">
    //   <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-dvh`}>
    //     <Navbar />
    <div className="bg-gradient-to-r from-[#01202e] to-[#045874]">{children}</div>
    //     <Toaster position="top-center" richColors />
    //   </body>
    // </html>
  )
}
