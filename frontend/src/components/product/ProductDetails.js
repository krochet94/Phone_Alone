import React, { useEffect, useState } from "react";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import { Link, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../actions/productActions";
import { addItemToCart } from "../../actions/cartActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faMicrochip,
  faMemory,
  faHdd,
  faMobileAlt,
  faCamera,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Carousel, Modal } from "react-bootstrap";
import ShowMoreText from "react-show-more-text";
import ListReviews from "../review/ListReviews";
import "../../App.css";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  const NEW_REVIEW_RESET = "NEW_REVIEW_RESET";
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(true);
  const [comment, setComment] = useState("");
  const [reviewShow, setReviewShow] = useState(false);
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );
  const { user } = useSelector((state) => state.auth);

  const incQuantity = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= product.stock) return;
    setQuantity(count.valueAsNumber + 1);
  };

  const decQuantity = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    setQuantity(count.valueAsNumber - 1);
  };

  const addToCart = () => {
    dispatch(addItemToCart(id, quantity));
    alert.success("Item added to cart");
  };

  const starClick = (el) => {
    setTempRating(false);
    setRating(el);
    [1, 2, 3, 4, 5].forEach((index) => {
      document.getElementById(`star${index}`).classList.remove("orange");
    });

    [1, 2, 3, 4, 5].forEach((index) => {
      if (el >= index) {
        document.getElementById(`star${index}`).classList.add("orange");
      }
    });
  };

  const starMover = (el) => {
    [1, 2, 3, 4, 5].forEach((index) => {
      if (el >= index) {
        document.getElementById(`star${index}`).classList.add("yellow");
      }
    });
  };

  const starMout = () => {
    [1, 2, 3, 4, 5].forEach((index) => {
      document.getElementById(`star${index}`).classList.remove("yellow");
    });
  };

  const reviewHandler = () => {
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", id);
    dispatch(newReview(formData));
  };

  useEffect(() => {
    dispatch(getProductDetails(id));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review posted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, alert, error, id, reviewError, success]);

  return (
    <>
      {loading ? (
        <>
          <MetaData title="Loading..." />
          <Loader />
        </>
      ) : (
        <>
          <MetaData title={product.name} />
          <div className="container container-fluid">
            <div className="row d-flex justify-content-around mt-5">
              <div className="col-12 col-lg-5">
                <h3>{product.name}</h3>
                <p id="product_id">
                  Brand: {product.brand}
                  <br />
                  Product # {product._id}
                </p>
                <hr />
                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${(product.rating / 5) * 100}%` }}
                  ></div>
                </div>
                <span id="no_of_reviews">
                  ({product.numOfReviews} Review
                  {product.numOfReviews > 1 && <>s</>})
                </span>
                <div className="img-fluid mt-3">
                  <Carousel pause="hover">
                    {product.images &&
                      product.images.map((image) => (
                        <Carousel.Item key={image.public_id}>
                          <img
                            className="d-block w-100"
                            src={image.url}
                            alt={product.title}
                          />
                        </Carousel.Item>
                      ))}
                  </Carousel>
                </div>
              </div>
              <div className="col-12 col-lg-5 mt-5">
                <p id="product_price">${product.price}</p>
                <div className="mt-2 container bg-light border border-dark rounded">
                  <ul className="list-unstyled row ">
                    <li className="col-12 col-lg-6 d-flex justify-content-start align-items-center p-3">
                      <FontAwesomeIcon
                        icon={faMicrochip}
                        className="col-6 h1"
                      />
                      <div className="col-6">
                        <span>Processor</span>
                        <br />
                        <strong>
                          {product.specs && product.specs.processor}
                        </strong>
                      </div>
                    </li>
                    <li className="col-12 col-lg-6 d-flex justify-content-start align-items-center p-2">
                      <FontAwesomeIcon icon={faMemory} className="col-6 h1" />
                      <div className="col-6">
                        <span>Memory</span>
                        <br />
                        <strong>{product.specs && product.specs.memory}</strong>
                      </div>
                    </li>
                    <li className="col-12 col-lg-6 d-flex justify-content-start align-items-center p-2">
                      <FontAwesomeIcon icon={faHdd} className="col-6 h1" />
                      <div className="col-6">
                        <span>Storage</span>
                        <br />
                        <strong>
                          {product.specs && product.specs.storage}
                        </strong>
                      </div>
                    </li>
                    <li className="col-12 col-lg-6 d-flex justify-content-start align-items-center p-2">
                      <FontAwesomeIcon
                        icon={faMobileAlt}
                        className="col-6 h1"
                      />
                      <div className="col-6">
                        <span>Display</span>
                        <br />
                        <strong>
                          {product.specs && product.specs.display}
                        </strong>
                      </div>
                    </li>
                    <li className="col-12 col-lg-6 d-flex justify-content-start align-items-center p-2">
                      <FontAwesomeIcon icon={faCamera} className="col-6 h1" />
                      <div className="col-6">
                        <span>Camera</span>
                        <br />
                        <strong>
                          {product.specs && product.specs.camera.rear}MP Rear +{" "}
                          {product.specs && product.specs.camera.front}MP front
                        </strong>
                      </div>
                    </li>
                    <li className="col-12 col-lg-6 d-flex justify-content-start align-items-center p-2">
                      <FontAwesomeIcon icon={faCog} className="col-6 h1" />
                      <div className="col-6">
                        <span>OS</span>
                        <br />
                        <strong>{product.specs && product.specs.os}</strong>
                      </div>
                    </li>
                  </ul>
                </div>
                <hr />
                <div className="stockCounter d-inline">
                  <span className="btn btn-danger minus" onClick={decQuantity}>
                    -
                  </span>

                  <input
                    type="number"
                    className="form-control count d-inline"
                    style={{ backgroundColor: "white" }}
                    value={quantity}
                    readOnly
                  />

                  <span className="btn btn-primary plus" onClick={incQuantity}>
                    +
                  </span>
                </div>
                <button
                  type="button"
                  id="cart_btn"
                  className="btn btn-primary d-inline ms-4"
                  onClick={addToCart}
                  disabled={product.stock === 0 ? true : false}
                >
                  Add to Cart
                </button>
                <p className="mt-2">
                  Status:{" "}
                  <span
                    id="stock_status"
                    className={product.stock > 0 ? "greenColor" : "redColor"}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p align="justify">
                  <ShowMoreText lines={2} more="More" less="Less">
                    {product.description}
                  </ShowMoreText>
                </p>
                <hr />
                <p id="product_seller mb-3">
                  Sold by: <strong>{product.seller}</strong>
                </p>

                {user ? (
                  <button
                    id="review_btn"
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={() => {
                      setTempRating(true);
                      setReviewShow(true);
                    }}
                  >
                    Submit Your Review
                  </button>
                ) : (
                  <div className="alert alert-danger mt-5" type="alert">
                    <Link to="/login">Login</Link> to post your review
                  </div>
                )}

                <Modal show={reviewShow} onHide={() => setReviewShow(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Submit Review</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ul className="stars">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <li
                          className="star"
                          key={index}
                          id={`star${index}`}
                          onClick={() => starClick(index)}
                          onMouseOver={() => starMover(index)}
                          onMouseOut={() => starMout()}
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </li>
                      ))}
                    </ul>

                    <textarea
                      name="review"
                      id="review"
                      className="form-control mt-3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      id={tempRating ? "review_btn_greyed" : "review_btn"}
                      className="my-3 float-end px-4 text-white"
                      onClick={() => {
                        reviewHandler();
                        setReviewShow(false);
                      }}
                      disabled={tempRating}
                    >
                      Submit
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <ListReviews reviews={product.reviews} />
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
