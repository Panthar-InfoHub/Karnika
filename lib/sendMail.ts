import { orderPlacedAdmin, orderPlacedUser } from "@/templates/Email";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  emailContent: { subject: string; text: string; html: string }
) => {
  try {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Helper function to send order confirmation to user
export const sendOrderConfirmationToUser = async (
  orderDetails: Parameters<typeof orderPlacedUser>[0]
) => {
  const emailContent = orderPlacedUser(orderDetails);
  return await sendMail(orderDetails.customerEmail, emailContent);
};

// Helper function to send order notification to admin
export const sendOrderNotificationToAdmin = async (
  adminEmail: string,
  orderDetails: Parameters<typeof orderPlacedAdmin>[0]
) => {
  const emailContent = orderPlacedAdmin(orderDetails);
  return await sendMail(adminEmail, emailContent);
};
