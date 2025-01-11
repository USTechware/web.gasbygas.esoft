import { UserRole } from "@/app/api/types/user";
import { RootState } from "@/data"
import { useSelector } from "react-redux"

const useUser = () => {
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);

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