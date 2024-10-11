const
  {   
    verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin } = 
  require("./verifyToken");
const Assignment = require("./Assingmentschema");
const router = require("express").Router();


//GET USER
router.get("/assignments", verifyTokenAndAdmin, async (req, res) => {
 try{ 
      const adminId = req.user.id; 
      const assignments = await Assignment.find({ adminId }).populate('userId', 'name'); 
  
      res.status(200).json(assignments); 
    } catch (err) {
      res.status(500).json(err);
    }
});

// accept 
router.post("/assignments/:id/accept", verifyTokenAndAdmin, async (req, res) => {
  try {
    
    const assignment = await Assignment.findOne({ _id: req.params.id, adminId: req.user.id });

    if (!assignment) {
      return res.status(404).json("Assignment not found or not tagged to this admin");
    }


    assignment.status = 'accepted';
    await assignment.save();

    res.status(200).json({ message: "Assignment accepted", assignment });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/assignments/:id/reject", verifyTokenAndAdmin, async (req, res) => {
  try {
 
    const assignment = await Assignment.findOne({ _id: req.params.id, adminId: req.user.id });

 
    if (!assignment) {
      return res.status(404).json("Assignment not found or not tagged to this admin");
    }

    if (assignment.status === 'rejected') {
      return res.status(400).json("Assignment is already rejected");
    }

 
    assignment.status = 'rejected';
    await assignment.save();

    res.status(200).json({ message: "Assignment rejected successfully", assignment });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;