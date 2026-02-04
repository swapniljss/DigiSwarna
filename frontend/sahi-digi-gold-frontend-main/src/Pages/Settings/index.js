import React, { useState } from 'react';
import { NavLink, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import RightSidePanel from '../../Components/RightSidePanel';
import { MENU_SLUG } from '../../Constants/constants';
import GeneralSettings from './generalSettings';
import ChangePassword from './changePassword';

import './style.css';

const SettingsPage = () => {
    let location = useLocation();

    const [tabsList] = useState([
        {
            name: 'general-settings',
            title: 'General Settings',
            path: '/',
            link: `/${MENU_SLUG.settings}`,
            component: GeneralSettings,
            show_tab: true,
        },
        {
            name: 'change-password',
            title: 'Change Password',
            path: '/password',
            link: `/${MENU_SLUG.settings}/password`,
            component: ChangePassword,
            show_tab: true,
        },
    ]);

    return (
        <RightSidePanel>
            <Box component="div" className={'BBPSettingsPage'}>
                <Box component="div" className={'BBPSPTab'}>
                    {tabsList.map((page, index) =>
                        page.show_tab ?
                            <NavLink
                                key={index}
                                to={page.link}
                                className={({ isActive }) =>
                                    [
                                        'BBPSPTBtn',
                                        isActive ? 'BBPSPTBActive' : '',
                                    ]
                                        .filter(Boolean)
                                        .join(" ")
                                }
                                end={location.pathname !== `/${MENU_SLUG.settings}/general-settings` ? true : false}
                            >
                                {page.title}
                            </NavLink> : ''
                    )}
                </Box>
                <Box component="div" className={'BBPSPTabView'}>
                    <Routes>
                        <Route path={'/'} element={<Outlet />}>
                            { // eslint-disable-next-line 
                                tabsList.map((route) => {
                                    if (route.show_tab) {
                                        const { path, component: Component, children, title, permission, ...rest } = route;
                                        return (
                                            <Route {...rest} key={path} path={`${path}`} element={<Component />} />
                                        )
                                    }
                                })}
                        </Route>
                    </Routes>
                </Box>
            </Box>
        </RightSidePanel>
    );
};

export default SettingsPage; 