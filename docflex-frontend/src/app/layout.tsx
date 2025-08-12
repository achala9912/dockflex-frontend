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
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "DocFlex Pro",
  description: "Discover amazing .",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
