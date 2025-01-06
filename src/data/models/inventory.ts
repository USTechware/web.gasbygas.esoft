import { HTTP_STATUS } from "@/constants/common";
import client from "../client";

interface InventoryState {
  currentStock: number,
  history: InventoryAddition[]
}

interface InventoryAddition {
  dateAdded: string;
  quantity: number;
}

export const inventory = {
  state: {
    currentStock: 0,
    history: []
  } as InventoryState,
  reducers: {
    setInventory(state: InventoryState, payload: any) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch: any) => ({
    async fetchInventory() {
      try {
        const { status, data } = await client.get('/api/v1/inventory');
        if (status === HTTP_STATUS.OK) {
          dispatch.inventory.setInventory(data);
        }
      } catch (error) {
        throw error
      }
    },

    async createInventory(payload: InventoryAddition) {
      try {
        const { status, data } = await client.post('/api/v1/inventory', payload);
        if (status === HTTP_STATUS.OK) {
          return data;
        }
      } catch (error) {
        throw error
      }
    }
  })
};