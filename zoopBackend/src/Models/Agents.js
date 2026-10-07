let mongoose = require("mongoose");
let validator = require("validator");

let AgentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [2, "Full name must be at least 2 characters"],
      maxLength: [60, "Full name must be at most 60 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      set: (value) =>
        validator.whitelist(String(value), "0-9").replace(/^(91|0)(?=\d{10}$)/, ""),
      validate(value) {
        if (value.length !== 10) {
          throw new Error("Phone number must be exactly 10 digits");
        }
        let isvalidmobile = validator.isMobilePhone(value, "en-IN");
        if (!isvalidmobile) {
          throw new Error("Phone must be a valid Indian mobile number");
        }
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        let isvalidemail = validator.isEmail(value);
        if (!isvalidemail) {
          throw new Error("Email is not valid");
        }
      },
    },
    serviceArea: {
      type: String,
      required: [true, "Service area is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be either active or inactive",
      },
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agents", AgentSchema);