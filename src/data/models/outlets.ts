interface OutletsState {
  list: IOutlet[]
}

interface IOutlet {

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
      dispatch.outlets.setOutlets([]);
    }
  })
};