import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import DevTable from '../../Components/DevTable';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import './style.css';

const Step2 = ({ tableHeader, tableData, tableDataErr, duplicateData }) => {

    const [tempTableData, setTempTableData] = useState(tableData);
    const [errCheck, setErrCheck] = useState(false);

    const handleErrData = (event) => {
        setErrCheck(event.target.checked);
        if (event.target.checked) {
            let tempData = [...tableData];
            const data = tempData.filter((item) => item.err === true);
            setTempTableData(data);
        } else {
            setTempTableData(tableData);
        }
    };

    return (
        <Box component="div" className={'BBPUCStep2'}>
            <Box component="div" className={'BBPUCSInner'}>
                <Box component="div" className={'BBPUCSHead'}>
                    <Box component="div" className={'BBPUCSHTitle'}>
                        Check column values
                    </Box>
                    <Box component="div" className={'BBPUCSHDes'}>
                        Our system checks the values of each row and if any issues found you can easily edit it by clicking on the cell.
                    </Box>
                    <Box component="div" className={'BBPUCSHAlert'}>
                        {tableDataErr > 0 ?
                            <Alert severity="error">{tableDataErr > 1 ? `${tableDataErr} rows contain errors.` : `${tableDataErr} row contain error.`}</Alert>
                            :
                            <Alert severity="success">All good! You're ready to import the data.</Alert>
                        }
                        {duplicateData > 0 &&
                            <Alert severity="warning">{duplicateData > 1 ? `${duplicateData} rows contain duplicate.` : `${duplicateData} row contain duplicate.`}</Alert>}
                    </Box>
                    <Box component="div" className={'BBPUCSHOption'}>
                        <Box component="div" className={'BBPUCSHOEnt'}>
                            {tableData.length > 1 ? `${tableData.length} Entries` : `${tableData.length} Entry`}
                        </Box>
                        <Box component="div" className={'BBPUCSHOToggle'}>
                            <FormControlLabel
                                value="yes"
                                control={<Switch color="primary" />}
                                label="Only show rows with problems"
                                labelPlacement="end"
                                onChange={handleErrData}
                                checked={errCheck}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box component="div" className={'BBPUCSBody'}>
                    <DevTable
                        columns={tableHeader}
                        rows={tempTableData}
                    />
                </Box>
            </Box>
        </Box>
    );
};
export default Step2;
