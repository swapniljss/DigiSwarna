import React from 'react';
import Box from '@mui/material/Box';
import './style.css';

const RightSidePanel = ({ children, fullWidth, removeBg, customClass }) => {
    return (
        <Box component="div" className={`BBPRightSidePanel ${removeBg ? 'BBPRSPRBG' : ''} ${fullWidth ? 'BBPRSPFull' : ''} ${customClass ? customClass : ''}`}>
            <Box component="div" className={'BBPRSPInner'}>
                {children}
            </Box>
        </Box>
    );
};
export default RightSidePanel;