"use server";

import { sendMail } from "@/lib/sendMail";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address",
      };
    }

    // Simple admin email
    const adminEmailContent = {
      subject: `New Contact Form - ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Simple customer confirmation email
    const customerEmailContent = {
      subject: "Thank you for contacting us!",
      text: `Hi ${name},\n\nThank you for your message. We'll get back to you soon!\n\nBest regards,\nKarnika Team`,
      html: `
        <h3>Thank you for contacting us!</h3>
        <p>Hi ${name},</p>
        <p>Thank you for your message. We'll get back to you soon!</p>
        <p>Best regards,<br>Karnika Team</p>
      `,
    };

    try {
      // Send to admin
      const adminEmail = process.env.ADMIN_EMAIL || "shivayadavsy1256@gmail.com";
      await sendMail(adminEmail, adminEmailContent);

      // Send confirmation to customer
      await sendMail(email, customerEmailContent);

      return {
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
      };
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      return {
        success: false,
        message: "Failed to send message. Please try again.",
      };
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
