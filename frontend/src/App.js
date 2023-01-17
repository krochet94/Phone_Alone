import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { loadUser } from "./actions/userActions";
import store from "./store";
import axios from "axios";
import "./App.css";
// Component imports
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
// Product imports
import ProductDetails from "./components/product/ProductDetails";
// User imports
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
// Cart imports
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import OrderSuccess from "./components/cart/OrderSuccess";
import Payment from "./components/cart/Payment";
// Order imports
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";
// Stricted Routes imports
import ProtectedRoute from "./components/route/ProtectedRoute";
import AdminRoute from "./components/route/AdminRoute";
// Admin imports
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";

function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());
    async function getApiKey() {
      const { data } = await axios.get("/api/v1/apikey");
      setApiKey(data.apiKey);
    }
    getApiKey();
  }, []);

  const { user, loading } = useSelector((state) => state.auth);

  return (
    <Router basename='/'>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" exact element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} exact />
          <Route
            path="/password/reset/:token"
            element={<NewPassword />}
            exact
          />
          <Route path="/cart" exact element={<Cart />} />

          {/* Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/me" element={<Profile />} exact />
            <Route path="/me/update" element={<UpdateProfile />} exact />
            <Route path="/password/update" element={<UpdatePassword />} exact />
            <Route path="/shipping" exact element={<Shipping />} />
            <Route path="/order/confirm" exact element={<ConfirmOrder />} />
            <Route path="/orders/me" exact element={<ListOrders />} />
            <Route path="/order/:id" exact element={<OrderDetails />} />
            <Route path="/success" exact element={<OrderSuccess />} />
            {apiKey && (
              <Route
                path="/payment"
                element={
                  <Elements stripe={loadStripe(apiKey)}>
                    <Payment />
                  </Elements>
                }
              />
            )}

            {/*  Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/admin/products" exact element={<ProductList />} />
              <Route path="/admin/product" exact element={<NewProduct />} />
              <Route
                path="/admin/product/:id"
                exact
                element={<UpdateProduct />}
              />
              <Route path="/admin/orders" exact element={<OrderList />} />
              <Route path="/admin/order/:id" exact element={<ProcessOrder />} />
              <Route path="/admin/users" exact element={<UsersList />} />
              <Route path="/admin/user/:id" exact element={<UpdateUser />} />
              <Route path="/admin/reviews" exact element={<ProductReviews />} />
            </Route>
          </Route>
        </Routes>
        {!loading && ((user && user.role !== "admin")) && <Footer />}
      </div>
    </Router>
  );
}

export default App;
