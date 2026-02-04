import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useAxiosPrivate } from '../../Hooks/useAxiosPrivate';
import { reformatedOption } from '../../Utils/autocompleteGroup';
import SomethingWentWrong from '../../Components/SomethingWentWrong';

import './style.css';

const CustomTooltip = ({ active, payload, sign }) => {
    if (active && payload && payload.length) {
        return (
            <Box component="div" className="BBPCustomTooltip">
                <Box component="div" className="BBPCTitle">{`${payload[0].payload.main_cat} - ${payload[0].payload.sub_cat}`}</Box>
                {payload.map((item, index) =>
                    <Box component="div" className="BBPCList" key={index}><span style={{ backgroundColor: item.color }}></span> <strong>{sign}{item.value}</strong> {item.name}</Box>
                )}
            </Box>
        );
    }

    return null;
};


const BBPBarChart = () => {

    const axiosPrivate = useAxiosPrivate();

    const categories = [];
    const allCatArr = reformatedOption(categories.allCategories, ['name|type']);

    const [loading, setLoading] = useState(true);
    const [errorDialog, setErrorDialog] = useState(false);
    const [catWiseVolData, setCatWiseVolData] = useState([]);
    const [catWiseCountData, setCatWiseCountData] = useState([]);

    const fetchCatWiseVol = useCallback(async () => {
        try {
            setLoading(true);
            let url = `dashboard/catwisevol`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    let tempCurData = [];
                    let tempLastData = [];
                    let allData = [];
                    // eslint-disable-next-line 
                    response.data.current.map((item) => {
                        tempCurData.push({ main_cat: item._id.main_cat, sub_cat: item._id.sub_cat, currentTotal: item.total });
                    });
                    // eslint-disable-next-line
                    response.data.last.map((item) => {
                        tempLastData.push({ main_cat: item._id.main_cat, sub_cat: item._id.sub_cat, lastTotal: item.total });
                    });


                    for (let i = 0; i < allCatArr.length; i++) {
                        let item = allCatArr[i];
                        const cIndex = tempCurData.findIndex(object => {
                            return object.main_cat === item.type && object.sub_cat === item.name;
                        });
                        const lIndex = tempLastData.findIndex(object => {
                            return object.main_cat === item.type && object.sub_cat === item.name;
                        });

                        allData.push({
                            name: `${item.name.slice(0, 4)}...`,
                            main_cat: item.type,
                            sub_cat: item.name,
                            currentTotal: cIndex !== -1 ? tempCurData[cIndex].currentTotal : 0,
                            lastTotal: lIndex !== -1 ? tempLastData[lIndex].lastTotal : 0
                        });

                        setCatWiseVolData(allData);
                    }
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
    }, [allCatArr]);

    const fetchCatWiseCount = useCallback(async () => {
        try {
            setLoading(true);
            let url = `dashboard/catwisecount`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    let tempCurData = [];
                    let tempLastData = [];
                    let allData = [];
                    // eslint-disable-next-line 
                    response.data.current.map((item) => {
                        tempCurData.push({ main_cat: item._id.main_cat, sub_cat: item._id.sub_cat, currentCount: item.count });
                    });
                    // eslint-disable-next-line 
                    response.data.last.map((item) => {
                        tempLastData.push({ main_cat: item._id.main_cat, sub_cat: item._id.sub_cat, lastCount: item.count });
                    });

                    for (let i = 0; i < allCatArr.length; i++) {
                        let item = allCatArr[i];
                        const cIndex = tempCurData.findIndex(object => {
                            return object.main_cat === item.type && object.sub_cat === item.name;
                        });

                        const lIndex = tempLastData.findIndex(object => {
                            return object.main_cat === item.type && object.sub_cat === item.name;
                        });

                        allData.push({
                            name: `${item.name.slice(0, 4)}...`,
                            main_cat: item.type,
                            sub_cat: item.name,
                            currentCount: cIndex !== -1 ? tempCurData[cIndex].currentCount : 0,
                            lastCount: lIndex !== -1 ? tempLastData[lIndex].lastCount : 0
                        });

                        setCatWiseCountData(allData);
                    }
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
    }, [allCatArr]);

    useEffect(() => {
        if (!categories.dataLoading && allCatArr.length > 0) {
            fetchCatWiseVol();
            fetchCatWiseCount();
        }
    }, [categories.dataLoading]);

    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <Box component="div" className={'BBPDPBarCharts'}>
                <Box component="div" className={'BBPBarChart'}>
                    <Box component="div" className={'BBPBCHead'}>
                        <Box component="div" className={'BBPBCHTitle'}>
                            Category Wise Volume
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPBCChart'}>
                        {loading ?
                            <Stack spacing={1}>
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                            :
                            <BarChart
                                width={(catWiseVolData.length * 70)}
                                height={400}
                                data={catWiseVolData}
                                margin={{
                                    left: 0
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 0" vertical={false} />
                                <XAxis dataKey="name" interval={0} width={50} />
                                <YAxis tickMargin={20} />
                                <Tooltip content={<CustomTooltip sign={'₹'} />} />
                                <Legend verticalAlign="top" iconType={'circle'} height={46} />
                                <Bar dataKey="currentTotal" fill="#29CB97" name="Current Month" barSize={8} minPointSize={1} />
                                <Bar dataKey="lastTotal" fill="#0062FF" name="Previous Month" barSize={8} minPointSize={1} />
                            </BarChart>
                        }
                    </Box>
                </Box>
                <Box component="div" className={'BBPBarChart'}>
                    <Box component="div" className={'BBPBCHead'}>
                        <Box component="div" className={'BBPBCHTitle'}>
                            Category Wise No Of Txn
                        </Box>
                    </Box>
                    <Box component="div" className={'BBPBCChart'}>
                        {loading ?
                            <Stack spacing={1}>
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                            :
                            <BarChart
                                width={(catWiseCountData.length * 70)}
                                height={400}
                                data={catWiseCountData}
                                margin={{
                                    left: 0
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 0" vertical={false} />
                                <XAxis dataKey="name" interval={0} width={50} />
                                <YAxis tickMargin={20} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" iconType={'circle'} height={46} />
                                <Bar dataKey="currentCount" fill="#29CB97" name="Current Month" barSize={8} minPointSize={1} />
                                <Bar dataKey="lastCount" fill="#0062FF" name="Previous Month" barSize={8} minPointSize={1} />
                            </BarChart>
                        }
                    </Box>
                </Box>
            </Box >
        </Fragment>
    );
};

export default BBPBarChart;
