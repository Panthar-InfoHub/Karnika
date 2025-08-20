
import ContactForm from "@/components/home/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Karnika",
  description: "Get in touch with us. We'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <div className=" flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-gray-600">
            We'd love to hear from you!
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
