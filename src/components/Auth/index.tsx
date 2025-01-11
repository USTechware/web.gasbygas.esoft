import React, { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/data";
import { UserRole } from "@/app/api/types/user";

interface AuthPageOptions {
    roles: UserRole[];
    redirectTo?: string;
}

const AuthRoleCheck = <P extends object>(
    WrappedComponent: ComponentType<P>,
    options: AuthPageOptions
): React.FC<P> => {
    const { roles, redirectTo = "/dashboard" } = options;

    const WithAuth: React.FC<P> = (props) => {
        const router = useRouter();
        const user = useSelector((state: RootState) => state.auth.user);

        useEffect(() => {
            if (!user) {
                router.replace('/auth/login')
                return
            }
            if(!roles.length) return
            if (!roles.includes(user.userRole)) {
                router.replace(redirectTo);
            }
        }, [user, roles, router, redirectTo]);

        if (!user) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuth;
};

export default AuthRoleCheck;
