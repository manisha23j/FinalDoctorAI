import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function MessageDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [senderName, setSenderName] = useState(""); // State to store sender name
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

const userName = user?.name;

  const fetchMessageById = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/message/get-message-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());

      if (response.data.success) {
        setMessage(response.data.data);
        fetchSenderName(response.data.data.sender);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong while fetching the message");
    }
  };

  const fetchSenderName = async (senderId) => {
    try {
     console.log("this is sender id" + senderId);
      const response = await axios.get(
        `/api/user/get-user-info-by-id/${senderId}`
      );

      if (response.data.success) {
        console.log(response);
        setSenderName(response.data.data.name);
      } else {
        toast.error("Failed to fetch sender's name");
      }
    } catch (error) {
      console.error("Error fetching sender's name:", error);
      toast.error("Something went wrong while fetching sender's name");
    }
  };

  const sendReply = async () => {
    if (replyContent.trim() === "") {
      alert("Please write a message before sending.");
      return;
    }

    setLoading(true); 
    try {
      const response = await axios.post("/api/message/send-message", {
        senderId: message.recipient,
        userName,
        senderModel: message.recipientModel,
        recipientId: message.sender,
        recipientModel: message.senderModel,
        content: replyContent,
      });
      if (response.status === 200) {
        toast.success("Message sent successfully");
        setReplyContent("");
        navigate("/");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchMessageById();
  }, [id]);

  return (
    <Layout>
      <h1 className="page-title">Message Details</h1>
      {message ? (
        <div className="card p-2 mt-2">
          <div className="card-text">
            <b>From:</b> {message.senderModel} ({senderName}){" "}
            <br />
            <b>Message:</b> {message.content} <br />
          </div>
          {/* Reply Section */}
          <div className="mt-4">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            ></textarea>
            <button className="btn btn-primary mt-2" onClick={sendReply}>
              Send Reply
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
}

export default MessageDetail;
