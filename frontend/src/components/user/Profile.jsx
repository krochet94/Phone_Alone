import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";

const Profile = () => {
  const { loading, user } = useSelector((state) => state.auth);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Your Profile"} />
          <div className="container container-fluid">
            <h2 className="mt-5">My Profile</h2>
            <div className="row justify-content-around mt-5 user-info">
              <div className="col-12 col-md-3">
                <figure className="avatar avatar-profile">
                  <img
                    className="rounded-circle img-fluid"
                    src={user.avatar.url}
                    alt={user.name}
                  />
                </figure>
                <Link
                  to="/me/update"
                  id="edit_profile"
                  className="btn btn-primary w-100 my-5"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="col-12 col-md-5">
                <h4>Full Name</h4>
                <p>{user.name}</p>

                <h4>Email Address</h4>
                <p>{user.email}</p>

                <h4>Joined on</h4>
                <p>{String(user.createdAt).substring(0, 10)}</p>

                {user.role !== "admin" && (
                  <Link to="/orders/me" className="btn btn-danger w-100 mt-5">
                    My Orders
                  </Link>
                )}

                <Link
                  to="/password/update"
                  className="btn btn-primary w-100 mt-3"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
