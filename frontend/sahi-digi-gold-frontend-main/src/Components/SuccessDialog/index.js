import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CheckCircleOutlineIcon from '../Icons/CheckCircleOutlineIcon';
import './style.css';

const SuccessDialog = ({ open, onClose, title, message, buttons, buttonTitle }) => {

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={onClose}
        >
            <Box component="div" className={'BBPSuccessDialog'}>
                <Box component="div" className={'BBPSDHead'}>
                    <Box component="div" className={'BBPSDHIcon'}>
                        <CheckCircleOutlineIcon />
                    </Box>
                    <Box component="div" className={'BBPSDHTitle'}>
                        {title}
                    </Box>
                </Box>
                <Box component="div" className={'BBPSDHSTitle'}>
                    {message}
                </Box>
                <Box component="div" className={'BBPSDBtn'}>
                    {buttons ? buttons :
                        <Button variant="contained" onClick={onClose}>{buttonTitle}</Button>
                    }
                </Box>
            </Box>
        </Dialog>
    );
};
export default SuccessDialog;
