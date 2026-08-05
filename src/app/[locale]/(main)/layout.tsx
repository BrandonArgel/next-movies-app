import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
