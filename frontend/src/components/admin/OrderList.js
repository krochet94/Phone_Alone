import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  allOrders,
  deleteOrder,
  clearErrors,
} from "../../actions/orderActions";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import "../../App.css";

const OrderList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DELETE_ORDER_RESET = "DELETE_ORDER_RESET";
  const { loading, error, orders } = useSelector((state) => state.allOrders);
  const { isDeleted } = useSelector((state) => state.order);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "No. of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    orders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        stock: order.stock,
        status:
          order.orderStatus &&
          String(order.orderStatus).includes("Delivered") ? (
            <p style={{ color: "green" }}>{order.orderStatus}</p>
          ) : (
            <p style={{ color: "red" }}>{order.orderStatus}</p>
          ),
        actions: (
          <>
            <Link
              to={`/admin/order/${order._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ms-2"
               onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this order?")
                ) {
                  dispatch(deleteOrder(order._id));
                }
              }} 
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </>
        ),
      });
    });

    return data;
  };

  useEffect(() => {
    dispatch(allOrders());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Order deleted succesfully...");
      dispatch({ type: DELETE_ORDER_RESET });
      navigate("/admin/orders");
    }
  }, [dispatch, alert, error, isDeleted]);

  return (
    <>
      <MetaData title="All Orders - Admin" />
      <div className="row">
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 px-5">
          <h1 className="my-4">All Orders</h1>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setOrders()}
              className="px-3"
              bordered
              striped
              hover
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrderList;
