import jwtDecode from "jwt-decode";

export const getUserIdFromToken = () => {
    try {
        const token = localStorage.getItem("token");
        // console.log("Retrieved Token:", token);
        if (!token) return null;

        const cleanToken = token.replace("Bearer ", "");
        // console.log("Cleaned Token:", cleanToken);
        const decoded = jwtDecode(cleanToken);

        // console.log("Decoded Token:", decoded);
        return decoded?.id || null;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
};