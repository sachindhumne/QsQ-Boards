"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema for userStory object.
 */
let taskSchema = new Schema(
  {
    /**
     * Title of the tasks.
     */
    title: {
      type: String,
      required: "title is required",
    },
    /**
     * Task description.
     */
    description: {
      type: String,
    },
    /**
     * Task status.
     */
    status: {
      type: String,
      default: "New",
    },
    /**
     * Priority for the tasks
     */
    priority: {
      type: String,
      default: "Low",
    },
    /**
     * Assignee for the tasks
     */
    assignee: {
      userName: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Tasks", taskSchema);
