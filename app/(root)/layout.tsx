import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import ProfileIcon from "@/components/ProfileIcon";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      {user && (
        <div className="absolute lg:top-10 lg:right-10 top-7 right-7 z-50">
          <ProfileIcon user={user} />
        </div>
      )}
      {children}
      <Toaster />
    </div>
  );
};
export default RootLayout;
