import React, { useState } from "react";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import RightSidePanel from "../../Components/RightSidePanel";
import BuyTable from "./buyTable/buyTable";
import ViewModel from "./buyTable/viewModel";
import ViewReceipt from "./buyTable/viewReceipt";
import ViewConvinienceCharge from "./buyTable/viewConvinienceCharge";
import SellTable from "./sellTable/sellTable";
import SellViewModel from "./sellTable/viewModel";
import TransferTable from "./transferTable/transferTable";
import RedeemTable from "./redeemTable/redeemTable";
import RedeemViewModel from "./redeemTable/viewModel";
import RedeemViewReceipt from "./redeemTable/viewReceipt";
import RedeemViewConvinienceCharge from "./redeemTable/viewConvinienceCharge";
import { CheckPermissions } from "../../Utils/permissions";
import "./style.css";

const Reports = () => {
  let location = useLocation();
  const background = location.state ? location.state.background : location;

  const [pages] = useState([
    {
      path: "/",
      component: BuyTable,
      enable_route: CheckPermissions("reports_permissions", "Buy"),
    },
    {
      path: "/sell",
      component: SellTable,
      enable_route: CheckPermissions("reports_permissions", "Sell"),
    },
    {
      path: "/transfer",
      component: TransferTable,
      enable_route: CheckPermissions("reports_permissions", "Transfer"),
    },
    {
      path: "/redeem",
      component: RedeemTable,
      enable_route: CheckPermissions("reports_permissions", "Redeem"),
    },
  ]);

  return (
    <RightSidePanel removeBg>
      <Routes location={background}>
        <Route path={"/"} element={<Outlet />}>
          {
            // eslint-disable-next-line
            pages.map((route) => {
              if (route.enable_route) {
                const {
                  path,
                  component: Component,
                  children,
                  title,
                  permission,
                  ...rest
                } = route;
                return (
                  <Route
                    {...rest}
                    key={path}
                    path={`${path}`}
                    element={<Component />}
                  />
                );
              }
            })
          }
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/view/:transaction_id" element={<ViewModel />} />
          <Route path="/receipt/:transaction_id" element={<ViewReceipt />} />
          <Route
            path="/viewconviniencecharge/:transaction_id"
            element={<ViewConvinienceCharge />}
          />
          <Route
            path="/sell/view/:transaction_id"
            element={<SellViewModel />}
          />
          <Route path="/redeem/view/:order_id" element={<RedeemViewModel />} />
          <Route
            path="/redeem/receipt/:order_id"
            element={<RedeemViewReceipt />}
          />
          <Route
            path="/redeem/viewconviniencecharge/:order_id"
            element={<RedeemViewConvinienceCharge />}
          />
        </Routes>
      )}
    </RightSidePanel>
  );
};

export default Reports;
