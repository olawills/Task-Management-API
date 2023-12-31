import AppError from "../../common/utils/appError.js";
import { catchAsync } from "../../common/utils/errorHandler.js";
import TaskModel from "../../modules/schemas/tasks.schema.js";
import { create, deleteOne, getAll, update } from "../repository/index.js";

export const getTaskById = catchAsync(async (req, res, next) => {
  console.log("get task by id", req.body);

  const id = req.params.id;
  const data = await getAll(id, TaskModel);

  return res.status(200).json({
    status: "success",
    data,
  });
});

export const getTaskByDate = catchAsync(async (req,res,next)=>{

})

// This endpoint creates user task, just run it on postman add the neccessary body
//  and proceed to create your task
export const createTask = catchAsync(async (req, res, next) => {
  console.log("get task details", req.body);
  const data = await create(TaskModel, req.body);
   return res.status(200).json({
    status: "success",
    data,
  });
});



export const getCompletedTaskById = catchAsync(async (req, res, next) => {
  // Get query parameters for filtering
  const sortBy = req.query.sortBy || "title"; // Default sort by title
  const id = req.params.id

  const sortOptions = {
    title: 'title',
    date: 'date',
  };

  // const uncompletedTasks = await TaskModel.find(query, options);
  const completedTasks = await TaskModel.find({userId: id, completed: true })
  // .sort(sortOptions[sortBy]);
  if (!completedTasks.length)  return next(new AppError("No completed tasks found for your filters", 404))

  return res.status(200).json({
    message: "completed tasks found successfully",
    completedTasks,
  });
});

export const getUnCompletedTaskById = catchAsync(async (req, res, next) => {
  console.log("get uncompleted", req.res)
  const uncompletedTask = await TaskModel.find({userId: req.params.id, completed: false})
  if (!uncompletedTask.length)  return next(new AppError("No uncompleted tasks found for your filters", 404))

  return res.status(200).json({
    message: "uncompleted tasks found successfully",
    uncompletedTask,
  })

});


export const searchTask = catchAsync(async (req, res, next) => {});

export const updateTaskById = catchAsync(async (req, res, next) => {
  console.log("get updated task details", req.body);
  const id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "completed",
    "description",
    "title",
    "pirority",
    "date",
    "time",
    "categoryId",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) return next(new AppError("Invalid Updates", 400));

  const task = await update(id, TaskModel);
  updates.forEach((update) => (task[update] = req.body[update]));

  await task.save();

  return res.status(200).json({
    status: "success",
    task,
  });
});

export const deleteTaskById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new AppError("ID does not exist", 401));
  await deleteOne(id, TaskModel);
  return res.status(200).json({
    status: "success",
    message: "sucessfully deleted task",
  });
});

