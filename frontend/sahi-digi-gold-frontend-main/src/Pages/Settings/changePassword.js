import React, { useState, useCallback, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from '../../Hooks/useAxiosPrivate';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Backdrops from '../../Components/Backdrops';
import PageChangeDialog from '../../Components/PageChangeDialog';
import SuccessDialog from '../../Components/SuccessDialog';
import SomethingWentWrong from '../../Components/SomethingWentWrong';
import './style.css';

const ChangePassword = () => {

    const schema = {
        "type": "object",
        "required": ["password", "confirm_password"],
        "properties": {
            "password": {
                "title": "Password",
                "type": "string"
            },
            "confirm_password": {
                "title": "Confirm Password",
                "type": "string"
            }
        }
    };

    const uiSchema = {
        "ui:submitButtonOptions": {
            "props": {
                "className": "BBPFBtn"
            }
        },
        "password": {
            "ui:widget": "password",
            "ui:placeholder": "Enter Password"
        },
        "confirm_password": {
            "ui:widget": "password",
            "ui:placeholder": "Enter Confirm Password"
        }
    };

    function customValidate(formData, errors) {
        if (formData.password !== formData.confirm_password) {
            errors.confirm_password.addError("Passwords don't match");
        }
        return errors;
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [errorDialog, setErrorDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [onSubmitLoading, setOnSubmitLoading] = useState(false);
    const [changePage, setChangePage] = useState(false);
    const [submitDialog, setSubmitDialog] = useState(false);

    let yourForm;

    const onSubmitNew = () => {
        yourForm.formElement.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    };

    const onFormSubmit = (formData) => {
        setFormData(formData);
        handleChangePassword(formData);
    };

    const handleSubmitDialogClose = () => {
        navigate(-1);
        setSubmitDialog(false);
    };

    const handleChangePassword = useCallback(async (data) => {
        try {
            setOnSubmitLoading(true);
            let url = `settings/changepass`;
            let options = {
                method: 'PUT',
                data,
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setSubmitDialog(true);
                } else {
                    console.error('err.res', response)
                }
                setOnSubmitLoading(false);
            }).catch(err => {
                if (err.response) {
                    setOnSubmitLoading(false);
                    setErrorDialog(true);
                    console.error('err.res', err.response.data);
                }
            });
        } catch (error) {
            setOnSubmitLoading(false);
            setErrorDialog(true);
            console.error('error', error)
        }
        // eslint-disable-next-line 
    }, []);

    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <PageChangeDialog showDialog={changePage} setShowDialog={setChangePage} />
            <Backdrops
                open={onSubmitLoading}
                title={'Updating'}
            />
            <SuccessDialog
                open={submitDialog}
                onClose={handleSubmitDialogClose}
                title={'Updated Successfully'}
                message={'Updated Successfully'}
                buttonTitle={'Close'}
            />
            <Box component="div" className={'BBPSPTView'}>
                <Box component="div" className={'BBPSPTVForm'}>
                    <Box component='div' className={'BBPForm'}>
                        <Form
                            schema={schema}
                            uiSchema={uiSchema}
                            formData={formData}
                            validator={validator}
                            customValidate={customValidate}
                            showErrorList={false}
                            omitExtraData={true}
                            onSubmit={({ formData }) => {
                                onFormSubmit(formData);
                            }}
                            ref={(form) => { yourForm = form; }}
                        />
                    </Box>
                </Box>
                <Box component="div" className={'BBPSPTVBtn'}>
                    <Button variant="contained" className={'BBPButton'} onClick={onSubmitNew}>Submit</Button>
                </Box>
            </Box>
        </Fragment>
    );
};
export default ChangePassword;
