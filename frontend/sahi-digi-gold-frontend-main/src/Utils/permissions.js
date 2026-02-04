import { useAuth } from '../Hooks/useAuth';

/**
 * Permissions
 * @param {data} xml
 *
 * ******* */

export const CheckPermissions = (page, permission) => {
    const { auth } = useAuth();
    if (auth && auth.role && auth.role[0] === 'Admin') {
        return true;
    } else {
        const permissions = auth && auth.permissions ? JSON.parse(auth.permissions) : '';
        if (permissions[page]) {
            if (permissions[page].includes(permission)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}