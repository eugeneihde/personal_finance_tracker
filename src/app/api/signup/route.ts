import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const GET = (): NextResponse => {
  return NextResponse.json({ error: 'Method not allowed!' }, { status: 405 })
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json()

  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/api/protected/create-user`,
      body,
      {
        headers: {
          'x-api-key': process.env.SYSTEM_API_KEY
        },
        validateStatus: (status) => {
          return status >= 200 && status < 500
        }
      }
    )

    return NextResponse.json({}, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Signup failed!', details: error }, { status: 500 })
  }
}