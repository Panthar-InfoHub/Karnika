
import VerificationForm from "@/components/auth/VerificationForm";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
    const error = (await searchParams).error;

    if (!error) redirect("/account");


    return (
        <div className="px-8 py-16   text-center justify-center items-center grid space-y-3">
            <h1 className="text-2xl font-bold">Verify Email</h1>

            <p className="text-destructive">
                <span className="capitalize">
                    {error?.replace(/_/g, " ").replace(/-/g, " ")}
                </span>{" "}
                - Please request a new verification email.
            </p>

            <VerificationForm />
        </div>
    );
}