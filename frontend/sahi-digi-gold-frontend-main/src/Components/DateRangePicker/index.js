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
    const MIN_DATE = new Date("2022-10-07");
const MAX_DATE = new Date();

const clampDate = (date) => {
    if (!date || isNaN(new Date(date))) return MIN_DATE;
    if (date < MIN_DATE) return MIN_DATE;
    if (date > MAX_DATE) return MAX_DATE;
    return date;
};


const handleRangePicker = (item) => {
    let start = new Date(item.selection.startDate);
    let end = new Date(item.selection.endDate);

    const sanitizeDate = (date) => {
        if (!date || isNaN(date)) return MIN_DATE;

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        // ✅ Year strictly 4 digits
        if (year.toString().length > 4) {
            year = parseInt(year.toString().slice(0, 4));
        }

        // ✅ Month clamp 0–11
        if (month < 0) month = 0;
        if (month > 11) month = 11;

        // ✅ Day clamp 1–31
        if (day < 1) day = 1;
        if (day > 31) day = 31;

        const fixedDate = new Date(year, month, day);

        return clampDate(fixedDate);
    };

    start = sanitizeDate(start);
    end = sanitizeDate(end);

    // 🔥 FIX ORDER (prevents auto swap by library)
    if (start > end) {
        end = start;
    }

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
                                        // minDate={MIN_DATE}

                                        // minDate={dataStartDate ? dataStartDate : new Date()}
                                        // maxDate={new Date()}
                                        minDate={MIN_DATE}
maxDate={MAX_DATE}
// editableDateInputs={false}

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