import { HTTP_STATUS } from "@/constants/common";
import client from "../client";

interface OutletsState {
  list: IOutlet[]
}

interface IOutlet {
  _id?: string;
  name: string;
  district: string;
  city: string;
  address: string;
  managerName: string;
  managerEmail: string;
  managerPhoneNumber: string;
}

export const outlets = {
  state: {
    list: []
  } as OutletsState,
  reducers: {
    setOutlets(state: OutletsState, list: any[]) {
      return { ...state, list };
    },
  },
  effects: (dispatch: any) => ({
    async fetchOutlets() {
      try {
        const { status, data } = await client.get('/api/v1/outlet');
        if (status === HTTP_STATUS.OK) {
          dispatch.outlets.setOutlets(data);
        }
      } catch (error) {
        throw error
      }
      
    },

    async createOutlet(payload: IOutlet) {
      
      try {
        const { status, data } = await client.post('/api/v1/outlet', payload);
        if (status === HTTP_STATUS.CREATED) {
          return data;
        }
      } catch (error) {
        throw error
      }
      
    }
  })
};