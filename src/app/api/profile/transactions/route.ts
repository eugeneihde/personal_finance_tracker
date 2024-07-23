import { isValidDate } from '@/config/project.config'
import Transaction from '@/db/models/Transaction'
import { sequelize } from '@/db/sequelize'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { Op, where } from 'sequelize'

const invalidAmounts: string[] = ['0', '0.00', '']
const validTypes: string[] = ['income', 'expense']

export const GET = (): NextResponse => {
  return NextResponse.json({ error: 'Method not allowed!' }, { status: 405 })
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { startDate, endDate } = await req.json()
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return NextResponse.json({ error: 'Invalid date format!' }, { status: 400 })
  }

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  if (start > end) {
    return NextResponse.json({ error: 'Start date cannot be after end date!' }, { status: 400 })
  }

  try {
    await sequelize.sync()
    const transactions = await Transaction.findAll({
      where: {
        user_id: token.id,
        date: {
          [Op.between]: [start, end]
        }
      },
      order: [['date', 'DESC']]
    })

    return NextResponse.json(transactions, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions', details: error }, { status: 500 })
  }
}

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  const { entry } = await req.json()
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!entry.id) {
    return NextResponse.json({ error: 'Given data is invalid!' }, { status: 409 })
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
  }

  try {
    await sequelize.sync()
    await Transaction.destroy({
      where: {
        id: entry.id
      }
    })

    return NextResponse.json({ message: 'Entry deleted successfully!' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry', details: error }, { status: 500 })
  }
}

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const { type, title, amount, date } = await req.json()
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (title === '' || invalidAmounts.includes(amount) || !isValidDate(date)) {
    return NextResponse.json({ error: 'Given data is invalid!' }, { status: 409 })
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
  }

  try {
    await sequelize.sync()
    await Transaction.create({ type: type, title: title, amount: amount, date: date, user_id: token.id })

    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error while creating Transaction!', details: error }, { status: 500 })
  }
}

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
    const { entryId, type, title, amount, date } = await req.json()
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!entryId || title === '' || !validTypes.includes(type) || invalidAmounts.includes(amount) || !isValidDate(date)) {
      return NextResponse.json({ error: 'Given data is invalid!' }, { status: 409 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
    }

    try {
      await sequelize.sync()
      await Transaction.update(
        {
          type: type,
          title: title,
          amount: amount,
          date: date
        },
        {
          where: { id: entryId }
        }
      )

      return NextResponse.json({}, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error: 'Error while updating Transaction!', details: error }, { status: 500 })
    }
}