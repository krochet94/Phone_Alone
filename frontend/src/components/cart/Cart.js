import React from "react";
import MetaData from "../layouts/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const incQuantity = (id, quantity, stock) => {
    const newQuantity = quantity + 1;
    if (newQuantity > stock) return;
    dispatch(addItemToCart(id, newQuantity));
  };

  const decQuantity = (id, quantity) => {
    const newQuantity = quantity - 1;
    if (newQuantity < 1) return;
    dispatch(addItemToCart(id, newQuantity));
  };

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const totalUnits = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  return (
    <>
      <MetaData title="Your Cart" />
      <div className="container container-fluid">
        {cartItems.length === 0 ? (
          <h2 className="mt-5">Cart is empty</h2>
        ) : (
          <>
            <h2 className="mt-5">
              Your Cart: 
              {cartItems.length <= 1 ? (
                <b>{cartItems.length} item</b>
              ) : (
                <b>{cartItems.length} items</b>
              )}
            </h2>
            <div className="row d-flex justify-content-around my-4">
              <div className="col-12 col-lg-8">
                {cartItems.map((item) => (
                  <>
                    <hr />
                    <div className="cart-item" key={item.product}>
                      <div className="row">
                        <div className="col-4 col-lg-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            height="90"
                            width="115"
                          />
                        </div>

                        <div className="col-5 col-lg-3">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                          <p id="card_item_price">${item.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                          <div className="stockCounter d-inline">
                            <span
                              className="btn btn-danger minus"
                              onClick={() =>
                                decQuantity(item.product, item.quantity)
                              }
                            >
                              -
                            </span>
                            <input
                              type="number"
                              className="form-control count d-inline"
                              style={{ backgroundColor: "white" }}
                              value={item.quantity}
                              readOnly
                            />

                            <span
                              className="btn btn-primary plus"
                              onClick={() =>
                                incQuantity(
                                  item.product,
                                  item.quantity,
                                  item.stock
                                )
                              }
                            >
                              +
                            </span>
                          </div>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                          <FontAwesomeIcon
                            icon={faTrash}
                            id="delete_cart_item"
                            className="btn btn-danger"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this item?"
                                )
                              ) {
                                removeCartItemHandler(item.product);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
              </div>

              <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                  <h4>Order Summary</h4>
                  <hr />
                  <p>
                    Subtotal:{" "}
                    <span className="order-summary-values">
                      {totalUnits <= 1 ? (
                        <>{totalUnits} Unit</>
                      ) : (
                        <>{totalUnits} Units</>
                      )}
                    </span>
                  </p>
                  <p>
                    Est. total:{" "}
                    <span className="order-summary-values">${itemsPrice}</span>
                  </p>

                  <hr />
                  <button
                    id="checkout_btn"
                    className="btn btn-primary w-100"
                    onClick={checkoutHandler}
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
