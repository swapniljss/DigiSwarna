import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Fragment,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
import SomethingWentWrong from "../../../Components/SomethingWentWrong";
import LogoImg from "../../../Assets/Images/clogo.svg";
import { MENU_SLUG } from "../../../Constants/constants";

const ViewReceipt = () => {
  const numberToWordsIN = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return "---";

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convert = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + convert(n % 100) : "")
        );
      if (n < 100000)
        return (
          convert(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + convert(n % 1000) : "")
        );
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    };

    let words = `${convert(rupees)} Rupees`;
    if (paise) words += ` and ${convert(paise)} Paise`;
    return `${words} Only`;
  };

  let componentRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  let { transaction_id } = useParams();
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactionInfo, setTransactionInfo] = useState({});
  const totalInWords = React.useMemo(() => {
    return numberToWordsIN(transactionInfo?.netAmount);
  }, [transactionInfo?.netAmount]);

  const handleCloseModal = () => {
    navigate(`/${MENU_SLUG.reports}`, { replace: true });
  };

  const fetchValue = useCallback(async () => {
    try {
      let url = `buy/invoice/${transaction_id}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setTransactionInfo(response.data.data);
          } else {
            console.error("err.res", response);
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
  }, [transaction_id]);

  useEffect(() => {
    fetchValue();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={true}
        onClose={handleCloseModal}
      >
        <Box
          component="div"
          className={"BBPBViewReceipt"}
          sx={{ paddingRight: 0 }}
          ref={(el) => (componentRef = el)}
        >
          <Box component="div" className={"BBPBVRHead"}>
            <Box component="div" className={"BBPBVRHLogo"}>
              <img src={LogoImg} alt={""} />
            </Box>
            <Box component="div" className={"BBPBVRHText"}>
              Original for recipient
            </Box>
          </Box>

          {/* MAIN ROW */}
          <Box component="div" className={"BBPBVRRow"} sx={{ paddingRight: 0 }}>
            <Box component="div" className={"BBPBVRRCol"}>
              <Box component="div" className={"BBPBVRGTitle"}>
                Sold by:
              </Box>
              <Box component="div" className={"BBPBVRTitle"}>
                Augmont Goldtech Private Limited
              </Box>
              <Box
                component="div"
                className={"BBPBVROp no-bold"}
                style={{ color: "gray", marginBottom: 0 }}
              >
                (Formerly known as Augmont Precious Metals Private Limited)
              </Box>
              <Box component="div" className={"BBPBVROT"}>
                <Box component="span">Address:</Box>
                504, 5th Floor, Trade Link, E Wing. Kamala Mills Compound, Lower
                Parel, Mumbai, Maharashtra 400013
              </Box>
              <Box
                component="div"
                className={"BBPBVROp"}
                style={{ color: "#d08b1c", fontWeight: 500 }}
              >
                Tel: +91 9090906867 | Email: support@augmont.com | Web:
                www.augmont.com
              </Box>
              <Box component="div" className={"BBPBVROp"}>
                <Box component="span" className={"BBPBVRGTitle"}>
                  Transaction ID:
                </Box>{" "}
                {loading ? (
                  <Skeleton variant="rounded" width={180} height={18} />
                ) : transactionInfo.transactionId ? (
                  transactionInfo.transactionId
                ) : (
                  "---"
                )}
              </Box>
              <Box component="div" className={"BBPBVRSpace"} />

              <Box component="div" className={"BBPBVRSpace"} />
            </Box>
            <Box component="div" className={"BBPBVRRCol BBPBVRRCRight"}>
              {/* <Box component="div" className={'BBPBVMTitle'}>
                                TAX INVOICE
                            </Box> */}
              <Box component="div" className={"BBPBVRGTitle"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    Invoice No:{" "}
                    <Box component="span">
                      {transactionInfo.invoiceNumber
                        ? transactionInfo.invoiceNumber
                        : "---"}
                    </Box>
                  </Fragment>
                )}
              </Box>
              <Box component="div" className={"BBPBVRGTitle"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={21} />
                ) : (
                  <Fragment>
                    Date:{" "}
                    <Box component="span">
                      {transactionInfo && transactionInfo.invoiceDate
                        ? transactionInfo.invoiceDate
                        : "---"}
                    </Box>
                  </Fragment>
                )}
              </Box>
            </Box>
          </Box>

          {/* ===== LEFT + RIGHT PARALLEL SECTION ===== */}

          <Box
            component="div"
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "flex-start",
              marginTop: "2px",
            }}
          >
            {/* LEFT GROUP */}
            <Box component="div">
              <Box component="div" className={"BBPBVRGTitle"}>
                Augmont Unique ID:
              </Box>
              <Box component="div" className={"BBPBVROp"}>
                {loading ? (
                  <Skeleton variant="rounded" height={21} />
                ) : (
                  transactionInfo.userInfo?.uniqueId || "---"
                )}
              </Box>

              <Box
                component="div"
                className={"BBPBVRGTitle"}
                sx={{ marginTop: "8px" }}
              >
                Payment Mode: <Box component="span">UPI</Box>
              </Box>

              <Box
                component="div"
                className={"BBPBVROp"}
                sx={{ marginTop: "6px" }}
              >
                <Box
                  component="span"
                  sx={{ color: "#175783", fontWeight: 600 }}
                >
                  Metal Purity :
                </Box>{" "}
                {transactionInfo.purity || "---"}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Box
                  component="span"
                  sx={{ color: "#175783", fontWeight: 600 }}
                >
                  Carat :
                </Box>{" "}
                {transactionInfo.karat || "---"}
              </Box>
            </Box>

            {/* RIGHT GROUP */}
            <Box
              component="div"
              sx={{
                marginLeft: "auto", // 🔥 THIS IS THE KEY
                textAlign: "right", // ✅ THIS fixes it
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{ marginLeft: "auto" }}
                component="div"
                className={"BBPBVRGTitle"}
              >
                Customer Details:
              </Box>

              <Box component="div" className={"BBPBVRTitle"}>
                {loading ? (
                  <Skeleton variant="rounded" height={21} />
                ) : (
                  transactionInfo.userInfo?.name || "---"
                )}
              </Box>

              <Box component="div" className={"BBPBVROp"}>
                {loading ? (
                  <Skeleton variant="rounded" height={21} />
                ) : (
                  `${transactionInfo.userInfo?.state || ""} ${transactionInfo.userInfo?.pincode || ""}`
                )}
              </Box>

              <Box component="div" className={"BBPBVROp"}>
                {loading ? (
                  <Skeleton variant="rounded" height={21} />
                ) : (
                  transactionInfo.userInfo?.mobileNumber || "---"
                )}
              </Box>

              <Box component="div" className={"BBPBVRMail"}>
                {loading ? (
                  <Skeleton variant="rounded" height={21} />
                ) : transactionInfo.userInfo?.email ? (
                  <Link href={`mailto:${transactionInfo.userInfo.email}`} underline="none">
                    {transactionInfo.userInfo.email}
                  </Link>
                ) : (
                  "---"
                )}
              </Box>
            </Box>
          </Box>
          {/* ===== END PARALLEL SECTION ===== */}

          <Box component="div" className={"BBPBVRTable"}>
            <Box component="div" className={"BBPBVRTHead"}>
              <Box component="div" className={"BBPBVRTCol"}>
                Description
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                HSN Code
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                Gram
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                Rate/gm (INR)
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                Amount (INR)
              </Box>
            </Box>
            <Box component="div" className={"BBPBVRTHI"}>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.metalType
                      ? `${transactionInfo.metalType} ${transactionInfo.karat} ${transactionInfo.purity / 10}%`
                      : "---"}
                  </Fragment>
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.hsnCode ? transactionInfo.hsnCode : "---"}
                  </Fragment>
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.quantity
                      ? transactionInfo.quantity
                      : "---"}
                  </Fragment>
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.unitType
                      ? `${transactionInfo.rate} (INR/${transactionInfo.unitType})`
                      : "---"}
                  </Fragment>
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.grossAmount
                      ? transactionInfo.grossAmount
                      : "---"}
                  </Fragment>
                )}
              </Box>
            </Box>
            <Box component="div" className={"BBPBVRTHI"}>
              <Box component="div" className={"BBPBVRTCol BBPBVRTCH"}>
                Net Total
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  ""
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.quantity
                      ? transactionInfo.quantity
                      : "---"}
                  </Fragment>
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  ""
                )}
              </Box>
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.grossAmount
                      ? transactionInfo.grossAmount
                      : "---"}
                  </Fragment>
                )}
              </Box>
            </Box>
            {loading ? (
              <Box component="div" className={"BBPBVRTHI"}>
                <Box component="div" className={"BBPBVRTCol BBPBVRTCH"}>
                  <Skeleton component="div" variant="rounded" height={23} />
                </Box>
                <Box component="div" className={"BBPBVRTCol"}>
                  <Skeleton component="div" variant="rounded" height={23} />
                </Box>
                <Box component="div" className={"BBPBVRTCol"}>
                  <Skeleton component="div" variant="rounded" height={23} />
                </Box>
                <Box component="div" className={"BBPBVRTCol"}>
                  <Skeleton component="div" variant="rounded" height={23} />
                </Box>
                <Box component="div" className={"BBPBVRTCol"}>
                  <Skeleton component="div" variant="rounded" height={23} />
                </Box>
              </Box>
            ) : (
              transactionInfo.taxes &&
              transactionInfo.taxes.taxSplit.map((tax, i) => (
                <Box component="div" className={"BBPBVRTHI"} key={i}>
                  <Box component="div" className={"BBPBVRTCol BBPBVRTCH"}>
                    {tax.type}
                  </Box>
                  <Box component="div" className={"BBPBVRTCol"} />
                  <Box component="div" className={"BBPBVRTCol"} />
                  <Box component="div" className={"BBPBVRTCol"}>
                    {tax.taxPerc}%
                  </Box>
                  <Box component="div" className={"BBPBVRTCol"}>
                    {tax.taxAmount}
                  </Box>
                </Box>
              ))
            )}
            <Box component="div" className={"BBPBVRTFoot"}>
              <Box component="div" className={"BBPBVRTCol BBPBVRTCH"}>
                Total in Number
              </Box>
              <Box component="div" className={"BBPBVRTCol"} />
              <Box component="div" className={"BBPBVRTCol"} />
              <Box component="div" className={"BBPBVRTCol"} />
              <Box component="div" className={"BBPBVRTCol"}>
                {loading ? (
                  <Skeleton component="div" variant="rounded" height={23} />
                ) : (
                  <Fragment>
                    {transactionInfo.netAmount
                      ? transactionInfo.netAmount
                      : "---"}
                  </Fragment>
                )}
              </Box>
            </Box>
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0px",
                paddingTop: "0px",
                fontWeight: "700",
                // marginLeft: "6.8px",
                fontSize: "13px",
                color: "#000",
                lineHeight: "normal",
              }}
            >
              <Box component="div">Total in Words</Box>
              <Box component="div" sx={{ textAlign: "right", maxWidth: "70%" }}>
                {loading ? <Skeleton width={400} /> : totalInWords}
              </Box>
            </Box>
          </Box>
          <Box component="div" className={"BBPBVRTC BBPBVRTCDisclaimer"}>
            <Box component="div" className={"BBPBVRTCHead"}>
              Disclaimer
            </Box>
            <Box component="div" className={"BBPBVRTCItem"}>
              The gold/silver grams you own are calculated by dividing the
              amount paid net of GST by the gold/silver rate and rounded down to
              4 decimal places. For example, .00054 grams will be rounded down
              to .0005 grams.
            </Box>
          </Box>
          <Box component="div" className={"BBPBVRTC"}>
            <Box component="div" className={"BBPBVRTCHead"}>
              Terms & Conditions:
            </Box>
            <Box component="div" className={"BBPBVRTCItem BBPBVRTCItemList"}>
              1. Goods once sold will not be returned.
            </Box>
            <Box component="div" className={"BBPBVRTCItem BBPBVRTCItemList"}>
              2. Any dispute shall be subject to Mumbai jurisdiction.
            </Box>
            <Box component="div" className={"BBPBVRTCItem BBPBVRTCItemList"}>
              3. Our responsibility ceases once the goods are delivered to the
              customer.
            </Box>
            <Box component="div" className={"BBPBVRTCItem BBPBVRTCItemList"}>
              4. I/We hereby certify that my/our registration certificate under
              the Central Goods and Services Act, 2017 is in force on the date
              on which the sales of goods specified in this tax invoice is made
              by me/us and that the transaction of sale covered by this tax
              invoice has been effected by me/us and it shall be accounted for
              in the turnover of sales while filing of return and the due tax,
              if any, payable on the sale has been paid or shall be paid.
            </Box>
            <Box component="div" className={"BBPBVRTCItem BBPBVRTCItemList"}>
              5. This is system generated document hence signature is not
              required
            </Box>
          </Box>
          {/* <Box component="div" className={"BBPBVRGLine"} /> */}
          <Box component="div" className={"BBPBVRGLink"} style={{ color: "#535353"}}>
            This is a computer generated invoice. If you have any questions
            concerning this invoice, please contact <br />
            <Link href={"mailto:support@sahisavings.com"}>
              support@sahisavings.com
            </Link>
          </Box>
          <br/>
          <Box component="div" className="BBPBVRSignatoryWrapper">
            <Box component="div" className={"BBPBVRSignatory"}>
              <Box component="div" className={"BBPBVRSignTitle"}>
                Authorised Signatory
              </Box>

              <Box component="div" className={"BBPBVRSignName"}>
                Augmont Goldtech Private Limited
              </Box>

              <Box component="div" className={"BBPBVRSignLine"}>
                GSTIN : <span>27AATCA3030A123</span>
              </Box>

              <Box component="div" className={"BBPBVRSignLine"}>
                CIN : <span>U51909MH2020PTC337639</span>
              </Box>
            </Box>

            <Box component="div" className={"BBPBVRSignatory"}>
              <Box component="div" className={"BBPBVRSignTitle"}>
                Program Partner
              </Box>

              <Box component="div" className={"BBPBVRSignName"}>
                K2VS Finance & Investment Pvt Ltd.
              </Box>

              <Box component="div" className={"BBPBVRSignLine"}>
                GSTIN : <span>27AAICK9851E1Z7</span>
              </Box>

              <Box component="div" className={"BBPBVRSignLine"}>
                CIN : <span>U67100MH2021PTC366575</span>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box component="div" className={"BBPBVRBtn"}>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" className={"BBPButton"}>
                Print Invoice
              </Button>
            )}
            content={() => componentRef}
          />
        </Box>
      </Dialog>
    </Fragment>
  );
};
export default ViewReceipt;
