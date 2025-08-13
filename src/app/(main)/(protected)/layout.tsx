import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const router = useRouter()
    const user = true
    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    })
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedLayout;