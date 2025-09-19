"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session?.user) return <button onClick={() => signIn()}>Login</button>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>ID: {session.user.id}</p>
      <p>Role: {session.user.role}</p>
      <p>Username: {session.user.username}</p>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
