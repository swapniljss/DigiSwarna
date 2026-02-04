
import axios from '../Api/axios';
import jwt_decode from "jwt-decode";
import { useAuth } from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('auth/refresh', {
            withCredentials: true
        });
        let temToken = response.data.token.replace('Bearer', '');
        let decoded = jwt_decode(temToken);
        const token = response.data.token;
        const id = decoded.id;
        const name = decoded.name;
        const image = decoded.image;
        const permissions = decoded.permissions;
        const role = [decoded.role];
        setAuth({ name, image, id, permissions, role, token });
        return response.data.token;
    }
    return refresh;
};

export default useRefreshToken;
