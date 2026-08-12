const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Officer",
  },

  officers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
    },
  ],

  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],

  pendingReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],

  stats: {
    pending: {
      type: Number,
      default: 0,
    },
    inprogress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Number,
      default: 0,
    },
    rejected: {
      type: Number,
      default: 0,
    },
  },
});

const NagarPalikaSchema = new mongoose.Schema({
  nagarId: {
    type: String,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  mainOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Officer",
    required: true,
  },

  boundary: {
    type: [[Number]],
    required: true,
  },

  office: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },

  others: {
    type: DepartmentSchema,
    default: () => ({}),
  },

  roads: {
    type: DepartmentSchema,
    default: () => ({}),
  },

  electricity: {
    type: DepartmentSchema,
    default: () => ({}),
  },

  sanitation: {
    type: DepartmentSchema,
    default: () => ({}),
  },

  water: {
    type: DepartmentSchema,
    default: () => ({}),
  },
});

module.exports = mongoose.model("NagarPalika", NagarPalikaSchema);