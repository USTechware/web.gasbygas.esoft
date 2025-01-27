import { UserRole } from "@/app/api/types/user";
import client from "../client";
import { HTTP_STATUS } from "@/constants/common";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: null | IUser;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  outlet?: string;
  city?: string;
  district?: string;
  address?: string;
  phoneNumber?: string;
  nationalIdNumber?: string;
  businessRegId?: string;
  requestChangePassword?: boolean
}

interface ILoginPayload {
  email: string;
  password: string;
}


interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  nationalIdNumber: string;
  address: string;
  phoneNumber: string;
  userRole: 'BUSINESS' | 'CUSTOMER';
  businessRegId?: string;
}
interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface IUpdateUserPayload {
  firstName: string;
  lastName: string;
  nationalIdNumber?: string;
  address: string;
  city: string;
  district: string;
  phoneNumber?: string;
  businessRegId?: string;
}

export const auth = {
  state: {
    isLoggedIn: false,
    user: null,
  } as AuthState,
  reducers: {
    setLoggedIn(state: AuthState, payload: boolean) {
      return { ...state, isLoggedIn: payload };
    },
    setUser(state: AuthState, payload: AuthState) {
      return { ...state, ...payload };
    },
    updateUser(state: AuthState, payload: AuthState['user']) {
      return { ...state, user: { ...(state.user || {}), ...payload } };
    },
    setLogout(state: AuthState) {
      return { ...state, isLoggedIn: false, user: null };
    },
  },
  effects: (dispatch: any) => ({
    async login(payload: ILoginPayload) {

      const result = await client.post('/api/v1/auth/login', payload)

      if (result.status === HTTP_STATUS.OK) {
        dispatch.auth.setLoggedIn(true);
        dispatch.auth.setUser({
          user: result.data.user,
          token: result.data.token
        })

        localStorage.setItem('token', result.data.token);
      }

    },
    async fetchUser() {
      const result = await client.get('/api/v1/user/fetch-user')

      if (result.status === HTTP_STATUS.OK) {
        dispatch.auth.setUser({
          user: result.data.user
        })
      }
    },
    async register(payload: IRegisterPayload) {
      await client.post('/api/v1/auth/register', payload)
    },
    async forgotPassword(payload: { email: string; }) {
    },
    async changePassword(payload: IChangePasswordPayload) {
      const result = await client.post('/api/v1/auth/change-password', payload)
      if (result.status === HTTP_STATUS.OK) {
        dispatch.auth.updateUser({ requestChangePassword: false })
        return result.data
      }
    },

    async updateProfile(payload: IUpdateUserPayload) {
      const result = await client.put('/api/v1/user/update-user', payload)
      if (result.status === HTTP_STATUS.OK) {
        dispatch.auth.updateUser(payload)
        return result.data
      }
    },
    async logout() {
      dispatch.auth.setLogout();
      localStorage.removeItem('token');
    }
  })
};