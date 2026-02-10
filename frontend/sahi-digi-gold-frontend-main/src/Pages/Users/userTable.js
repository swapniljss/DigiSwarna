import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useAxiosPrivate } from '../../Hooks/useAxiosPrivate';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PasswordIcon from '@mui/icons-material/Password';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchBox from '../../Components/SearchBox';
import FileAddIcon from '../../Components/Icons/FileAddIcon';
import DevTable from '../../Components/DevTable';
import AlertDialog from '../../Components/AlertDialog';
import { MENU_SLUG } from '../../Constants/constants';
import Backdrops from '../../Components/Backdrops';
import PageChangeDialog from '../../Components/PageChangeDialog';
import { CheckPermissions } from '../../Utils/permissions';
import SomethingWentWrong from '../../Components/SomethingWentWrong';
import { format, parseISO } from "date-fns";

import './style.css';

const UserTable = () => {
    const axiosPrivate = useAxiosPrivate();
    let navigate = useNavigate();
    let location = useLocation();
    let editPermissions = CheckPermissions('users_permissions', 'Edit');
    let deletePermissions = CheckPermissions('users_permissions', 'Delete');
    let addPermissions = CheckPermissions('users_permissions', 'Add');
    let passwordPermissions = CheckPermissions('users_permissions', 'Change Password');

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
                name: 'name',
                title: 'Name',
                width: 250,
                sorting: true,
                direction: ''
            },
            {
                name: 'email',
                title: 'Email ID',
                width: 250,
                sorting: true,
                direction: ''
            },
            {
                name: 'mobile_number',
                title: 'Mobile Number',
                width: 150,
                sorting: false,
                direction: ''
            },
            {
                name: 'dob',
                title: 'Date of Birth',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'status',
                title: 'Status',
                width: 100,
                sorting: true,
                direction: ''
            },
            {
                name: 'action',
                title: 'Actions',
                width: 100,
                sorting: false,
                direction: ''
            }
        ]
    });

    const fetchUsers = useCallback(async (params) => {
        try {
            let urlParams = '';
            if (params) {
                Object.keys(params).forEach(function (key, index) {
                    urlParams += (index === 0 ? '?' : '&') + key + '=' + params[key];
                });
            }
            let url = `users${urlParams}`;
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
        fetchUsers(prm);
    }, [apiParams, fetchUsers])

    const handlePaginate = (value) => {
        let prm = apiParams;
        prm.page = value;
        setSelectedPage(value);
        setLoading(true);
        fetchUsers(prm);
    };

    const handlePreviewUser = (item) => {
        navigate(`/${MENU_SLUG.users}/view/${item._id}`, { state: { background: location } });
    }

    const handleEditUser = (item) => {
        navigate(`/${MENU_SLUG.users}/edit/${item._id}`, { replace: true });
    }

    const handleChangePassword = (item) => {
        navigate(`/${MENU_SLUG.users}/password/${item._id}`, { state: { background: location } });
    }

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
        fetchUsers(prm);
    }

    const handleSetDeleteUser = (item) => {
        setDeleteItem(item);
        setDeleteAlert(true);
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
                    fetchUsers();
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
    }, [deleteItem, fetchUsers]);

    function generateRows(tempArray) {
        const tempRowArray = [];
        if (tempArray) {
            tempArray.map((item) =>
                tempRowArray.push({
                    // name: (<Box component="div" className="BBPDTImgText">
                    //     <Box component="div" className="BBPDTSITImg"><img src={`${process.env.REACT_APP_API_BASE_URL}/image/${item.image}`} alt={item.name} /></Box>
                    //     <Box component="div" className="BBPDTSITText">{item.name}</Box>
                    // </Box>),
name: (
  <Box component="div" className="BBPDTSText BBPDropCap">
    <span className="BBPDropCapLetter">
      {item.name?.charAt(0)}
    </span>
    {item.name?.slice(1)}
  </Box>
),


                    email: (<Box component="div" className="BBPDTSText" style={{ textTransform: 'lowercase' }}>{item.email}</Box>),
                    mobile_number: (<Box component="div" className="BBPDTSText">{item.phone}</Box>),
                    dob: (<Box component="div" className="BBPDTSText">{format(parseISO(item.dob), "dd-MMM-yyyy")}</Box>),
                    status: (<Box component="div" className="BBPDTSText">{item.status ? 'Active' : 'InActive'}</Box>),
                    action: (<Box component="div" className="BBPDTIBtns">
                        <Tooltip
                            placement="top"
                            classes={{
                                popper: 'BBPTPopper',
                                tooltip: 'BBPTooltip'
                            }}
                            title={'User Details'}
                        >
                            <IconButton size="small" className="BBPDTIBIcon" onClick={() => { handlePreviewUser(item) }}>
                                <RemoveRedEyeOutlinedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        {editPermissions ?
                            <Tooltip
                                placement="top"
                                classes={{
                                    popper: 'BBPTPopper',
                                    tooltip: 'BBPTooltip'
                                }}
                                title={'Edit User'}
                            >
                                <IconButton size="small" className="BBPDTIBIcon" onClick={() => { handleEditUser(item) }}>
                                    <EditOutlinedIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                            : ''}
                        {passwordPermissions ?
                            <Tooltip
                                placement="top"
                                classes={{
                                    popper: 'BBPTPopper',
                                    tooltip: 'BBPTooltip'
                                }}
                                title={'Change Password'}
                            >
                                <IconButton size="small" className="BBPDTIBIcon" onClick={() => { handleChangePassword(item) }}>
                                    <PasswordIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip> : ''}
                        {deletePermissions ?
                            <Tooltip
                                placement="top"
                                classes={{
                                    popper: 'BBPTPopper',
                                    tooltip: 'BBPTooltip'
                                }}
                                title={'Delete User'}
                            >
                                <IconButton size="small" className="BBPDTIBIcon" onClick={() => { handleSetDeleteUser(item) }}>
                                    <DeleteOutlinedIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                            : ''}
                    </Box>),
                }),
            );
        }
        return tempRowArray;
    }

    useEffect(() => {
        fetchUsers(apiParams);
    }, [apiParams, fetchUsers])

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
            <Box component='div' className={'BBPUser'}>
                <Box component='div' className={'BBPUHead'}>
                    <SearchBox
                        onSearchChange={handleSearch}
                        placeholder={'Search User'}
                        searchTooltip={'Searching from Name, Email and Phone'}
                    />
                    <Box component='div' className={'BBPUHBtn'}>
                        {addPermissions ?
                            <Link to={`/${MENU_SLUG.users}/add`} className={'BBPTableBtn'}>
                                <Box component='span'><FileAddIcon /></Box>
                                Add
                            </Link>
                            : ''}
                    </Box>
                </Box>
                <Box component='div' className={'BBPUBody'}>
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

export default UserTable;
