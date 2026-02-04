import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function HomeIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <path d="M0,0H24V24H0Z" fill="none" />
            <path d="M5,12H3l9-9,9,9H19" fill="none" stroke="#92929d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M5,12v7a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V12" fill="none" stroke="#92929d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M9,21V15a2,2,0,0,1,2-2h2a2,2,0,0,1,2,2v6" fill="none" stroke="#92929d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </SvgIcon>
    );
}