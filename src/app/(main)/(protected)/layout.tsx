'use client'

import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

const ProtectedLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { user, loading } = useAuth()
    if (!loading && !user) {
        redirect('/login')
    }
    return (
        <div className="container max-w-7xl mx-auto p-4 space-y-6">
            <AppointmentsProvider>
                {children}
            </AppointmentsProvider>
        </div>
    )
}

export default ProtectedLayout;