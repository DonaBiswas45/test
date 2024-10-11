const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("./Userschema");
const Assignment = require("./Assignmentschema");
const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();

router.use(fileUpload());

// GET ALL ADMINS
router.get("/admins", verifyTokenAndAdmin, async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true });
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPLOAD ASSIGNMENT
router.post("/upload", async (req, res) => {
  try {
    const { userId, adminId, task } = req.body;


    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const file = req.files.Assignment; 

    const newAssignment = new Assignment({
      userId,
      adminId,
      task,
      file: {
        filename: file.name,
        data: file.data, 
        contentType: file.mimetype,
      },
    });

    await newAssignment.save();

    res.status(201).json({ message: 'Assignment uploaded successfully.', assignment: newAssignment });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading assignment.', error: err });
  }
});

module.exports = router;
