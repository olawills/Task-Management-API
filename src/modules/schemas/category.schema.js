import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Category must belong to user"],
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    color: {
      type: String,
      required: [true, "Category color is required"],
    },
  },
  { timestamps: true }
);

// categorySchema.pre(/^find/, function (next) {
//   this.find({ id: { $ne: false } });
//   next();
// });

const CategoryModel = mongoose.model("Categories", categorySchema);

export default CategoryModel;
