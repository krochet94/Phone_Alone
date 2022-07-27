import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Search from "./Search";
import { logout } from "../../actions/userActions";
import { Dropdown, Row, Col } from "react-bootstrap";
import "../../App.css";

const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Successfully logged out...");
  };

  return (
    <Fragment>
      <Row className="navbar">
        <Col xs={{ span: 6, order: 1 }} md={{ span: 3, order: 1 }}>
          <div className="navbar-brand">
            <NavLink to="/" state={{ keyword: "" }}>
              <img src="/images/logo.png" id="nav-logo" alt="PhoneAlone Logo" />
            </NavLink>
          </div>
        </Col>

        <Col
          className="my-2 mt-md-0"
          xs={{
            span: 12,
            order: 3,
          }}
          md={{ span: 6, order: 2 }}
        >
          <Search />
        </Col>

        <Col
          className="text-center d-flex justify-content-end align-items-center"
          xs={{ span: 6, order: 2 }}
          md={{ span: 3, order: 3 }}
        >
          <NavLink
            to="/cart"
            style={{ textDecoration: "none" }}
            className="pe-2"
          >
            <span id="cart" className="">
              Cart
            </span>
            <span className="ms-1" id="cart_count">
              {cartItems.length}
            </span>
          </NavLink>
          {user ? (
            <Dropdown className="d-inline dropdown">
              <Dropdown.Toggle className="dropdown-toggle-prof text-white">
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user && user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu text-center">
                {user && user.role === "admin" && (
                  <Dropdown.Item>
                    <NavLink className="dropdown-item" to="/dashboard">
                      Dashboard
                    </NavLink>
                  </Dropdown.Item>
                )}
                <Dropdown.Item>
                  <NavLink className="dropdown-item" to="/me">
                    Profile
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink className="dropdown-item" to="/orders/me">
                    Orders
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Divider className="dropdown-divider" />
                <Dropdown.Item>
                  <NavLink
                    className="dropdown-item text-danger"
                    to="/"
                    onClick={logoutHandler}
                    style={{ backgroundColor: "transparent" }}
                  >
                    Logout
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            loading === false && (
              <NavLink to="/login" className="btn ms-4" id="login_btn">
                Login
              </NavLink>
            )
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default Header;
