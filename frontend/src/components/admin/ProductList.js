import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
} from "../../actions/productActions";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import "../../App.css";

const ProductList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DELETE_PRODUCT_RESET = "DELETE_PRODUCT_RESET";
  const { loading, error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: (
          <>
            <Link to={`/product/${product._id}`} target="_blank">
              {product.name}
            </Link>
          </>
        ),
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <FontAwesomeIcon icon={faPencil} />
            </Link>
            <button
              className="btn btn-danger py-1 px-2"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this product?"
                  )
                ) {
                  deleteProduct(product._id);
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
    dispatch(getAdminProducts());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Product deleted succesfully...");
      dispatch({ type: DELETE_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, alert, error, deleteError, isDeleted]);

  return (
    <>
      <MetaData title="All Products - Admin" />
      <div className="row">
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 px-5">
          <h1 className="my-4">All Products</h1>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setProducts()}
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

export default ProductList;
