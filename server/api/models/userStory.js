"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema for userStory object.
 */
let userStorySchema = new Schema(
  {
    /**
     * Title of the user story.
     */
    title: {
      type: String,
      required: "title is required",
    },
    /**
     * User Story description.
     */
    description: {
      type: String,
    },
    /**
     * ProjectId of the user story
     */
    projectId: {
      type: String,
      required: "projectId is required",
    },

    /**
     * UserStory status.
     */
    status: {
      type: String,
      default: "New",
    },

    /**
     * Story Points for the userStory
     */
    storyPoints: {
      type: Number,
      default: 0,
    },
    /**
     * Priority for the userStory
     */
    priority: {
      type: String,
      default: "Low",
    },
    /**
     * Tasks for the userStory
     */
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("UserStories", userStorySchema);
