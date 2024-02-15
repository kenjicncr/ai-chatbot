import NextAuth, { type DefaultSession } from 'next-auth'
import { getAddress } from 'ethers'
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthConfig,  } from 'next-auth'
import { SiweMessage } from 'siwe'

export const runtime = 'edge';

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

type EthereumCredentials = {
  message: string;
  signature: string;
}

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials: EthereumCredentials, request) {
        try {
          if (!process.env.NEXTAUTH_URL) {
            throw 'NEXTAUTH_URL is not set'
          }
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          console.log(process.env.NEXTAUTH_URL, siwe)
          // const nextAuthUrl = new URL(process.env.NEXT_AUTH_URL)
          if (siwe.uri !== process.env.NEXTAUTH_URL) {
            return null
          }

          /**

          if (siwe.nonce !== (await getCsrfToken({ req: request }))) {
            return null
          }
           */

          await siwe.verify({
            signature: credentials?.signature || '',
          })

          return {
            id: siwe.address,
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile.picture
      }
      return token
    },
    async session({ session, token }) {
      session.address = token.sub!
      session.user.id = token.sub!
      return session
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    signOut: '/',
    error: '/',
    newUser: '/',
  },
})
