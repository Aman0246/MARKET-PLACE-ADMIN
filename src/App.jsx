// src/App.jsx

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import LayoutWrapper from "./Component/Layout/LayoutWrapper";
import Loader from "./Component/Common/Loader";
import AllSubcategory from "./Pages/Category/AllSubcategory";
import Category from "./Pages/Category/Category";
import AttributePage from "./Pages/Category/AttributePage";
import Product from "./Pages/Product/Product";


// Lazy-loaded pages
const Login = lazy(() => import("./Pages/Auth/Login"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const Home = lazy(() => import("./Pages/Home/Home"));
const User = lazy(() => import("./Pages/User/User"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<User />} />

              <Route path="/subcategory/:id" element={<AllSubcategory />} />

              <Route path="/category" element={<Category />} />
              <Route path="/subcategoryAttribute/:id" element={<AttributePage />} />

              <Route path="/product/*" element={<Product />} />

            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;