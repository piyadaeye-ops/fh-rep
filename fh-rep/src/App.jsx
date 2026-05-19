import { useState, useEffect } from 'react'; // เพิ่ม useEffect ตรงนี้
import Header from './components/header';
import Footer from './components/footer';
import LoginPage from './pages/logInPage';
import HomePage from './pages/homePage';
import RegisterPage from './pages/RegisterPage';
import AdminAuthorPage from './pages/adminAuthorPage';
import TabBossPage from './pages/tabBossPage';
// import MainLayout from './pages/mainLayout';
// import ProfilePage from './pages/ProfilePage'; // อย่าลืม Import หน้า Profile ถ้ามีการใช้งาน

function App() {
  console.log("เช็ค URL ปัจจุบัน:", import.meta.env.VITE_API_URL);
// ถ้าขึ้น http://localhost:5000 แปลว่าผ่าน! 
// แต่ถ้าขึ้น undefined แปลว่าไฟล์ .env อยู่ผิดที่ หรือยังไม่ได้รีสตาร์ท npm run dev ครับ

fetch(`${import.meta.env.VITE_API_URL}/admin/users`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error fetching tasks:", err));
  
  const [page, setPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [tasks, setTasks] = useState([]);
  const isUrgent = (deadLineDate) => {
    if (!deadLineDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadLineDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 && diffDays >= 0;
  };

  // 🌟 3. คำนวณ urgentTasks ที่นี่เพื่อให้ส่งไป MainLayout ได้
  const urgentTasks = tasks.filter(task => 
    task.owner === user?.username && isUrgent(task.deadLine_date)
  );

  const [members, setMembers] = useState([]);

  // 🌟 4. ดึงข้อมูลงาน (เลือกทำตอน Login สำเร็จ หรือใน useEffect)
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${import.meta.env.VITE_API_URL}/tasks`)
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.log(err));
    }
  }, [isLoggedIn]);
  // 1. ตรวจสอบ Session เมื่อโหลด Component ครั้งแรก (Refresh หน้าเว็บ)
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
  
  if (savedSession) {
    const sessionData = JSON.parse(savedSession);
    const now = new Date().getTime();

    // ถ้าเวลาปัจจุบัน เกินเวลาที่ตั้งไว้ (30 นาที)
    if (now > sessionData.expiry) {
      localStorage.removeItem('userSession');
      setIsLoggedIn(false);
      setUser(null);
      setPage('login');
      alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
    } else {
      // ถ้ายังไม่หมดอายุ ให้ใช้งานต่อ
      setUser(sessionData.user);
      setIsLoggedIn(true);
      setPage('home');
    }
  }
  }, []);

  useEffect(() => {
  if (isLoggedIn) {
    // ตั้งเวลา 30 นาที (1,800,000 ms) ให้ทำงานครั้งเดียว
    const timer = setTimeout(() => {
      handleLogout(); // เรียกใช้ฟังก์ชัน Logout ที่เราทำไว้ก่อนหน้านี้
      alert("เซสชันของคุณหมดอายุเนื่องจากไม่มีการใช้งานนานเกินไป");
    }, 30 * 60 * 1000);

    // ล้าง Timer ทันทีถ้าผู้ใช้กด Logout เองก่อนเวลา หรือเปลี่ยนหน้า
    return () => clearTimeout(timer);
  }
}, [isLoggedIn]); // ทำงานเมื่อสถานะล็อกอินเปลี่ยนเป็น true

useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`); 
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
    fetchTasks();
  }, []);
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // 2. ฟังก์ชันเมื่อ Login สำเร็จ (ยุบรวมเหลืออันเดียว)
  const handleLoginSuccess = (userData) => {
    console.log("Login Success!", userData);
    const now = new Date().getTime(); // เวลาปัจจุบัน (Milliseconds)
    const sessionData = {
      user: userData,
      expiry: now + (30 * 60 * 1000) // เวลาปัจจุบัน + 30 นาที
    };
    setUser(userData);
    setIsLoggedIn(true);
    setPage('home');
    
    // บันทึกลง localStorage เพื่อทำ Session
    localStorage.setItem('userSession', JSON.stringify(sessionData));
  };

  // 3. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setPage('login');
  };

  // --- ส่วนการแสดงผล (Conditional Rendering) ---

  // กรณีล็อกอินแล้ว
  if (isLoggedIn) {
    return (
      <>
        {/* ส่ง handleLogout หรือ setIsLoggedIn ไปที่ Header */}
        <Header setPage={setPage} setIsLoggedIn={setIsLoggedIn} onLogout={handleLogout}/>
        
        {page === 'home' && <HomePage setPage={setPage}   /* 🌟 ต้องเพิ่มบรรทัดนี้เพื่อส่งฟังก์ชันไปให้หน้า Home */
          user={user} 
          setIsLoggedIn={setIsLoggedIn} />}
        {page === 'admin' && <AdminAuthorPage user={user} setPage={setPage}/>}
        {page === 'boss' && <TabBossPage user={user} setPage={setPage} />}
        {/* {page === 'profile' && <ProfilePage />} */}
      <Footer />
      </>
      
    );
  }
  
  console.log("Current Page State:", page);
  // กรณีที่ยังไม่ได้ล็อกอิน
  return (
    <div>
      {page === 'login' ? (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          goToRegister={() => setPage('register')} 
        />
      ) : (
        <RegisterPage 
          goToLogin={() => setPage('login')} 
        />
      )}
    </div>
  );
}

export default App;