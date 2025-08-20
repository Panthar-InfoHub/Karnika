
import EmailForm from "@/components/auth/EmailForm";

export default async function Page() {
    return (
        <div className="px-8 py-16   text-center justify-center items-center grid space-y-3">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground">
                Please enter your email address to receive a password reset link.
            </p>
            <EmailForm type="forgot-password" />
        </div>
    );
}