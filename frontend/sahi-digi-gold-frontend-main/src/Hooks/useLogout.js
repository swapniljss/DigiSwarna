import { useNavigate } from 'react-router-dom';
import axios from "../Api/axios";
import { useAuth } from "../Hooks/useAuth";

const useLogout = () => {
    let navigate = useNavigate();
    const { setAuth, setPersist } = useAuth();

    const logout = async () => {
        try {
            let url = `auth/logout`;
            let options = {
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };
            await axios(options).then(response => {
                if (response.data.status === 1) {
                    setAuth({});
                    setPersist(false);
                    navigate(`/`, { replace: true });
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout
