import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Confetti from '../../Components/Confetti';
import './style.css';

const Step3 = ({ tableDataErr, tableData, duplicateData, handleUploadJson, loading, apiResponse, backButtonTitle }) => {
    let navigate = useNavigate();
    const handleBackBiller = () => {
        navigate(-1);
    }
    return (
        <Box component="div" className={'BBPUCStep3'}>
            <Box component="div" className={'BBPUCSInner'}>
                <Box component="div" className={'BBPUCSHead'}>
                    <Box component="div" className={'BBPUCSHTitle'}>
                        Choose a file
                    </Box>
                    <Box component="div" className={'BBPUCSHDes'}>
                        Our system checks the values of each row and if any issues found you can easily edit it by clicking on the cell.
                    </Box>
                </Box>
                {Object.keys(apiResponse).length === 0 ?
                    <Box component="div" className={'BBPUCSBody'}>
                        {loading ?
                            <Box component="div" className={'BBPUCStep3L'}>
                                <Box component='div' className={'BBPUCS3Loader'} />
                                <Box component="div" className={'BBPUCS3LTitle'}>
                                    Importing JSON
                                </Box>
                            </Box>
                            :
                            <Fragment>
                                <Box component="div" className={'BBPUCSErrSuc'}>
                                    <Alert severity="error">{tableDataErr > 1 ? `${tableDataErr} rows contain errors.` : `${tableDataErr} row contain error.`}</Alert>
                                    <Alert severity="warning">{duplicateData > 1 ? `${duplicateData} rows contain duplicate.` : `${duplicateData} row contain duplicate.`}</Alert>
                                    <Alert severity="success"><Box component="strong">{tableData.length - tableDataErr - duplicateData}</Box> rows ready for import.</Alert>
                                </Box>
                                <Box component="div" className={'BBPUCSCBtn'}>
                                    <Button color="success" variant="outlined" onClick={handleUploadJson}>Confirm Import</Button>
                                </Box>
                            </Fragment>
                        }
                    </Box>
                    :
                    <Box component="div" className={'BBPUCSBody'}>
                        <Box component="div" className={'BBPUCSESIcon'}>
                            <CheckCircleIcon fontSize='inherit' color="success" />
                        </Box>
                        <Box component="div" className={'BBPUCSErrSuc'}>
                            {apiResponse.notFoundLine &&
                                <Alert severity="error"><Box component="strong">{apiResponse.notFound}</Box> {apiResponse.notFoundLine}.</Alert>}
                            <Alert severity="error"><Box component="strong">{apiResponse.duplicated}</Box> Duplicate Data</Alert>
                            <Alert severity="success"><Box component="strong">{apiResponse.inserted}</Box> Data Imported.</Alert>
                        </Box>
                        <Box component="div" className={'BBPUCSCBtn'}>
                            <Button variant="outlined" className={'BBPButton'} onClick={handleBackBiller}>{backButtonTitle ? backButtonTitle : 'Back to Billers'}</Button>
                        </Box>
                        {apiResponse.inserted > 0 && <Confetti />}
                    </Box>
                }
            </Box>
        </Box>
    );
};
export default Step3;
