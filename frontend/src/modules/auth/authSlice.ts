import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Me = { username?: string; role?: string }

type AuthState = {
  token: string | null
  role: string | null
  user: Me | null
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  role: null,
  user: null
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<string | null>) { state.role = action.payload },
    setUser(state, action: PayloadAction<Me | null>) { state.user = action.payload }
  }
})

export const { setRole, setUser } = slice.actions
export default slice.reducer
