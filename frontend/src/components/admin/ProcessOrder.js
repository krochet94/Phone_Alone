import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  updateOrder,
  getOrderDetails,
  clearErrors,
} from "../../actions/orderActions";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import "../../App.css";

const ProcessOrder = () => {
  const { loading, order = {} } = useSelector((state) => state.orderDetails);
  const { error, isUpdated } = useSelector((state) => state.order);
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();
  const UPDATE_ORDER_RESET = "UPDATE_ORDER_RESET";
  const [status, setStatus] = useState("");
  const updateOrderHandler = (id) => {
    const formData = new FormData();
    formData.set("status", status);
    dispatch(updateOrder(id, formData));
  };

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city},  ${shippingInfo.postalCode}, ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  useEffect(() => {
    dispatch(getOrderDetails(id));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
  }, [dispatch, alert, error, isUpdated, id]);

  return (
    <>
      <MetaData title={`Process Order #${order && order._id} - Admin`} />
      <div className="row">
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 px-5">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="container container-fluid">
                <div className="row d-flex justify-content-around">
                  <div className="col-12 col-lg-7 order-details">
                    <h2 className="my-5">Order # {order._id}</h2>

                    <h4 className="mb-4">Shipping Info</h4>
                    <p>
                      <b className="me-3">Name:</b>
                      {user && user.name}
                    </p>
                    <p>
                      <b className="me-3">Phone:</b>{" "}
                      {shippingInfo && shippingInfo.phoneNo}
                    </p>
                    <p className="mb-4">
                      <b className="me-3">Address:</b>
                      {shippingDetails}
                    </p>
                    <p>
                      <b className="me-3">Amount:</b> $
                      {totalPrice && totalPrice.toFixed(2)}
                    </p>

                    <hr />

                    <h4 className="my-4">Payment</h4>
                    <p className={isPaid ? "greenColor" : "redColor"}>
                      <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                    </p>

                    <hr />

                    <h4 className="my-4">Stripe ID</h4>
                    <p>
                      <b>{paymentInfo && paymentInfo.id}</b>
                    </p>

                    <hr />

                    <h4 className="my-4">Order Status:</h4>
                    <p
                      className={
                        orderStatus && String(orderStatus).includes("Delivered")
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      <b>{orderStatus}</b>
                    </p>

                    <h4 className="my-4">Order Items:</h4>

                    <hr />
                    <div className="cart-item my-1">
                      {orderItems &&
                        orderItems.map((item) => (
                          <div className="row my-5" key={item.product}>
                            <div className="col-4 col-lg-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                height="45"
                                width="65"
                              />
                            </div>

                            <div className="col-5 col-lg-5">
                              <Link to={`/products/${item.product}`}>
                                {item.name}
                              </Link>
                            </div>

                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                              <p>${item.price.toFixed(2)}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                              <p>
                                {" "}
                                {item.quantity <= 1 ? (
                                  <>{item.quantity} Piece</>
                                ) : (
                                  <>{item.quantity} Pieces</>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <hr />
                  </div>

                  <div className="col-12 col-lg-3 mt-5">
                    <h4 className="my-4">Status</h4>

                    <div className="form-group">
                      <select
                        className="form-control"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={String(orderStatus).includes("Delivered")
                            ? true
                            : false
                        }
                      >
                        {String(orderStatus).includes("Processing") ? 
                        (
                          <>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </>
                        ) : String(orderStatus).includes("Shipped")?(
                          <>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </>
                        ):(
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    <button
                      className="btn btn-primary w-100"
                      onClick={() => updateOrderHandler(order._id)}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
