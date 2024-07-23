import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { sequelize } from '@/db/sequelize'
import User from '@/db/models/User'
import bcrypt from 'bcryptjs'


declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      displayName: string
      currency: string
    }
  }

  interface User {
    id: string
    username: string
    displayName: string
    currency: string
  }

  interface JWT {
    id: string
    username: string
    displayName: string
    currency: string
  }
}

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 86400
  },
  providers: [
    Credentials({
      type: 'credentials',
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error('No Credentials provided!')
        }

        const { username, password } = credentials
        await sequelize.sync()
        const user = await User.findOne({
          where: {
            username: username
          }
        })

        if (!user) {
          throw new Error('No User found with this Username!')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid Username or Password!')
        }

        return {
          id: user.id.toString(),
          username: user.username,
          displayName: user.displayName,
          currency: user.currency
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.displayName = user.displayName
        token.currency = user.currency
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.displayName = token.displayName as string
        session.user.currency = token.currency as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }