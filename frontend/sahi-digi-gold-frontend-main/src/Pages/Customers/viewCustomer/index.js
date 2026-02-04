import React, { Fragment, useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
import { MENU_SLUG } from "../../../Constants/constants";
import SomethingWentWrong from "../../../Components/SomethingWentWrong";

const ViewCustomer = () => {
  let { customer_id } = useParams();

  const axiosPrivate = useAxiosPrivate();
  let navigate = useNavigate();

  const [errorDialog, setErrorDialog] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [kycLoading, setKYCLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [kyc, setKYC] = useState({});
  const [bank, setBank] = useState([]);
  const [address, setAddress] = useState([]);
  const [bankLoading, setBankLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);

  const fetchCustomerProfile = useCallback(async () => {
    try {
      let url = `customers/${customer_id}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setProfile(response.data.data);
            fetchCustomerKYC();
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
          setProfileLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            setProfileLoading(false);
            setErrorDialog(true);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setProfileLoading(false);
      setErrorDialog(true);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, []);

  const fetchCustomerKYC = useCallback(async () => {
    try {
      let url = `customers/${customer_id}/kyc`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setKYC(response.data.data);
            setKYCLoading(false);
            fetchCustomerBank();
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
          setKYCLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            setErrorDialog(true);
            setKYCLoading(false);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setKYCLoading(false);
      setErrorDialog(true);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, []);

  const fetchCustomerBank = useCallback(async () => {
    try {
      let url = `customers/${customer_id}/banks`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setBank(response.data.data || []);
            setBankLoading(false);
            fetchCustomerAddress();
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
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

  const fetchCustomerAddress = useCallback(async () => {
    try {
      let url = `customers/${customer_id}/address`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            const addr = response.data.data;

            // normalize API response to ARRAY
            setAddress(addr ? (Array.isArray(addr) ? addr : [addr]) : []);
            setAddressLoading(false);
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
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

  const handleCloseModal = () => {
    navigate(`/${MENU_SLUG.customers}?reload=${Date.now()}`, { replace: true });
  };

  useEffect(() => {
    fetchCustomerProfile();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Dialog fullWidth={true} maxWidth={"lg"} open={true}>
        <Box component="div" className={"BBPViewCustomer"}>
          <Box component="div" className={"BBPVCHead"}>
            <Box component="div" className={"BBPVCHTitle"}>
              Customer Details
            </Box>
            <IconButton onClick={handleCloseModal}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box component="div" className={"BBPVCBody"}>
            <Box component="div" className={"BBPVCBItem"}>
              <Box component="div" className={"BBPVCBITitle"}>
                Basic Details
              </Box>
              <Box component="div" className={"BBPVCBIDet"}>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Name
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.userName ? profile.userName : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Email ID
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.userEmail ? profile.userEmail : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Mobile Number
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.mobileNumber ? profile.mobileNumber : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Date Of Birth
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.dateOfBirth ? profile.dateOfBirth : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    State
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.userState ? profile.userState : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    City
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.userCity ? profile.userCity : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Pin Code
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.userPincode ? profile.userPincode : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    KYC Status
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.kycStatus ? profile.kycStatus : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box component="div" className={"BBPVCBItem"}>
              <Box component="div" className={"BBPVCBITitle"}>
                Address Details
              </Box>
              {addressLoading ? (
                <Fragment>
                  {address.map((item, index) => (
                    <Box component="div" key={index} className={"BBPVCBIDet"}>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Name
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.name ? item.name : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Email ID
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.email ? item.email : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Address
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.address ? item.address : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          City
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.city ? item.city : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          State
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.state ? item.state : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Pin Code
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.pincode ? item.pincode : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Status
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.status ? item.status : "---"}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Fragment>
              ) : (
                // Earlier working showss-> black values no data from DB
                <Box component="div" className={"BBPVCBIDet"}>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Name
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Email ID
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Address
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      City
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      State
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Pin Code
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Status
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                </Box>
                // <Box component="div" className={"BBPVCBIDet"}>
                //   <Box component="div" className={"BBPVCBIDCol"}>
                //     <Box component="div" className={"BBPVCBIDCSTitle"}>
                //       No address details available
                //     </Box>
                //   </Box>
                // </Box>
              )}
            </Box>
            <Box component="div" className={"BBPVCBItem"}>
              <Box component="div" className={"BBPVCBITitle"}>
                KYC Details
              </Box>
              <Box component="div" className={"BBPVCBIDet"}>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Aadhar Number
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {kycLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {kyc.aadharNumber ? kyc.aadharNumber : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    PAN Number
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {kycLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {kyc.panNumber ? kyc.panNumber : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Status
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {kycLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>{kyc.status ? kyc.status : "---"}</Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Aadhar Attachment
                  </Box>
                  <Box
                    component="div"
                    className={"BBPVCBIDCSTitle BBPVCBIDCImg"}
                  >
                    {kycLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {kyc.aadharAttachment ? (
                          <img
                            src={kyc.aadharAttachment}
                            alt={"Aadhar Attachment"}
                          />
                        ) : (
                          "---"
                        )}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    PAN Attachment
                  </Box>
                  <Box
                    component="div"
                    className={"BBPVCBIDCSTitle BBPVCBIDCImg"}
                  >
                    {kycLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {kyc.panAttachment ? (
                          <img src={kyc.panAttachment} alt={"PAN Attachment"} />
                        ) : (
                          "---"
                        )}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Rejected Reason
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {kycLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {kyc.rejectedReason ? kyc.rejectedReason : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box component="div" className={"BBPVCBItem"}>
              <Box component="div" className={"BBPVCBITitle"}>
                Nominee Details
              </Box>
              <Box component="div" className={"BBPVCBIDet"}>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Name
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.nomineeName ? profile.nomineeName : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Date Of Birth
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.nomineeDateOfBirth
                          ? profile.nomineeDateOfBirth
                          : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
                <Box component="div" className={"BBPVCBIDCol"}>
                  <Box component="div" className={"BBPVCBIDCTitle"}>
                    Relation
                  </Box>
                  <Box component="div" className={"BBPVCBIDCSTitle"}>
                    {profileLoading ? (
                      <Skeleton component="div" variant="rounded" height={21} />
                    ) : (
                      <Fragment>
                        {profile.nomineeRelation
                          ? profile.nomineeRelation
                          : "---"}
                      </Fragment>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box component="div" className={"BBPVCBItem"}>
              <Box component="div" className={"BBPVCBITitle"}>
                Bank Details
              </Box>
              {!bankLoading && bank.length > 0 ? (
                <Fragment>
                  {bank.map((item, index) => (
                    <Box component="div" key={index} className={"BBPVCBIDet"}>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Bank Name
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.bankName ? item.bankName : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          IFSC Code
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.ifscCode ? item.ifscCode : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Account Holder Name
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.accountName ? item.accountName : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Account Number
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.accountNumber ? item.accountNumber : "---"}
                        </Box>
                      </Box>
                      <Box component="div" className={"BBPVCBIDCol"}>
                        <Box component="div" className={"BBPVCBIDCTitle"}>
                          Status
                        </Box>
                        <Box component="div" className={"BBPVCBIDCSTitle"}>
                          {item.status ? item.status : "---"}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Fragment>
              ) : (
                <Box component="div" className={"BBPVCBIDet"}>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Account Name
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Account Number
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Bank Name
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      IFSC Code
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                  <Box component="div" className={"BBPVCBIDCol"}>
                    <Box component="div" className={"BBPVCBIDCTitle"}>
                      Status
                    </Box>
                    <Box component="div" className={"BBPVCBIDCSTitle"}>
                      <Skeleton component="div" variant="rounded" height={21} />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};
export default ViewCustomer;
