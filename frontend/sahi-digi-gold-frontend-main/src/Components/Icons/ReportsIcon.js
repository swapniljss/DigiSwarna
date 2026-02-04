import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function ReportsIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <path d="M0,0H24V24H0Z" fill="none" />
            <path d="M14,3V7a1,1,0,0,0,1,1h4" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M17,21H7a2,2,0,0,1-2-2V5A2,2,0,0,1,7,3h7l5,5V19A2,2,0,0,1,17,21Z" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <line x2="1" transform="translate(9 7)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <line x2="6" transform="translate(9 13)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <line x2="2" transform="translate(13 17)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </SvgIcon>
    );
}