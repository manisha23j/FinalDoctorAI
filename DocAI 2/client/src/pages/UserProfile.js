import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

function UserProfile() {
  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();

  const getUserData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {
          userId: params.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Profile</h1>
      <hr />
      <div>
        <h1 className="card-title">{user.name}</h1>
        <p>
          <b>Email: </b>
          {user.email}
        </p>
        <p>
          <b>Account created at: </b>
          {dayjs(user.createdAt).format("DD-MM-YYYY")}
        </p>
      </div>
    </Layout>
  );
}

export default UserProfile;
