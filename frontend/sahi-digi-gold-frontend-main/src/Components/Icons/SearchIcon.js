import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function SearchIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
            <rect width="24" height="24" fill="none" />
            <path d="M16,17a1,1,0,0,1-.613-.21l-.095-.084-3.245-3.243A7.432,7.432,0,0,1,7.5,15,7.5,7.5,0,1,1,15,7.5a7.431,7.431,0,0,1-1.536,4.549l3.243,3.244A1,1,0,0,1,16,17ZM7.5,2a5.5,5.5,0,1,0,3.546,9.7,1,1,0,0,1,.659-.66A5.5,5.5,0,0,0,7.5,2Z" transform="translate(3 3)" fill="#7e84a3" />
        </SvgIcon>
    );
}