/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Navigate, Route, RouteProps, useParams } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";

// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Launch = React.lazy(() => import("../pages/auth/launch"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const RecoverPassword = React.lazy(() => import("../pages/auth/RecoverPassword"));
const LockScreen = React.lazy(() => import("../pages/auth/LockScreen"));

// dashboard
const Dashboard = React.lazy(() => import("../pages/dashboard/index"));

// apps
const CalendarApp = React.lazy(() => import("../pages/apps/Calendar"));
const Tarikere = React.lazy(() => import("../pages/apps/Tarikere/index"));
const Panchayath = React.lazy(() => import("../pages/apps/Tarikere/PatanaPanchayath/index"));
const ConsolidationApp = React.lazy(() => import("../pages/apps/Tarikere/ConsolidationData/manavidata"));
const ConsolidationworkApp = React.lazy(() => import("../pages/apps/Tarikere/ConsolidationData/workdata"));

const AdhiveshanaApp = React.lazy(() => import("../pages/apps/Adhiveshana/index"));
const MLALaddApp = React.lazy(() => import("../pages/apps/MLALadd/mlaladd"));
const SchemApp = React.lazy(() => import("../pages/apps/Schems/schemamain"));

const StatasticApp = React.lazy(() => import("../pages/apps/Statistics/index"));

const GovtOfficeApp = React.lazy(() => import("../pages/apps/GovtOffice/index"));

const GOVTLinksApp = React.lazy(() => import("../pages/apps/GovtLinks/index"));
// error pages
const Maintenance = React.lazy(() => import("../pages/error/Maintenance"));
const ComingSoon = React.lazy(() => import("../pages/error/ComingSoon"));
const Error404 = React.lazy(() => import("../pages/error/Error404"));
const Error500 = React.lazy(() => import("../pages/error/Error500"));

/* ================= WRAPPERS ================= */

const TalukWrapper = () => {
  const { taluk } = useParams();
  return <Tarikere key={taluk} />;
};

const PanchayathWrapper = () => {
  const { panchayath, id } = useParams();
  return <Panchayath key={`${panchayath}-${id}`} />;
};

export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}

/* ================= DASHBOARD ================= */

const dashboardRoutes: RoutesProps = {
  path: "/home",
  name: "Dashboards",
  icon: "home",
  header: "Navigation",
  children: [
    {
      path: "/",
      name: "Root",
      element: <Navigate to="/dashboard" />,
      route: PrivateRoute,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      element: <Dashboard />,
      route: PrivateRoute,
      layout: "vertical",
    },
  ],
};

/* ================= APPS ================= */

const calendarAppRoutes: RoutesProps = {
  path: "/apps/calendar",
  name: "Calendar",
  layout: "vertical",
  roles: ["Admin"],
  icon: "calendar",
  element: <CalendarApp />,
  route: PrivateRoute,
  header: "Apps",
};

/* ---------- TALUK ROUTES ---------- */

const talukVillageRoutes: RoutesProps = {
  path: "/apps/:taluk/village/:id",
  name: "TalukVillage",
  route: PrivateRoute,
  layout: "vertical",
  roles: ["Admin"],
  element: <TalukWrapper />,
};

const talukAppRoutes: RoutesProps = {
  path: "/apps/taluk/:taluk",
  name: "Taluk",
  layout: "vertical",
  roles: ["Admin"],
  route: PrivateRoute,
  element: <TalukWrapper />,
};

/* ---------- PANCHAYATH ROUTES ---------- */

const panchayathWardRoutes: RoutesProps = {
  path: "/apps/panchayath/:panchayath/ward/:id",
  name: "PanchayathWard",
  route: PrivateRoute,
  layout: "vertical",
  roles: ["Admin"],
  element: <PanchayathWrapper />,
};

const panchayathAppRoutes: RoutesProps = {
  path: "/apps/panchayath/:panchayath",
  name: "Panchayath",
  layout: "vertical",
  roles: ["Admin"],
  route: PrivateRoute,
  element: <PanchayathWrapper />,
};

const consolidationAppRoutes: RoutesProps = {
  path: "/apps/consolidation",
  name: "Consolidation",
  layout: "vertical",
  roles: ["Admin"],
  route: PrivateRoute,
  element: <ConsolidationApp />,
};

const consolidationworkAppRoutes: RoutesProps = {
  path: "/apps/consolidationwork",
  name: "Consolidation",
  layout: "vertical",
  roles: ["Admin"],
  route: PrivateRoute,
  element: <ConsolidationworkApp />,
};

const statasticsAppRoutes: RoutesProps = {
  path: "/apps/statdata",
  name: "StatasticData",
  layout: "vertical",
  roles: ["Admin"],
  element: <StatasticApp />,
  route: PrivateRoute,
  header: "Apps",
};

const govtofficeAppRoutes: RoutesProps = {
  path: "/apps/govtoffice",
  name: "GovtOffice",
  layout: "vertical",
  roles: ["Admin"],
  element: <GovtOfficeApp />,
  route: PrivateRoute,
  header: "Apps",
};

const adhiveshanapdfAppRoutes: RoutesProps = {
  path: "/apps/adhiveshana",
  name: "Adhiveshana",
  layout: "vertical",
  roles: ["Admin"],
  element: <AdhiveshanaApp />,
  route: PrivateRoute,
  header: "Apps",
};


const mlaladdAppRoutes: RoutesProps = {
  path: "/apps/mlaladd",
  name: "MLALad",
  layout: "vertical",
  roles: ["Admin"],
  element: <MLALaddApp />,
  route: PrivateRoute,
  header: "Apps",
};

const schemAppRoutes: RoutesProps = {
  path: "/apps/schem",
  name: "Schem",
  layout: "vertical",
  roles: ["Admin"],
  element: <SchemApp />,
  route: PrivateRoute,
  header: "Apps",
};


const govtlinksAppRoutes: RoutesProps = {
  path: "/apps/govtlinks",
  name: "GOVT Links",
  layout: "vertical",
  roles: ["Admin"],
  element: <GOVTLinksApp />,
  route: PrivateRoute,
  header: "Apps",
};

/* ================= ROUTE ORDER ================= */

const appRoutes = [
  calendarAppRoutes,

  // Panchayath specific first
  panchayathWardRoutes,
  panchayathAppRoutes,

  // Taluk routes
  talukVillageRoutes,
  talukAppRoutes,

  consolidationAppRoutes,
  consolidationworkAppRoutes,
  statasticsAppRoutes,
  govtofficeAppRoutes,
  adhiveshanapdfAppRoutes,
  mlaladdAppRoutes,
  schemAppRoutes,
  govtlinksAppRoutes

];

/* ================= AUTH ROUTES ================= */

const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
    route: Route,
  },
   {
    path: "/auth/launch",
    name: "Launch",
    element: <Launch />,
    route: Route,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
    route: Route,
  },
  {
    path: "/auth/recover-password",
    name: "Recover Password",
    element: <RecoverPassword />,
    route: Route,
  },
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
    route: Route,
  },
];

/* ================= ERROR ROUTES ================= */

const otherPublicRoutes = [
  {
    path: "*",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    element: <Maintenance />,
    route: Route,
  },
  {
    path: "/coming-soon",
    name: "Coming Soon",
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: "/error-404",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/error-500",
    name: "Error - 500",
    element: <Error500 />,
    route: Route,
  },
];

/* ================= FLATTEN ROUTES ================= */

const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);
    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });

  return flatRoutes;
};

/* ================= EXPORT ================= */

const authProtectedRoutes = [
  dashboardRoutes,
  ...appRoutes,
];

const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);

export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};