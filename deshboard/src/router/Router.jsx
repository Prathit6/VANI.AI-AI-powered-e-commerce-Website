import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";

const Router = ({ allRoutes }) => {
  const routes = useRoutes([...allRoutes]);
  return <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>;
};

export default Router;