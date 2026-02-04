import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import BBPAreaChart from './areaChart';



const Overview = () => {

    return (
        <Fragment>
            <Box component="div" className={'BBPDPTitle'}>
                Overview
            </Box>
            <Box component="div" className={'BBPDPCharts'}>
                <BBPAreaChart
                    apiPrm={'totalBuy'}
                    color={"#82ca9d"}
                    name={'totalBuy'}
                    title={'Total Buy'}
                    itemKey={'total'}
                    isAmt={true}
                    percentage_text={'Than Last 30 Days'}
                />
                <BBPAreaChart
                    apiPrm={'totalSell'}
                    color={"#201EAA"}
                    name={'totalSell'}
                    title={'Total Sell'}
                    itemKey={'total'}
                    isAmt={true}
                    percentage_text={'Than Last 30 Days'}
                />
                <BBPAreaChart
                    apiPrm={'totalTransferCount'}
                    color={"#12e1e3"}
                    name={'totalTransferCount'}
                    title={'Total Transfer Count'}
                    itemKey={'count'}
                    isAmt={false}
                    percentage_text={'Than Last 30 Days'}
                />
                <BBPAreaChart
                    apiPrm={'totalRedeemCount'}
                    color={"#ff9800"}
                    name={'totalRedeemCount'}
                    title={'Total Redeem Count'}
                    itemKey={'count'}
                    isAmt={false}
                    percentage_text={'Than Last 30 Days'}
                />
            </Box>
        </Fragment>
    );
};

export default Overview;
