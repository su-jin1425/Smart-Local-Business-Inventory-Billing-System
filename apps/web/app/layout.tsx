import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventory & Billing V2",
  description: "Internal operations tool for inventory and billing workflows"
};

const navigation = [
  { href: "/", label: "Operations Overview" },
  { href: "/products", label: "Product Catalog" },
  { href: "/inventory", label: "Stock Control" },
  { href: "/billing", label: "Billing Desk" }
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <h1>Inventory & Billing V2</h1>
            <p>
              Internal operations workspace for catalog maintenance, stock control, and billing.
            </p>
            <nav className="nav">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
