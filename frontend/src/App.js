import Signup from './components/Signup';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect } from 'react';
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';
import useGetRealTimeMessage from './hooks/useGetRealTimeMessage';

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },

])

function App() { 
  const {authUser} = useSelector(store=>store.user);
  const {unreadByUser} = useSelector(store=>store.user);
  const {socket} = useSelector(store=>store.socket);
  const dispatch = useDispatch();
  useGetRealTimeMessage();

  useEffect(() => {
    const totalUnread = Object.values(unreadByUser || {}).reduce((sum, count) => sum + count, 0);
    document.title = totalUnread ? `(${totalUnread}) Chatly` : 'Chatly';
    return () => { document.title = 'Chatly'; };
  }, [unreadByUser]);

  useEffect(()=>{
    if(authUser){
      const socketio = io(`${BASE_URL}`, {
          withCredentials: true,
          query:{
            userId:authUser._id
          },
          reconnection: true,
          reconnectionAttempts: 10,
      });
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      return () => socketio.close();
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authUser]);

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-5 lg:p-8">
      <RouterProvider router={router}/>
    </div>

  );
}

export default App;
