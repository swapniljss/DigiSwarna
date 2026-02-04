import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function OnBoardingIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <g transform="translate(605 469)">
                <g transform="translate(-605 -469)">
                    <path d="M0,0H24V24H0Z" fill="none" />
                    <circle cx="4" cy="4" r="4" transform="translate(5 3)" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M3,21V19a4,4,0,0,1,4-4h4a4,4,0,0,1,4,4v2" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M16,3.13a4,4,0,0,1,0,7.75" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M21,21V19a4,4,0,0,0-3-3.85" fill="none" stroke="#7e84a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </g>
            </g>
        </SvgIcon>
    );
}