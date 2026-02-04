import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosPrivate } from "../../Hooks/useAxiosPrivate";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import SomethingWentWrong from "../../Components/SomethingWentWrong";
import "./style.css";

const PermissionBlock = ({ label, items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Box component="div" className={"BBPVUMDIRCol"}>
      <Box component="div" className={"BBPVUMDIRCLabel"}>
        {label}
      </Box>
      <Box component="div" className={"BBPVUMDIRCCheck"}>
        {items.map((item, index) => (
          <Box key={index} component="div" className={"BBPVUMDIRCCB"}>
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ViewUserModel = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  let { user_id } = useParams();
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providerValue, setProviderValue] = useState({});

  const handleCloseModal = () => {
    navigate(-1);
  };

  const fetchUserValue = useCallback(async () => {
    try {
      setLoading(true);
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
            tempData.status = response.data.data.status;
            // tempData.permissions = JSON.parse(response.data.data.permissions);
            const rawPermissions = JSON.parse(
              response.data.data.permissions || "{}",
            );

            tempData.permissions = {
              dashboard_permissions: Array.isArray(
                rawPermissions.dashboard_permissions,
              )
                ? rawPermissions.dashboard_permissions
                : [],
              customers_permissions: Array.isArray(
                rawPermissions.customers_permissions,
              )
                ? rawPermissions.customers_permissions
                : [],
              users_permissions: Array.isArray(rawPermissions.users_permissions)
                ? rawPermissions.users_permissions
                : [],
              reports_permissions: Array.isArray(
                rawPermissions.reports_permissions,
              )
                ? rawPermissions.reports_permissions
                : [],
            };

            setProviderValue(tempData);
            setLoading(false);
          } else {
            console.error("err.res", response);
            setLoading(false);
          }
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
  }, [user_id]);

  useEffect(() => {
    fetchUserValue();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={true}
        onClose={handleCloseModal}
      >
        <Box component="div" className={"BBPVUMDialog"}>
          <Box component="div" className={"BBPVUMDHead"}>
            <Box component="div" className={"BBPVUMDHTitle"}>
              User Details
            </Box>
            <IconButton onClick={handleCloseModal}>
              <ClearIcon />
            </IconButton>
          </Box>
          {loading ? (
            <Box component="div" className={"BBPVUMDInfo"}>
              <Box component="div" className={"BBPVUMDIRow"}>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Full Name
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    <Skeleton variant="rounded" height={22} />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Mobile Number
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    <Skeleton variant="rounded" height={22} />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol BBPVUMDIRCFull"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Email ID
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    <Skeleton variant="rounded" height={22} />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Date of Birth
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    <Skeleton variant="rounded" height={22} />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Status
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    <Skeleton variant="rounded" height={22} />
                  </Box>
                </Box>
                <Box
                  component="div"
                  className={"BBPVUMDIRCol BBPVUMDIRCFull BBPVUMDIRCTitle"}
                >
                  Permissions
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Dashboard
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Bill Payment
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Reports
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Billers
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Users
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Commissions
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                    <Skeleton
                      variant="rounded"
                      component={"div"}
                      className={"BBPVUMDIRCCB"}
                      height={18}
                      width={40}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box component="div" className={"BBPVUMDInfo"}>
              <Box component="div" className={"BBPVUMDIRow"}>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Full Name
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    {providerValue.name}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Mobile Number
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    {providerValue.phone}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol BBPVUMDIRCFull"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Email ID
                  </Box>
                  <Box
                    component="div"
                    className={"BBPVUMDIRCTitle"}
                    style={{ textTransform: "lowercase" }}
                  >
                    {providerValue.email}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Date of Birth
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    {providerValue.dob}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Status
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCTitle"}>
                    {providerValue.status ? "Active" : "InActive"}
                  </Box>
                </Box>
                {/* <Box
                  component="div"
                  className={"BBPVUMDIRCol BBPVUMDIRCFull BBPVUMDIRCTitle"}
                >
                  Permissions
                </Box>
                <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Dashboard
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    {providerValue &&
                      providerValue.permissions &&
                      providerValue.permissions.dashboard_permissions.map(
                        (item, index) => (
                          <Box
                            key={index}
                            component={"div"}
                            className={"BBPVUMDIRCCB"}
                          >
                            {item}
                          </Box>
                        ),
                      )}
                  </Box> */}
                {/* </Box> */}
                <Box
                  component="div"
                  className={"BBPVUMDIRCol BBPVUMDIRCFull BBPVUMDIRCTitle"}
                >
                  Permissions
                </Box>

                <PermissionBlock
                  label="Dashboard"
                  items={providerValue.permissions?.dashboard_permissions}
                />

                <PermissionBlock
                  label="Customers"
                  items={providerValue.permissions?.customers_permissions}
                />

                <PermissionBlock
                  label="Users"
                  items={providerValue.permissions?.users_permissions}
                />

                <PermissionBlock
                  label="Reports"
                  items={providerValue.permissions?.reports_permissions}
                />

                {/* <Box component="div" className={'BBPVUMDIRCol'}>
                                    <Box component="div" className={'BBPVUMDIRCLabel'}>
                                        Reports
                                    </Box>
                                    <Box component="div" className={'BBPVUMDIRCCheck'}>
                                        {providerValue && providerValue.permissions && providerValue.permissions.reports_permissions.map((item, index) => <Box key={index} component={'div'} className={'BBPVUMDIRCCB'}>{item}</Box>)}
                                    </Box>
                                </Box> */}
                                {/* shows in bottom -> Users */}
                {/* <Box component="div" className={"BBPVUMDIRCol"}>
                  <Box component="div" className={"BBPVUMDIRCLabel"}>
                    Users
                  </Box>
                  <Box component="div" className={"BBPVUMDIRCCheck"}>
                    {providerValue &&
                      providerValue.permissions &&
                      providerValue.permissions.users_permissions.map(
                        (item, index) => (
                          <Box
                            key={index}
                            component={"div"}
                            className={"BBPVUMDIRCCB"}
                          >
                            {item}
                          </Box>
                        ),
                      )}
                  </Box>
                </Box> */}
              </Box>
            </Box>
          )}
          <Box component="div" className={"BBPVUMDBtn"}>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              className={"BBPButton"}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};
export default ViewUserModel;
