import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/login");

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">

        <h1 className="text-3xl font-bold">Reset Password</h1>

        <p className="text-muted-foreground">
          Please enter your new password.
        </p>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}