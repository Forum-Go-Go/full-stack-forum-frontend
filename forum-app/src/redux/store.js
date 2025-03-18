import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import messageReducer from './slices/messageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer
  }
})

export default store
