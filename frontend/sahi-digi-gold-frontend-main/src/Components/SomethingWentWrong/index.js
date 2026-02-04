import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import SWWImg from "../../Assets/Images/sww.png";
import "./style.css";

const SomethingWentWrong = ({ open, setOpen }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => setOpen(false)} 
    >
      <Box component="div" className="SomethingWentWrong">
        <Box component="div" className="SWWImg">
          <img src={SWWImg} alt={""} />
        </Box>
        <Box component="div" className="SWWTitle">
          Please try again later.
        </Box>
      </Box>
    </Dialog>
  );
};

export default SomethingWentWrong;
