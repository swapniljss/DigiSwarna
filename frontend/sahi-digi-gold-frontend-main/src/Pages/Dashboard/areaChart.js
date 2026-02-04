import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import { useAxiosPrivate } from '../../Hooks/useAxiosPrivate';
import { getPercentage, getStatusChartData, dataByStatus } from './utils';
import SomethingWentWrong from '../../Components/SomethingWentWrong';
import './style.css';

const CustomTooltip = ({ active, payload, isAmt }) => {
    if (active && payload && payload.length) {
        let date = new Date(payload[0].payload.date);
        return (
            <Box component="div" className="BBPCustomTooltip">
                <Box component="div" className="BBPCTitle">{format(date, "dd MMM yyyy")}</Box>
                <Box component="div" className="BBPCList">
                    <strong>{isAmt ? `₹${payload[0].payload.currentCount.toFixed(2)}` : `${payload[0].payload.currentCount}`}</strong> Current Month
                </Box>
                <Box component="div" className="BBPCList">
                    <strong>{isAmt ? `₹${payload[0].payload.lastCount.toFixed(2)}` : `${payload[0].payload.lastCount}`}</strong> Last Month
                </Box>
            </Box>
        );
    }

    return null;
};

const BBPAreaChart = ({ apiPrm, color, name, title, percentage_text, itemKey, isAmt }) => {

    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [buyCount, setBuyCount] = useState({ current: 0, last: 0 });
    const [totalData, setTotalData] = useState([]);

    const fetchTotalData = useCallback(async (prm) => {
        try {
            setLoading(true);
            let url = `dashboard/${apiPrm}`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    let tempCount = { ...buyCount };
                    let tempCurrentData = [];
                    let tempLastData = [];
                    tempCurrentData = dataByStatus(response.data.current, 'currentCount', itemKey);
                    tempLastData = dataByStatus(response.data.last, 'lastCount', itemKey);
                    tempCount.current = tempCurrentData.reduce((a, v) => a = a + v.currentCount, 0);
                    tempCount.last = tempLastData.reduce((a, v) => a = a + v.lastCount, 0);
                    setTotalData(getStatusChartData(tempCurrentData, tempLastData));
                    setBuyCount(tempCount);
                } else {
                    setErrorDialog(true);
                    console.error('err.res', response.data);
                }
                setLoading(false);
            }).catch(err => {
                if (err.response) {
                    setErrorDialog(true);
                    setLoading(false);
                    console.error('err.res', err.response.data);
                }
            });
        } catch (error) {
            setErrorDialog(true);
            setLoading(false);
            console.error('error', error)
        }
    }, []);

    useEffect(() => {
        if (apiPrm) {
            fetchTotalData(apiPrm);
        }
    }, [apiPrm]);

    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <Box component="div" className={'BBPAreaChart'}>
                <Box component="div" className={'BBPACMTitle'}>{loading ? <Skeleton variant="rounded" width={200} height={21} /> : title} </Box>
                <Box component="div" className={'BBPACInfo'}>
                    <Box component="div" className={'BBPACIDet'}>
                        <Box component="div" className={'BBPACIDTitle'}>
                            {loading ? <Skeleton variant="rounded" width={180} height={32} /> : `${isAmt ? `₹${buyCount.current.toFixed(2)}` : `${buyCount.current}`}`}
                        </Box>
                        <Box component="div" className={'BBPACIDSubTitle'}>
                            {loading ? <Skeleton variant="rounded" width={180} height={20} /> :
                                <Fragment>
                                    <Box component="div" className={'BBPACIDPer'} style={{ color: getPercentage(buyCount.current, buyCount.last) >= 0 ? '#3DD598' : '#F0142F' }}>
                                        {`${Math.abs(getPercentage(buyCount.current, buyCount.last))}%`} {getPercentage(buyCount.current, buyCount.last) >= 0 ? <NorthIcon fontSize="inherit" /> : <SouthIcon fontSize="inherit" />}
                                    </Box>
                                    <Box component="div" className={'BBPACIDPTitle'}>
                                        {percentage_text}
                                    </Box>
                                </Fragment>}
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPACIChart'}>
                        {loading ? <Skeleton variant="rounded" component="div" height={52} /> :
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    width={500}
                                    height={400}
                                    data={totalData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: 5,
                                        bottom: 5
                                    }}
                                >
                                    <defs>
                                        <linearGradient id={name} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area dataKey="currentCount" name={title} stroke={color} fillOpacity={1} fill={`url(#${name})`} />
                                    <Tooltip position={{ y: -85 }} content={<CustomTooltip isAmt={isAmt} />} />
                                </AreaChart>
                            </ResponsiveContainer>
                        }
                    </Box>
                </Box>
            </Box>
        </Fragment>
    );
};

export default BBPAreaChart;
