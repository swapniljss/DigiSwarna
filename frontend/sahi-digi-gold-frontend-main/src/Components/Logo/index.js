import React from 'react';
import Box from '@mui/material/Box';
import { NavLink } from 'react-router-dom';
import LogoImg from '../../Assets/Images/cshulkpaylogo.svg';
import './style.css';

const Logo = ({ logo, link }) => {
    return (
        <Box component="div" className={'BBPMLogo'}>
            <NavLink to={link ? link : '/'}>
                <img src={logo || LogoImg} alt="SAHI SAVINGS" />
            </NavLink>
        </Box>
    );
};
export default Logo;