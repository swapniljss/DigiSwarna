import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePapaParse } from "react-papaparse";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useAxiosPrivate } from "../../../Hooks/useAxiosPrivate";
import SearchBox from "../../../Components/SearchBox";
import DevTable from "../../../Components/DevTable";
import PageChangeDialog from "../../../Components/PageChangeDialog";
import DateRangePicker from "../../../Components/DateRangePicker";
import SomethingWentWrong from "../../../Components/SomethingWentWrong";
import Backdrops from "../../../Components/Backdrops";
import { MENU_SLUG } from "../../../Constants/constants";

const BuyTable = () => {
  const { jsonToCSV } = usePapaParse();

  let navigate = useNavigate();
  let location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [changePage, setChangePage] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataStartDate, setDataStartDate] = useState();
  const [totalData, setTotalData] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [limitData] = useState(20);
  const [onDownloadLoading, setOnDownloadLoading] = useState(false);

  const [rowData, setRowData] = useState([]);

  const [apiParams] = useState({ limit: limitData });

  const [mainColumns, setMainColumns] = useState({
    columns: [
      {
        name: "date",
        title: "Date",
        width: 150,
        sorting: false,
        direction: "",
      },
      {
        name: "mobileNumber",
        title: "Mobile Number",
        width: 150,
        sorting: false,
        direction: "",
      },
      {
        name: "userName",
        title: "User Name",
        width: 100,
        sorting: false,
        direction: "",
      },
      {
        name: "quantity",
        title: "Quantity",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "totalAmount",
        title: "Total Amount",
        width: 200,
        sorting: true,
        direction: "",
      },
      {
        name: "invoiceNumber",
        title: "Invoice Number",
        width: 150,
        sorting: false,
        direction: "",
      },
      {
        name: "metalType",
        title: "Metal Type",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "uniqueId",
        title: "Unique ID",
        width: 150,
        sorting: false,
        direction: "",
      },
      {
        name: "transactionId",
        title: "Transaction ID",
        width: 150,
        sorting: false,
        direction: "",
      },
      {
        name: "merchantTransactionId",
        title: "Merchant Transaction ID",
        width: 100,
        sorting: false,
        direction: "",
      },
      {
        name: "goldBalance",
        title: "Gold Balance",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "paymentMode",
        title: "Payment Mode",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "paymentRefID",
        title: "Payment Ref ID",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "ConvinienceCharge",
        title: "Convinience Charge",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "silverBalance",
        title: "Silver Balance",
        width: 100,
        sorting: true,
        direction: "",
      },
      {
        name: "action",
        title: "Action",
        width: 150,
        sorting: false,
        direction: "",
      },
    ],
  });

  const fetchTransaction = useCallback(async (params) => {
    try {
      let urlParams = "";
      if (params) {
        Object.keys(params).forEach(function (key, index) {
          urlParams += (index === 0 ? "?" : "&") + key + "=" + params[key];
        });
      }
      let url = `buy${urlParams}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setRowData(response.data.data);
            setTotalData(response.data.total);
            setLoading(false);
          } else {
            setRowData([]);
            setTotalData(0);
            setLoading(false);
          }
          setDataStartDate(new Date(response.data.firstDate));
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

  const handleSearch = useCallback(
    (value) => {
      setLoading(true);
      let prm = apiParams;
      setSelectedPage(1);
      prm.page = 1;
      if (value.length > 0) {
        prm.search = value;
      } else {
        delete prm.search;
      }
      fetchTransaction(prm);
    },
    [apiParams, fetchTransaction]
  );

  const handlePaginate = (value) => {
    let prm = apiParams;
    prm.page = value;
    setSelectedPage(value);
    setLoading(true);
    fetchTransaction(prm);
  };

  const handleSorting = (name, index) => {
    let prm = apiParams;
    let tempCol = mainColumns.columns;
    if (tempCol[index].direction === "") {
      tempCol.map((column) =>
        column.name === name
          ? (column.direction = "ASC")
          : (column.direction = "")
      );
      prm.sort_by = name;
      prm.order = 1;
      prm.page = 1;
    } else if (tempCol[index].direction === "ASC") {
      tempCol.map((column) =>
        column.name === name
          ? (column.direction = "DSC")
          : (column.direction = "")
      );
      prm.sort_by = name;
      prm.order = -1;
      prm.page = 1;
    } else if (tempCol[index].direction === "DSC") {
      tempCol.map((column) => (column.direction = ""));
      prm.page = 1;
      delete prm.sort_by;
      delete prm.order;
    }
    setLoading(true);
    setMainColumns({ columns: tempCol });
    setSelectedPage(1);
    fetchTransaction(prm);
  };

  const handlePreviewUser = (id) => {
    navigate(`/${MENU_SLUG.reports}/view/${id}`, {
      state: { background: location },
    });
  };

  const handlePreviewReceipt = (id) => {
    navigate(`/${MENU_SLUG.reports}/receipt/${id}`, {
      state: { background: location },
    });
  };

  const handleConvinienceChargeReceipt = (id) => {
    navigate(`/${MENU_SLUG.reports}/viewconviniencecharge/${id}`, {
      state: { background: location },
    });
  };

const normalizeNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "Null" ||
    value === "null"
  ) {
    return "0.0000";
  }
  return Number(value).toFixed(4);
};

  function generateRows(tempArray) {
    const tempRowArray = [];
    if (tempArray) {
      tempArray.map((item) =>
        tempRowArray.push({
          date: (
            <Box component="div" className="BBPDTSText">
              {format(new Date(item.date), "dd-MM-yyyy HH:mm:ss")}
            </Box>
          ),
          mobileNumber: (
            <Box component="div" className="BBPDTSText">
              {item.mobileNumber}
            </Box>
          ),
          userName: (
            <Box component="div" className="BBPDTSText">
              {item.userName}
            </Box>
          ),
          quantity: (
            <Box component="div" className="BBPDTSText">
              {item.quantity}
            </Box>
          ),
totalAmount: (
  <Box component="div" className="BBPDTSText">
    {normalizeNumber(item.totalAmount)}
  </Box>
),


          invoiceNumber: (
            <Box component="div" className="BBPDTSText">
              {item.invoiceNumber}
            </Box>
          ),
          metalType: (
            <Box component="div" className="BBPDTSText">
              {item.metalType}
            </Box>
          ),
          uniqueId: (
            <Box component="div" className="BBPDTSText">
              {item.uniqueId}
            </Box>
          ),
          transactionId: (
            <Box component="div" className="BBPDTSText">
              {item.transactionId}
            </Box>
          ),
          merchantTransactionId: (
            <Box component="div" className="BBPDTSText">
              {item.merchantTransactionId}
            </Box>
          ),
goldBalance: (
  <Box component="div" className="BBPDTSText">
    {normalizeNumber(item.goldBalance)}
  </Box>
),


          paymentMode: (
            <Box component="div" className="BBPDTSText">
              {item.paymentMode}
            </Box>
          ),
          paymentRefID: (
            <Box component="div" className="BBPDTSText">
              {item.paymentRefID}
            </Box>
          ),
          ConvinienceCharge: (
            <Box component="div" className="BBPDTSText">
              {item.ConvinienceCharge ? item.ConvinienceCharge : 0}
            </Box>
          ),
silverBalance: (
  <Box component="div" className="BBPDTSText">
    {normalizeNumber(item.silverBalance)}
  </Box>
),


          action: (
            <Box component="div" className="BBPDTIBtns">
              <Tooltip
                placement="top"
                classes={{
                  popper: "BBPTPopper",
                  tooltip: "BBPTooltip",
                }}
                title={"View Transaction"}
              >
                <IconButton
                  size="small"
                  className="BBPDTIBIcon"
                  onClick={() => handlePreviewUser(item.transactionId)}
                >
                  <RemoveRedEyeOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip
                placement="top"
                classes={{
                  popper: "BBPTPopper",
                  tooltip: "BBPTooltip",
                }}
                title={"View Receipt"}
              >
                <IconButton
                  size="small"
                  className="BBPDTIBIcon"
                  onClick={() => handlePreviewReceipt(item.transactionId)}
                >
                  <ReceiptIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>

              <Tooltip
                placement="top"
                classes={{
                  popper: "BBPTPopper",
                  tooltip: "BBPTooltip",
                }}
                title={
                  item.ConvinienceCharge
                    ? "Convinience Charge"
                    : `Convinience Charge is 0`
                }
              >
                {item.ConvinienceCharge ? (
                  <IconButton
                    size="small"
                    className="BBPDTIBIcon"
                    onClick={() =>
                      handleConvinienceChargeReceipt(item.transactionId)
                    }
                  >
                    <ReceiptIcon fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton size="small" className="BBPDTIBIcon BBPDTIBDes">
                    <ReceiptIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Tooltip>
            </Box>
          ),
        })
      );
    }
    return tempRowArray;
  }

  const handleCSVDownload = useCallback(async () => {
    try {
      setOnDownloadLoading(true);
      let urlParams = "";
      if (apiParams) {
        Object.keys(apiParams).forEach(function (key, index) {
          urlParams +=
            (index === 0 ? "?" : "&") +
            key +
            "=" +
            (key === "limit" ? totalData : apiParams[key]);
        });
      }
      let url = `buy${urlParams}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            setRowData(response.data.data);
            setTotalData(response.data.total);
            const tempDownloadArr = [];
            const tempHeader = {};
            mainColumns.columns.map(
              (item) => (tempHeader[item.name] = item.title)
            );
            response.data.data.map((item) =>
              tempDownloadArr.push({
                date: format(new Date(item.date), "dd-MM-yyyy HH:mm:ss"),
                mobileNumber: item.mobileNumber,
                userName: item.userName,
                quantity: item.quantity,
                // totalAmount: item.totalAmount,
                totalAmount: normalizeNumber(item.totalAmount),
                invoiceNumber: item.invoiceNumber,
                metalType: item.metalType,
                uniqueId: item.uniqueId,
                transactionId: item.transactionId,
                merchantTransactionId: item.merchantTransactionId,
                // goldBalance: item.goldBalance,
                goldBalance: normalizeNumber(item.goldBalance),
                paymentMode: item.paymentMode,
                paymentRefID: item.paymentRefID,
                ConvinienceCharge: item.ConvinienceCharge
                  ? item.ConvinienceCharge
                  : 0,
                // silverBalance: item.silverBalance,
                silverBalance: normalizeNumber(item.silverBalance),
              })
            );
            delete tempHeader.action;
            tempDownloadArr.unshift(tempHeader);
            const csv = jsonToCSV(tempDownloadArr, { header: false });
            let filename = `${"buy-transactions"}-${format(
              new Date(),
              "yyyy-MM-dd-HH:mm:ss"
            )}.csv`;
            var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            var csvURL = null;
            if (navigator.msSaveBlob) {
              csvURL = navigator.msSaveBlob(csvData, filename);
            } else {
              csvURL = window.URL.createObjectURL(csvData);
            }
            var tempLink = document.createElement("a");
            tempLink.href = csvURL;
            tempLink.setAttribute("download", filename);
            tempLink.click();
            setOnDownloadLoading(false);
          } else {
            setRowData([]);
            setTotalData(0);
            setOnDownloadLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) {
            setErrorDialog(true);
            setOnDownloadLoading(false);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setErrorDialog(true);
      setOnDownloadLoading(false);
      console.error("error", error);
    }
    // eslint-disable-next-line
  }, [totalData]);

  const handleDateFilter = (date) => {
    let prm = apiParams;
    prm.startDate = format(date.startDate, "yyyy-MM-dd");
    prm.endDate = format(date.endDate, "yyyy-MM-dd");
    setLoading(true);
    fetchTransaction(prm);
  };

  const handleRestDateFilter = () => {
    let prm = apiParams;
    delete prm.startDate;
    delete prm.endDate;
    setLoading(true);
    fetchTransaction(prm);
  };

  useEffect(() => {
    fetchTransaction(apiParams);
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <PageChangeDialog showDialog={changePage} setShowDialog={setChangePage} />
      <Backdrops open={onDownloadLoading} title={"Downloading"} />

      <Box component="div" className={"BBPReports"}>
        <Box component="div" className={"BBPRHead"}>
          <SearchBox
            onSearchChange={handleSearch}
            placeholder={"Search Transaction"}
            searchTooltip={
              "Searching from Mobile Number, Unique ID, Transaction ID, Merchant Transaction ID"
            }
          />
          <Box component="div" className={"BBPRHBtn"}>
            <DateRangePicker
              title={"Period"}
              buttonTitle={"Apply"}
              dataStartDate={dataStartDate}
              onChange={handleDateFilter}
              onReset={handleRestDateFilter}
            />
            <Button
              variant="contained"
              className={"BBPRHBD"}
              onClick={handleCSVDownload}
              disabled={loading || totalData === 0}
            >
              Download
            </Button>
          </Box>
        </Box>
        <Box component="div" className={"BBPRBody"}>
          <DevTable
            rows={generateRows(rowData)}
            columns={mainColumns.columns}
            selectedPage={selectedPage}
            handlePagination={handlePaginate}
            loading={loading}
            handleSort={handleSorting}
            limitData={limitData}
            totalData={totalData}
          />
        </Box>
      </Box>
    </Fragment>
  );
};

export default BuyTable;
