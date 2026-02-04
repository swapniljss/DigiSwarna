import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import './style.css';

const SelectOption = ({ customClass, disabled, options, selectedOption, handledSelect }) => {
    const [open, setOpen] = React.useState(false);
    const [width, setWidth] = React.useState('0');
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        setWidth(anchorRef.current.clientWidth);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Box component="div" className={`${customClass} BBPSelectOption`}>
            <Button
                ref={anchorRef}
                aria-haspopup="true"
                onClick={handleToggle}
                fullWidth
                disabled={disabled}
                className={`SelectOptionLabel ${open ? 'open' : ''}`}
            >
                {selectedOption ? selectedOption : 'Select Option'}
            </Button>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                style={{ minWidth: width }}
                className={'BBPSOptions'}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                    className={'BBPSOList'}
                                >
                                    {options.map((item, index) =>
                                        <MenuItem
                                            className={item === selectedOption ? 'BBPSPSelected' : ''}
                                            key={index}
                                            onClick={(event) => {
                                                handledSelect(item);
                                                handleClose(event);
                                            }}
                                        >{item}</MenuItem>
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    );
}

export default SelectOption;