import { HTTP_STATUS } from "@/constants/common";
import client from "../client";
import { IRequestItem } from "@/app/api/models/deliveries.model";
import { DeliveryStatus } from "@/app/api/types/deliveries";

interface DeliveryState {
  list: IDelivery[]
}

interface IDelivery {
  _id?: string
  outlet: string,
  quantity: number,
  dateOfDelivery: string
}

interface IUpdateDelivery {
  _id?: string;
  status: DeliveryStatus
}

export const deliveries = {
  state: {
    list: []
  } as DeliveryState,
  reducers: {
    setDeliveries(state: DeliveryState, list: any[]) {
      return { ...state, list };
    },
  },
  effects: (dispatch: any) => ({
    async fetchDeliveries() {
      try {
        const { status, data } = await client.get('/api/v1/deliveries');
        if (status === HTTP_STATUS.OK) {
          dispatch.deliveries.setDeliveries(data);
        }
      } catch (error) {
        throw error
      }
    },
    async createDelivery(payload: { items: IRequestItem[]}) {
      try {
        const { status, data } = await client.post('/api/v1/deliveries', payload);
        if (status === HTTP_STATUS.CREATED) {
          return data;
        }
      } catch (error) {
        throw error
      }
    },
    async confirmDelivery(payload: IUpdateDelivery) {
      try {
        const { status, data } = await client.put('/api/v1/deliveries/update-status', payload);
        if (status === HTTP_STATUS.OK) {
          return data;
        }
      } catch (error) {
        throw error
      }
    }
  })
};