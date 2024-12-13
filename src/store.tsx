import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './core/reducer/customer/reducer'
export const store = configureStore({
    reducer: {
         account: accountReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch