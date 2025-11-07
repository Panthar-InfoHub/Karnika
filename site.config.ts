export const siteConfig = {
  // Basic Site Information
  title: "Karnika Organics",
  name: "Karnika Organics",
  description:
    "Karnika Organics is your trusted source for premium organic products, dedicated to promoting a healthy lifestyle through natural and sustainable choices.",
  domain: "https://karnikaorganics.in",
  // Logo
  logo: {
    path: "/logo.png",
    alt: "Karnika Organics Logo",
  },

  // Contact Information
  contact: {
    email: "karnikaorganics@gmail.com",
    phone: "+91 1234567890",
    whatsapp: "911234567890", // Format: country code + number (no spaces or special characters)
    address: "RISE Incubation Nagar Nigam Premises Elite Square, Civil Lines Jhansi (UP) - 284001",
  },

  // Social Media Links
  social: {
    facebook: "https://facebook.com",
    instagram: "https://www.instagram.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },

  // Admin Panel
  admin: {
    title: "Karnika Organics Admin",
    subtitle: "Admin Panel",
  },
} as const;

export type SiteConfig = typeof siteConfig;
