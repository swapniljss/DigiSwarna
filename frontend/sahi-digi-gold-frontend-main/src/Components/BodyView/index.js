import React from 'react';
import Box from '@mui/material/Box';
import './style.css';

const BodyView = ({ children, customClass }) => {
    return (
        <Box component="div" className={`BBPBodyView ${customClass}`}>
            <Box component="div" className={'BBPBVInner'}>
                {children}
            </Box>
        </Box>
    );
};
export default BodyView;