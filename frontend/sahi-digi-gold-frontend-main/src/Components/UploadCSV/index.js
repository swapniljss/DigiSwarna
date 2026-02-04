import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

import './style.css';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UploadCSVDialog = ({ CSVFile, uploadFile, setUploadFile, jsonHeader, jsonHeaderError, tableDataErr, tableHeader, tableData, handleValidJson, fileProgress, setFileProgress, nextButton, setNextButton, handleUploadJson, loading, duplicateData, apiResponse, backButtonTitle }) => {

    const navigate = useNavigate();

    const steps = ["Upload File", "File Validation", "Upload"];

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        if (activeStep === 1) {
            if (tableDataErr === tableData.length) {
                setNextButton(true);
            }
        }
    }, [activeStep]);

    const handleView = (step) => {
        switch (step) {
            case 0:
                return <Step1
                    jsonHeader={jsonHeader}
                    handleValidJson={handleValidJson}
                    fileProgress={fileProgress}
                    setFileProgress={setFileProgress}
                    jsonHeaderError={jsonHeaderError}
                    uploadFile={uploadFile}
                    setUploadFile={setUploadFile}
                    CSVFile={CSVFile}
                />
            case 1:
                return <Step2
                    tableDataErr={tableDataErr}
                    tableHeader={tableHeader}
                    tableData={tableData}
                    duplicateData={duplicateData}
                />
            case 2:
                return <Step3
                    tableDataErr={tableDataErr}
                    tableData={tableData}
                    duplicateData={duplicateData}
                    loading={loading}
                    apiResponse={apiResponse}
                    handleUploadJson={handleUploadJson}
                    backButtonTitle={backButtonTitle}
                />
            default:
                break;
        }
    };

    const handleUploadDialogClose = () => {
        navigate(-1);
    }

    return (
        <Dialog
            fullScreen
            TransitionComponent={Transition}
            open={true}
            onClose={handleUploadDialogClose}
        >
            <Box component="div" className={'BBPUploadCSVDialog'}>
                <Box component="div" className={'BBPUCDInner'}>
                    <Box component="div" className={'BBPUCDIHead'}>
                        <Box component="div" className={'BBPUCDIHTitle'}>
                            Bulk Upload
                        </Box>
                        <IconButton onClick={handleUploadDialogClose} disabled={loading}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                    <Box component="div" className={'BBPUCDIUOut'}>
                        <Box component="div" className={'BBPUCDIUOInner'}>
                            <Stepper activeStep={activeStep} className={'BBPUCStepper'}>
                                {steps.map((label, index) => (
                                    <Step key={index} className={activeStep === index ? 'BBPUCSActive' : ''}>
                                        <StepLabel
                                            classes={{
                                                active: activeStep === index ? 'BBPUCSLAc' : '',
                                                completed: 'BBPUCSLComp',
                                            }}
                                        >{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Box component="div" className={'BBPUCView'}>
                                {handleView(activeStep)}
                            </Box>
                        </Box>
                    </Box>
                    {!loading && Object.keys(apiResponse).length === 0 &&
                        <Box component="div" className={'BBPUCDIBtn'}>
                            <Box component="div" className={'BBPUCDIBInner'}>
                                <Button className={'BBPButton'}
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                {activeStep !== steps.length - 1 ?
                                    <Button className={'BBPButton'} onClick={handleNext} disabled={nextButton} >
                                        Next
                                    </Button>
                                    : ''}
                            </Box>
                        </Box>}
                </Box>
            </Box>
        </Dialog>
    );
};
export default UploadCSVDialog;
