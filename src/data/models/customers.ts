import { BusinessVerifcationStatus, HTTP_STATUS } from "@/constants/common";
import client from "../client";
import { UserRole } from "@/app/api/types/user";

interface CustomersState {
  list: ICustomer[]
}

interface ICustomer {
  _id?: string;
  name: string;
  userRole: UserRole;
  district: string;
  city: string;
  address: string;
  type: string;
}

export const customers = {
  state: {
    list: [],
  } as CustomersState,
  reducers: {
    setCustomers(state: CustomersState, list: any[]) {
      return { ...state, list };
    },
    setBusinessStatus(state: CustomersState, payload: { _id: string, status: boolean }) {
      return {
        ...state, list: state.list.map(o => {
          if (o._id === payload._id) {
            return { ...o, businessVerificationStatus: payload.status }
          }
          return o
        })
      };
    },
  },
  effects: (dispatch: any) => ({
    async fetchCustomers() {
      try {
        const { status, data } = await client.get('/api/v1/admin/customers');
        if (status === HTTP_STATUS.OK) {
          dispatch.customers.setCustomers(data.customers);
        }
      } catch (error) {
        throw error
      }

    },
    async updateBusinessStatus(payload: { _id: string, status: BusinessVerifcationStatus}) {
      try {
        const { status } = await client.put('/api/v1/admin/customers/update-status', payload);
        if (status === HTTP_STATUS.OK) {
          dispatch.customers.setBusinessStatus(payload)
        }
      } catch (error) {
        throw error
      }
    },
  })
};