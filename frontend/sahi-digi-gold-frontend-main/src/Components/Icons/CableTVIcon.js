import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function CableTVIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 64 64" fontSize="inherit">
            <g fill="rgb(23, 87, 131)">
                <path d="m59 9h-54c-.553 0-1 .448-1 1v38c0 .552.447 1 1 1h23v4h-10c-1.324 0-1.323 2 0 2h28c1.324 0 1.323-2 0-2h-10v-4h23c.553 0 1-.448 1-1v-38c0-.552-.447-1-1-1zm-25 44h-4v-4h4zm24-6h-52v-36h52z" />
                <path d="m9 45.008h46c.553 0 1-.448 1-1v-30.016c0-.552-.447-1-1-1h-46c-.553 0-1 .448-1 1v30.016c0 .552.447 1 1 1zm1-30.016h44v28.016h-44z" />
            </g>
        </SvgIcon>
    );
}