import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAxiosPrivate } from '../../Hooks/useAxiosPrivate';
import CheckCircleOutlineIcon from '../Icons/CheckCircleOutlineIcon';
import BAssuredImg from '../../Assets/Images/bassured.png';
import SomethingWentWrong from '../../Components/SomethingWentWrong';
import PoweredBy from '../../Components/PoweredBy';
import './style.css';

export default function PaymentReceipt({ open, onClose, handleCompliant, handleCancel, transactionId }) {

    const matches = useMediaQuery('(max-width:767px)');

    const axiosPrivate = useAxiosPrivate();

    const [errorDialog, setErrorDialog] = useState(false);
    const [billDetails, setBillDetails] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReceiptDetails = useCallback(async (id) => {
        try {
            setLoading(true);
            let url = `transactions/getreceipt/${id}`;
            let options = {
                method: 'GET',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setBillDetails(response.data.data);
                } else {
                    setErrorDialog(true);
                    console.error('err.res', response.data)
                }
                setLoading(false);
            }).catch(err => {
                if (err.response) {
                    setErrorDialog(true);
                    setLoading(false);
                    console.error('err.res', err.response.data)
                }
            });
        } catch (error) {
            setErrorDialog(true);
            setLoading(false);
            console.error('error', error);
        }
    }, []);

    useEffect(() => {
        if (open) {
            handleReceiptDetails(transactionId);
        }
    }, [open]);
    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <Dialog
                fullWidth={true}
                fullScreen={matches ? true : false}
                maxWidth={'sm'}
                open={open}
                classes={{
                    root: 'BBPPSDialogRoot',
                    paper: 'BBPPSDialog'
                }}
                onClose={onClose}
            >
                <Box component="div" className={'BBPPaymentSuccessful'}>
                    <Box component="div" className={'BBPPSHead'}>
                        <Box component="div" className={'BBPPSHSuccess'}>
                            <Box component="div" className={'BBPPSHSIcon'}>
                                <CheckCircleOutlineIcon />
                            </Box>
                            <Box component="div" className={'BBPPSHSTitle'}>
                                Your Bill Payment is successful
                            </Box>
                        </Box>
                        <Box component="div" className={'BBPPSHSLogo'}>
                            <img src={BAssuredImg} alt={'Payment Successful'} />
                        </Box>
                    </Box>
                    {loading ?
                        <Box component="div" className={'BBPPSOrderDetail'}>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Biller Name</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Bill Category</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Bill Period</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Bill Payment Date</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Due Date</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Bill Amount</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Bill Number</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Conv. Fee</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Biller ID</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Payment Channel</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Payment Mode</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Customer Name</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSODCol'}>
                                <Box component="div" className={'BBPPSODCTitle'}>Customer Mobile Number</Box>
                                <Box component="div" className={'BBPPSODCSTitle'}>
                                    <Skeleton component="div" variant="rounded" height={18} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSBPrms'}>
                                <Box component="div" className={'BBPPSBPItem'}>
                                    <Box component="div" className={'BBPPSBPITitle'}>
                                        <Skeleton component="div" variant="rounded" height={18} />
                                    </Box>
                                    <Box component="div" className={'BBPPSBPISTitle'}>
                                        <Skeleton component="div" variant="rounded" height={18} />
                                    </Box>
                                </Box>
                                <Box component="div" className={'BBPPSBPItem'}>
                                    <Box component="div" className={'BBPPSBPITitle'}>
                                        <Skeleton component="div" variant="rounded" height={18} />
                                    </Box>
                                    <Box component="div" className={'BBPPSBPISTitle'}>
                                        <Skeleton component="div" variant="rounded" height={18} />
                                    </Box>
                                </Box>
                                <Box component="div" className={'BBPPSBPItem'}>
                                    <Box component="div" className={'BBPPSBPITitle'}>
                                        <Skeleton component="div" variant="rounded" height={18} />
                                    </Box>
                                    <Box component="div" className={'BBPPSBPISTitle'}>
                                        <Skeleton component="div" variant="rounded" height={18} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        :
                        <Fragment>
                            <Box component="div" className={'BBPPSOrderDetail'}>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Biller Name</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.biller}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Bill Category</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{`${billDetails.main_cat} - ${billDetails.sub_cat}`}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Bill Period</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.billPeriod ? billDetails.billPeriod : '-'}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Bill Date</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.billDate}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Due Date</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.billDueDate}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Bill Payment Date</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.createdAt && format(new Date(billDetails.createdAt), "dd-MM-yyyy HH:mm:ss")}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Bill Amount</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{Number(parseInt(billDetails.totalBillAmount)).toFixed(2)}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Bill Number</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.billnumber !== '' ? billDetails.billnumber : '-'}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Conv. Fee</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.convFee && Number(parseInt(billDetails.convFee)).toFixed(2) ? Number(parseInt(billDetails.convFee)).toFixed(2) : '0.00'}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Biller ID</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.billerId ? billDetails.billerId : '-'}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Payment Channel</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.paymentChannel ? billDetails.paymentChannel : '-'}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Payment Mode</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.paymentMode}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Customer Name</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.customerName ? billDetails.customerName : '-'}</Box>
                                </Box>
                                <Box component="div" className={'BBPPSODCol'}>
                                    <Box component="div" className={'BBPPSODCTitle'}>Customer Mobile Number</Box>
                                    <Box component="div" className={'BBPPSODCSTitle'}>{billDetails.customerMobnum !== '' ? billDetails.customerMobnum : '-'}</Box>
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSBPrms'}>
                                {billDetails.customerParams && billDetails.customerParams.map((item, index) =>
                                    <Box component="div" key={index} className={'BBPPSBPItem'}>
                                        <Box component="div" className={'BBPPSBPITitle'}>
                                            {item.Name}
                                        </Box>
                                        <Box component="div" className={'BBPPSBPISTitle'}>
                                            {item.Value}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Fragment>
                    }
                    {loading ?
                        <Box component="div" className={'BBPPSOAmt'}>
                            <Box component="div" className={'BBPPSOATitle'}>
                                <Skeleton component="div" variant="rounded" height={25} />
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>Transaction Ref ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>
                                    <Skeleton component="div" variant="rounded" height={25} width={300} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>Pay Ref ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>
                                    <Skeleton component="div" variant="rounded" height={25} width={300} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>Transaction ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>
                                    <Skeleton component="div" variant="rounded" height={25} width={300} />
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>UPI Ref ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>
                                    <Skeleton component="div" variant="rounded" height={25} width={300} />
                                </Box>
                            </Box>
                        </Box>
                        :
                        <Box component="div" className={'BBPPSOAmt'}>
                            <Box component="div" className={'BBPPSOATitle'}>
                                Payment Details:
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>Transaction Ref ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>{billDetails.transRefID}</Box>
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>Transaction ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>{billDetails.transID ? billDetails.transID : '-'}</Box>
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>Pay Ref ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>{billDetails.payRefId ? billDetails.payRefId : '-'}</Box>
                            </Box>
                            <Box component="div" className={'BBPPSOARow'}>
                                <Box component="div" className={'BBPPSOARTitle'}>UPI Ref ID</Box>
                                <Box component="div" className={'BBPPSOARAmt'}>{billDetails.upiRefId}</Box>
                            </Box>
                        </Box>
                    }
                    <PoweredBy />
                    <Box component="div" className={'BBPPSOPBtn'}>
                        {handleCancel &&
                            <Button
                                variant="contained"
                                className={'BBPButton'}
                                disabled={loading}
                                onClick={handleCancel}
                            >Close</Button>
                        }
                        {handleCompliant &&
                            <Button
                                variant="contained"
                                className={'BBPButton'}
                                disabled={loading}
                                onClick={() => { handleCompliant(transactionId) }}
                            >Raise Dispute</Button>
                        }
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    );
}
