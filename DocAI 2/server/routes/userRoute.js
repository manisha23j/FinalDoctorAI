const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const dayjs = require("dayjs");
const customParse = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParse);

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exist!", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error creating user", success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect!", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).send({
        message: "Login successful",
        success: true,
        data: {
          token,
          userId: user._id, 
        },
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.get("/get-user-info-by-id/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from route params
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching user info", error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} applied for doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res
      .status(200)
      .send({ message: "Doctor account applied successfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error applying", success: false, error });
  }
});

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const seenNotifications = user.seenNotifications;
      const unseenNotifications = user.unseenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;

      res
        .status(200)
        .send({
          message: "All notifications marked as seen",
          success: true,
          data: updatedUser,
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({
          message: "Error marking the notifications",
          success: false,
          error,
        });
    }
  }
);

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res
      .status(200)
      .send({
        message: "All notifications deleted",
        success: true,
        data: updatedUser,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Error deleting the notifications",
        success: false,
        error,
      });
  }
});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res
      .status(200)
      .send({
        message: "Doctors fetched successfully",
        success: true,
        data: doctors,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching details", success: false, error });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = dayjs(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = dayjs(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `${req.body.userInfo.name} has requested the appointment`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res
      .status(200)
      .send({ message: "Appointment booked successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error", success: false, error });
  }
});

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = dayjs(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = dayjs(req.body.time, "HH:mm")
      .subtract(30, "minute")
      .toISOString();
    const toTime = dayjs(req.body.time, "HH:mm")
      .add(30, "minute")
      .toISOString();

    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res
        .status(200)
        .send({ message: "Appointment not available", success: false });
    } else {
      return res
        .status(200)
        .send({ message: "Appointment available", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error", success: false, error });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res
      .status(200)
      .send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching appointments", success: false, error });
  }
});

module.exports = router;
