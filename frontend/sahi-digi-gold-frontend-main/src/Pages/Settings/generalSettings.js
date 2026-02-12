import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { customizeValidator } from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import { useAxiosPrivate } from "../../Hooks/useAxiosPrivate";
import { useAuth } from "../../Hooks/useAuth";
// import FileUpload from "../../Components/FormFields/FileUploadNew";
// import { dataUrlToFile } from "../../Utils/index";
import Backdrops from "../../Components/Backdrops";
import PageChangeDialog from "../../Components/PageChangeDialog";
import SuccessDialog from "../../Components/SuccessDialog";
import SomethingWentWrong from "../../Components/SomethingWentWrong";
import "./style.css";

const NameWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, "");
    props.onChange(value);
  };

  return (
    <input
      type="text"
      value={props.value || ""}
      placeholder={props.placeholder}
      maxLength={50}
      onChange={handleChange}
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
      placeholder={props.placeholder}
      inputMode="numeric"
      maxLength={10}
      onChange={handleChange}
      className="form-control"
    />
  );
};

/* =======================
   SCHEMA (VALIDATION)
   ======================= */

const schema = {
  type: "object",
  required: ["email", "name", "phone", "dob"],
  properties: {
    email: {
      title: "Email ID",
      type: "string",
    },
    name: {
      title: "Full Name",
      type: "string",
      pattern: "^[A-Za-z ]+$",
    },
    phone: {
      title: "Mobile Number",
      type: "string",
      format: "Number",
      minLength: 10,
      maxLength: 10,
    },
    dob: {
      title: "Date of Birth",
      type: "string",
      format: "date",
    },
    // file: {
    //   title: "Profile Image",
    //   type: "string",
    // },
  },
};

function customValidate(formData, errors) {
  // EMAIL validation (submit-time only)
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email.addError(
        "Please enter a valid email address (e.g. name@example.com)",
      );
    }
  }
    // PHONE validation (reject 0000000000 and invalid numbers)
  if (formData.phone) {
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone.addError("Please enter a valid 10-digit mobile number");
    }
  }

  // DOB validation (already correct behaviour)
  if (formData.dob) {
    const year = new Date(formData.dob).getFullYear();
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      errors.dob.addError(`Year should be between 1900 and ${currentYear}`);
    }
  }

  return errors;
}

const customFormats = {
  Number: /^[0-9]+$/,
};

const validator = customizeValidator({ customFormats });
const DobWidget = (props) => {
  const currentYear = new Date().getFullYear();
  const MIN_YEAR = 1900;
  const MAX_YEAR = currentYear;

  const handleChange = (e) => {
    // Let user type freely
    props.onChange(e.target.value);
  };

  const handleBlur = (e) => {
    let value = e.target.value;

    // Only validate when full date is present
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      let [year, month, day] = value.split("-").map(Number);

      if (year < MIN_YEAR) year = MIN_YEAR;
      if (year > MAX_YEAR) year = MAX_YEAR;

      const corrected = `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      props.onChange(corrected);
    }
  };
  

  return (
    <input
      type="date"
      value={props.value || ""}
      min={`${MIN_YEAR}-01-01`}
      max={`${MAX_YEAR}-12-31`}
      onChange={handleChange}
      onBlur={handleBlur}
      className="form-control"
    />
  );
};

/* =======================
   COMPONENT
   ======================= */

const GeneralSettings = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // const [imageKey, setImageKey] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setSetLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);
  const [changePage, setChangePage] = useState(false);
  const [duplicateUser, setDuplicateUser] = useState({ error: false, msg: "" });

  /* =======================
     UI SCHEMA (WIDGET MAPPING)
     ======================= */

  const uiSchema = {
    "ui:submitButtonOptions": {
      props: {
        className: "BBPFBtn",
      },
    },

    name: {
      "ui:widget": "NameWidget",
      "ui:placeholder": "Enter Full Name",
    },

    phone: {
      "ui:widget": "PhoneWidget",
      "ui:placeholder": "Enter Mobile Number",
    },
    dob: {
      "ui:widget": "DobWidget",
    },

    // file: {
    //   "ui:widget": "fileUpload",
    //   "ui:options": {
    //     accept: ".png, .jpeg, .jpg",
    //     imageKey: imageKey,
    //   },
    // },
  };

  let yourForm;

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  const onFormSubmit = (data) => {
    setFormData(data);

    let tempData = {
      ...data,
      email: data.email?.toLowerCase(), // normalize email
    };

    // if (tempData.file) {
    //   tempData.file = dataUrlToFile(tempData.file, "bbp");
    // }

    handleUpdateUser(tempData);
  };

  const fetchUserValue = useCallback(async () => {
    try {
      setSetLoading(true);
      setChangePage(true);

      const response = await axiosPrivate({ method: "GET", url: "settings" });

      if (response.data.status === 1) {
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          dob: response.data.data.dob,
        });
        // setImageKey(response.data.data.image);
      }

      setSetLoading(false);
      setChangePage(false);
    } catch (error) {
      setErrorDialog(true);
      setSetLoading(false);
      setChangePage(false);
    }
  }, []);

  const handleUpdateUser = useCallback(
    async (data) => {
      try {
        setOnSubmitLoading(true);
        setChangePage(true);

        const response = await axiosPrivate({
          method: "PUT",
          url: "settings",
          data,
          headers: { "Content-Type": "multipart/form-data" }, 
          // you can remove this line as img is no longer exist
        });

        if (response.data.status === 1) {
          setSubmitDialog(true);
          setDuplicateUser({ error: false, msg: "" });
        } else {
          setDuplicateUser({ error: true, msg: response.data.message });
        }

        setOnSubmitLoading(false);
        setChangePage(false);
      } catch (error) {
        setErrorDialog(true);
        setOnSubmitLoading(false);
        setChangePage(false);
      }
    },
    [auth.id],
  );

  const handleSubmitDialogClose = () => {
    setSubmitDialog(false);
    navigate(0);
  };

  useEffect(() => {
    fetchUserValue();
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <PageChangeDialog showDialog={changePage} setShowDialog={setChangePage} />
      <Backdrops open={onSubmitLoading} title="Updating" />
      <SuccessDialog
        open={submitDialog}
        onClose={handleSubmitDialogClose}
        title="Updated Successfully"
        message="Updated Successfully"
        buttonTitle="Close"
      />

      <Box component="div" className="BBPSPTView">
        <Box component="div" className="BBPSPTVForm">
          {loading ? (
            <Box component="div" className="BBPSPTVFFLoad">
              {Array.from(Array(6).keys()).map((item) => (
                <Stack spacing={1} key={item}>
                  <Skeleton variant="rectangular" height={22} />
                  <Skeleton variant="rectangular" height={55} />
                </Stack>
              ))}
            </Box>
          ) : (
            <Box component="div" className="BBPForm">
              <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                validator={validator}
                customValidate={customValidate}
                widgets={{
                  // fileUpload: FileUpload,
                  NameWidget,
                  PhoneWidget,
                  DobWidget,
                }}
                showErrorList={false}
                omitExtraData
                onSubmit={({ formData }) => onFormSubmit(formData)}
                ref={(form) => (yourForm = form)}
              />
            </Box>
          )}
        </Box>

        {duplicateUser.error && (
          <Box component="div" className="BBPSPTVErr">
            {duplicateUser.msg}
          </Box>
        )}

        <Box component="div" className="BBPSPTVBtn">
          <Button
            variant="contained"
            className="BBPButton"
            onClick={onSubmitNew}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};

export default GeneralSettings;
