import { useContext } from "react";
import { AuthContext } from "../Contexts/authProvider";

export const useAuth = () => {
    return useContext(AuthContext);
} 