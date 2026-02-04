import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import { useAxiosPrivate } from '../../../Hooks/useAxiosPrivate';
import SomethingWentWrong from '../../../Components/SomethingWentWrong';
import { MENU_SLUG } from '../../../Constants/constants';


const ViewModel = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    let { order_id } = useParams();
    const [errorDialog, setErrorDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactionInfo, setTransactionInfo] = useState({});

    const handleCloseModal = () => {
        navigate(`/${MENU_SLUG.reports}/redeem`, { replace: true });
    };

    const fetchValue = useCallback(async () => {
        try {
            let url = `order/${order_id}`;
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
    }, [order_id]);

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
                            Buy Details
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
                                    Invoice No
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.invoiceNo ? transactionInfo.invoiceNo : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    AWB No
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.awbNo ? transactionInfo.awbNo : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Logistic Name
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.logisticName ? transactionInfo.logisticName : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Merchant Order ID
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.merchantOrderId ? transactionInfo.merchantOrderId : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Mode Of Payment
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.modeOfPayment ? transactionInfo.modeOfPayment : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Status
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.status ? transactionInfo.status : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Transaction ID
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
                                    Shipping Charges
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingCharges ? transactionInfo.shippingCharges : '---'}
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

                            <Box component="div" className={'BBPRVMIRTitle'}>
                                Product Details
                            </Box>
                            {loading ?
                                <Box component="div" className={'BBPRPrt'}>
                                    <Box component="div" className={'BBPRPInfo'}>
                                        <Stack spacing={1}>
                                            <Skeleton component="div" variant="rounded" height={21} />
                                            <Skeleton component="div" variant="rounded" height={21} />
                                            <Skeleton component="div" variant="rounded" height={21} />
                                            <Skeleton component="div" variant="rounded" height={21} />
                                            <Skeleton component="div" variant="rounded" height={21} />
                                        </Stack>
                                    </Box>
                                    <Box component="div" className={'BBPRPImg'}>
                                        <Skeleton component="div" variant="rounded" width={'100%'} height={'100%'} />
                                    </Box>
                                </Box>
                                :
                                transactionInfo.productDetails.map((product, index) =>
                                    <Box component="div" className={'BBPRPrt'} key={index}>
                                        <Box component="div" className={'BBPRPInfo'}>
                                            <Box component="div" className={'BBPRPISku'}>
                                                <Box component="span">SKU :</Box> {product.sku}
                                            </Box>
                                            <Box component="div" className={'BBPRPIName'}>
                                                {product.productName}
                                            </Box>
                                            <Box component="div" className={'BBPRPIMt'}>
                                                <Box component="span">Metal Type :</Box> {product.metalType}
                                            </Box>
                                            <Box component="div" className={'BBPRPIQt'}>
                                                <Box component="span">Quantity :</Box> {product.quantity}
                                            </Box>
                                            <Box component="div" className={'BBPRPIPri'}>
                                                <Box component="span">Price :</Box>  {product.price}
                                            </Box>
                                            <Box component="div" className={'BBPRPIAmt'}>
                                                <Box component="span">Amount :</Box> {product.amount}
                                            </Box>
                                        </Box>
                                        <Box component="div" className={'BBPRPImg'}>
                                            <img src={product.productImages[0].url} alt={product.productName} />
                                        </Box>
                                    </Box>
                                )
                            }
                            <Box component="div" className={'BBPRVMIRTitle'}>
                                Shipping Address
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Name
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingAddress.name ? transactionInfo.shippingAddress.name : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Mobile
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingAddress.mobile ? transactionInfo.shippingAddress.mobile : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Address
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingAddress.address ? transactionInfo.shippingAddress.address : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    City
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingAddress.city ? transactionInfo.shippingAddress.city : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    State
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingAddress.state ? transactionInfo.shippingAddress.state : '---'}
                                        </Fragment>}
                                </Box>
                            </Box>
                            <Box component="div" className={'BBPRVMIRCol'}>
                                <Box component="div" className={'BBPRVMIRCLabel'}>
                                    Pincode
                                </Box>
                                <Box component="div" className={'BBPVUMDIRCTitle'}>
                                    {loading ? <Skeleton component="div" variant="rounded" height={21} /> :
                                        <Fragment>
                                            {transactionInfo.shippingAddress.pincode ? transactionInfo.shippingAddress.pincode : '---'}
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
