import React, { lazy, Suspense } from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";

const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>
);
