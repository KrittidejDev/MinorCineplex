
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthOptions } from "next-auth";

interface MyUser {
  id: string;
  role: string;
  username?: string;
  email?: string | null;
  avatar_id?: string | null;
}

// 🔹 Module augmentation ของ NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username?: string;
      email?: string | null;
      avatar_id?: string | null;
    };
  }

  interface JWT {
    id: string;
    role: string;
    username?: string;
    avatar_id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email / Username / Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) return null;

        const normalizedIdentifier = credentials.identifier.toLowerCase();

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedIdentifier },
              { username: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
          avatar_id: user.avatar_id,
        } as MyUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as MyUser;
        token.id = u.id;
        token.role = u.role;
        token.username = u.username;
        token.avatar_id = u.avatar_id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.username = token.username as string | undefined;
      session.user.avatar_id = token.avatar_id as string | null | undefined;
      return session;
    }
    ,
  },
  pages: { signIn: "/auth/login" },
};

export default NextAuth(authOptions);



// export default NextAuth({
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         identifier: { label: "Email / Username / Phone", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.identifier || !credentials.password) return null;

//         // Normalize email to lowercase for case-insensitive login
//         const normalizedIdentifier = credentials.identifier.toLowerCase();

//         const user = await prisma.user.findFirst({
//           where: {
//             OR: [
//               { email: normalizedIdentifier },
//               { username: credentials.identifier },
//               { phone: credentials.identifier },
//             ],
//           },
//         });

//         if (!user) return null;

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!isValid) return null;

//         return {
//           id: user.id.toString(),
//           email: user.email,
//           username: user.username,
//           role: user.role,
//           avatar_id: user.avatar_id,
//         } as MyUser;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         const u = user as MyUser;
//         token.id = u.id;
//         token.role = u.role;
//         token.username = u.username;
//         token.avatar_id = u.avatar_id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = session.user ?? {};
//       session.user.id = token.id as string;
//       session.user.role = token.role as string;
//       session.user.email = session.user.email ?? null;
//       session.user.avatar_id = token.avatar_id as string;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/login",
//   },
// });
