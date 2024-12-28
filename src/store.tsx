import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './core/reducer/customer/reducer'
export const store = configureStore({
    reducer: {
        customer: customerReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch