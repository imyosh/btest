import { createSlice } from '@reduxjs/toolkit'

const homeFolderPathSlice = createSlice({
  name: 'homeFolderPath',
  initialState: {},
  reducers: {
    setHomeFolderPath(state, action) {
      return action.payload
    },
  },
})

// Export actions
export const { setHomeFolderPath } = homeFolderPathSlice.actions

// Export reducer
export default homeFolderPathSlice.reducer
