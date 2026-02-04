import React, { useState, useCallback, useEffect, Fragment } from "react";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
import ApiAutocompleteNew from "../../../Components/FormFields/ApiAutocompleteNew";
import SomethingWentWrong from "../../../Components/SomethingWentWrong";

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

const DobWidget = (props) => {
  const MIN_YEAR = 1900;
  const MAX_YEAR = new Date().getFullYear();

  return (
    <input
      type="date"
      value={props.value || ""}
      min={`${MIN_YEAR}-01-01`}
      max={`${MAX_YEAR}-12-31`}
      onChange={(e) => props.onChange(e.target.value)}
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
  required: [
    "userName",
    "emailId",
    "dateOfBirth",
    "userState",
    "userCity",
    "userPincode",
  ],
  properties: {
    userName: {
      title: "Name",
      type: "string",
    },
    emailId: {
      title: "Email ID",
      type: "string",
      format: "email",
    },
    dateOfBirth: {
      title: "Date of Birth",
      type: "string",
      format: "date",
    },
    userState: {
      title: "State",
      type: "string",
    },
    userCity: {
      title: "City",
      type: "string",
    },
    userPincode: {
      title: "Pincode",
      type: "string",
    },
  },
};

function customValidate(formData, errors) {
  // EMAIL
  if (formData.emailId) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.emailId)) {
      errors.emailId.addError("Enter a valid email address");
    }
  }

  // DOB
  if (formData.dateOfBirth) {
    let dobYear = new Date(formData.dateOfBirth).getFullYear();
    let curYear = new Date().getFullYear();
    if (dobYear < 1900 || dobYear > curYear) {
      errors.dateOfBirth.addError(`Year should be between 1900 and ${curYear}`);
    }
  }

  // PINCODE
  if (formData.userPincode) {
    if (!/^\d{6}$/.test(formData.userPincode)) {
      errors.userPincode.addError("Pincode must be exactly 6 digits");
    }
  }

  return errors;
}

function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

