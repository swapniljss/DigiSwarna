import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import SortUp from '../Icons/SortUp';
import SortDown from '../Icons/SortDown';
import NoData from '../NoData';

import './style.css';

const DevTable = ({ rows, columns, handleSort, handlePagination, loading, limitData, totalData, selectedPage }) => {
    return (
        <Box component='div' className={'BBPDevTable'}>
            <Box component='div' className={'BBPDTInner'}>
                <Box component='div' className={`BBPDTIResponsive ${rows.length === 0 || loading ? 'BBPDTIREmpty' : ''}`}>
                    <table className={'BBPTable'}>
                        <thead>
                            <tr>
                                {columns.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <th style={{ minWidth: item.width }}>
                                                <Box component='div' className={`BBPDTHead ${item.sorting ? 'BBPDTHSort' : ''} ${item.direction ? 'BBPDTHSOn' : ''}`} onClick={() => { item.sorting && handleSort(item.name, index) }}>
                                                    <Box component='div' className={'BBPDTHText'}>{item.title}</Box>
                                                    {item.sorting && <Box component='div' className={'BBPDTHIcon'}>
                                                        {item.direction.length > 0 ? item.direction === 'ASC' ? <SortUp /> : <SortDown /> : <SortUp />}
                                                    </Box>}
                                                </Box>
                                            </th>
                                        </Fragment>
                                    )
                                })}

                            </tr>
                        </thead>
                        {loading ?
                            <Fragment>
                                <tbody>
                                    {Array.from(Array(25).keys()).map((item) => (
                                        <tr key={item}>
                                            {columns.map((colItem, colIndex) => {
                                                return (
                                                    <td key={colIndex}>
                                                        <Skeleton variant="rectangular" height={38} />
                                                    </td>
                                                )
                                            })}

                                        </tr>
                                    ))}
                                </tbody>
                            </Fragment>
                            :
                            <tbody>
                                {rows.length > 0 ?
                                    <Fragment>
                                        {rows.map((rowItem, rowIndex) => {
                                            return (
                                                <tr key={rowIndex}>
                                                    {columns.map((colItem, colIndex) => {
                                                        return (
                                                            <td key={colIndex}>
                                                                {rowItem[colItem.name]}
                                                            </td>
                                                        )
                                                    })}

                                                </tr>
                                            )
                                        })}
                                    </Fragment>
                                    : <tr>
                                        <td className={'BBPTNDCol'}>
                                            <Box className={'BBPTNDBox'}>
                                                <NoData title={'No Data'} description={'no data found'} />
                                            </Box>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        }
                    </table>
                </Box>
            </Box>
            {totalData !== 0 && handlePagination &&
                <Box component='div' className={'BBPDTBottom'}>
                    <Box component='div' className={'BBPDTBPag'}>
                        <Pagination
                            count={Math.ceil(totalData / limitData) > 0 ? Math.ceil(totalData / limitData) : 1}
                            className={'BBPDTPagination'}
                            shape="rounded"
                            disabled={rows.length === 0 || loading}
                            onChange={(event, page) => { handlePagination(page) }}
                            page={selectedPage}
                        />
                    </Box>
                    <Box component='div' className={'BBPDTBPNum'}>
                        Showing {(selectedPage * limitData) - (limitData - 1)} - {Math.ceil(totalData / limitData) === selectedPage ? totalData : (selectedPage * limitData)} of {totalData}</Box>
                </Box>
            }
        </Box>
    );
};

export default DevTable;