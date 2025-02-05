import { HTTP_STATUS } from "@/constants/common";
import client from "../client";

export interface IProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
interface ProductsState {
  list: IProduct[],
}

export const products = {
  state: {
    list: [],
  } as ProductsState,
  reducers: {
    setProducts(state: ProductsState, list: any[]) {
      return { ...state, list };
    },
  },
  effects: (dispatch: any) => ({
    async fetchProducts() {
      try {
        const { status, data } = await client.get('/api/v1/product');
        if (status === HTTP_STATUS.OK) {
          dispatch.products.setProducts(data.products);
        }
      } catch (error) {
        throw error
      }

    }
  })
};