import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import { useAxiosPrivate } from '../../../Hooks/useAxiosPrivate';
import SomethingWentWrong from '../../../Components/SomethingWentWrong';
import { MENU_SLUG } from '../../../Constants/constants';


const ViewModel = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    let { transaction_id } = useParams();
    const [errorDialog, setErrorDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactionInfo, setTransactionInfo] = useState({});

    const handleCloseModal = () => {
        navigate(`/${MENU_SLUG.reports}/sell`, { replace: true });
    };

    const fetchValue = useCallback(async () => {
        try {
            let url = `sell/${transaction_id}`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setTransactionInfo(response.data.data);
                } else {
                    console.error('err.res', response)
                }
                setLoading(false);
            }).catch(err => {
                if (err.response) {
                    setLoading(false);
                    setErrorDialog(true);
                    console.error('err.res', err.response.data);
                }
            });
        } catch (error) {
            setLoading(false);
            setErrorDialog(true);
            console.error('error', error);
        }
        // eslint-disable-next-line  
    }, [transaction_id]);

    useEffect(() => {
        fetchValue();
        // eslint-disable-next-line 
    }, [])

    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={true}
                onClose={handleCloseModal}
            >
                <Box component="div" className={'BBPRViewModel'}>
                    <Box component="div" className={'BBPRVMHead'}>
                        <Box component="div" className={'BBPRVMHTitle'}>
                            Sell Details
                        </Box>
                        <IconButton onClick={handleCloseModal}>
                            <ClearIcon />
                        </IconButton>
                    </Box>
                    <Box component="div" className={'BBPRVMInfo'}>
                        <Box component="div" className={'BBPRVMIRow'}>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Date
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.createdAt ? format(new Date(transactionInfo.createdAt), "dd-MM-yyyy HH:mm:ss") : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Mobile Number
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.mobileNumber ? transactionInfo.mobileNumber : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    User Name
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.userName ? transactionInfo.userName : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Quantity
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.quantity ? transactionInfo.quantity : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Total Amount
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.totalAmount ? transactionInfo.totalAmount : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Metal Type
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.metalType ? transactionInfo.metalType : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Unique ID
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.uniqueId ? transactionInfo.uniqueId : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Transaction Id
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.transactionId ? transactionInfo.transactionId : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Merchant Transaction ID
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.merchantTransactionId ? transactionInfo.merchantTransactionId : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Account Name
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.bankInfo && transactionInfo.bankInfo.accountName ? transactionInfo.bankInfo.accountName : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Account Number
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.bankInfo && transactionInfo.bankInfo.accountNumber ? transactionInfo.bankInfo.accountNumber : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    IFSC Code
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.bankInfo && transactionInfo.bankInfo.ifscCode ? transactionInfo.bankInfo.ifscCode : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPVUMDBtn'}>
                        <Button variant="contained" onClick={handleCloseModal} className={'BBPButton'}>Close</Button>
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    );
};
export default ViewModel;
