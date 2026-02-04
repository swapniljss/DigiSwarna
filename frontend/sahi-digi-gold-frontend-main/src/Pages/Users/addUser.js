import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { customizeValidator } from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { useAxiosPrivate } from "../../Hooks/useAxiosPrivate";
import SuccessDialog from "../../Components/SuccessDialog";
import { MENU_SLUG } from "../../Constants/constants";
import Backdrops from "../../Components/Backdrops";
import PageChangeDialog from "../../Components/PageChangeDialog";
import FileUpload from "../../Components/FormFields/FileUploadNew";
import SomethingWentWrong from "../../Components/SomethingWentWrong";
import { dataUrlToFile } from "../../Utils/index";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

import "./style.css";

const NameWidget = (props) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 50);
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
const PasswordWidget = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={props.value || ""}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-control"
        style={{ paddingRight: 44 }}
      />

      <IconButton
        onClick={() => setShowPassword((v) => !v)}
        tabIndex={-1}
        sx={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </Box>
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

const DobWidget = (props) => {
  const MIN_YEAR = 1900;
  const MAX_YEAR = new Date().getFullYear();

  const handleChange = (e) => {
    props.onChange(e.target.value);
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;

    let [y, m, d] = value.split("-").map(Number);
    if (y < MIN_YEAR) y = MIN_YEAR;
    if (y > MAX_YEAR) y = MAX_YEAR;

    props.onChange(
      `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    );
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
function customValidate(formData, errors) {
  // EMAIL VALIDATION (friendly message)
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email.addError(
        "Please enter a valid email address (e.g. name@example.com)",
      );
    }
  }

  // PASSWORD VALIDATION (only while creating user)
  if (formData.password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      errors.password.addError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      );
    }
  }

  // DOB VALIDATION (already correct)
  if (formData.dob) {
    let dobYear = new Date(formData.dob).getFullYear();
    let curYear = new Date().getFullYear();

    if (dobYear < 1900 || dobYear > curYear) {
      errors.dob.addError(`Year should be between 1900 and ${curYear}`);
    }
  }

  return errors;
}

const AddUser = () => {
  let { user_id } = useParams();

  const schema = {
    type: "object",
    required: ["email", "name", "phone", "dob"],
    properties: {
      email: {
        title: "Email ID",
        type: "string",
      },
      password: {
        title: "Password",
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
      status: {
        title: "Status",
        enum: ["Yes", "No"],
        enumNames: ["Active", "Inactive"],
        default: "Yes",
      },

      file: {
        title: "Profile Image",
        type: "string",
      },
      permissions: {
        type: "object",
        title: "User Permissions",
        properties: {
          dashboard_permissions: {
            type: "array",
            title: "Dashboard",
            items: {
              type: "string",
              enum: ["View"],
            },
            uniqueItems: true,
          },
          customers_permissions: {
            type: "array",
            title: "Customers",
            items: {
              type: "string",
              enum: ["View", "Edit"],
            },
            uniqueItems: true,
          },
          reports_permissions: {
            type: "array",
            title: "Reports",
            items: {
              type: "string",
              enum: ["Buy", "Sell", "Transfer", "Redeem"],
            },
            uniqueItems: true,
          },
          users_permissions: {
            type: "array",
            title: "Users",
            items: {
              type: "string",
              enum: ["View", "Add", "Edit", "Delete", "Change Password"],
            },
            uniqueItems: true,
          },
        },
      },
    },
  };

  const customFormats = {
    Number: /^[0-9]+$/,
  };

  const validator = customizeValidator({ customFormats });

  let navigate = useNavigate();
  const location = useLocation();

  const pathWithoutLastPart = location.pathname.slice(
    0,
    location.pathname.lastIndexOf("/"),
  );
  const axiosPrivate = useAxiosPrivate();

  let widgets = {
    fileUpload: FileUpload,
  };
  const [imageKey, setImageKey] = useState("");

  const uiSchema = {
    "ui:submitButtonOptions": {
      props: {
        className: "BBPFBtn",
      },
    },
    file: {
      "ui:widget": "fileUpload",
      "ui:options": {
        accept: ".png, .jpeg, .jpg",
        imageKey: imageKey,
      },
    },

    dob: {
      "ui:widget": "DobWidget",
    },

    name: {
      "ui:widget": "NameWidget",
      "ui:placeholder": "Enter Full Name",
    },
    phone: {
      "ui:widget": "PhoneWidget",
      "ui:placeholder": "Enter Mobile Number",
    },

    password: {
      "ui:widget":
        pathWithoutLastPart === `/${MENU_SLUG.users}/edit`
          ? "hidden"
          : "PasswordWidget",
    },

    permissions: {
      "ui:options": {
        classNames: "BBPUserPer",
      },
      dashboard_permissions: {
        "ui:widget": "checkboxes",
      },
      customers_permissions: {
        "ui:widget": "checkboxes",
      },
      reports_permissions: {
        "ui:widget": "checkboxes",
      },
      users_permissions: {
        "ui:widget": "checkboxes",
      },
    },
  };

  const [formData, setFormData] = useState({});

  const [errorDialog, setErrorDialog] = useState(false);

  const [submitDialog, setSubmitDialog] = useState(false);
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);
  const [changePage, setChangePage] = useState(false);

  const [loading, setSetLoading] = useState(false);
  const [duplicateUser, setDuplicateUser] = useState({ error: false, msg: "" });

  const handleCancel = () => {
    navigate(`/${MENU_SLUG.users}`, { replace: true });
  };

  let yourForm;

  const onFormSubmit = (formData) => {
    setFormData(formData);
    let tempData = { ...formData };
    tempData.email = tempData.email?.toLowerCase();
    if (tempData.file) {
      tempData.file = dataUrlToFile(tempData.file, "bbp");
    }
    if (tempData.permissions) {
      tempData.permissions = JSON.stringify(tempData.permissions);
    }
    if (pathWithoutLastPart === `/${MENU_SLUG.users}/edit`) {
      handleUpdateUser(tempData);
    } else {
      handleCreateUser(tempData);
    }
  };

  const handleCreateUser = useCallback(async (data) => {
    try {
      setOnSubmitLoading(true);
      setChangePage(true);
      let url = `users`;
      let options = {
        method: "POST",
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setSubmitDialog(true);
            setOnSubmitLoading(false);
            setChangePage(false);
            setDuplicateUser({ error: false, msg: "" });
          } else {
            setOnSubmitLoading(false);
            setChangePage(false);
            setDuplicateUser({ error: true, msg: response.data.message });
          }
        })
        .catch((err) => {
          if (err.response) {
            setErrorDialog(true);
            setOnSubmitLoading(false);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setErrorDialog(true);
      setOnSubmitLoading(false);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, []);

  const handleUpdateUser = useCallback(
    async (data) => {
      try {
        setOnSubmitLoading(true);
        setChangePage(true);
        let url = `users/${user_id}`;
        let options = {
          method: "PUT",
          url,
          data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        await axiosPrivate(options)
          .then((response) => {
            if (response.data.status === 1) {
              setSubmitDialog(true);
              setOnSubmitLoading(false);
              setChangePage(false);
              setDuplicateUser({ error: false, msg: "" });
            } else {
              setOnSubmitLoading(false);
              setChangePage(false);
              setDuplicateUser({ error: true, msg: response.data.message });
              console.error("err.res", response);
            }
          })
          .catch((err) => {
            if (err.response) {
              setOnSubmitLoading(false);
              setErrorDialog(true);
              console.error("err.res", err.response.data);
            }
          });
      } catch (error) {
        setOnSubmitLoading(false);
        setErrorDialog(true);
        console.error("error", error);
      }
      // eslint-disable-next-line
    },
    [user_id],
  );

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  const fetchUserValue = useCallback(async () => {
    setSetLoading(true);
    try {
      let url = `users/${user_id}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            let tempData = {};
            tempData.name = response.data.data.name;
            tempData.email = response.data.data.email;
            tempData.phone = response.data.data.phone;
            tempData.dob = response.data.data.dob;
            tempData.status = response.data.data.status ? "Yes" : "No";
            tempData.permissions = JSON.parse(response.data.data.permissions);
            setImageKey(response.data.data.image);
            setFormData(tempData);
            setSetLoading(false);
          } else {
            setSetLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) {
            setSetLoading(false);
            setErrorDialog(true);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setSetLoading(false);
      setErrorDialog(true);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, [user_id]);

  const handleSubmitDialogClose = () => {
    setSubmitDialog(false);
    navigate(`/${MENU_SLUG.users}`, { replace: true });
  };

  useEffect(() => {
    if (pathWithoutLastPart === `/${MENU_SLUG.users}/edit`) {
      fetchUserValue();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <PageChangeDialog showDialog={changePage} setShowDialog={setChangePage} />
      <Backdrops
        open={onSubmitLoading}
        title={
          pathWithoutLastPart === `/${MENU_SLUG.users}/edit`
            ? "Updating"
            : "Saving"
        }
      />
      <SuccessDialog
        open={submitDialog}
        onClose={handleSubmitDialogClose}
        title={
          pathWithoutLastPart === `/${MENU_SLUG.users}/edit`
            ? "User updated successfully"
            : "User added successfully"
        }
        message={
          pathWithoutLastPart === `/${MENU_SLUG.users}/edit`
            ? "User has been updated successfully. Now you can initiate User for the added user."
            : "User has been added successfully. Now you can initiate User for the added user."
        }
        buttonTitle={"Close"}
      />
      <Box component="div" className={"BBPUserAdd"}>
        <Box component="div" className={"BBPUAHead"}>
          <Box component="div" className={"BBPUAHTitle"}>
            {pathWithoutLastPart === `/${MENU_SLUG.users}/edit`
              ? "Edit User"
              : "Add User"}
          </Box>
        </Box>
        <Box component="div" className={"BBPUABody"}>
          <Box component="div" className={"BBPUABPannel"}>
            <Box component="div" className={"BBPUABPInner"}>
              {loading ? (
                <Box component="div" className={"BBPUABPIFields"}>
                  {Array.from(Array(6).keys()).map((item) => (
                    <Box
                      component="div"
                      key={item}
                      className={"BBPCABPIFField"}
                    >
                      <Skeleton
                        variant="rectangular"
                        className={"BBPLabel"}
                        height={22}
                      />
                      <Skeleton variant="rectangular" height={55} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box component="div" className={"BBPUABPIFields"}>
                  <Box component="div" className={"BBPForm"}>
                    <Form
                      schema={schema}
                      uiSchema={uiSchema}
                      formData={formData}
                      validator={validator}
                      widgets={{
                        ...widgets,
                        NameWidget,
                        PhoneWidget,
                        DobWidget,
                        PasswordWidget,
                      }}
                      showErrorList={false}
                      omitExtraData={true}
                      customValidate={customValidate}
                      onSubmit={({ formData }) => {
                        onFormSubmit(formData);
                      }}
                      ref={(form) => {
                        yourForm = form;
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            {duplicateUser.error && (
              <Box component="div" className={"BBPUABPErr"}>
                {duplicateUser.msg}
              </Box>
            )}
            <Box component="div" className={"BBPUABPBtns"}>
              <Button className={"BBPButton"} onClick={handleCancel}>
                Cancel
              </Button>
              {pathWithoutLastPart === `/${MENU_SLUG.users}/edit` ? (
                <Button
                  disabled={loading}
                  className={"BBPButton"}
                  onClick={onSubmitNew}
                >
                  Update
                </Button>
              ) : (
                <Button
                  disabled={loading}
                  className={"BBPButton"}
                  onClick={onSubmitNew}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default AddUser;