const BasicDetails = ({ handleClose, customerID }) => {
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({});
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnDisable, setBtnDisable] = useState(true);

  const [selectedState, setSelectedState] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [extraErrors, setExtraErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  let widgets = {
    apiAutocomplete: ApiAutocompleteNew,
  };

  const uiSchema = {
    userName: {
      "ui:widget": "NameWidget",
    },

    emailId: {
      "ui:widget": "EmailWidget",
    },

    dateOfBirth: {
      "ui:widget": "DobWidget",
    },

    userPincode: {
      "ui:widget": "PincodeWidget",
    },

    "ui:submitButtonOptions": {
      props: {
        className: "BBPFBtn",
      },
    },
    userState: {
      "ui:widget": "apiAutocomplete",
      "ui:options": {
        itemLabel: "name",
        api: `${process.env.REACT_APP_API_BASE_URL}/states`,
        defaultValue: selectedState,
        type: "has-more",
      },
    },
    userCity: {
      "ui:widget": "apiAutocomplete",
      "ui:disabled": selectedStateId ? false : true,
      "ui:options": {
        itemLabel: "name",
        api: `${process.env.REACT_APP_API_BASE_URL}/cities`,
        cat_id: selectedStateId,
        defaultValue: selectedCity,
        type: "has-more",
      },
    },
  };

  let yourForm;

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  const onFormSubmit = (formData) => {
    if (!selectedStateId || !selectedCityId) {
      setExtraErrors({
        userState: { __errors: ["State is required"] },
        userCity: { __errors: ["City is required"] },
      });
      return;
    }
    let tempData = { ...formData };
    if (isValidJson(tempData.userState)) {
      let stateObj = JSON.parse(tempData.userState);
      tempData.userState = stateObj.id;
      tempData.userStateName = stateObj.name;
    } else {
      tempData.userState = selectedStateId;
      tempData.userStateName = selectedState;
    }
    if (isValidJson(tempData.userCity)) {
      let cityObj = JSON.parse(tempData.userCity);
      tempData.userCity = cityObj.id;
      tempData.userCityName = cityObj.name;
    } else {
      tempData.userCity = selectedCityId;
      tempData.userCityName = selectedCity;
    }
    setFormData(formData);
    handleCustomerProfile(tempData);
  };

  const onFormChange = (formData) => {
    // 🔥 CLEAR OLD ERRORS ON CHANGE
    if (Object.keys(extraErrors).length > 0) {
      setExtraErrors({});
    }
    let tempData = { ...formData };
    if (isValidJson(formData.userState)) {
      let stateObj = JSON.parse(formData.userState);

      setSelectedStateId(stateObj.id);
      setSelectedState(stateObj.name);

      // 🔥 IMPORTANT: clear city completely
      tempData.userCity = undefined;
      setSelectedCity("");
      setSelectedCityId("");
    }

    if (isValidJson(formData.userCity)) {
      let cityObj = JSON.parse(formData.userCity);
      tempData.userCity = formData.userCity;
      setSelectedCity(cityObj.name);
      setSelectedCityId(cityObj.id);
    }
    setFormData(tempData);
  };

  const fetchDetails = useCallback(async () => {
    try {
      let url = `customers/${customerID}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            let tempData = {};
            tempData.userName = response.data.data.userName;
            tempData.emailId = response.data.data.userEmail;
            tempData.dateOfBirth = response.data.data.dateOfBirth;
            setSelectedStateId(response.data.data.userStateId);
            setSelectedState(response.data.data.userState);

            setSelectedCityId(response.data.data.userCityId);
            setSelectedCity(response.data.data.userCity);

            // ✅ Put state & city into formData so RJSF validation passes
            tempData.userState = JSON.stringify({
              id: response.data.data.userStateId,
              name: response.data.data.userState,
            });

            tempData.userCity = JSON.stringify({
              id: response.data.data.userCityId,
              name: response.data.data.userCity,
            });

            tempData.userPincode = response.data.data.userPincode;
            setFormData(tempData);
            setSelectedStateId(response.data.data.userStateId);
            setSelectedState(response.data.data.userState);
            setSelectedCityId(response.data.data.userCityId);
            setSelectedCity(response.data.data.userCity);
            setBtnDisable(false);
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

  const handleCustomerProfile = useCallback(async (data) => {
    try {
      setBtnDisable(true);
      let url = `customers/${customerID}`;
      let options = {
        method: "PUT",
        url,
        data,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setApiSuccess(true);

            setTimeout(() => {
              window.location.href = "/customers";
            }, 300);
          } else {
            if (typeof response.data.message === "string") {
              setErrorMessage(response.data.message);
            } else {
              let tempErr = { ...extraErrors };
              if (response.data.message.userName) {
                tempErr.userName = {
                  __errors: [response.data.message.userName[0].message],
                };
              }
              if (response.data.message.emailId) {
                tempErr.emailId = {
                  __errors: [response.data.message.emailId[0].message],
                };
              }
              if (response.data.message.dateOfBirth) {
                tempErr.ifscCode = {
                  __errors: [response.data.message.dateOfBirth[0].message],
                };
              }
              if (response.data.message.userState) {
                tempErr.userState = {
                  __errors: [response.data.message.userState[0].message],
                };
              }
              if (response.data.message.userCity) {
                tempErr.userCity = {
                  __errors: [response.data.message.userCity[0].message],
                };
              }
              if (response.data.message.userPincode) {
                tempErr.userPincode = {
                  __errors: [response.data.message.userPincode[0].message],
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
          Basic Details
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
                  ...widgets,
                  NameWidget,
                  EmailWidget,
                  DobWidget,
                  PincodeWidget,
                }}
                extraErrors={extraErrors}
                onChange={({ formData }) => {
                  onFormChange(formData);
                }}
                onSubmit={({ formData }) => {
                  onFormSubmit(formData);
                }}
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
            disabled={btnDisable || !selectedStateId || !selectedCityId}
            onClick={onSubmitNew}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
export default BasicDetails;
