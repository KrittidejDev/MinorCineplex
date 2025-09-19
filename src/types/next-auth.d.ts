import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username?: string;
      email?: string | null;
    };
  }

  interface JWT {
    id: string;
    role: string;
    username?: string;
  }
}
