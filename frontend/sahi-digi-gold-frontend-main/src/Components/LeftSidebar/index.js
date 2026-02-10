import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '../../Components/Icons/HomeIcon';
import OnBoardingIcon from '../Icons/OnBoardingIcon';
import ReportsIcon from '../Icons/ReportsIcon';
import SettingsIcon from '../Icons/SettingsIcon';
import './style.css';

const LeftSidebar = ({ pages }) => {

    const getIcon = app => {
        switch (app) {
            case 'dashboard':
                return <HomeIcon />;
            case 'reports':
                return <ReportsIcon />;
            case 'customers':
                return <GroupIcon />;
            case 'users':
                return <OnBoardingIcon />;
            case 'settings':
                return <SettingsIcon />;
            default:
        }
    };

    return (
        <Box component="div" className={'BBPLeftSidebar'}>
            <Box component="div" className={'BBPLSInner'}>
                {pages.map((page, index) =>
                    <Fragment key={index}>
                        {page.show_tab ?
                            <Box component="div" className={`${page && page.children && page.children.length > 0 ? 'BBPLSIMOC' : ''} BBPLSIMOuter`}>
                                <NavLink
                                    to={page.link}
                                    className={({ isActive }) =>
                                        [
                                            'BBPLSIMenu',
                                            isActive ? 'BBPLSIActive' : '',
                                        ]
                                            .filter(Boolean)
                                            .join(" ")
                                    }
                                >
                                    {getIcon(page.name)}
                                    <Box component="span" className={'BBPLSIMTitle'}>{page.title}</Box>
                                </NavLink>
                                {page.children ?
                                    page.children.map((child, childIndex) =>
                                        child.show_tab ?
                                            <NavLink
                                                key={childIndex}
                                                to={child.link}
                                                className={({ isActive }) =>
                                                    [
                                                        'BBPLSIMChild',
                                                        isActive ? 'BBPLSICActive' : '',
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ")
                                                }
                                                end
                                            >
                                                <Box component="span" className={'BBPLSIMCTitle'}>{child.title}</Box>
                                            </NavLink>
                                            : ''
                                    )
                                    : ''}
                            </Box>
                            : ''}
                    </Fragment>
                )}
                <div className="BBPVersion">v1.1.0 ©2026</div>

            </Box>
        </Box>
    );
};
export default LeftSidebar;