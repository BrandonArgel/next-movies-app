import { getTranslations } from "next-intl/server";

export async function Footer() {
  return (
    <footer className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      Footer
    </footer>
  );
}
