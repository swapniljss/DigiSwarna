import React, { useState, useCallback, useEffect, Fragment } from "react";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
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

const RelationWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30);
    props.onChange(value);
  };
  return (
    <input
      type="text"
      value={props.value || ""}
      onChange={handleChange}
      maxLength={30}
      className="form-control"
    />
  );
};

const schema = {
  type: "object",
  required: ["nomineeName", "nomineeDateOfBirth", "nomineeRelation"],
  properties: {
    nomineeName: {
      title: "Name",
      type: "string",
    },
    nomineeDateOfBirth: {
      title: "Date of Birth",
      type: "string",
      format: "date",
    },
    nomineeRelation: {
      title: "Relation",
      type: "string",
    },
  },
};

const uiSchema = {
  "ui:submitButtonOptions": {
    props: {
      className: "BBPFBtn",
    },
  },
  nomineeName: {
    "ui:widget": "NameWidget",
  },
  nomineeRelation: {
    "ui:widget": "RelationWidget",
  },
};

function customValidate(formData, errors) {
  // NAME
  if (!formData.nomineeName || formData.nomineeName.trim() === "") {
    errors.nomineeName.addError("Name is required");
  } else if (!/^[A-Za-z ]{3,50}$/.test(formData.nomineeName)) {
    errors.nomineeName.addError(
      "Name should contain only letters and be at least 3 characters",
    );
  }

  // DOB (Must be 18+ and not future)
  if (formData.nomineeDateOfBirth) {
    const dob = new Date(formData.nomineeDateOfBirth);
    const today = new Date();

    dob.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (isNaN(dob.getTime())) {
      errors.nomineeDateOfBirth.addError("Please select a valid date");
    } else if (dob > today) {
      errors.nomineeDateOfBirth.addError(
        "Date of Birth cannot be a future date",
      );
    } else {
      const age =
        today.getFullYear() -
        dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
          ? 1
          : 0);

      if (age < 18) {
        errors.nomineeDateOfBirth.addError(
          "Nominee must be at least 18 years old",
        );
      }
    }
  }

  // RELATION
  if (!formData.nomineeRelation || formData.nomineeRelation.trim() === "") {
    errors.nomineeRelation.addError("Relation is required");
  } else if (!/^[A-Za-z ]{3,30}$/.test(formData.nomineeRelation)) {
    errors.nomineeRelation.addError(
      "Relation should contain only letters and be at least 3 characters",
    );
  }

  return errors;
}

const NomineeDetails = ({ handleClose, customerID }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorDialog, setErrorDialog] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
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
    handleCustomerNominee(formData);
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
            tempData.nomineeName = response.data.data.nomineeName;
            tempData.nomineeDateOfBirth = response.data.data.nomineeDateOfBirth;
            tempData.nomineeRelation = response.data.data.nomineeRelation;
            setFormData(tempData);
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

  const handleCustomerNominee = useCallback(async (data) => {
    try {
      setBtnDisable(true);
      let url = `customers/${customerID}/nominee`;
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
              if (response.data.message.nomineeName) {
                tempErr.nomineeName = {
                  __errors: [response.data.message.nomineeName[0].message],
                };
              }
              if (response.data.message.nomineeDateOfBirth) {
                tempErr.nomineeDateOfBirth = {
                  __errors: [
                    response.data.message.nomineeDateOfBirth[0].message,
                  ],
                };
              }
              if (response.data.message.nomineeRelation) {
                tempErr.nomineeRelation = {
                  __errors: [response.data.message.nomineeRelation[0].message],
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
          Nominee Details
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
                extraErrors={extraErrors}
                widgets={{
                  NameWidget,
                  RelationWidget,
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
export default NomineeDetails;
