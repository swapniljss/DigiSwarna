import React, { Fragment, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from '../Hooks/useRefreshToken';
import { useAuth } from '../Hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !auth.token && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
        // eslint-disable-next-line 
    }, [])

    return (
        <Fragment>
            {!persist
                ? <Outlet />
                : isLoading
                    ? ''
                    : <Outlet />
            }
        </Fragment>
    )
}

export default PersistLogin
