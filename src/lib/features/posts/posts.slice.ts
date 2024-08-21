import { Post } from '@prisma/client';
import { createSlice } from '@reduxjs/toolkit';
import { createdPost } from './posts.actions';

type initialState = {
  posts: Post[];
  status: 'idle' | 'pending' | 'fulfield' | 'rejected';
  error: string | null;
};

const initialState: initialState = {
  posts: [],
  status: 'idle',
  error: null,
};
//posts/increment -> ot reducer
//posts/createdPost/fulfield -> ot thunk

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // increment() {
    //   state.counter += 1
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createdPost.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(createdPost.fulfilled, (state, action) => {
        state.status = 'fulfield';
        // state.posts.push(...action.payload)
      })
      .addCase(createdPost.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || 'Unknown error'
      });
  },
});

export const postsReducer = postsSlice.reducer;
