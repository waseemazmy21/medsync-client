'use client'

import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

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
        <>
            {children}
        </>
    )
}

export default ProtectedLayout;