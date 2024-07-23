import User from '@/db/models/User'
import { sequelize } from '@/db/sequelize'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  const { userId, updateType, ...otherData } = await req.json()
  let { newValue } = otherData
  const session = await getServerSession(authOptions)
  const validUpdateTypes: string[] = ['displayName', 'username', 'password', 'currency']
  const validCurrencies: string[] = ['dollar', 'euro']
  let hashedPassword: string = ''

  if (
    !userId ||
    !validUpdateTypes.includes(updateType) ||
    newValue.length === 0 ||
    (updateType === 'displayName' && newValue.length > 20) ||
    (updateType === 'username' && newValue.length > 15) ||
    (updateType === 'password' && newValue.length > 32) ||
    (updateType === 'currency' && !validCurrencies.includes(newValue))
  ) {
    return NextResponse.json({ error: 'Given data is invalid!' }, { status: 409 })
  }

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
  }

  if (updateType === 'password') {
    newValue = await bcrypt.hash(newValue, 10)
  }

  try {
    await sequelize.sync()
    await User.update(
      {
        [updateType]: newValue
      },
      {
        where: { id: userId }
      }
    )

    const updatedUser = await User.findOne({
      where: {
        id: userId
      }
    })

    const updatedSessionData = {
      ...session,
      user: {
        id: updatedUser?.id,
        username: updatedUser?.username,
        displayName: updatedUser?.displayName,
        currency: updatedUser?.currency
      }
    }

    return NextResponse.json({ updatedSession: updatedSessionData }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error while updating User!', details: error }, { status: 500 })
  }
}