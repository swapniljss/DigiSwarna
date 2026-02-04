import React, { Fragment, useState, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file 
import './style.css';

const RangePicker = ({ buttonTitle, ranges, dataStartDate, title, onChange, onReset }) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const [selected, setSelected] = useState((ranges && ranges.length > 0) || false);

    const [dateState, setDateState] = useState(ranges || []);

    const [tempDate, setTempDate] = useState(ranges || [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const handleRangePicker = (item) => {
        setTempDate([item.selection]);
    };

    const handleRangePickerSave = () => {
        setDateState(tempDate);
        onChange && onChange(tempDate[0]);
        setSelected(true);
        setOpen(false);
    };

    const handleRangePickerReset = () => {
        setTempDate(ranges ? ranges : [
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
        setDateState(ranges ? ranges : []);
        setSelected(ranges ? true : false);
        onReset && onReset();
    };

    return (
        <Fragment>
            <Box component="div" className={'BBPRangePicker'}>
                <Button
                    className={'BBPRPDate'}
                    variant="contained"
                    endIcon={<ArrowDropDownIcon fontSize="inherit" />}
                    ref={anchorRef}
                    aria-controls={open ? 'date-picker' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}

                >{selected ? `${format(dateState[0].startDate, 'MMM dd Y')} - ${format(dateState[0].endDate, 'MMM dd Y')}` : title || 'All'}</Button>
                {selected ? <IconButton className={'BBPRPReset'} onClick={handleRangePickerReset}><RestartAltIcon fontSize="inherit" /></IconButton> : ''}
            </Box>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                className={"BBPRPCal"}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Box component="div" className={"BBPRPCOuter"}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box component="div" className={"BBPRPCInner"}>
                                    <DateRange
                                      editableDateInputs={true}
                                        onChange={item => handleRangePicker(item)}
                                        moveRangeOnFirstSelection={false}
                                        ranges={tempDate}
                                        minDate={dataStartDate ? dataStartDate : new Date()}
                                        maxDate={new Date()}
                                        direction="vertical"
                                        scroll={{ enabled: true }}
                                    />
                                    <Box component="div" className={"BBPRPCIBtn"}>
                                        <Button variant="contained" onClick={handleRangePickerSave}>{buttonTitle || 'Save'}</Button>
                                        <Button variant="contained" onClick={handleClose}>Cancel</Button>
                                    </Box>
                                </Box>
                            </ClickAwayListener>
                        </Box>
                    </Grow>
                )}
            </Popper>
        </Fragment>
    );
};
export default RangePicker;