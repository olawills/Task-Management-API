export const getOne = async (id, model) => {
  return await model.findOne({ userId: id });
};

export const getAll = async (id, model) => {
  return await model.find({ userId: id });
};

export const create = async (model, body) => {
  return await new model(body).save();
};

export const update = async (id, model) => {
  return await model.findOne({ _id: id });
};

export const deleteOne = async (id, model) => {
  return await model.findByIdAndDelete(id);
};
