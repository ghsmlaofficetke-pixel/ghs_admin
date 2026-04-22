import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import {
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
} from ".";

import VerticalLayout from "../layouts/Vertical";
import DefaultLayout from "../layouts/Default";

const AllRoutes = () => (
  <Suspense fallback={<div />}>
    <Routes>

      {/* PUBLIC ROUTES (NO SIDEBAR) */}
      {publicProtectedFlattenRoutes?.map((route, idx) => {
        if (!route.element) return null;

        return (
          <Route
            key={idx}
            path={route.path}
            element={route.element}
          />
        );
      })}

      {/* PROTECTED ROUTES (WITH SIDEBAR) */}
      <Route element={<PrivateRoute />}>
        {authProtectedFlattenRoutes.map((route, idx) => {
          if (!route.element) return null;

          const Layout =
            route.layout === "vertical"
              ? VerticalLayout
              : DefaultLayout;

          return (
            <Route
              key={idx}
              path={route.path}
              element={
                <Layout>
                  {route.element}
                </Layout>
              }
            />
          );
        })}
      </Route>

    </Routes>
  </Suspense>
);

export default AllRoutes;