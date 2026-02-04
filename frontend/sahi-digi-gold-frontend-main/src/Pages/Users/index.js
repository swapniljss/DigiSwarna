import React, { useState } from 'react';
import { Route, Routes, Outlet, useLocation } from 'react-router-dom';
import RightSidePanel from '../../Components/RightSidePanel';
import AddUser from './addUser';
import UserTable from './userTable';
import ViewUserModel from './viewUserModel';
import ChangePassword from './changePassword';
import { CheckPermissions } from '../../Utils/permissions';
import './style.css';

const Users = () => {

    let location = useLocation();

    let passwordPermissions = CheckPermissions('users_permissions', 'Change Password');

    const background = location.state ? location.state.background : location;

    const [pages] = useState([
        {
            path: '/',
            component: UserTable,
            enable_route: CheckPermissions('users_permissions', 'View')
        },
        {
            path: '/add',
            component: AddUser,
            enable_route: CheckPermissions('users_permissions', 'Add')
        },
        {
            path: '/edit/:user_id',
            component: AddUser,
            enable_route: CheckPermissions('users_permissions', 'Edit')
        },
    ]);

    return (
        <RightSidePanel removeBg>
            <Routes location={background}>
                <Route path={'/'} element={<Outlet />}>
                    { // eslint-disable-next-line 
                        pages.map((route) => {
                            if (route.enable_route) {
                                const { path, component: Component, children, title, permission, ...rest } = route;
                                return (
                                    <Route {...rest} key={path} path={`${path}`} element={<Component />} />
                                )
                            }
                        })}
                </Route>
            </Routes>
            {background && (
                <Routes>
                    <Route path="/view/:user_id" element={<ViewUserModel />} />
                    {passwordPermissions && <Route path="/password/:user_id" element={<ChangePassword />} />}
                </Routes>
            )}
        </RightSidePanel>
    );
};

export default Users;
