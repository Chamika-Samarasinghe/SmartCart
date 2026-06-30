import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = { title: "Admin — SmartCart" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
