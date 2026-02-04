import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function HelpCenterIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <path d="M0,0H24V24H0Z" fill="none" />
            <circle cx="9" cy="9" r="9" transform="translate(3 3)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <line y2="0.01" transform="translate(12 17)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M12,13.5A1.5,1.5,0,0,1,13,12a2.6,2.6,0,1,0-3-4" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </SvgIcon>
    );
}