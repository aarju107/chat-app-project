import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[],
        loading:false,
        error:null,
        activeConversationId:null,
    },
    reducers:{
        startLoadingMessages:(state, action)=>{
            state.messages = [];
            state.loading = true;
            state.error = null;
            state.activeConversationId = action.payload;
        },
        setMessages:(state,action)=>{
            const { conversationId, messages } = action.payload;
            if (state.activeConversationId !== conversationId) return;
            state.messages = Array.isArray(messages) ? messages : [];
            state.loading = false;
            state.error = null;
        },
        setMessagesError:(state,action)=>{
            if (state.activeConversationId !== action.payload.conversationId) return;
            state.loading = false;
            state.error = action.payload.message;
        },
        addMessage:(state,action)=>{
            if (!action.payload) return;
            const exists = state.messages.some(m => m._id === action.payload._id);
            if (exists) return;
            state.messages.push(action.payload);
        },
        clearMessages:(state)=>{
            state.messages = [];
            state.loading = false;
            state.error = null;
            state.activeConversationId = null;
        }
    }
});
export const {
    startLoadingMessages,
    setMessages,
    setMessagesError,
    addMessage,
    clearMessages
} = messageSlice.actions;
export default messageSlice.reducer;
