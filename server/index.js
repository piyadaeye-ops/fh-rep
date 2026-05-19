import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
const bcrypt = require('bcryptjs');

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

// เชื่อมต่อ MongoDB (ดึงค่าจากไฟล์ .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Backend connected to MongoDB'))
  .catch(err => console.error('❌ Connection error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // 'user' หรือ 'admin'
    status: { type: String, default: 'pending' } // 'pending' (รอตรวจสอบ), 'approved' (อนุมัติแล้ว)
});
const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  detail: String,
  owner: String,
  deadLine_date: Date,
  assigner: String,
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

const menuSchema = new mongoose.Schema({
  menu_name: String,
  level_access: String,
  sub_menu_name: Array,
  createdAt: { type: Date, default: Date.now }
});
const Menu = mongoose.model('Menu', menuSchema);


// สร้าง Schema สำหรับ User
// const User = mongoose.model('User', new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   status: { type: String, default: 'pending' }
// }));

// API สำหรับสมัครสมาชิก
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ message: 'ชื่อผู้ใช้นี้อาจจะมีอยู่ในระบบแล้ว' });
  }
});


// API สำหรับ Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้นี้' });

    // ตรวจสอบว่าได้รับการอนุมัติหรือยัง
    if (user.status === 'pending') {
        return res.status(403).json({ message: 'บัญชีของคุณกำลังรอการตรวจสอบจาก Admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    res.json({ 
        message: 'เข้าสู่ระบบสำเร็จ', 
        user: { username: user.username, role: user.role } 
    });
    //Old Code not approve status by admin
    /*const { username, password } = req.body;

    // 1. ค้นหา User จาก username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' });
    }

    // 2. ตรวจสอบรหัสผ่าน (เปรียบเทียบรหัสที่กรอกมา กับรหัสที่เข้ารหัสไว้ใน DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // 3. ถ้าถูกต้อง ให้ส่งข้อความตอบกลับ (หรือส่งข้อมูล User กลับไป)
    res.json({
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: {
        id: user._id,
        username: user.username
        
      }
    });*/

  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ระบบหลังบ้าน' });
  }
});

// ดึงรายชื่อคนที่รออนุมัติ
app.get('/admin/users', async (req, res) => {
    const pendingUsers = await User.find({}, { password: 0 });
    res.json(pendingUsers);
});

app.get('/users', async (req, res) => {
    const pendingUsers = await User.find({}, { password: 0 });
    res.json(pendingUsers);
});

app.get('/menus', async (req, res) => {
    const pendingMenu = await Menu.find();
    res.json(pendingMenu);
});
// app.post('/menu', async (req, res) => {
//      const { userId } = req.body;
//     await User.findByIdAndUpdate(userId, { status: 'approved' });
//     res.json({ message: 'อนุมัติเรียบร้อยแล้ว' });
// });

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});


// กดยอมรับการสมัคร
app.post('/admin/approve', async (req, res) => {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { status: 'approved' });
    res.json({ message: 'อนุมัติเรียบร้อยแล้ว' });
});

// วางไว้ก่อน app.listen
app.use((err, req, res, next) => {
  console.error("🔥 เกิด Error ที่ Backend:");
  console.error(err.stack); // ดูว่าบรรทัดไหนในโค้ดเราที่เป็นต้นเหตุ
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 1. Route สำหรับแก้ไข Role
app.patch('/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await User.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: "Status updated successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 2. Route สำหรับลบ User
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});



// app.listen(5000, () => console.log('🚀 Server is running on port 5000'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});