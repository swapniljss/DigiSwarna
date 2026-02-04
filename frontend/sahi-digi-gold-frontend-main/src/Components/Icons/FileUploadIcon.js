import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function FileUploadIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
            <path d="M20.71,14.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L17,13.41V21a1,1,0,0,1-2,0V13.41l-2.29,2.3a1,1,0,0,1-1.42-1.42l4-4a1,1,0,0,1,1.42,0ZM27,9.72V27a3,3,0,0,1-3,3H8a3,3,0,0,1-3-3V5A3,3,0,0,1,8,2H20.06a3,3,0,0,1,2.31,1.08L26.3,7.8A3,3,0,0,1,27,9.72ZM21,7a1,1,0,0,0,1,1h1.86L21,4.56Zm4,3H22a3,3,0,0,1-3-3V4H8A1,1,0,0,0,7,5V27a1,1,0,0,0,1,1H24a1,1,0,0,0,1-1Z" />
        </SvgIcon>
    );
}