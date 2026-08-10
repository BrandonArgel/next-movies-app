import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex min-h-screen flex-1 flex-col bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
