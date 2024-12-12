"use client";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useRedirect = (redirect: string) => {
    const { userLoginStatus } = useUserContext();
    const router = useRouter();
    
    useEffect(()=> {
        const redirectUser = async () => {
            try {
                const isLoggedUser = await userLoginStatus();
                console.log("isloggedUser", isLoggedUser);
                if(!isLoggedUser) router.push(redirect);
            } catch (error) {
                console.log("error in redirectUser", error);
            }
        };
        redirectUser();
    }, [redirect, userLoginStatus, router]);
};

export default useRedirect;