import { useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '..';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();
    const authUserId = useSelector(store => store.user.authUser?._id);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/user`);
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                dispatch(setOtherUsers([]));
            }
        }
        fetchOtherUsers();
    }, [authUserId, dispatch])

}

export default useGetOtherUsers
