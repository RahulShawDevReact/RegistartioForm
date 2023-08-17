import { createSlice } from '@reduxjs/toolkit'

export const registerSlice = createSlice({
  name: 'register',
  
  initialState: {
    value: 0,
    userData:[],
    dialogPopup:false
  },
  reducers: {
    register: (state, action) => {
        console.log("state",action.payload)
        state.userData.push(action.payload)
        // console.log("data",state.userData)
    },
    updateUser: (state = initialState, action) => {
        
        console.log("vlues------------------",action.payload)
        const { id } = action.payload;
        const index = state.userData.findIndex((user) => user.id === id);
        state.userData.splice(index, 1, action.payload);
    },
    removeUser: (state = initialState, action) => {
        state.userData = state.userData.filter((user) => user.id !== action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { register,updateDialogPopup,removeUser,updateUser} = registerSlice.actions

export default registerSlice.reducer