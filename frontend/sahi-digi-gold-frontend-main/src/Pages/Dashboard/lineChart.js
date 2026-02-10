import React, { Fragment, useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAxiosPrivate } from "../../Hooks/useAxiosPrivate";
import DateRange from "../../Components/DateRangePicker/range";
import SomethingWentWrong from "../../Components/SomethingWentWrong";
import { format, addDays, addMonths } from "date-fns";
import "./style.css";

const CustomTooltip = ({ active, payload, tooltipDateFormat }) => {
  if (active && payload && payload.length) {
    let date = new Date(payload[0].payload.date);
    return (
      <Box component="div" className="BBPCustomTooltip">
        <Box component="div" className="BBPCTitle">
          {format(date, tooltipDateFormat)}
        </Box>
        {payload.map((item, index) => (
          <Box component="div" className="BBPCList" key={index}>
            <span style={{ backgroundColor: item.stroke }}></span>
            <strong>
           {item.name === "Amount"
  ? `₹${Number(item.value).toFixed(3)}`
  : Number(item.value).toFixed(3)}

            </strong>{" "}
            {item.name}
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

const BBPLineChart = ({ apiName, title, name1, name2 }) => {
  const axiosPrivate = useAxiosPrivate();
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState({ data: [], key: "", format: "" });

  const [dateRange] = useState([
    {
      startDate: addDays(addMonths(new Date(), -1), 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [apiParams] = useState({
    startDate: format(addDays(addMonths(new Date(), -1), 1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchTotalBillPay = useCallback(async (api, params) => {
    try {
      setLoading(true);
      let urlParams = "";
      if (params) {
        Object.keys(params).forEach(function (key, index) {
          urlParams += (index === 0 ? "?" : "&") + key + "=" + params[key];
        });
      }
      let url = `${api}${urlParams}`;
      let options = {
        method: "GET",
        url,
      };
      await axiosPrivate(options)
        .then((response) => {
          if (response.data.status === 1) {
            let startDate = new Date(params.startDate);
            let endDate = new Date(params.endDate);
            if (response.data.type === "day") {
              let uniqueDates = [...response.data.data];
              let allDates = [];
              for (
                var day = startDate;
                day <= endDate;
                day.setDate(day.getDate() + 1)
              ) {
                let newDate = format(day, "yyyy-MM-dd");
                let newMon = format(day, "dd-MMM");
                const index = uniqueDates.findIndex((object) => {
                  return object._id === newDate;
                });
                allDates.push({
                  name: newMon,
                  date: newDate,
                total:
  index !== -1
    ? Number(uniqueDates[index].total.toFixed(3))
    : 0,

 qty:
  index !== -1
    ? Number(uniqueDates[index].totalQuantity.toFixed(3))
    : 0,


                });
              }
              setChartData({
                data: allDates,
                key: "name",
                format: "dd MMM yyyy",
              });
            } else if (response.data.type === "month") {
              let uniqueDates = [...response.data.data];
              let allDates = [];
              for (
                day = startDate;
                day <= addDays(endDate, 1);
                day.setMonth(day.getMonth() + 1)
              ) {
                let newDate = format(day, "yyyy-MM");
                let newMon = format(day, "MMM-yyyy");
                const index = uniqueDates.findIndex((object) => {
                  return object._id === newDate;
                });
                allDates.push({
                  name: newMon,
                  date: newDate,
                  total: index !== -1 ? uniqueDates[index].total : 0,
                  qty:
                    index !== -1 ? Number(uniqueDates[index].quantity || 0) : 0,
                });
              }
              setChartData({ data: allDates, key: "name", format: "MMM yyyy" });
            } else if (response.data.type === "year") {
              let uniqueDates = [...response.data.data];
              let allDates = [];
              let startYear = startDate.getFullYear();
              let endYear = endDate.getFullYear();
              for (day = startYear; day <= endYear; day++) {
                let newDate = day.toString();
                const index = uniqueDates.findIndex((object) => {
                  return object._id === newDate;
                });
                allDates.push({
                  name: newDate,
                  date: newDate,
                  total: index !== -1 ? uniqueDates[index].total : 0,
                  qty:
                    index !== -1 ? Number(uniqueDates[index].quantity || 0) : 0,
                });
              }
              setChartData({ data: allDates, key: "name", format: "yyyy" });
            }
          } else {
            setErrorDialog(true);
            console.error("err.res", response.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            setErrorDialog(true);
            setLoading(false);
            console.error("err.res", err.response.data);
          }
        });
    } catch (error) {
      setErrorDialog(true);
      setLoading(false);
      console.error("error", error);
    }
  }, []);

  const handleDateFilter = (date) => {
    let prm = apiParams;
    prm.startDate = format(date.startDate, "yyyy-MM-dd");
    prm.endDate = format(date.endDate, "yyyy-MM-dd");
    fetchTotalBillPay(apiName, prm);
  };

  const handleRestDateFilter = () => {
    let prm = apiParams;
    prm.startDate = format(addDays(addMonths(new Date(), -1), 1), "yyyy-MM-dd");
    prm.endDate = format(new Date(), "yyyy-MM-dd");
    fetchTotalBillPay(apiName, prm);
  };

  useEffect(() => {
    if (apiName) {
      fetchTotalBillPay(apiName, apiParams);
    }
  }, [apiName]);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Box component="div" className={"BBPDPLineChart"}>
        <Box component="div" className={"BBPDPlCHead"}>
          <Box component="div" className={"BBPDPlCHTitle"}>
            {title}
          </Box>
          <Box component="div" className={"BBPDPlCHFilter"}>
            <DateRange
              title={"Period"}
              buttonTitle={"Apply"}
              ranges={dateRange}
              onChange={handleDateFilter}
              onReset={handleRestDateFilter}
            />
          </Box>
        </Box>
        <Box component="div" className={"BBPDPlCChart"}>
          {loading ? (
            <Stack spacing={1}>
              <Skeleton variant="rounded" height={60} />
              <Skeleton variant="rounded" height={60} />
              <Skeleton variant="rounded" height={60} />
              <Skeleton variant="rounded" height={60} />
              <Skeleton variant="rounded" height={60} />
            </Stack>
          ) : (
            <ResponsiveContainer width="100%" height={450}>
              <LineChart
                width={500}
                height={300}
                data={chartData.data}
                margin={{
                  left: 35,
                  right: 15,
                }}
              >
                <CartesianGrid strokeDasharray="1 0" horizontal={false} />
                <XAxis padding={{ right: 6 }} dataKey={chartData.key} />
                <YAxis tickMargin={30} yAxisId="1" />
                <YAxis
                  tickMargin={30}
                  padding={{ top: 6 }}
                  orientation="right"
                  allowDataOverflow
                  type="number"
                  yAxisId="2"
                />
                <Tooltip
                  content={
                    <CustomTooltip tooltipDateFormat={chartData.format} />
                  }
                />
                <Legend verticalAlign="top" iconType={"circle"} height={46} />
                <Line
                  type="monotone"
                  name={name1}
                  dataKey="qty"
                  yAxisId="2"
                  stroke="#21D59B"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  name={name2}
                  dataKey="total"
                  yAxisId="1"
                  stroke="#0058FF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </Fragment>
  );
};

export default BBPLineChart;
