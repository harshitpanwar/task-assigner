import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import bcrypt from 'bcryptjs';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('No user found with the email');
        }

        const isValidPassword = await bcrypt.compare(credentials?.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        return { id: user._id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    newUser: '/auth/signup'
  }
});
