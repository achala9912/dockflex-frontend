// import type { Metadata } from 'next'
// import './globals.css'


// export const metadata: Metadata = {
//   title: "DocFlex Pro",
//   description: "Discover amazing products at Cripsy.",
//   icons: {
//     icon: "/favicon.ico",
//   }
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className=''>{children}</body>
//     </html>
//   )
// }

// app/layout.tsx (server component)
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "DocFlex Pro",
  description: "Discover amazing products at Cripsy.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
