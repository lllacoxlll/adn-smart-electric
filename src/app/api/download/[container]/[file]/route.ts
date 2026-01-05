import { createSAS } from '@/lib/azure-blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { container: string,  file: string } }) {
  try {
    const { container, file } = await params

    if (container === 'images') {
      return NextResponse.json(await createSAS('images', file))
    }

    else if (container === 'signatures') {
      return NextResponse.json((await createSAS('signatures', file)))
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }
}
