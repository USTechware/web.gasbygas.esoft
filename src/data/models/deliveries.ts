interface DeliveryState {
  list: IDelivery[]
}

interface IDelivery {

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
      dispatch.deliveries.setDeliveries([]);
    }
  })
};