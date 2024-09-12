import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './mongodb';
import { User as UserModel } from '../models/User';
import bcrypt from 'bcryptjs';

// Define types for token and session
interface JWTToken {
  id?: string;
  role?: string;
}

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await UserModel.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('No user found with the email');
        }

        if (!credentials?.password) {
          throw new Error('Please provide a password');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as JWTToken).id = user.id;
        (token as JWTToken).role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = (token as JWTToken).id as string;
        (session.user as any).role = (token as JWTToken).role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    newUser: '/auth/signup',
  },
};
