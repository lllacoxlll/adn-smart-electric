import { uploadToBlob } from '@/lib/azure-blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    if (formData.has('image')) {
      const images = formData.getAll('image') as File[]

      const buffers: ArrayBuffer[] = []
      for (const image of images) {
        buffers.push(await image.arrayBuffer())
      }

      const urls: string[] = []
      for (let i = 0; i < buffers.length; i++) {
        urls.push(await uploadToBlob('images', images[i].name, buffers[i]))
      }

      return NextResponse.json(urls)
    } else if (formData.has('signature')) {
      const signature = formData.get('signature') as File

      const buffer: ArrayBuffer = await signature.arrayBuffer()

      const url = await uploadToBlob('signatures', signature.name, buffer)

      return NextResponse.json(url)
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
