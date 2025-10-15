import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null;
      role: string;
      username?: string;
      email?: string | null;
      avatar_url?: string | null;
      avatar_id?: string | null;
    };
  }

  interface JWT {
    id: string;
    role: string;
    username?: string;
    avatar_url?: string | null;
    avatar_id?: string | null;
  }
}
