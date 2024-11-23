import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { StateContext as UserStateContext } from "@/frontend/contexts/UserContext";

/* Wrapper for components that need authenticated to be enfored */
const withAuth = (WrappedComponent: React.ComponentType, admin?: boolean) => {
    const AuthWrapper = (props: any) => {
        const user = useContext(UserStateContext);
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push("/auth/login");
            } else if (admin && !user.isAdmin) {
                router.push("/");
            }
        }, [user, router]);

        // Prevent rendering the wrapped component until the user is verified
        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthWrapper;
};

export default withAuth;
