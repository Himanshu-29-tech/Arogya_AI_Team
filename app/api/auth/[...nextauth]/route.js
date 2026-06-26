import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          await connectToDatabase();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordMatch) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          // If connection fails, return mock user for MVP demo if requested
          if (error.message.includes('MONGODB_URI is not defined')) {
             console.log('Using mock user for MVP demonstration since MongoDB is not connected');
             if (credentials.email === 'demo@arogya.ai' && credentials.password === 'demo123') {
                return { id: 'mock-1', name: 'Demo User', email: 'demo@arogya.ai', role: 'user' };
             }
             throw new Error('Please use demo@arogya.ai / demo123 for mock login');
          }
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
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
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
