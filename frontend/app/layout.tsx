import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
<<<<<<< HEAD:frontend/app/layout.tsx
  title: "HOP",
  description: "HOP",
  generator: "HOP",
};
=======
  title: 'HOP',
  description: 'HOP',
  generator: 'HOP',
}
>>>>>>> 166dc720f6e966500a7f971965f5dbb5faa2b9e6:app/layout.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
