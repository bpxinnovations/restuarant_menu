import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Restaurant Menus",
  description: "Get in touch with Restaurant Menus. Questions, suggestions, or want your restaurant listed? We'd love to hear from you.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
