import { HTTP_STATUS } from "@/constants/common";
import client from "../client";

interface DahboardDataState {
  inventory: number,
  outlets: number,
  requests: number,
  deliveries: number,
  stocks: number
}


export const dashboard = {
  state: {
    inventory: 0,
    outlets: 0,
    requests: 0,
    deliveries: 0,
    stocks: 0
  } as DahboardDataState,
  reducers: {
    setData(state: DahboardDataState, data: any) {
      return { ...state, ...data };
    },
  },
  effects: (dispatch: any) => ({
    async fetchData() {
      try {
        const { status, data } = await client.get('/api/v1/dashboard');
        if (status === HTTP_STATUS.OK) {
          dispatch.dashboard.setData(data);
        }
      } catch (error) {
        throw error
      }
    }
  })
};