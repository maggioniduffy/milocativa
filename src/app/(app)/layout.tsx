import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/siteFooter";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
