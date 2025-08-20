
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ email: string }> }) {

    const sp = await searchParams;


    if (!sp.email) {
        redirect("/login");
    }

    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-4">

                <h1 className="text-3xl font-bold">Success</h1>

                <p className="text-muted-foreground">
                    Success! You have sent a verification link to your email.
                </p>
            </div>
        </div>
    );
}