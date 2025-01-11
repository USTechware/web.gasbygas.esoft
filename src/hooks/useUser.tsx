import { UserRole } from "@/app/api/types/user";
import { Dispatch, RootState } from "@/data"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

const useUser = () => {
    const dispatch = useDispatch<Dispatch>();
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);


    useEffect(() => {
        dispatch.auth.fetchUser();
    }, [dispatch]);

    return {
        user,
        isLoggedIn: isLoggedIn,
        isDistributor: user?.userRole === UserRole.DISTRIBUTOR,
        isOutletManager: user?.userRole === UserRole.OUTLET_MANAGER,
        isCustomer: user?.userRole === UserRole.CUSTOMER,
        isBusiness: user?.userRole === UserRole.BUSINESS,

    }
}

export default useUser;