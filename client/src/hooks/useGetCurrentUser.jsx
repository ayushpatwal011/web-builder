import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

export function useGetCurrentUser() {
	const dispatch = useDispatch()
	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, { withCredentials: true })
				dispatch(setUserData(result.data.user))
				
			} catch (e) {
				console.error(e);
			}
		}
		getCurrentUser()
	}, [])
}