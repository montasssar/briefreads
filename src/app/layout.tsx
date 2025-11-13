import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";


export const metadata: Metadata = {
title: "BriefReads Quotes",
description: "A lightweight, beautiful feed of quotes with search & filtering.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<Navbar />
<main className="container-wide py-8">{children}</main>
</body>
</html>
);
}