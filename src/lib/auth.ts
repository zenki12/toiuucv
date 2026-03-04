// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'okthaiday@gmail.com';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.email === ADMIN_EMAIL ? 'admin' : 'user';
      }
      return session;
    },
    async signIn({ user }) {
      // Ensure role is set correctly on sign in
      if (user.email === ADMIN_EMAIL) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'admin' },
        }).catch(() => {});
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
};
