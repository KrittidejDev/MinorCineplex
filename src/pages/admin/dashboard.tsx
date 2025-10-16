"use client";
import AdminSidebar from "@/components/ui/adminsidebar";

export default function Dashboard() {
  // if (!session?.user) return <button onClick={() => signIn()}>Login</button>;

  return (
    // <div>
    //   <h1>Dashboard</h1>
    //   <p>ID: {session.user.id}</p>
    //   <p>Role: {session.user.role}</p>
    //   <p>Username: {session.user.username}</p>
    //   <p>Email: {session.user.email}</p>
    //   <button onClick={() => signOut()}>Logout</button>
    // </div>
    <div>
      <AdminSidebar />
      {/* <h1>Dashboard</h1>
      <p>ID: </p>
      <p>Role: </p>
      <p>Username: </p>
      <p>Email: </p>
      <button onClick={() => signOut()}>Logout</button> */}
    </div>
  );
}
