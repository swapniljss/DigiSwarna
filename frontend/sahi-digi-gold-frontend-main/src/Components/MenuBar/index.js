import React from 'react';
import Box from '@mui/material/Box';
import Logo from '../Logo';
import UserDropdown from '../UserDropdown';
import LogoImg from '../../Assets/Images/digiswarnalogo.svg';
import './style.css';


const MenuBar = () => {
    return (
        <Box component="div" className={'BBPMenuBar'}>
            <Box component="div" className={'BBPMInner'}>
                <Logo logo={LogoImg} />
                <Box component="div" className={'BBPMNU'}>
                    <Box component="div" className={'BBPMNUInnner'}>
                        <UserDropdown />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MenuBar;