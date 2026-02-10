import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import BodyView from './Components/BodyView';
import MenuBar from './Components/MenuBar';
import LeftSidebar from './Components/LeftSidebar';

import { getAllowedRoutes } from './Utils/index';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Reports from './Pages/Reports';
import Customers from './Pages/Customers';
import Users from './Pages/Users';
import Settings from './Pages/Settings';
import { MENU_SLUG } from './Constants/constants';
import { ROLES } from './Constants/roles';

import RequireAuth from './Auth/RequireAuth';
import PersistLogin from './Auth/PersistLogin';
import { useAuth } from './Hooks/useAuth';
import { CheckPermissions } from './Utils/permissions';
import history from './Utils/history';

import './App.css';

const App = () => {

  const { auth } = useAuth();

  const pages = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      link: `/${MENU_SLUG.dashboard}`,
      path: `/${MENU_SLUG.dashboard}`,
      component: Dashboard,
      show_tab: CheckPermissions('dashboard_permissions', 'View'),
    },
    {
      name: 'customers',
      title: 'Customers',
      link: `/${MENU_SLUG.customers}`,
      path: `/${MENU_SLUG.customers}/*`,
      component: Customers,
      show_tab: CheckPermissions('customers_permissions', 'View'),
    },
    {
      name: 'reports',
      title: 'Reports',
      link: `/${MENU_SLUG.reports}`,
      path: `/${MENU_SLUG.reports}/*`,
      component: Reports,
      show_tab: CheckPermissions('reports_permissions', 'Buy') || CheckPermissions('reports_permissions', 'Sell') || CheckPermissions('reports_permissions', 'Transfer') || CheckPermissions('reports_permissions', 'Redeem'),
      children: [
        {
          name: 'buy',
          title: 'Buy',
          link: `/${MENU_SLUG.reports}`,
          show_tab: CheckPermissions('reports_permissions', 'Buy'),
        },
        {
          name: 'sell',
          title: 'Sell',
          link: `/${MENU_SLUG.reports}/sell`,
          show_tab: CheckPermissions('reports_permissions', 'Sell'),
        },
        // {
        //   name: 'transfer',
        //   title: 'Transfer',
        //   link: `/${MENU_SLUG.reports}/transfer`,
        //   show_tab: CheckPermissions('reports_permissions', 'Transfer'),
        // },
        {
          name: 'redeem',
          title: 'Redeem',
          link: `/${MENU_SLUG.reports}/redeem`,
          show_tab: CheckPermissions('reports_permissions', 'Redeem'),
        },
      ]
    },
    {
      name: 'users',
      title: 'Users',
      link: `/${MENU_SLUG.users}`,
      path: `/${MENU_SLUG.users}/*`,
      component: Users,
      show_tab: CheckPermissions('users_permissions', 'View'),
    },
    {
      name: 'settings',
      title: 'Settings',
      link: `/${MENU_SLUG.settings}`,
      path: `/${MENU_SLUG.settings}/*`,
      component: Settings,
      show_tab: true,
    }];

  const allowedRoutes = getAllowedRoutes(pages);

  const lastHistory = history.location.pathname;
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route exact path={'/'} element={
          auth && auth.token ? <Navigate to={lastHistory === '/' ? '/dashboard' : lastHistory} replace /> :
            <Box component="div" className={"BBPApp BBPLP"}>
              <Box component="div" className={"BBPAInner"}>
                <BodyView>
                  <Login />
                </BodyView>
              </Box>
            </Box>
        } />
        <Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.subUser]} />}>

          <Route path={'/'} element={
            <Box component="div" className={"BBPApp"}>
              <Box component="div" className={"BBPAInner"}>
                <MenuBar />
                <BodyView>
                  <LeftSidebar pages={allowedRoutes} />
                  <Outlet />
                </BodyView>
              </Box>
            </Box>
          }>

            {// eslint-disable-next-line 
              allowedRoutes.map((route) => {
                if (route.show_tab) {
                  const { path, component: Component, children, title, permission, ...rest } = route;
                  return (
                    <Route {...rest} key={path} path={`${path}`} element={<Component />} />
                  )
                }
              })}
          </Route>

        </Route>
      </Route>
      <Route path='*' element={
        auth && auth.token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
      } />
    </Routes>
  );
}

export default App;