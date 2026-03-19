import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  allUsers,
  deleteUser,
  clearErrors,
} from "../../actions/userActions";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import SimpleTable from "../layouts/SimpleTable";
import "../../App.css";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DELETE_USER_RESET = "DELETE_USER_RESET";
  const { loading, error, users } = useSelector((state) => state.allUsers);
  const { isDeleted } = useSelector((state) => state.user);

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "User ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    users.forEach((user) => {
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        actions: (
          <>
            <Link
              to={`/admin/user/${user._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <FontAwesomeIcon icon={faPencil} />
            </Link>
            <button
              className="btn btn-danger py-1 px-2"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this user?")
                ) {
                  dispatch(deleteUser(user._id));
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
    dispatch(allUsers());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("User deleted succesfully...");
      dispatch({ type: DELETE_USER_RESET });
      navigate("/admin/users");
    }
  }, [dispatch, error, isDeleted, navigate]);

  return (
    <>
      <MetaData title="All Users - Admin" />
      <div className="row">
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 px-5">
          <h1 className="my-4">All Users</h1>
          {loading ? (
            <Loader />
          ) : (
            <SimpleTable
              data={setUsers()}
              className="px-1"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserList;
