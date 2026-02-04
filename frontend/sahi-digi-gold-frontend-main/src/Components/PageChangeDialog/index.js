import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { useNavigatingAway } from "../../Hooks/useNavigatingAway";
import ExclamationIcon from "../../Components/Icons/ExclamationIcon";
import './style.css';

const PageChangeDialog = ({ showDialog, setShowDialog, handleConfirm }) => {

    const [showDialogLeavingPage, confirmNavigation, cancelNavigation] = useNavigatingAway(showDialog);
    const handleDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <Dialog fullWidth={true} maxWidth={'xs'} open={showDialogLeavingPage} onClose={handleDialogClose}>
            <Box component="div" className="PageChangeDialog">
                <Box component="div" className="PCDIcon">
                    <ExclamationIcon />
                </Box>
                <Box component="div" className="PCDTitle">Leaving Page</Box>
                <Box component="div" className="PCDDes">There are some changes<br />If you proceed your changes will be lost<br />Are you sure you want to proceed?</Box>
                <Box component="div" className="PCDBtn">
                    <Button variant="outlined" className={'BBPButton BBPOButton'} onClick={cancelNavigation}>
                        No
                    </Button>
                    <Button variant="contained" className={'BBPButton'} onClick={() => { confirmNavigation(); handleConfirm && handleConfirm(); }}>
                        Yes
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default PageChangeDialog;