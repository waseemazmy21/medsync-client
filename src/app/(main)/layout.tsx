import Header from "@/components/Header";
import QueryProviders from "@/components/QueryProviders";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedSync",
  description: "MedSync - Manage your medical appointments with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <QueryProviders>
        <NotificationsProvider>
          <Header />
          <main>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </main >
        </NotificationsProvider >
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProviders>
    </>
  );
}
