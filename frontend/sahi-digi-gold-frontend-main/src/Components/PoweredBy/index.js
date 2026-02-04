import React from 'react';
import Box from '@mui/material/Box';
import TJSBLogo from '../../Assets/Images/tjsb.jpg';
import './style.css';

const PoweredBy = () => {

    return (
        <Box component="div" className={'BBPBPPoweredBy'}>
            <Box component="div" className={'BBPBPPBTitle'}>
                Powered by
            </Box>
            <Box component="div" className={'BBPBPPBLogo'}>
                <img src={TJSBLogo} alt={'TJSB'} />
            </Box>
        </Box>
    );
};
export default PoweredBy;  