import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useAxiosPrivate } from "../../Hooks/useAxiosPrivate";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "@mui/material/Skeleton";
import MenuItem from "@mui/material/MenuItem";
import useDebounce from "../../Utils/useDebounce";
import NoData from "../../Components/NoData";
import SomethingWentWrong from "../../Components/SomethingWentWrong";
import "./style.css";

const ApiAutocomplete = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { label, options, placeholder, disabled, onChange, id, value } = props;
  const { valueKey, itemLabel, api, cat_id, defaultValue, type } = options;

  const [errorDialog, setErrorDialog] = useState(false);
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [width, setWidth] = React.useState("0");
  const [apiUrl, setApiUrl] = React.useState("");

  const [selectedValue, setSelectedValue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [allProviders, setAllProviders] = useState([]);
  const [limitData] = useState(15);
  const [selectedPage, setSelectedPage] = useState(1);
  const [totalData, setSetTotalData] = useState(0);
  const [apiParams] = useState({ limit: limitData });

  const fetchBillerProviders = useCallback(
    async (params, isSearch, api) => {
      try {
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
              if (type === "has-more") {
                if (isSearch) {
                  setAllProviders(response.data.data.data);
                } else {
                  setAllProviders((prev) => {
                    const map = new Map();

                    [...prev, ...response.data.data.data].forEach((item) => {
                      map.set(item.id, item);
                    });

                    return Array.from(map.values());
                  });
                }

                if (response.data.data.pagination) {
                  setHasMoreData(response.data.data.pagination.hasMore);
                  setSelectedPage(params.page + 1);
                } else {
                  setHasMoreData(false);
                }
              } else {
                if (isSearch) {
                  setAllProviders(response.data.data);
                } else {
                  setAllProviders(
                    allProviders.concat(Array.from(response.data.data)),
                  );
                }
                setSelectedPage(parseInt(params.page + 1));
                setSetTotalData(response.data.total);
              }
              setLoading(false);
            } else {
              setAllProviders([]);
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
    },
    [allProviders],
  );

  const handleFetch = useCallback(() => {
    const prm = { ...apiParams, page: selectedPage };

    if (type === "has-more") {
      // has-more APIs rely ONLY on pagination.hasMore
      if (!hasMoreData) return;
      fetchBillerProviders(prm, false, apiUrl);
    } else {
      // existing behaviour — DO NOT TOUCH
      if (allProviders.length !== totalData) {
        fetchBillerProviders(prm, false, apiUrl);
      } else {
        setHasMoreData(false);
      }
    }
  }, [
    apiParams,
    apiUrl,
    fetchBillerProviders,
    selectedPage,
    hasMoreData,
    allProviders.length,
    totalData,
    type,
  ]);

  const handleSearch = useCallback(
    (value) => {
      setLoading(true);
      setHasMoreData(true);

      const prm = {
        ...apiParams,
        page: 1,
        ...(value.length > 0 ? { search: value } : {}),
      };

      fetchBillerProviders(prm, true, apiUrl);
    },
    [apiParams, apiUrl, fetchBillerProviders],
  );

  const doSearch = useCallback(
    (str) => {
      handleSearch(str);
    },
    [handleSearch],
  );

  const doSave = useDebounce(doSearch, 500);

  const handleSearchInput = useCallback(
    (value) => {
      doSave(value);
    },
    [doSave],
  );

  const handleToggle = (open) => {
    setSelectedPage(1);
    if (open) {
      setLoading(true);
      fetchBillerProviders({ limit: limitData, page: 1 }, true, apiUrl);
    }
    setOpen((previousOpen) => !previousOpen);
    setWidth(anchorRef.current.clientWidth);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleAutocomplete = (newValue) => {
    setSelectedValue(newValue ? newValue[itemLabel] : value);
    if (valueKey) {
      onChange(newValue ? newValue[valueKey] : value);
    } else {
      onChange(newValue ? JSON.stringify(newValue) : value);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (cat_id) {
      setApiUrl(`${api}/${cat_id}`);
    } else {
      setApiUrl(`${api}`);
    }
    if (defaultValue) {
      setSelectedValue(defaultValue);
    } else {
      setSelectedValue(null);
    }
    // eslint-disable-next-line
  }, [cat_id]);

  
  const displayedProviders = React.useMemo(() => {
    const seen = new Set();

    return allProviders.filter((item) => {
      const label = item[itemLabel];
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }, [allProviders, itemLabel]);

  return (
    <Fragment>
      <SomethingWentWrong open={errorDialog} setOpen={setErrorDialog} />
      <Box component="div" className={"BBPApiAutocomplete"}>
        <Box component="div" className={"BBPAACInner"}>
          <Button
            ref={anchorRef}
            aria-controls={open ? "composition-select" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={() => {
              handleToggle(!open);
            }}
            fullWidth
            disabled={disabled}
            className={`BBPAACILabel ${open ? "open" : ""} ${selectedValue ? "" : "BBPAACIError"}`}
          >
            {selectedValue ? selectedValue : `Select ${label}`}
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            style={{ width: width }}
            sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box component="div" className={"BBPAAPSearch"}>
                      <Box component="div" className={"BBPAAInput"}>
                        <input
                          id={id}
                          placeholder={placeholder || `Search ${label}`}
                          onChange={(e) => {
                            handleSearchInput(e.target.value);
                          }}
                          autoComplete="off"
                        />
                      </Box>
                      {allProviders.length > 0 && !loading ? (
                        <InfiniteScroll
                          height={260}
                          dataLength={allProviders.length}
                          next={handleFetch}
                          hasMore={hasMoreData}
                          pullDownToRefreshThreshold={100}
                          loader={
                            <Fragment>
                              {Array.from(Array(15).keys()).map((item) => (
                                <Box
                                  component="div"
                                  key={item}
                                  className={"BBPAAILoader"}
                                >
                                  <Skeleton variant="rounded" height={19} />
                                </Box>
                              ))}
                            </Fragment>
                          }
                        >
                          {displayedProviders.map((item, index) => (
                            <MenuItem
                              key={index}
                              onClick={(event) => {
                                handleAutocomplete(item);
                                handleClose(event);
                              }}
                            >
                              {item[itemLabel]}
                            </MenuItem>
                          ))}
                        </InfiniteScroll>
                      ) : loading ? (
                        <Fragment>
                          {Array.from(Array(7).keys()).map((item) => (
                            <Box
                              component="div"
                              key={item}
                              className={"BBPAAILoader"}
                            >
                              <Skeleton variant="rounded" height={19} />
                            </Box>
                          ))}
                        </Fragment>
                      ) : (
                        <Box component="div" className={"BBPAAINot"}>
                          <NoData type="small" title="Provider Not Found" />
                        </Box>
                      )}
                    </Box>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Box>
      </Box>
    </Fragment>
  );
};
export default ApiAutocomplete;
