'use client'

import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { useAuth } from "@/hooks/useAuth";
import { redirect, useRouter } from "next/navigation";

const ProtectedLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const {user} = useAuth()
    console.log("user",user);
    
    if (!user) {
        redirect('/login')
    }
    return (
        <AppointmentsProvider>
            {children}
        </AppointmentsProvider>
    )
}

export default ProtectedLayout;