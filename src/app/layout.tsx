import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

{/* <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body className="antialiased">
  <main className="main-content">
    {children}
  </main>
</body>
</html> */}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
<html> 
<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<style> 
 #BodyWrap { font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:18px; padding:2%; } 
 #BodyWrap H1 { margin-bottom:20px; } 
 #BodyWrap P { margin-bottom:20px; } 
 #ViewProductButton { background-color:#CC0000; width:100%; max-width:500px; text-align:center; padding:10px; margin:auto; color:#ffffff; border:0 none;  border-radius:5px; font-size:20px; display:block; font-weight:bold; } 
 </style> 
 <body className="antialiased">
  <main className="main-content">
    {children}
  </main>
</body>
 </html>
  );
}
