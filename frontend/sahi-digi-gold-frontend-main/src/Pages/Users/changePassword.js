import React, { useState, useCallback, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosPrivate } from "../../Hooks/useAxiosPrivate";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import SomethingWentWrong from "../../Components/SomethingWentWrong";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./style.css";

const PasswordToggleWidget = (props) => {
  const [show, setShow] = useState(false);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <input
        type={show ? "text" : "password"}
        value={props.value || ""}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-control"
        style={{ paddingRight: 44 }}
      />

      <IconButton
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        sx={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {show ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </Box>
  );
};
const ChangePassword = () => {
  const schema = {
    type: "object",
    required: ["password", "confirm_password"],
    properties: {
      password: {
        title: "Password",
        type: "string",
      },
      confirm_password: {
        title: "Confirm Password",
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
    password: {
      "ui:widget": "PasswordToggleWidget",
      "ui:placeholder": "Enter Password",
    },
    confirm_password: {
      "ui:widget": "PasswordToggleWidget",
      "ui:placeholder": "Enter Confirm Password",
    },
  };

  function customValidate(formData, errors) {
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password.addError("Passwords don't match");
    }
    return errors;
  }
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  let { user_id } = useParams();

  const [errorDialog, setErrorDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  let yourForm;

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  const onFormSubmit = (formData) => {
    setFormData(formData);
    handleChangePassword(formData);
  };

  const handleCloseModal = () => {
    navigate(-1);
  };

  const handleChangePassword = useCallback(
    async (data) => {
      try {
        setLoading(true);
        let url = `users/changepass/${user_id}`;
        let options = {
          method: "PUT",
          data,
          url,
        };
        await axiosPrivate(options)
          .then((response) => {
            if (response.data.status === 1) {
              navigate(-1);
            }
            setLoading(false);
          })
          .catch((err) => {
            if (err.response) {
              setLoading(false);
              setErrorDialog(true);
              console.error("err.res", err.response.data);
              navigate(-1);
            }
          });
      } catch (error) {
        setLoading(false);
        setErrorDialog(true);
        console.error("error", error);
        navigate(-1);
      }
      // eslint-disable-next-line
    },
    [user_id],
  );

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={true}
        onClose={handleCloseModal}
      >
        <Box component="div" className={"BBPChangePassword"}>
          <Box component="div" className={"BBPCPHead"}>
            <Box component="div" className={"BBPCPHTitle"}>
              Change Password
            </Box>
            <IconButton onClick={handleCloseModal}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box component="div" className={"BBPCPInfo"}>
            <Box component="div" className={"BBPForm"}>
              <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                validator={validator}
                widgets={{
                  PasswordToggleWidget,
                }}
                customValidate={customValidate}
                showErrorList={false}
                omitExtraData={true}
                onSubmit={({ formData }) => {
                  onFormSubmit(formData);
                }}
                ref={(form) => {
                  yourForm = form;
                }}
              />
            </Box>
          </Box>
          <Box component="div" className={"BBPCPBtn"}>
            <LoadingButton
              className={"BBPButton"}
              loading={loading}
              disabled={loading}
              onClick={onSubmitNew}
            >
              Change Password
            </LoadingButton>
            <Button
              variant="contained"
              className={"BBPButton"}
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};
export default ChangePassword;
