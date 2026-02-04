import React, { useState, useCallback, useEffect, Fragment } from "react";
import { customizeValidator } from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
import AlertDialog from "../../../Components/AlertDialog";
import SomethingWentWrong from "../../../Components/SomethingWentWrong";
import DevTable from "../../../Components/DevTable";

const NameWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 50);
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      onChange={handleChange}
      maxLength={50}
      className="form-control"
    />
  );
};

const PhoneWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      maxLength={10}
      inputMode="numeric"
      onChange={handleChange}
      className="form-control"
    />
  );
};

const EmailWidget = (props) => {
  return (
    <input
      type="email"
      value={props.value || ""}
      onChange={(e) => props.onChange(e.target.value)}
      className="form-control"
    />
  );
};

const AddressWidget = (props) => {
  return (
    <textarea
      value={props.value || ""}
      onChange={(e) => props.onChange(e.target.value)}
      rows={3}
      className="form-control"
    />
  );
};

const PincodeWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      maxLength={6}
      inputMode="numeric"
      onChange={handleChange}
      className="form-control"
    />
  );
};

const schema = {
  type: "object",
  required: ["name", "mobileNumber", "email", "address", "pincode"],
  properties: {
    name: {
      title: "Name",
      type: "string",
    },
    mobileNumber: {
      title: "Mobile Number",
      type: "string",
      format: "Number",
      minLength: 10,
      maxLength: 10,
    },
    email: {
      title: "Email ID",
      type: "string",
      format: "email",
    },
    address: {
      title: "Address",
      type: "string",
    },
    pincode: {
      title: "Pincode",
      type: "string",
      format: "Number",
    },
  },
};

const customFormats = {
  Number: /^[0-9]+$/,
};

const validator = customizeValidator({ customFormats });
function customValidate(formData, errors) {
  // EMAIL
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email.addError(
        "Please enter a valid email address (e.g. name@example.com)",
      );
    }
  }

  // ADDRESS (🔥 REQUIRED FIX)
  if (formData.address) {
    const addressRegex = /^[A-Za-z0-9\s,./-]{10,250}$/;
    if (!addressRegex.test(formData.address)) {
      errors.address.addError(
        "Address should be at least 10 characters and can contain letters, numbers, space, comma, dot, hyphen, and slash",
      );
    }
  }

  // PINCODE
  if (formData.pincode) {
    if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode.addError("Pincode must be exactly 6 digits");
    }
  }

  return errors;
}

