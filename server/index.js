import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors({
  origin: [
    'https://fh-rep-cwwj.vercel.app', // 👈 ใส่ลิงก์เว็บหน้าบ้าน Vercel ของคุณตรงนี้
    'http://localhost:5173'            // สำหรับรันเทสในคอมเครื่องตัวเอง
  ],
  credentials: true
}));
app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))


const TodoSchema = new mongoose.Schema({
  text: String
})


const Todo = mongoose.model("Todo", TodoSchema)

// GET
app.get("/todos", async (req, res) => {
  const data = await Todo.find()
  res.json(data)
})

// POST
app.post("/todos", async (req, res) => {
  const newTodo = await Todo.create(req.body)
  res.json(newTodo)
})

// test route
app.get("/", (req, res) => {
  res.send("API working")
})

app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id)
  res.json({ message: "Deleted" })
})

app.put("/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updated)
})
// app.listen(3000, () => console.log("Server running"))
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});   