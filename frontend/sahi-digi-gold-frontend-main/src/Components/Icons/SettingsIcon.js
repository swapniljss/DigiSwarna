import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function SettingsIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <path d="M0,0H24V24H0Z" fill="none" />
            <path d="M10.325,4.317a1.724,1.724,0,0,1,3.35,0,1.724,1.724,0,0,0,2.573,1.066,1.725,1.725,0,0,1,2.37,2.37,1.724,1.724,0,0,0,1.065,2.572,1.724,1.724,0,0,1,0,3.35,1.724,1.724,0,0,0-1.066,2.573,1.725,1.725,0,0,1-2.37,2.37,1.724,1.724,0,0,0-2.572,1.065,1.724,1.724,0,0,1-3.35,0,1.724,1.724,0,0,0-2.573-1.066,1.725,1.725,0,0,1-2.37-2.37,1.724,1.724,0,0,0-1.065-2.572,1.724,1.724,0,0,1,0-3.35A1.724,1.724,0,0,0,5.383,7.752a1.725,1.725,0,0,1,2.37-2.37,1.723,1.723,0,0,0,2.572-1.065Z" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <circle cx="3" cy="3" r="3" transform="translate(9 9)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </SvgIcon>
    );
}