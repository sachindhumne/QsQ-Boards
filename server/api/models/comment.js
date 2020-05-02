"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema for comments object.
 */
let commentSchema = new Schema(
  {
    /**
     * comment for the task.
     */
    comment: {
      type: String,
      required: "comment is required",
    },
    /**
     * Associated TaskId.
     */
    taskId: {
      type: String,
      required: "associated task is required",
    },
    /**
     * author of the comment
     */
    author: {
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

module.exports = mongoose.model("Comments", commentSchema);
