import Header from "@/src/components/nav/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-grey-10 pt-[76px] transition-[padding] duration-300 lg:pl-[var(--dashboard-sidebar-width,256px)]">
        {children}
      </main>
    </>
  );
}
