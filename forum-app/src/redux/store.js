
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import messageReducer from './slices/messageSlice'
import postsReducer from './slices/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer,
    posts: postsReducer,

  }
})

export default store
