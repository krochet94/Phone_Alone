import React, { useEffect, useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layouts/MetaData";
import { updatePassword, clearErrors } from "../../actions/userActions";

const UpdatePassword = () => {
  const UPDATE_PASSWORD_RESET = "UPDATE_PASSWORD_RESET";
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const { error, isUpdated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password changed successfully");
      navigate("/me");
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("password", password);
    dispatch(updatePassword(formData));
  };
  return (
    <>
      <MetaData title={"Change Password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">New Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn update-btn w-100 mt-4 mb-3"
              disabled={loading ? true : false}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
