import { UserRole } from "@/app/api/types/user";
import { Dispatch, RootState } from "@/data"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

const useDashboard = () => {
    const dispatch = useDispatch<Dispatch>();
    const data = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch.dashboard.fetchData();
    }, [dispatch]);

    return data
}

export default useDashboard;