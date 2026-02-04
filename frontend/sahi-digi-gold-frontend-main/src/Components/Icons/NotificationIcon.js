import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function NotificationIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <path d="M0,0H24V24H0Z" fill="none" />
            <path d="M10,5a2,2,0,1,1,4,0,7,7,0,0,1,4,6v3a4,4,0,0,0,2,3H4a4,4,0,0,0,2-3V11a7,7,0,0,1,4-6" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M9,17v1a3,3,0,0,0,6,0V17" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </SvgIcon>
    );
}