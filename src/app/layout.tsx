import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Readystore AI",
  description: "Scan whether AI shopping assistants can understand a WooCommerce store.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
