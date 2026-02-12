import React, { Fragment, useState, useRef } from 'react';
import { DateRangePicker } from "react-date-range";
import { format, add } from 'date-fns';
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

const DefineRange = ({ buttonTitle, ranges, title, onChange, onReset }) => {

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
    const MIN_DATE = new Date("2022-10-07");
const MAX_DATE = new Date();

const clampDate = (date) => {
    if (!date || isNaN(new Date(date))) return MIN_DATE;
    if (date < MIN_DATE) return MIN_DATE;
    if (date > MAX_DATE) return MAX_DATE;
    return date;
};

    const handleRangePicker = (item) => {
    const start = clampDate(new Date(item.selection.startDate));
    const end = clampDate(new Date(item.selection.endDate));

    setTempDate([{
        startDate: start,
        endDate: end,
        key: 'selection'
    }]);
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
                                    <DateRangePicker
                                        onChange={item => handleRangePicker(item)}
                                        months={1}
                                        maxDate={new Date()}
                                        direction="vertical"
                                        ranges={tempDate}
                                        inputRanges={[]}
                                        staticRanges={[
                                            {
                                                label: "Last Month",
                                                range: () => ({
                                                    startDate: add(new Date(), { days: 1, months: -1 }),
                                                    endDate: new Date()
                                                }),
                                                isSelected(range) {
                                                    let rangeDate = format(range.startDate, 'yyyy-MM-dd');
                                                    let strDate = format(add(new Date(), { days: 1, months: -1 }), 'yyyy-MM-dd');
                                                    return rangeDate === strDate ? true : false;
                                                }
                                            },
                                            {
                                                label: "Last 2 Months",
                                                range: () => ({
                                                    startDate: add(new Date(), { days: 1, months: -2 }),
                                                    endDate: new Date()
                                                }),
                                                isSelected(range) {
                                                    let rangeDate = format(range.startDate, 'yyyy-MM-dd');
                                                    let strDate = format(add(new Date(), { days: 1, months: -2 }), 'yyyy-MM-dd');
                                                    return rangeDate === strDate ? true : false;
                                                }
                                            },
                                            {
                                                label: "Last 3 Months",
                                                range: () => ({
                                                    startDate: add(new Date(), { days: 1, months: -3 }),
                                                    endDate: new Date()
                                                }),
                                                isSelected(range) {
                                                    let rangeDate = format(range.startDate, 'yyyy-MM-dd');
                                                    let strDate = format(add(new Date(), { days: 1, months: -3 }), 'yyyy-MM-dd');
                                                    return rangeDate === strDate ? true : false;
                                                }
                                            },
                                            {
                                                label: "Last 6 Months",
                                                range: () => ({
                                                    startDate: add(new Date(), { days: 1, months: -6 }),
                                                    endDate: new Date()
                                                }),
                                                isSelected(range) {
                                                    let rangeDate = format(range.startDate, 'yyyy-MM-dd');
                                                    let strDate = format(add(new Date(), { days: 1, months: -6 }), 'yyyy-MM-dd');
                                                    return rangeDate === strDate ? true : false;
                                                }
                                            },
                                            {
                                                label: "Last 12 Months",
                                                range: () => ({
                                                    startDate: add(new Date(), { days: 1, years: -1 }),
                                                    endDate: new Date()
                                                }),
                                                isSelected(range) {
                                                    let rangeDate = format(range.startDate, 'yyyy-MM-dd');
                                                    let strDate = format(add(new Date(), { days: 1, years: -1 }), 'yyyy-MM-dd');
                                                    return rangeDate === strDate ? true : false;
                                                }
                                            },

                                        ]}
                                    />
                                    <Box component="div" className={"BBPRPCISRBtn"}>
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
export default DefineRange;