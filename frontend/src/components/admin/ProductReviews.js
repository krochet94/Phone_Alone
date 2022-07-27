import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getProductReviews,
  deleteReview,
  clearErrors,
} from "../../actions/productActions";
import MetaData from "../layouts/MetaData";
import Sidebar from "./Sidebar";
import "../../App.css";

const ProductReviews = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const [productId, setProductId] = useState("");
  const DELETE_REVIEW_RESET = "DELETE_REVIEW_RESET";
  const { error, reviews } = useSelector((state) => state.productReviews);
  const { isDeleted } = useSelector((state) => state.review);

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    reviews.forEach((review) => {
      data.rows.push({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.name,
        actions: (
          <>
            <button
              className="btn btn-danger py-1 px-2 ms-2"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this review?")
                ) {
                  dispatch(deleteReview(review._id, productId));
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
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      dispatch({ type: DELETE_REVIEW_RESET });
    }
    if (isDeleted) {
      alert.success("Review deleted succesfully...");
      dispatch({ type: DELETE_REVIEW_RESET });
      dispatch(getProductReviews(productId));
    }
  }, [dispatch, alert, error, isDeleted, productId]);

  return (
    <>
      <MetaData title="All Product Reviews - Admin" />
      <div className="row">
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 px-5">
          <div className="row justify-content-center mt-5">
            <div className="col-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (productId !== "") {
                    dispatch(getProductReviews(productId));
                  }
                }}
              >
                <div className="form-group">
                  <label htmlFor="productId_field">Enter Product ID</label>
                  <input
                    type="text"
                    id="email_field"
                    className="form-control"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <button
                  id="search_button"
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                >
                  SEARCH
                </button>
              </form>
            </div>
          </div>

          {reviews && reviews.length > 0 ? (
            <MDBDataTable
              data={setReviews()}
              className="px-3"
              bordered
              striped
              hover
            />
          ) : (
            <p className="mt-5 text-center">No reviews yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
