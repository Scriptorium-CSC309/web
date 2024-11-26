import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { StateContext as UserStateContext } from "@/frontend/contexts/UserContext";
import { useState } from "react";

/* Wrapper for components that need authenticated to be enfored */
const withAuth = (WrappedComponent: React.ComponentType, admin?: boolean) => {
    const AuthWrapper = (props: any) => {
        const user = useContext(UserStateContext);
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            if (!user) {
                router.push("/auth/login");
            } else if (admin && !user.isAdmin) {
                router.push("/");
            } else {
                setIsLoading(false);
            }
        }, [user, router]);

        // Prevent rendering the wrapped component until the user is verified
        if (isLoading) {
            return null; // Or render a loading spinner if desired
        }

        return <WrappedComponent {...props} />;
    };

    return AuthWrapper;
};

export default withAuth;
