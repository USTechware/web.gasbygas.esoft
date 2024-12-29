interface RequestsState {
  list: IRequest[]
}

interface IRequest {

}

export const requests = {
  state: {
    list: []
  } as RequestsState,
  reducers: {
    setRequests(state: RequestsState, list: any[]) {
      return { ...state, list };
    },
  },
  effects: (dispatch: any) => ({
    async fetchRequests() {
      dispatch.requests.setRequests([]);
    }
  })
};