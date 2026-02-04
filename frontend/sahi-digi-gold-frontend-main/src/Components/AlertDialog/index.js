import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CheckCircleOutlineIcon from '../Icons/CheckCircleOutlineIcon';
import './style.css';

const AlertDialog = ({ open, onClose, title, message, buttons, buttonTitle }) => {

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'xs'}
            open={open}
            onClose={onClose}
        >
            <Box component="div" className={'BBPAlertDialog'}>
                <Box component="div" className={'BBPADHead'}>
                    <Box component="div" className={'BBPSDAIcon'}>
                        <CheckCircleOutlineIcon />
                    </Box>
                    <Box component="div" className={'BBPSDATitle'}>
                        {title}
                    </Box>
                </Box>
                <Box component="div" className={'BBPSDASTitle'}>
                    {message}
                </Box>
                <Box component="div" className={'BBPADBtn'}>
                    {buttons ? buttons :
                        <Button variant="contained" className={'BBPButton'} onClick={onClose}>{buttonTitle}</Button>
                    }
                </Box>
            </Box>
        </Dialog>
    );
};
export default AlertDialog;
