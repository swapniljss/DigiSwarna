import React, { useState, Fragment } from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import BackupIcon from '@mui/icons-material/Backup';
import CloseIcon from '@mui/icons-material/Close';
import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';

import './style.css';

const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

const UploadCSVDialog = ({ open, onClose, jsonValidError, handleValidJson, handleUploadJson, fileProgress, setFileProgress }) => {

    const { CSVReader } = useCSVReader();
    const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => { onClose(); }}
        >
            <Box component="div" className={'BBPUploadCSVDialog'}>
                <Box component="div" className={'BBPUCDInner'}>
                    <Box component="div" className={'BBPUCDIHead'}>
                        <Box component="div" className={'BBPUCDIHTitle'}>
                            Bulk Upload
                        </Box>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box component="div" className={'BBPUCDIUOut'}>
                        <CSVReader
                            onUploadAccepted={(results) => {
                                handleValidJson(results);
                                setFileProgress(false);
                            }}
                            config={{
                                skipEmptyLines: true,
                            }}
                        >
                            {({
                                getRootProps,
                                acceptedFile,
                                ProgressBar,
                                getRemoveFileProps,
                                Remove,
                            }) => (
                                <Fragment>
                                    <Box component="div" {...getRootProps()} className={'BBPUCDIUpload'}>
                                        {acceptedFile ? (
                                            <Fragment>
                                                <Box component="div" className={'BBPUCDIFile'}>
                                                    <Box component="div" className={'BBPUCDIFInfo'}>
                                                        <Box component="div" className={'BBPUCDIFISize'}>
                                                            {formatFileSize(acceptedFile.size)}
                                                        </Box>
                                                        <Box component="div" className={'BBPUCDIFIName'}>{acceptedFile.name}</Box>
                                                    </Box>
                                                    <Box component="div" className={'BBPUCDIProgress'}>
                                                        <ProgressBar />
                                                    </Box>
                                                    <Box component="div" className={'BBPUCDIRemove'}
                                                        onClick={(event) => {
                                                            getRemoveFileProps().onClick(event);
                                                            setFileProgress(true);
                                                            handleValidJson({});
                                                        }}
                                                        onMouseOver={(event) => {
                                                            event.preventDefault();
                                                            setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                                                        }}
                                                        onMouseOut={(event) => {
                                                            event.preventDefault();
                                                            setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                                                        }}
                                                    >
                                                        <Remove color={removeHoverColor} />
                                                    </Box>
                                                </Box>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <Box component="div" className={'BBPUCDIUIcon'}>
                                                    <BackupIcon fontSize="inherit" />
                                                </Box>
                                                <Box component="div" className={'BBPUCDIUTitle'}>
                                                    Drag and drop or choose a file to upload your
                                                </Box>
                                            </Fragment>
                                        )}
                                    </Box>
                                </Fragment>
                            )}
                        </CSVReader>
                    </Box>
                    {jsonValidError.error ?
                        <Box component="div" className={'BBPUCDIValid'}>
                            {jsonValidError.msg}
                        </Box> : ''}
                    <Box component="div" className={'BBPUCDIBtn'}>
                        <Button variant="outlined" className={'BBPButton BBPOButton'} disabled={fileProgress} onClick={handleUploadJson}>Upload</Button>
                        <Button
                            variant="contained"
                            className={'BBPButton BBPBRed'}
                            onClick={() => {
                                onClose();
                                setFileProgress(true);
                                handleValidJson({});
                            }}
                        >Cancel</Button>
                    </Box>
                    <Box component="div" className={'BBPUCDIDes'}>
                        Drag and drop or choose a file to upload your <Link href='#' target='_blank'>File Link</Link>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};
export default UploadCSVDialog;
