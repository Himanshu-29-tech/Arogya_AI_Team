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
          console.error('Auth authorize error:', error.message);
          // If MongoDB connection fails or is not configured, check demoStore
          if (
            error.message.includes('MONGODB_URI') ||
            error.message.includes('ENOTFOUND') ||
            error.message.includes('timed out') ||
            error.message.includes('connect')
          ) {
            console.log('Using demo user fallback since MongoDB is not connected');
            const { demoStore } = await import('@/lib/demoStore');
            const normalizedEmail = credentials.email.toLowerCase().trim();
            const demoUser = demoStore.users.get(normalizedEmail);

            if (demoUser) {
              const isMatch = await bcrypt.compare(credentials.password, demoUser.passwordHash);
              if (isMatch) {
                return {
                  id: demoUser.id,
                  name: demoUser.name,
                  email: demoUser.email,
                  role: demoUser.role,
                };
              } else {
                throw new Error('Invalid password');
              }
            }

            if (normalizedEmail === 'demo@arogya.ai' && credentials.password === 'demo123') {
              return { id: 'mock-1', name: 'Demo User', email: 'demo@arogya.ai', role: 'user' };
            }
            throw new Error('User not found. Use demo@arogya.ai / demo123, or sign up with Create Account first.');
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
