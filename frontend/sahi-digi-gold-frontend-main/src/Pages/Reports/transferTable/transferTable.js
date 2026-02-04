import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { usePapaParse } from 'react-papaparse';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAxiosPrivate } from '../../../Hooks/useAxiosPrivate';
import SearchBox from '../../../Components/SearchBox';
import DevTable from '../../../Components/DevTable';
import PageChangeDialog from '../../../Components/PageChangeDialog';
import DateRangePicker from '../../../Components/DateRangePicker';
import SomethingWentWrong from '../../../Components/SomethingWentWrong';
import Backdrops from '../../../Components/Backdrops';

const TransferTable = () => {

    const { jsonToCSV } = usePapaParse();

    const axiosPrivate = useAxiosPrivate();

    const [changePage, setChangePage] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataStartDate, setDataStartDate] = useState();
    const [totalData, setTotalData] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);
    const [limitData] = useState(20);
    const [onDownloadLoading, setOnDownloadLoading] = useState(false);

    const [rowData, setRowData] = useState([]);

    const [apiParams] = useState({ limit: limitData });

    const [mainColumns, setMainColumns] = useState({
        columns: [
            {
                name: 'date',
                title: 'Date',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'senderName',
                title: 'Sender Name',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'senderNumber',
                title: 'Sender Mobile',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'silverBalance',
                title: 'Sender Silver Balance',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'goldBalance',
                title: 'Sender Silver Balance',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'receiverName',
                title: 'Receiver Name',
                width: 100,
                sorting: false,
                direction: ''
            },
            {
                name: 'receiverNumber',
                title: 'Receiver Mobile',
                width: 100,
                sorting: false,
                direction: ''
            },
            {
                name: 'receiverSilverBalance',
                title: 'Receiver Silver Balance',
                width: 100,
                sorting: false,
                direction: ''
            },
            {
                name: 'receiverGoldBalance',
                title: 'Receiver Gold Balance',
                width: 100,
                sorting: false,
                direction: ''
            },
            {
                name: 'metalType',
                title: 'Metal Type',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'quantity',
                title: 'Quantity',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'transactionId',
                title: 'Transaction ID',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'merchantTransactionId',
                title: 'Merchant Transaction ID',
                width: 100,
                sorting: false,
                direction: ''
            }
        ]
    });

    const fetchTransaction = useCallback(async (params) => {
        try {
            let urlParams = '';
            if (params) {
                Object.keys(params).forEach(function (key, index) {
                    urlParams += (index === 0 ? '?' : '&') + key + '=' + params[key];
                });
            }
            let url = `transfer${urlParams}`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setRowData(response.data.data);
                    setTotalData(response.data.total);
                    setLoading(false);
                } else {
                    setRowData([]);
                    setTotalData(0);
                    setLoading(false);
                }
                setDataStartDate(new Date(response.data.firstDate));
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
    }, []);

    const handleSearch = useCallback((value) => {
        setLoading(true);
        let prm = apiParams;
        setSelectedPage(1);
        prm.page = 1;
        if (value.length > 0) {
            prm.search = value;
        } else {
            delete prm.search;
        }
        fetchTransaction(prm);
    }, [apiParams, fetchTransaction])

    const handlePaginate = (value) => {
        let prm = apiParams;
        prm.page = value;
        setSelectedPage(value);
        setLoading(true);
        fetchTransaction(prm);
    };

    const handleSorting = (name, index) => {
        let prm = apiParams;
        let tempCol = mainColumns.columns;
        if (tempCol[index].direction === '') {
            tempCol.map((column) => (column.name === name ? column.direction = 'ASC' : column.direction = ''));
            prm.sort_by = name;
            prm.order = 1;
            prm.page = 1;
        } else if (tempCol[index].direction === 'ASC') {
            tempCol.map((column) => (column.name === name ? column.direction = 'DSC' : column.direction = ''));
            prm.sort_by = name;
            prm.order = -1;
            prm.page = 1;
        } else if (tempCol[index].direction === 'DSC') {
            tempCol.map((column) => column.direction = '');
            prm.page = 1;
            delete prm.sort_by;
            delete prm.order;
        }
        setLoading(true);
        setMainColumns({ columns: tempCol });
        setSelectedPage(1);
        fetchTransaction(prm);
    }

    function generateRows(tempArray) {
        const tempRowArray = [];
        if (tempArray) {
            tempArray.map((item) =>
                tempRowArray.push({
                    date: (<Box component="div" className="BBPDTSText">{format(new Date(item.date), "dd-MM-yyyy HH:mm:ss")}</Box>),
                    senderName: (<Box component="div" className="BBPDTSText">{item.sender.userName}</Box>),
                    senderNumber: (<Box component="div" className="BBPDTSText">{item.sender.mobileNumber}</Box>),
                    silverBalance: (<Box component="div" className="BBPDTSText">{item.silverBalance}</Box>),
                    goldBalance: (<Box component="div" className="BBPDTSText">{item.goldBalance}</Box>),
                    receiverName: (<Box component="div" className="BBPDTSText">{item.receiver.userName}</Box>),
                    receiverNumber: (<Box component="div" className="BBPDTSText">{item.receiver.mobileNumber}</Box>),
                    receiverSilverBalance: (<Box component="div" className="BBPDTSText">{item.receiverSilverBalance}</Box>),
                    receiverGoldBalance: (<Box component="div" className="BBPDTSText">{item.receiverGoldBalance}</Box>),
                    metalType: (<Box component="div" className="BBPDTSText">{item.metalType}</Box>),
                    quantity: (<Box component="div" className="BBPDTSText">{item.quantity}</Box>),
                    transactionId: (<Box component="div" className="BBPDTSText">{item.transactionId}</Box>),
                    merchantTransactionId: (<Box component="div" className="BBPDTSText">{item.merchantTransactionId}</Box>)
                }),
            );
        }
        return tempRowArray;
    }

    const handleCSVDownload = useCallback(async () => {
        try {
            setOnDownloadLoading(true);
            let urlParams = '';
            if (apiParams) {
                Object.keys(apiParams).forEach(function (key, index) {
                    urlParams += (index === 0 ? '?' : '&') + key + '=' + (key === 'limit' ? totalData : apiParams[key]);
                });
            }
            let url = `transfer${urlParams}`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setRowData(response.data.data);
                    setTotalData(response.data.total);
                    const tempDownloadArr = [];
                    const tempHeader = {};
                    mainColumns.columns.map((item) => tempHeader[item.name] = item.title);
                    response.data.data.map((item) =>
                        tempDownloadArr.push({
                            date: format(new Date(item.date), "dd-MM-yyyy HH:mm:ss"),
                            senderName: item.sender.userName,
                            senderNumber: item.sender.mobileNumber,
                            silverBalance: item.silverBalance,
                            goldBalance: item.goldBalance,
                            receiverName: item.receiver.userName,
                            receiverNumber: item.receiver.mobileNumber,
                            receiverSilverBalance: item.receiverSilverBalance,
                            receiverGoldBalance: item.receiverGoldBalance,
                            metalType: item.metalType,
                            quantity: item.quantity,
                            transactionId: item.transactionId,
                            merchantTransactionId: item.merchantTransactionId,
                        })
                    );
                    tempDownloadArr.unshift(tempHeader);
                    const csv = jsonToCSV(tempDownloadArr, { header: false });
                    let filename = `${'transfer-transactions'}-${format(new Date(), 'yyyy-MM-dd-HH:mm:ss')}.csv`;
                    var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    var csvURL = null;
                    if (navigator.msSaveBlob) {
                        csvURL = navigator.msSaveBlob(csvData, filename);
                    }
                    else {
                        csvURL = window.URL.createObjectURL(csvData);
                    }
                    var tempLink = document.createElement('a');
                    tempLink.href = csvURL;
                    tempLink.setAttribute('download', filename);
                    tempLink.click();
                    setOnDownloadLoading(false);
                } else {
                    setRowData([]);
                    setTotalData(0);
                    setOnDownloadLoading(false);
                }
            }).catch(err => {
                if (err.response) {
                    setErrorDialog(true);
                    setOnDownloadLoading(false);
                    console.error('err.res', err.response.data);
                }
            });
        } catch (error) {
            setErrorDialog(true);
            setOnDownloadLoading(false);
            console.error('error', error);
        }
        // eslint-disable-next-line 
    }, [totalData]);

    const handleDateFilter = (date) => {
        let prm = apiParams;
        prm.startDate = format(date.startDate, "yyyy-MM-dd");
        prm.endDate = format(date.endDate, "yyyy-MM-dd");
        setLoading(true);
        fetchTransaction(prm);
    };

    const handleRestDateFilter = () => {
        let prm = apiParams;
        delete prm.startDate;
        delete prm.endDate;
        setLoading(true);
        fetchTransaction(prm);
    };

    useEffect(() => {
        fetchTransaction(apiParams);
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <PageChangeDialog showDialog={changePage} setShowDialog={setChangePage} />
            <Backdrops
                open={onDownloadLoading}
                title={'Downloading'}
            />

            <Box component='div' className={'BBPReports'}>
                <Box component='div' className={'BBPRHead'}>
                    <SearchBox
                        onSearchChange={handleSearch}
                        placeholder={'Search Transaction'}
                        searchTooltip={'Searching from Mobile Number, Unique ID, Transaction ID, Merchant Transaction ID'}
                    />
                    <Box component='div' className={'BBPRHBtn'}>
                        <DateRangePicker
                            title={'Period'}
                            buttonTitle={'Apply'}
                            dataStartDate={dataStartDate}
                            onChange={handleDateFilter}
                            onReset={handleRestDateFilter}
                        />
                        <Button variant="contained" className={'BBPRHBD'} onClick={handleCSVDownload} disabled={loading || totalData === 0}>Download</Button>
                    </Box>
                </Box>
                <Box component='div' className={'BBPRBody'}>
                    <DevTable
                        rows={generateRows(rowData)}
                        columns={mainColumns.columns}
                        selectedPage={selectedPage}
                        handlePagination={handlePaginate}
                        loading={loading}
                        handleSort={handleSorting}
                        limitData={limitData}
                        totalData={totalData}
                    />
                </Box>
            </Box>
        </Fragment>
    );
};

export default TransferTable;
