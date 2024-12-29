interface InventoryState {
  total: number,
  list: InventoryAddition[]
}

interface InventoryAddition {

}

export const inventory = {
  state: {
    total: 0,
    list: []
  } as InventoryState,
  reducers: {
    setInventory(state: InventoryState, list: any[], total: number) {
      return { ...state, list, total };
    },
  },
  effects: (dispatch: any) => ({
    async fetchInventory() {
      dispatch.inventory.setInventory({});
    }
  })
};