"use client";

import { useTransition } from "react";
import { submitContactForm } from "@/actions/contactActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactForm() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await submitContactForm(formData);

            if (result.success) {
                toast.success(result.message);
                // Reset form
                const form = document.getElementById("contact-form") as HTMLFormElement;
                form?.reset();
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <form id="contact-form" action={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    disabled={isPending}
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    disabled={isPending}
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message"
                    rows={6}
                    
                    required
                    disabled={isPending}
                    className="mt-1 resize-none"
                />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
