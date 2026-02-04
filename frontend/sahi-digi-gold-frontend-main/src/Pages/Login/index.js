import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../Api/axios";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import jwt_decode from "jwt-decode";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuth } from "../../Hooks/useAuth";
import LeftSide from "./leftSide";
import SomethingWentWrong from "../../Components/SomethingWentWrong";

import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./style.css";

/* ------------------ Schema ------------------ */

const schema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      title: "Email",
      type: "string",
      format: "email",
    },
    password: {
      title: "Password",
      type: "string",
       minLength: 8
    },
  },
};

const uiSchema = {
  "ui:submitButtonOptions": {
    props: {
      className: "BBPFBtn",
    },
  },
  email: {
    "ui:placeholder": "Enter Email Address",
  },
  password: {
    "ui:widget": "PasswordWidget",
    "ui:placeholder": "Enter Password",
  },
};

/* ------------------ Password Widget ------------------ */

const PasswordWidget = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      component="div"
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <input
        type={showPassword ? "text" : "password"}
        value={props.value || ""}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-control"
        style={{ paddingRight: "42px" }}
      />

      <IconButton
        onClick={() => setShowPassword((prev) => !prev)}
        sx={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "4px",
        }}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </Box>
  );
};

/* ------------------ Login Component ------------------ */

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state && location.state.from.pathname) || "/dashboard";

  const [extraErrors, setExtraErrors] = useState({});
  const [errorDialog, setErrorDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  let yourForm;

  const onSubmitNew = () => {
    yourForm.formElement.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const onFormSubmit = (data) => {
    setFormData(data);
    handleLogin(data);
  };

  const handleLogin = useCallback(
    async (data) => {
      try {
        setLoading(true);

        const normalizedData = {
          ...data,
          email: data?.email?.toLowerCase(), // ✅ normalize email
        };

        const options = {
          method: "POST",
          url: "auth/login",
          data: normalizedData,
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        };

        const response = await axios(options);

        if (response.data.status === 1) {
          const tempToken = response.data.token.replace("Bearer", "");
          const decoded = jwt_decode(tempToken);

          setAuth({
            name: decoded.name,
            image: decoded.image,
            id: decoded.id,
            permissions: decoded.permissions,
            role: [decoded.role],
            token: response.data.token,
          });

          localStorage.setItem("persist", true);
          setPersist(true);
          setExtraErrors({});
          navigate(from, { replace: true });
        } else {
          setExtraErrors({
            email: { __errors: [response.data.message.email] },
            password: { __errors: [response.data.message.password] },
          });
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorDialog(true);
        console.error("login error", error);
      }
    },
    [extraErrors, navigate, from, setAuth, setPersist]
  );

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />

      <Box component="div" className="BBPLoginPage">
        <LeftSide />

        <Box component="div" className="BBPLPForm">
          <Box component="div" className="BBPLPFInner">
            <Box component="div" className="BBPLPFITitle">
              Welcome to new way of management and payment of Bills
            </Box>

            <Box component="div" className="BBPLPFIInput">
              <Box component="div" className="BBPForm">
                <Form
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={formData}
                  validator={validator}
                  showErrorList={false}
                  omitExtraData
                  widgets={{ PasswordWidget }}
                  extraErrors={extraErrors}
                  onSubmit={({ formData }) => onFormSubmit(formData)}
                  ref={(form) => {
                    yourForm = form;
                  }}
                />

                <Box component="div" className="BBPLPFIIBtn">
                  <LoadingButton
                    className="BBPButton"
                    loading={loading}
                    disabled={loading}
                    onClick={onSubmitNew}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Login;
