import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getOrderDetails, clearErrors } from "../../actions/orderActions";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import "../../App.css";

const OrderDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, order = {} } = useSelector(
    (state) => state.orderDetails
  );
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  useEffect(() => {
    dispatch(getOrderDetails(id));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, id]);

  return (
    <>
      <MetaData title="Order Details" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container container-fluid">
            <div className="row d-flex justify-content-between mx-4">
              <div className="col-12 col-lg-8 mt-5 order-details">
                <h1 className="my-5">Order # {order._id}</h1>

                <h4 className="mb-4">Shipping Info</h4>
                <p>
                  <b>Name:</b> {user && user.name}
                </p>
                <p>
                  <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
                </p>
                <p className="mb-4">
                  <b>Address:</b>
                  {shippingInfo &&
                    ` ${shippingInfo.address}, ${shippingInfo.city},  ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                </p>
                <p>
                  <b>Amount:</b> ${totalPrice && totalPrice.toFixed(2)}
                </p>

                <hr />

                <h4 className="my-4">Payment</h4>
                <p className={isPaid ? "greenColor" : "redColor"}>
                  <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                </p>
                <hr />
                <h4 className="my-4">Order Status:</h4>
                <p
                  className={
                    order.orderStatus &&
                    String(order.orderStatus).includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </p>
                <hr />
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
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetails;
