import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

export const POST = NextAuth(authOptions);
export const GET = NextAuth(authOptions);
