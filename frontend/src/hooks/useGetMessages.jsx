import { useEffect } from 'react'
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearMessages, setMessages, setMessagesError, startLoadingMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!selectedUser?._id) {
            dispatch(clearMessages());
            return;
        }

        let cancelled = false;
        const conversationId = selectedUser._id;

        // Clear the previous conversation immediately so it can't
        // flash/leak into the newly selected one while the fetch is in flight.
        dispatch(startLoadingMessages(conversationId));

        const fetchMessages = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/message/get/${conversationId}`);
                // Ignore this response if the user has already switched
                // to a different conversation before it came back.
                if (!cancelled) {
                    dispatch(setMessages({ conversationId, messages: res.data }));
                }
            } catch (error) {
                if (!cancelled) {
                    dispatch(setMessagesError({
                        conversationId,
                        message: error.response?.data?.message || "Couldn't load this conversation."
                    }));
                }
            }
        }
        fetchMessages();

        return () => {
            cancelled = true;
        };
    }, [selectedUser?._id, dispatch]);
}

export default useGetMessages
