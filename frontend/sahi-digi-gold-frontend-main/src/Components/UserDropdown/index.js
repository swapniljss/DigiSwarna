import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import useLogout from '../../Hooks/useLogout';
import { useAuth } from '../../Hooks/useAuth';
import './style.css';

export default function UserDropdown() {
    const logout = useLogout();
    const { auth } = useAuth();

    const [open, setOpen] = React.useState(false);
    const [width, setWidth] = React.useState(0);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setWidth(anchorRef.current.clientWidth);
        setOpen((prevOpen) => !prevOpen);
    };
    const signOut = async () => {
        await logout();
    }
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
        <Fragment>
            <Box component="div" className={'BBPUserDropdown'} ref={anchorRef} onClick={handleToggle}>
                {/* <Box component="div" className={'BBPUDImg'}>
                    {auth.image ?
                        <Avatar alt="Remy Sharp" src={`${process.env.REACT_APP_API_BASE_URL}/image/${auth.image}`} sx={{ width: 30, height: 30 }} />
                        :
                        <Avatar sx={{ width: 30, height: 30 }} >{auth.name[0]}</Avatar>
                    }
                </Box> */}
                <Box component="div" className={'BBPUDImg'}>
  <Avatar sx={{ width: 30, height: 30 }}>
    {auth?.name?.split(" ")[0]?.charAt(0)?.toUpperCase()}
  </Avatar>
</Box>

                <Box component="div" className={'BBPUDName'}>
                    {auth.name}
                </Box>
                <Box component="div" className={'BBPUDIcon'}>
                    <KeyboardArrowDownOutlinedIcon />
                </Box>
            </Box>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                style={{ width: width }}
                className={'BBPUDPopper'}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Box component="div" className={'BBPUDMenus'}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem onClick={signOut}>Logout</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Box>
                    </Grow>
                )}
            </Popper>
        </Fragment>
    );
}