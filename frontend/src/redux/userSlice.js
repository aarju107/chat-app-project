import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:null,
        selectedUser:null,
        onlineUsers:[],
        unreadByUser:{},
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
            if (!action.payload) {
                state.otherUsers = null;
                state.selectedUser = null;
                state.onlineUsers = [];
                state.unreadByUser = {};
            }
        },
        setOtherUsers:(state, action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
            const selectedId = action.payload?._id;
            if (!state.unreadByUser) state.unreadByUser = {};
            if (selectedId) delete state.unreadByUser[String(selectedId)];
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        incrementUnread:(state, action)=>{
            const senderId = String(action.payload || '');
            if (!senderId) return;
            if (!state.unreadByUser) state.unreadByUser = {};
            state.unreadByUser[senderId] = (state.unreadByUser[senderId] || 0) + 1;
        }
    }
});
export const {setAuthUser,setOtherUsers,setSelectedUser,setOnlineUsers,incrementUnread} = userSlice.actions;
export default userSlice.reducer;
