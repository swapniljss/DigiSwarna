import React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import './style.css';

const Backdrops = ({ open, title }) => {

    return (
        <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
            <Box component='div' className={'BBPBackdrops'}>
                <Box component='div' className={'BBPBLoader'} />
                <Box component='div' className={'BBPBTitle'}>
                    <Box component='span'>{title}</Box>
                </Box>
            </Box>
        </Backdrop>
    );
}
export default Backdrops;