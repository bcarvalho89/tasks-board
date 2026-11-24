import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ToastProvider } from "@/components/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SquareCheckBig } from "lucide-react";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Board",
  description: "Create, edit and remove tasks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <header className="border-b border-border bg-card">
            <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between gap-4 px-4">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-sm text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <SquareCheckBig
                  className="size-6 text-primary"
                  aria-hidden="true"
                />
                Task Board
              </Link>
              <ThemeToggle />
            </div>
          </header>

          <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
            <TRPCReactProvider>
              <ToastProvider>{children}</ToastProvider>
            </TRPCReactProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
