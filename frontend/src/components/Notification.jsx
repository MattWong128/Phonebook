import React from "react";

const Notification = ({ message }) => {
  if (message == null) {
    console.log("Message null");
    return null;
  }
  if (message.includes("Added")) return <div className='success'>{message}</div>;
  return <div className='error'>{message}</div>;
};

export default Notification;
