import React from 'react';
import Box from '@mui/material/Box';
import NoDataImg from '../../Assets/Images/no-data.png';
import './style.css';


const NoData = ({ image, type, title, description }) => {
    return (
        <Box component="div" className={'BBPNoData ' + type}>
            <Box component="div" className={'BBPNDInner'}>
                <Box component="div" className={'BBPNDIImg'}>
                    {image ? <img src={image} alt={''} /> : <img src={NoDataImg} alt={''} />}
                </Box>
                {title && <Box component="div" className={'BBPNDITitle'}>{title}</Box>}
                {description && <Box component="div" className={'BBPNDIDes'}>{description}</Box>}
            </Box>
        </Box>
    );
};

export default NoData;