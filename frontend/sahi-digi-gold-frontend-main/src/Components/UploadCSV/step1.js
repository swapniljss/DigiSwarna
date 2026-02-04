import React, { useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import BackupIcon from '@mui/icons-material/Backup';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';
import Link from '@mui/material/Link';
import './style.css';

const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

const Step1 = ({ CSVFile, jsonHeaderError, uploadFile, handleValidJson, setFileProgress, setUploadFile }) => {

    const { CSVReader } = useCSVReader();
    const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);

    return (
        <Box component="div" className={'BBPUCStep1'}>
            <Box component="div" className={'BBPUCSInner'}>
                <Box component="div" className={'BBPUCSHead'}>
                    <Box component="div" className={'BBPUCSHTitle'}>
                        Choose a file
                    </Box>
                    <Box component="div" className={'BBPUCSHDes'}>
                        Our system checks the values of each row and if any issues found you can easily edit it by clicking on the cell.
                    </Box>
                </Box>
                <Box component="div" className={'BBPUCSBody'}>
                    <CSVReader
                        onUploadAccepted={(results, event) => {
                            handleValidJson(results);
                            setUploadFile(event);
                            setFileProgress(false);
                        }}
                        config={{
                            skipEmptyLines: true,
                        }}
                    >
                        {({
                            getRootProps,
                            getRemoveFileProps,
                            Remove,
                        }) => (
                            <Fragment>
                                <Box component="div" {...getRootProps()} className={`BBPUCDIUpload ${jsonHeaderError.success ? 'BBPUCDIUSuc' : ''} ${jsonHeaderError.err ? 'BBPUCDIUError' : ''}`}>
                                    {uploadFile ? (
                                        <Fragment>
                                            <Box component="div" className={'BBPUCDIFile'}>
                                                <Box component="div" className={'BBPUCDIFInfo'}>
                                                    <Box component="div" className={'BBPUCDIFIName'}>{uploadFile.name}</Box>
                                                    <Box component="div" className={'BBPUCDIFISize'}>
                                                        ({formatFileSize(uploadFile.size)})
                                                    </Box>
                                                </Box>
                                                <Box component="div" className={'BBPUCDIRemove'}
                                                    onClick={(event) => {
                                                        getRemoveFileProps().onClick(event);
                                                        setFileProgress(true);
                                                        handleValidJson({});
                                                        setUploadFile();
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
                <Box component="div" className={'BBPUCSLink'}>
                    <Link href={CSVFile} download>download demo csv</Link>
                </Box>
            </Box>
            {jsonHeaderError.err ?
                <Box component="div" className={'BBPUCSError'}>
                    <Box component="div" className={'BBPUCSEIcon'}>
                        <WarningTwoToneIcon fontSize="inherit" />
                    </Box>
                    <Box component="div" className={'BBPUCSEInfo'}>
                        <Box component="div" className={'BBPUCSEITitle'}>
                            Please check your column header. The first row must contain title.
                        </Box>
                        <Box component="div" className={'BBPUCSEIColums'}>
                            {jsonHeaderError.arr.map((item, index) => `${index > 0 ? ',' : ''} ${item}`)} can same or not be blank.
                        </Box>
                    </Box>
                </Box>
                : ''}
        </Box>
    );
};
export default Step1;
