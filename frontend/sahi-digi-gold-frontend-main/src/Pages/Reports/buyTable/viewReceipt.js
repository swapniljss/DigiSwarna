import React, { useState, useCallback, useRef, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import { useAxiosPrivate } from '../../../Hooks/useAxiosPrivate';
import SomethingWentWrong from '../../../Components/SomethingWentWrong';
import LogoImg from '../../../Assets/Images/clogo.svg';
import { MENU_SLUG } from '../../../Constants/constants';

const ViewReceipt = () => {
    let componentRef = useRef();

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    let { transaction_id } = useParams();
    const [errorDialog, setErrorDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactionInfo, setTransactionInfo] = useState({});

    const handleCloseModal = () => {
        navigate(`/${MENU_SLUG.reports}`, { replace: true });
    };

    const fetchValue = useCallback(async () => {
        try {
            let url = `buy/invoice/${transaction_id}`;
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
                maxWidth={'md'}
                open={true}
                onClose={handleCloseModal}
            >
                <Box component="div" className={'BBPBViewReceipt'} ref={(el) => (componentRef = el)}>
                    <Box component="div" className={'BBPBVRHead'}>
                        <Box component="div" className={'BBPBVRHLogo'}>
                            <img src={LogoImg} alt={''} />
                        </Box>
                        <Box component="div" className={'BBPBVRHText'}>
                            Original for recipient
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPBVRRow'}>
                        <Box component="div" className={'BBPBVRRCol'}>
                            <Box component="div" className={'BBPBVRGTitle'}>
                                Sold by:
                            </Box>
                            <Box component="div" className={'BBPBVRTitle'}>
                                Augmont Goldtech Private Limited
                            </Box>
                            <Box component="div" className={'BBPBVROp'}>
                                (Formerly known as Augmont Precious Metals Private Limited)
                            </Box>
                            <Box component="div" className={'BBPBVROT'}>
                                <Box component="span">
                                    Address:
                                </Box>
                                504, 5th Floor, Trade Link, E Wing. Kamala Mills Compound, Lower Parel, Mumbai, Maharashtra 400013
                            </Box>
                            <Box component="div" className={'BBPBVRSpace'} />
                            <Box component="div" className={'BBPBVRGTitle'}>
                                GSTIN:
                            </Box>
                            <Box component="div" className={'BBPBVRTitle'}>
                                Augmont Goldtech Private Limited
                            </Box>
                            <Box component="div" className={'BBPBVROp'}>
                                27AATCA3030A1Z3
                            </Box>
                            <Box component="div" className={'BBPBVRSpace'} />
                            <Box component="div" className={'BBPBVRGTitle'}>
                                Customer Address:
                            </Box>
                            <Box component="div" className={'BBPBVRTitle'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                    <Fragment>
                                        {transactionInfo.userInfo && transactionInfo.userInfo.name ? transactionInfo.userInfo.name : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVROp'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                    <Fragment>
                                        {transactionInfo.userInfo ? `${transactionInfo.userInfo.address ? transactionInfo.userInfo.address : ''} ${transactionInfo.userInfo.city} ${transactionInfo.userInfo.state} ${transactionInfo.userInfo.pincode} ` : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVROp'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                    <Fragment>
                                        {transactionInfo.userInfo && transactionInfo.userInfo.mobileNumber ? transactionInfo.userInfo.mobileNumber : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRMail'}>
                                {loading ? <Skeleton component="div" variant="rounded" width={"100%"} height={21} /> :
                                    <Fragment>
                                        {transactionInfo.userInfo && transactionInfo.userInfo.email ? <Link href={`mailto:${transactionInfo.userInfo.email}`}>{transactionInfo.userInfo.email}</Link> : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRSpace'} />
                            <Box component="div" className={'BBPBVRGTitle'}>
                                Augmont Unique ID:
                            </Box>
                            <Box component="div" className={'BBPBVROp'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                    <Fragment>
                                        {transactionInfo.userInfo && transactionInfo.userInfo.uniqueId ? transactionInfo.userInfo.uniqueId : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRSpace'} />
                            <Box component="div" className={'BBPBVRGTitle'}>
                                Payment Mode: <Box component="span">UPI</Box>
                            </Box>
                        </Box>
                        <Box component="div" className={'BBPBVRRCol BBPBVRRCRight'}>
                            <Box component="div" className={'BBPBVMTitle'}>
                                TAX INVOICE
                            </Box>
                            <Box component="div" className={'BBPBVRGTitle'}>

                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        Invoice No: <Box component="span">{transactionInfo.invoiceNumber ? transactionInfo.invoiceNumber : '---'}</Box>
                                    </Fragment>}

                            </Box>
                            <Box component="div" className={'BBPBVRGTitle'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                    <Fragment>
                                        Date: <Box component="span">{transactionInfo && transactionInfo.invoiceDate ? transactionInfo.invoiceDate : '---'}</Box>
                                    </Fragment>}
                            </Box>
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPBVRTable'}>
                        <Box component="div" className={'BBPBVRTHead'}>
                            <Box component="div" className={'BBPBVRTCol'}>Description</Box>
                            <Box component="div" className={'BBPBVRTCol'}>HSN Code</Box>
                            <Box component="div" className={'BBPBVRTCol'}>Gram</Box>
                            <Box component="div" className={'BBPBVRTCol'}>Rate/gm (INR)</Box>
                            <Box component="div" className={'BBPBVRTCol'}>Amount (INR)</Box>
                        </Box>
                        <Box component="div" className={'BBPBVRTHI'}>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.metalType ? `${transactionInfo.metalType} ${transactionInfo.karat} ${transactionInfo.purity / 10}%` : '---'}
                                    </Fragment>}</Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.hsnCode ? transactionInfo.hsnCode : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.quantity ? transactionInfo.quantity : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.unitType ? `${transactionInfo.rate} (INR/${transactionInfo.unitType})` : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.grossAmount ? transactionInfo.grossAmount : '---'}
                                    </Fragment>}
                            </Box>
                        </Box>
                        <Box component="div" className={'BBPBVRTHI'}>
                            <Box component="div" className={'BBPBVRTCol BBPBVRTCH'}>Net Total</Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> : ''}
                            </Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.quantity ? transactionInfo.quantity : '---'}
                                    </Fragment>}
                            </Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> : ''}
                            </Box>
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.grossAmount ? transactionInfo.grossAmount : '---'}
                                    </Fragment>}
                            </Box>
                        </Box>
                        {loading ?
                            <Box component="div" className={'BBPBVRTHI'}>
                                <Box component="div" className={'BBPBVRTCol BBPBVRTCH'}>
                                    <Skeleton component="div" variant="rounded" height={23} />
                                </Box>
                                <Box component="div" className={'BBPBVRTCol'}>
                                    <Skeleton component="div" variant="rounded" height={23} />
                                </Box>
                                <Box component="div" className={'BBPBVRTCol'}>
                                    <Skeleton component="div" variant="rounded" height={23} />
                                </Box>
                                <Box component="div" className={'BBPBVRTCol'}>
                                    <Skeleton component="div" variant="rounded" height={23} />
                                </Box>
                                <Box component="div" className={'BBPBVRTCol'}>
                                    <Skeleton component="div" variant="rounded" height={23} />
                                </Box>
                            </Box>
                            :
                            transactionInfo.taxes && transactionInfo.taxes.taxSplit.map((tax, i) =>
                                <Box component="div" className={'BBPBVRTHI'} key={i}>
                                    <Box component="div" className={'BBPBVRTCol BBPBVRTCH'}>{tax.type}</Box>
                                    <Box component="div" className={'BBPBVRTCol'} />
                                    <Box component="div" className={'BBPBVRTCol'} />
                                    <Box component="div" className={'BBPBVRTCol'}>{tax.taxPerc}%</Box>
                                    <Box component="div" className={'BBPBVRTCol'}>{tax.taxAmount}</Box>
                                </Box>
                            )
                        }
                        <Box component="div" className={'BBPBVRTFoot'}>
                            <Box component="div" className={'BBPBVRTCol BBPBVRTCH'}>Total</Box>
                            <Box component="div" className={'BBPBVRTCol'} />
                            <Box component="div" className={'BBPBVRTCol'} />
                            <Box component="div" className={'BBPBVRTCol'} />
                            <Box component="div" className={'BBPBVRTCol'}>
                                {loading ? <Skeleton component="div" variant="rounded" height={23} /> :
                                    <Fragment>
                                        {transactionInfo.netAmount ? transactionInfo.netAmount : '---'}
                                    </Fragment>}
                            </Box>
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPBVRTC'}>
                        <Box component="div" className={'BBPBVRTCHead'}>Terms & Conditions:</Box>
                        <Box component="div" className={'BBPBVRTCItem'}>1. Goods once sold will not be returned.</Box>
                        <Box component="div" className={'BBPBVRTCItem'}>2. Any dispute shall be subject to Mumbai jurisdiction.</Box>
                        <Box component="div" className={'BBPBVRTCItem'}>3. Additional payment gateway surcharge might be levied by the partner.</Box>
                    </Box>
                    <Box component="div" className={'BBPBVRGSTHead'}>
                        Authorised Signatory
                    </Box>
                    <Box component="div" className={'BBPBVRGTitle'}>
                        GSTIN:  <Box component="span">27AATCA3030A123</Box>
                    </Box>
                    <Box component="div" className={'BBPBVRGLine'} />
                    <Box component="div" className={'BBPBVRGLink'}>
                        This is a computer generated invoice. If you have any questions concerning this invoice, please contact <br />
                        <Link href={'mailto:support@sahisavings.com'}>support@sahisavings.com</Link>
                    </Box>
                </Box>
                <Box component="div" className={'BBPBVRBtn'}>
                    <ReactToPrint
                        trigger={() => <Button variant="contained" className={'BBPButton'}>Print Invoice</Button>}
                        content={() => componentRef}
                    />
                </Box>
            </Dialog>
        </Fragment>
    );
};
export default ViewReceipt;
