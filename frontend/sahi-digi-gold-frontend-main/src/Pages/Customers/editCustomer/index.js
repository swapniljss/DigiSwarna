import React, { Fragment, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import { MENU_SLUG } from "../../../Constants/constants";
import BasicDetails from "./basicDetails";
import AddressDetails from "./addressDetails";
import NomineeDetails from "./nomineeDetails";
import BankDetails from "./bankDetails";

const ViewCustomer = () => {
  let { customer_id } = useParams();

  let navigate = useNavigate();

  const handleCloseModal = () => {
    window.location.href = "/customers";
  };

  const [tabsList] = useState([
    {
      title: "Basic Details",
      component: (
        <BasicDetails customerID={customer_id} handleClose={handleCloseModal} />
      ),
    },
    {
      title: "Address Details",
      component: (
        <AddressDetails
          customerID={customer_id}
          handleClose={handleCloseModal}
        />
      ),
    },
    {
      title: "Nominee Details",
      component: (
        <NomineeDetails
          customerID={customer_id}
          handleClose={handleCloseModal}
        />
      ),
    },
    {
      title: "Bank Details",
      component: (
        <BankDetails customerID={customer_id} handleClose={handleCloseModal} />
      ),
    },
  ]);

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={"lg"} open={true}>
        <Box component="div" className={"BBPEditCustomer"}>
          <Box component="div" className={"BBPECHead"}>
            <Box component="div" className={"BBPECHTab"}>
              {tabsList.map((tab, index) => (
                <Button
                  key={index}
                  className={index === selectedTab ? "BBPECHTAct" : ""}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab.title}
                </Button>
              ))}
            </Box>
            <IconButton onClick={handleCloseModal}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box component="div" className={"BBPECBody"}>
            {tabsList[selectedTab].component}
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};
export default ViewCustomer;
