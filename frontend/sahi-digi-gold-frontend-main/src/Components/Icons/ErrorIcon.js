import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function ErrorIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
            <path d="m16 1c-8.28 0-15 6.72-15 15s6.72 15 15 15 15-6.72 15-15-6.72-15-15-15zm0 24c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2.29-15.51-.67 8.02c-.07.84-.77 1.49-1.62 1.49s-1.55-.65-1.62-1.49l-.67-8.02c-.11-1.34.94-2.49 2.29-2.49 1.28 0 2.3 1.04 2.3 2.3 0 .06 0 .13-.01.19z" />
        </SvgIcon>
    );
}