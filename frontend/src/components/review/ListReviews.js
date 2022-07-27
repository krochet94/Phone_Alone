import React from "react";
import "../../App.css";

const ListReviews = ({ reviews }) => {
  return (
    <>
      <div className="container container-fluid mt-5">
        <div className="reviews w-90">
          <h3>Other's Reviews:</h3>
          <hr />
          {reviews &&
            reviews.map((review) => (
              <div className="review-card my-3" key={review._id}>
                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${review.rating * 5}%` }}
                  ></div>
                </div>
                <p className="review_user">by {review.name}</p>
                <p className="review_comment">{review.comment}</p>
                <hr />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ListReviews;
