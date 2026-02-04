import React, { useState } from "react";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import RightSidePanel from "../../Components/RightSidePanel";
import CustomersTable from "./customersTable";
import EditCustomer from "./editCustomer";
import ViewCustomer from "./viewCustomer";
import { CheckPermissions } from "../../Utils/permissions";
import "./style.css";

const Customers = () => {
  let location = useLocation();

  let editPermissions = CheckPermissions("customers_permissions", "Edit");

  // const background = location.state ? location.state.background : location;
  const background = location.state?.background || null;

  const [pages] = useState([
    {
      path: "/",
      component: CustomersTable,
      enable_route: CheckPermissions("customers_permissions", "View"),
    },
  ]);

  return (
    <RightSidePanel removeBg>
      {/* <Routes location={background}> */}
      <Routes location={background || location}>
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
          {editPermissions && (
            <Route path="/edit/:customer_id" element={<EditCustomer />} />
          )}
          <Route path="/view/:customer_id" element={<ViewCustomer />} />
        </Routes>
      )}
    </RightSidePanel>
  );
};

export default Customers;
