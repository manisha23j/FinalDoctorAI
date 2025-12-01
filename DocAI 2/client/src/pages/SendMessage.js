import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "antd";
import { useParams , useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function SendMessage() {
  const { doctorName, doctorId } = useParams(); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipientId, setRecipientId] = useState(null); 
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const senderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = user?.isAdmin ? "ADMIN" : user?.isDoctor ? "DOCTOR" : "USER";
  const userName = user?.name;
  const senderModel = role;
  const recipientModel = "DOCTOR";

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
         const response = await axios.get(`/api/doctor/get-doctor/${doctorId}`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
        if (response.data.success) {
          setRecipientId(response.data.data.userId);
        } else {
          alert("Failed to fetch doctor details.");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        alert("Something went wrong while fetching doctor details.");
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleSendMessage = async () => {
    if(senderId==recipientId) {
      toast.error("You cannot send a message to yourself.");
    }
    if (message.trim() === "") {
      alert("Please write a message before sending.");
      return;
    }

    if (!senderId) {
      toast.error("You cannot send a message to yourself.");
      return;
    }
    if (!recipientId) {
      toast.error("Doctor details are not loaded yet. Please wait.");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.post("/api/message/send-message", {
        senderId,
        userName,
        senderModel,
        recipientId,
        recipientModel,
        content: message,
      });
      if (response.status===200) {
        toast.success("Message sent successfully");
        setMessage(""); 
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

  return (
    <Layout>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <Card
          className="send-message-card"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#273469",
              marginBottom: "20px",
            }}
          >
            Send a Message to Dr. {doctorName}
          </h2>
          <Input.TextArea
            rows={5}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              borderRadius: "8px",
              borderColor: "rgba(128, 128, 128, 0.521)",
              marginBottom: "15px",
              resize: "none",
            }}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            loading={loading} // Show loading indicator
            style={{
              width: "100%",
              backgroundColor: "#273469",
              borderColor: "#273469",
              borderRadius: "8px",
            }}
            disabled={!recipientId} // Disable button if recipientId is not loaded
          >
            Send Message
          </Button>
        </Card>
      </div>
    </Layout>
  );
}

export default SendMessage;
