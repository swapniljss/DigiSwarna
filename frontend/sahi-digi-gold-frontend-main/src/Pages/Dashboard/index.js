import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import RightSidePanel from '../../Components/RightSidePanel';
import Overview from './overview';
import LineChart from './lineChart';
import { CheckPermissions } from '../../Utils/permissions';

import './style.css';

const DashboardPage = () => {

    return (
        <Fragment>
            <RightSidePanel removeBg>
                <Box component="div" className={'BBPDashboardPage'}>
                    {CheckPermissions('dashboard_permissions', 'View') ?
                        <Fragment>
                            <Overview />
                            <LineChart
                                apiName={'dashboard/totalGold'}
                                title={'Total Gold Purchased (Amount & Qty)'}
                                name1={'Qty'}
                                name2={'Amount'}
                            />
                            <LineChart
                                apiName={'dashboard/totalSilver'}
                                title={'Total Silver Purchased (Amount & Qty)'}
                                name1={'Qty'}
                                name2={'Amount'}
                            />
                        </Fragment>
                        : 'No Access'}
                </Box>
            </RightSidePanel>
        </Fragment>
    );
};

export default DashboardPage;
