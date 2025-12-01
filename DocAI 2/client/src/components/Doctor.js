import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";

function Doctor({ doctor }) {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    navigate(`/book-appointment/${doctor._id}`);
  };

  return (
    <div className="card p-2">
      <h1 className="card-title">
        {doctor.firstName} {doctor.lastName}
      </h1>
      <hr />
      <p>
        <b>Specialization: </b>
        {doctor.specialization}
      </p>
      <p>
        <b>Phone No: </b>
        {doctor.phoneNumber}
      </p>
      <p>
        <b>Address: </b>
        {doctor.address}
      </p>
      <p>
        <b>Fee per visit (Rs): </b>
        {doctor.feePerConsultation}
      </p>
      <p>
        <b>Experience (Yrs): </b>
        {doctor.experience}
      </p>
      <p>
        <b>Timings: </b>
        {doctor.timings[0]} - {doctor.timings[1]}
      </p>
      <button onClick={handleSendMessage} className="formal-button">
        Book Appointment <IoIosSend />
      </button>
    </div>
  );
}

export default Doctor;
