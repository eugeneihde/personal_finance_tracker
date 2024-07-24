import { NextRequest, NextResponse } from 'next/server'
import { sequelize } from '@/db/sequelize'
import User from '@/db/models/User'
import bcrypt from 'bcryptjs'

export const GET = (): NextResponse => {
  return NextResponse.json({ error: 'Method not allowed!' }, { status: 405 })
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  if (req.headers.get('x-api-key') !== process.env.SYSTEM_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
  }
  
  try {
    const { displayName, username, password } = await req.json()
    await sequelize.sync()

    const usernameExists = await User.findOne({ where: { username: username } })
    if (usernameExists) {
      return NextResponse.json({ error: 'Username already exists! Please take another one.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      displayName: displayName,
      username: username,
      password: hashedPassword,
      currency: 'dollar'
    })

    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error while creating User!', details: error }, { status: 500 })
  }
}