'use client'

import { useAuth } from "@/hooks/useAuth";
import { Doctor } from "@/lib/types";
import { redirect } from "next/navigation";

const ProtectedLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { user } = useAuth()
    if (!(user?.role === 'Doctor' && (user as Doctor).departmentManager)) {
        redirect('/dashboard')
    }
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedLayout;