import React, { useState, useCallback, useEffect, Fragment } from "react";
import { customizeValidator } from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
import SomethingWentWrong from "../../../Components/SomethingWentWrong";

const AccountNumberWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 18);
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      maxLength={18}
      inputMode="numeric"
      onChange={handleChange}
      className="form-control"
    />
  );
};

const AccountNameWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 100);
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      maxLength={100}
      onChange={handleChange}
      className="form-control"
    />
  );
};

const IfscWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 11);
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      maxLength={11}
      onChange={handleChange}
      className="form-control"
    />
  );
};

const schema = {
  type: "object",
  required: ["accountNumber", "accountName", "ifscCode"],
  properties: {
    accountNumber: {
      title: "Account Number",
      type: "string",
    },
    accountName: {
      title: "Account Name",
      type: "string",
    },
    ifscCode: {
      title: "IFSC Code",
      type: "string",
    },
  },
};

const customFormats = {
  Number: /^[0-9]+$/,
};

const validator = customizeValidator({ customFormats });
function customValidate(formData, errors) {
  // ACCOUNT NUMBER
  if (!formData.accountNumber || formData.accountNumber.trim() === "") {
    errors.accountNumber.addError("Account number is required");
  } else if (!/^[0-9]{9,18}$/.test(formData.accountNumber)) {
    errors.accountNumber.addError(
      "Account number must be between 9 and 18 digits",
    );
  }

  // ACCOUNT NAME
  if (!formData.accountName || formData.accountName.trim() === "") {
    errors.accountName.addError("Account name is required");
  } else if (!/^[A-Za-z ]{3,100}$/.test(formData.accountName)) {
    errors.accountName.addError(
      "Account name should contain only letters and spaces (min 3 characters)",
    );
  }

  // IFSC
  const ifsc = formData.ifscCode?.trim();

  if (!ifsc) {
    errors.ifscCode.addError("IFSC code is required");
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    errors.ifscCode.addError("Enter a valid IFSC code (e.g. HDFC0001234)");
  }

  return errors;
}

const uiSchema = {
  "ui:submitButtonOptions": {
    props: {
      className: "BBPFBtn",
    },
  },
  accountNumber: {
    "ui:widget": "AccountNumberWidget",
  },
  accountName: {
    "ui:widget": "AccountNameWidget",
  },
  ifscCode: {
    "ui:widget": "IfscWidget",
  },
};

const BankDetails = ({ handleClose, customerID }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorDialog, setErrorDialog] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [bankId, setBankId] = useState("");
  const [extraErrors, setExtraErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const axiosPrivate = useAxiosPrivate();

  let yourForm;

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  const onFormSubmit = (formData) => {
    setFormData(formData);
    handleCustomerBank(formData, bankId);
  };

  const fetchDetails = useCallback(async () => {
    try {
      let url = `customers/${customerID}/banks`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            const bankData = response.data.data?.[0];

            if (bankData) {
              setFormData({
                accountNumber: bankData.accountNumber,
                accountName: bankData.accountName,
                ifscCode: bankData.ifscCode,
              });
              setBankId(bankData.userBankId);
              setBtnDisable(false);
            } else {
              // No bank details yet → allow fresh entry
              setFormData({});
              setBtnDisable(false);
            }
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            setLoading(false);
            setErrorDialog(true);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setLoading(false);
      setErrorDialog(true);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, []);

  const handleCustomerBank = useCallback(async (data, Id) => {
    try {
      setBtnDisable(true);
      let url = `customers/${customerID}/banks/${Id}`;
      let options = {
        method: "PUT",
        url,
        data,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setApiSuccess(true);
          } else {
            if (typeof response.data.message === "string") {
              setErrorMessage(response.data.message);
            } else {
              let tempErr = { ...extraErrors };
              if (response.data.message.accountNumber) {
                tempErr.accountNumber = {
                  __errors: [response.data.message.accountNumber[0].message],
                };
              }
              if (response.data.message.accountName) {
                tempErr.accountName = {
                  __errors: [response.data.message.accountName[0].message],
                };
              }
              if (response.data.message.ifscCode) {
                tempErr.ifscCode = {
                  __errors: [response.data.message.ifscCode[0].message],
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

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Box component="div" className={"BBPVCDet"}>
        <Box component="div" className={"BBPVCDTitle"}>
          Bank Details
        </Box>
        <Box component="div" className={"BBPVCDForm"}>
          {loading ? (
            <Box component="div" className={"BBPVCDFSk"}>
              {Array.from(Array(3).keys()).map((item) => (
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
                  AccountNumberWidget,
                  AccountNameWidget,
                  IfscWidget,
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
            Updated Successfully
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
      </Box>
    </Fragment>
  );
};
export default BankDetails;
