import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useAxiosPrivate } from '../../Hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchBox from '../../Components/SearchBox';
import DevTable from '../../Components/DevTable';
import AlertDialog from '../../Components/AlertDialog';
import { MENU_SLUG } from '../../Constants/constants';
import Backdrops from '../../Components/Backdrops';
import PageChangeDialog from '../../Components/PageChangeDialog';
import SomethingWentWrong from '../../Components/SomethingWentWrong';
import { CheckPermissions } from '../../Utils/permissions';
import { format, parseISO } from "date-fns";

import './style.css';

const CustomersTable = () => {


    let editPermissions = CheckPermissions('customers_permissions', 'Edit');

    const axiosPrivate = useAxiosPrivate();
    let navigate = useNavigate();
    let location = useLocation();

    const [changePage, setChangePage] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [onDeleteLoading, setOnDeleteLoading] = useState(false);
    const [deleteItem, setDeleteItem] = useState({});
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);
    const [limitData] = useState(20);

    const [rowData, setRowData] = useState([]);

    const [apiParams] = useState({ limit: limitData });

    const [mainColumns, setMainColumns] = useState({
        columns: [
            {
                name: 'mobileNumber',
                title: 'Mobile Number',
                width: 250,
                sorting: false,
                direction: ''
            },
            {
                name: 'emailId',
                title: 'Email ID',
                width: 250,
                sorting: false,
                direction: ''
            },
            {
                name: 'uniqueId',
                title: 'Unique ID',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'userName',
                title: 'User Name',
                width: 100,
                sorting: false,
                direction: ''
            },
            {
                name: 'userCity',
                title: 'City',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'userState',
                title: 'State',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'userPincode',
                title: 'Pincode',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'dateOfBirth',
                title: 'Date Of Birth',
                width: 100,
                sorting: false,
                direction: ''
            },
            {
                name: 'kycStatus',
                title: 'KYC Status',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'action',
                title: 'Action',
                width: 100,
                sorting: false,
                direction: ''
            }
        ]
    });

    const fetchCustomers = useCallback(async (params) => {
        try {
            let urlParams = '';
            if (params) {
                Object.keys(params).forEach(function (key, index) {
                    urlParams += (index === 0 ? '?' : '&') + key + '=' + params[key];
                });
            }
            let url = `customers${urlParams}`;
            let options = {
                method: 'GET',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setRowData(response.data.data);
                    setTotalData(response.data.total);
                } else {
                    setRowData([]);
                    setTotalData(0);
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
            console.error('error', error)
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
        fetchCustomers(prm);
    }, [apiParams, fetchCustomers])

    const handlePaginate = (value) => {
        let prm = apiParams;
        prm.page = value;
        setSelectedPage(value);
        setLoading(true);
        fetchCustomers(prm);
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
        fetchCustomers(prm);
    }
    const handleDeleteAlertClose = () => {
        setDeleteAlert(false);
        setDeleteItem({});
    }

    const handleDeleteUser = useCallback(async () => {
        try {
            setDeleteAlert(false);
            setOnDeleteLoading(true);
            setChangePage(true);
            let url = `users/${deleteItem._id}`;
            let options = {
                method: 'DELETE',
                url
            };
            await axiosPrivate(options).then(response => {
                if (response.data.status === 1) {
                    setDeleteItem({});
                    setLoading(false);
                    setOnDeleteLoading(false);
                    fetchCustomers();
                    setChangePage(false);
                } else {
                    setLoading(false);
                }
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
    }, [deleteItem, fetchCustomers]);


    const handlePreviewUser = (id) => {
        navigate(`/${MENU_SLUG.customers}/view/${id}`, { state: { background: location } });
    }

    const handleEditUser = (id) => {
        navigate(`/${MENU_SLUG.customers}/edit/${id}`, { state: { background: location } });
    }

    function generateRows(tempArray) {
        const tempRowArray = [];
        if (tempArray) {
            tempArray.map((item) =>
                tempRowArray.push({
                    mobileNumber: (<Box component="div" className="BBPDTSText">{item.mobileNumber}</Box>),
                    emailId: (<Box component="div" className="BBPDTSText" style={{ textTransform: 'lowercase' }}>{item.emailId}</Box>),
                    uniqueId: (<Box component="div" className="BBPDTSText">{item.uniqueId}</Box>),
                    userName: (<Box component="div" className="BBPDTSText">{item.userName}</Box>),
                    userCity: (<Box component="div" className="BBPDTSText">{item.userCity}</Box>),
                    userState: (<Box component="div" className="BBPDTSText">{item.userState}</Box>),
                    userPincode: (<Box component="div" className="BBPDTSText">{item.userPincode}</Box>),
                    dateOfBirth: (<Box component="div" className="BBPDTSText">{format(parseISO(item.dateOfBirth), "dd-MMM-yyyy")}</Box>),
                    kycStatus: (<Box component="div" className="BBPDTChips"><Box component="div" className={"BBPDTCChip " + item.kycStatus}>{item.kycStatus}</Box></Box>),
                    action: (<Box component="div" className="BBPDTIBtns">
                        <Tooltip
                            placement="top"
                            classes={{
                                popper: 'BBPTPopper',
                                tooltip: 'BBPTooltip'
                            }}
                            title={'User Details'}
                        >
                            <IconButton size="small" className="BBPDTIBIcon" onClick={() => { handlePreviewUser(item.id) }}>
                                <RemoveRedEyeOutlinedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        {editPermissions &&
                            <Tooltip
                                placement="top"
                                classes={{
                                    popper: 'BBPTPopper',
                                    tooltip: 'BBPTooltip'
                                }}
                                title={'Edit User'}
                            >
                                <IconButton size="small" className="BBPDTIBIcon" onClick={() => { handleEditUser(item.id) }}>
                                    <EditOutlinedIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>}
                    </Box>),
                }),
            );
        }
        return tempRowArray;
    }

    useEffect(() => {
        fetchCustomers(apiParams);
    }, [apiParams, fetchCustomers])

    return (
        <Fragment>
            <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
            <PageChangeDialog showDialog={changePage} setShowDialog={setChangePage} />
            <Backdrops
                open={onDeleteLoading}
                title={'Deleting'}
            />
            <AlertDialog
                open={deleteAlert}
                onClose={handleDeleteAlertClose}
                title={'Are you sure ?'}
                message={'Do you really want to delete these record ?'}
                buttons={
                    <Fragment>
                        <Button variant="contained" onClick={handleDeleteAlertClose}>Cancel</Button>
                        <Button variant="contained" className={'BBPADBDelete'} onClick={handleDeleteUser}>Delete</Button>
                    </Fragment>
                }
            />
            <Box component='div' className={'BBPCusTable'}>
                <Box component='div' className={'BBPCTHead'}>
                    <SearchBox
                        onSearchChange={handleSearch}
                        placeholder={'Search Customer'}
                        searchTooltip={'Searching from Email ID, Phone Number, Unique ID, User Name, Pincode'}
                    />
                </Box>
                <Box component='div' className={'BBPCTBody'}>
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

export default CustomersTable;
