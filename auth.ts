import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/config/database";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await compare(
          String(credentials.password),
          user.password
        );
        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const error = encodeURIComponent(
          "You must sign up first before logging in"
        );
        return `/login?error=${error}`;
      }
      return true;
    },
    async jwt({ token, user }) {
      await dbConnect();

      if (user?.email) {
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          token.id = existingUser._id.toString();
          token.role = existingUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure session.user exists

      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  //from next auth secrete to auth secrete
  secret: process.env.AUTH_SECRET,
});
