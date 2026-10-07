let express = require("express");
let agentsRouter = express.Router();
let mongoose = require("mongoose");
let Agents = require("../Models/Agents");
const cache = require("../config/cacche");
const redis = require("../config/redis");

const LIST_KEY = "cache:/agents";

const clearAgentsCache = async (id) => {
  try {
    const keys = [LIST_KEY];
    if (id) keys.push(`cache:/agents/${id}`);
    await redis.del(...keys);
  } catch (err) {
    console.error("Cache clear failed:", err.message);
  }
};

// CREATE
agentsRouter.post("/agents", async (req, res) => {
  try {
    const { fullName, phone, email, serviceArea, status } = req.body;
    const agent = await new Agents({ fullName, phone, email, serviceArea, status }).save();
    await clearAgentsCache();
    res.status(201).json({ message: "Agent created successfully", data: agent });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("POST /agents error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


agentsRouter.get("/agents", cache(300), async (req, res) => {
  try {
    const agents = await Agents.find().select("fullName phone email serviceArea status createdAt updatedAt").lean();
    res.status(200).json({ data: agents });
  } catch (err) {
    
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ONE (cached)
agentsRouter.get("/agents/:id", cache(300), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agent id" });
    }
    const agent = await Agents.findById(id).lean();
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json({ data: agent });
  } catch (err) {
    console.error("GET /agents/:id error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// UPDATE
agentsRouter.patch("/agents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agent id" });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Send at least one field to update" });
    }
    if (req.body.email !== undefined) {
      return res.status(400).json({ message: "Email cannot be updated" });
    }
    const allowed = ["fullName", "phone", "serviceArea", "status"];
    if (!Object.keys(req.body).every((k) => allowed.includes(k))) {
      return res.status(400).json({ message: "Update not allowed" });
    }

    const agent = await Agents.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    await clearAgentsCache(id);
    res.status(200).json({ message: "Agent updated successfully", data: agent });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("PATCH /agents/:id error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

agentsRouter.delete("/agents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agent id" });
    }
    const agent = await Agents.findByIdAndDelete(id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    await clearAgentsCache(id);
    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    console.error("DELETE /agents/:id error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = agentsRouter;