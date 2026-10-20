import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../redux/messageSlice";
import { incrementUnread } from "../redux/userSlice";
import toast from "react-hot-toast";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { selectedUser, authUser, otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            const senderId = String(newMessage?.senderId || "");
            const receiverId = String(newMessage?.receiverId || "");
            const selectedUserId = String(selectedUser?._id || "");
            const authUserId = String(authUser?._id || "");
            // Only add this message to the open thread if it actually
            // belongs to the conversation currently being viewed.
            const belongsToOpenConversation =
                selectedUserId &&
                (
                    (senderId === selectedUserId && receiverId === authUserId) ||
                    (senderId === authUserId && receiverId === selectedUserId)
                );

            if (belongsToOpenConversation) {
                dispatch(addMessage(newMessage));
            } else if (receiverId === authUserId) {
                dispatch(incrementUnread(senderId));
                const sender = otherUsers?.find(user => String(user._id) === senderId);
                toast(`New message from ${sender?.fullName || 'someone'}`, {
                    icon: '💬',
                    duration: 3500,
                });
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, selectedUser, authUser, otherUsers, dispatch]);
};

export default useGetRealTimeMessage;
