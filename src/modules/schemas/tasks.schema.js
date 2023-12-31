import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Task must belong to user"],
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Task must have a Category"],
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    taskPirority: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    subTask: {
      type: Object,
    }
  },
  { timestamps: true }
);

taskSchema.index({ categoryId: 1 }, { unique: false });
// taskSchema.pre(/^find/, function (next) {
//   this.find({ id: { $ne: false } });
//   next();
// });

const TaskModel = mongoose.model("Tasks", taskSchema);

// module.exports = TaskModel
export default TaskModel;
