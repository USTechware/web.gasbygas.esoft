import { HTTP_STATUS } from "@/constants/common";
import client from "../client";

interface OutletsState {
  list: IOutlet[],
  currentStock: number,
  stockHistory: IStockHistory[]
}

interface IStockHistory{
  dateAdded: string;
  quantity: number;
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
    list: [],
    currentStock: 0,
    stockHistory: []
  } as OutletsState,
  reducers: {
    setOutlets(state: OutletsState, list: any[]) {
      return { ...state, list };
    },
    setInventory(state: OutletsState, currentStock: number, stockHistory: IStockHistory[]) {
      return { ...state, currentStock, stockHistory };
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
      
    },
    async fetchStocks() {
      try {
        const { status, data } = await client.get('/api/v1/outlet/stocks');
        if (status === HTTP_STATUS.OK) {
          dispatch.outlets.setInventory(data.currentStock, data.stockHistory || []);
        }
      } catch (error) {
        throw error
      }
    },
    async fetchOutletDetail(id: string) {
      try {
        const { status, data } = await client.post('/api/v1/outlet/detail', {id});
        if (status === HTTP_STATUS.OK) {
          return data || {}
        }
      } catch (error) {
        throw error
      }
    },
  })
};