const AddressDetails = ({ handleClose, customerID }) => {
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({});
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [btnDisable, setBtnDisable] = useState(true);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [address, setAddress] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [extraErrors, setExtraErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [mainColumns] = useState([
    {
      name: "name",
      title: "Name",
      width: 150,
      sorting: false,
      direction: "",
    },
    {
      name: "email",
      title: "Email ID",
      width: 150,
      sorting: false,
      direction: "",
    },
    {
      name: "address",
      title: "Address",
      width: 250,
      sorting: false,
      direction: "",
    },
    {
      name: "pincode",
      title: "Pin Code",
      width: 100,
      sorting: false,
      direction: "",
    },
    {
      name: "action",
      title: "Action",
      width: 50,
      sorting: false,
      direction: "",
    },
  ]);

  const uiSchema = {
    "ui:submitButtonOptions": {
      props: {
        className: "BBPFBtn",
      },
    },
    name: {
      "ui:widget": "NameWidget",
    },
    mobileNumber: {
      "ui:widget": "PhoneWidget",
    },
    email: {
      "ui:widget": "EmailWidget",
    },
    address: {
      "ui:widget": "AddressWidget",
    },
    pincode: {
      "ui:widget": "PincodeWidget",
    },
  };

  let yourForm;

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  const onFormSubmit = (formData) => {
    setFormData(formData);
    handleCustomerAddress(formData);
  };

  const onFormChange = (formData) => {
    setFormData(formData);
  };

  const fetchDetails = useCallback(async () => {
    try {
      let url = `customers/${customerID}/address`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setAddress(response.data.data);
            setBtnDisable(false);
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
          setLoading(false);
          setTableLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            setTableLoading(false);
            setLoading(false);
            setErrorDialog(true);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setLoading(false);
      setTableLoading(false);
      setErrorDialog(true);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, []);

  const handleCustomerAddress = useCallback(async (data) => {
    try {
      setBtnDisable(true);
      let url = `customers/${customerID}/address`;
      let options = {
        method: "POST",
        url,
        data,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setApiSuccess("Updated Successfully");
            fetchDetails();
            setTableLoading(true);
          } else {
            if (typeof response.data.message === "string") {
              setErrorMessage(response.data.message);
            } else {
              let tempErr = { ...extraErrors };
              if (response.data.message.name) {
                tempErr.name = {
                  __errors: [response.data.message.name[0].message],
                };
              }
              if (response.data.message.mobileNumber) {
                tempErr.mobileNumber = {
                  __errors: [response.data.message.mobileNumber[0].message],
                };
              }
              if (response.data.message.email) {
                tempErr.email = {
                  __errors: [response.data.message.email[0].message],
                };
              }
              if (response.data.message.address) {
                tempErr.address = {
                  __errors: [response.data.message.address[0].message],
                };
              }
              if (response.data.message.pincode) {
                tempErr.pincode = {
                  __errors: [response.data.message.pincode[0].message],
                };
              }
              setExtraErrors(tempErr);
            }
          }
          setBtnDisable(false);
        })
        .catch((err) => {
          if (err.response) {
            setErrorDialog(true);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setErrorDialog(true);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, []);

  const handleSetDeleteUser = (item) => {
    setDeleteItem(item);
    setDeleteAlert(true);
  };

  const handleDeleteAlertClose = () => {
    setDeleteAlert(false);
    setDeleteItem({});
  };

  const handleDeleteUser = useCallback(
    async (item) => {
      try {
        setDeleteAlert(false);
        setTableLoading(true);
        let url = `customers/${customerID}/address/${item.userAddressId}`;
        let options = {
          method: "DELETE",
          url,
        };
        await axiosPrivate(options)
          .then((response) => {
            if (response.data.status === 1) {
              setDeleteItem({});
              setLoading(false);
              fetchDetails();
            } else {
              console.error("err.res", response.data);
            }
          })
          .catch((err) => {
            if (err.response) {
              setLoading(false);
              setTableLoading(false);
              setErrorDialog(true);
              console.error("err.res", err.response.data);
            }
          });
      } catch (error) {
        setLoading(false);
        setTableLoading(false);
        setErrorDialog(true);
        console.error("error", error);
      }
      // eslint-disable-next-line
    },
    [deleteItem],
  );

  function generateRows(tempArray) {
    const tempRowArray = [];
    if (tempArray) {
      tempArray.map((item) =>
        tempRowArray.push({
          name: (
            <Box component="div" className="BBPDTSText">
              {item.name}
            </Box>
          ),
          email: (
            <Box
              component="div"
              className="BBPDTSText"
              style={{ textTransform: "lowercase" }}
            >
              {item.email}
            </Box>
          ),
          address: (
            <Box component="div" className="BBPDTSText">
              {item.address}
            </Box>
          ),
          pincode: (
            <Box component="div" className="BBPDTSText">
              {item.pincode}
            </Box>
          ),
          action: (
            <Box component="div" className="BBPDTIBtns">
              <Tooltip
                placement="top"
                classes={{
                  popper: "BBPTPopper",
                  tooltip: "BBPTooltip",
                }}
                title={"Delete Address"}
              >
                <IconButton
                  size="small"
                  className="BBPDTIBIcon"
                  onClick={() => {
                    handleSetDeleteUser(item);
                  }}
                >
                  <DeleteOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        }),
      );
    }
    return tempRowArray;
  }

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <AlertDialog
        open={deleteAlert}
        onClose={handleDeleteAlertClose}
        title={"Are you sure ?"}
        message={"Do you really want to delete these record ?"}
        buttons={
          <Fragment>
            <Button variant="contained" onClick={handleDeleteAlertClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              className={"BBPADBDelete"}
              onClick={() => {
                handleDeleteUser(deleteItem);
              }}
            >
              Delete
            </Button>
          </Fragment>
        }
      />
      <Box component="div" className={"BBPVCDet"}>
        <Box component="div" className={"BBPVCDTitle"}>
          Add Address
        </Box>
        <Box component="div" className={"BBPVCDForm"}>
          {loading ? (
            <Box component="div" className={"BBPVCDFSk"}>
              {Array.from(Array(6).keys()).map((item) => (
                <Stack spacing={1} key={item}>
                  <Skeleton component="div" variant="rounded" height={21} />
                  <Skeleton component="div" variant="rounded" height={47} />
                </Stack>
              ))}
            </Box>
          ) : (
            <Box component="div" className={"BBPForm"}>
              <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                validator={validator}
                showErrorList={false}
                omitExtraData={true}
                customValidate={customValidate}
                widgets={{
                  NameWidget,
                  PhoneWidget,
                  EmailWidget,
                  AddressWidget,
                  PincodeWidget,
                }}
                onChange={({ formData }) => {
                  onFormChange(formData);
                }}
                onSubmit={({ formData }) => {
                  onFormSubmit(formData);
                }}
                extraErrors={extraErrors}
                ref={(form) => {
                  yourForm = form;
                }}
              />
            </Box>
          )}
        </Box>
        {apiSuccess && (
          <Box component="div" className={"BBPVCDMsg"}>
            {apiSuccess}
          </Box>
        )}
        {errorMessage && (
          <Box component="div" className={"BBPVCDErrMsg"}>
            {errorMessage}
          </Box>
        )}
        <Box component="div" className={"BBPVCDBtn"}>
          <Button
            variant="contained"
            className={"BBPButton BBPOButton"}
            disabled={btnDisable}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="contained"
            className={"BBPButton"}
            disabled={btnDisable}
            onClick={onSubmitNew}
          >
            Submit
          </Button>
        </Box>
        <Box component="div" className={"BBPVCDTable"}>
          <DevTable
            rows={generateRows(address)}
            columns={mainColumns}
            loading={tableLoading}
          />
        </Box>
      </Box>
    </Fragment>
  );
};
export default AddressDetails;
