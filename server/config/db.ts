import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wmspro")
    console.log("MongoDB connected")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default connectDB
