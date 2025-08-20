"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { sendVerificationEmail } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
const VerificationForm = () => {

    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const router = useRouter();

    const handleSubmit = async () => {

        if (!email) {
            toast.error('Please enter your email address.');
            return;
        }

        try {
            setLoading(true);
            await sendVerificationEmail({
                email,
                fetchOptions: {
                    // onRequest: () => {
                    //     setIsPending(true);
                    // },
                    // onResponse: () => {
                    //     setIsPending(false);
                    // },
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: () => {
                        toast.success("Verification email sent successfully.");
                        router.push("/verify-email/success?email=" + encodeURIComponent(email));
                    },
                },
            });
        } catch (error) {
            toast.error("Failed to send verification email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md w-full ">
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            value={email}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <p>Send Verification Email</p>
                        )}
                    </Button>
                </div>
            </CardContent>


        </Card>
    )
}

export default VerificationForm