import Header from "../components/header";
import "../styles/homePage.css"; // 🌟 ต้อง Import CSS มาด้วยเพื่อให้ Sidebar/Footer มีสไตล์
import "../styles/header.css";

// 🌟 เพิ่ม setIsLoggedIn และ onLogout ในการรับ Props
function MainLayout({ 
  children,
  schildren, 
  setPage, 
  user, 
  urgentTasks, 
  members, 
  setSelectedUser, 
  selectedUser,
  setIsLoggedIn, // เพิ่มตัวนี้
  onLogout       // เพิ่มตัวนี้
}) {
  return (
    <div className="home-container">
      {/* 1. Header คงที่ */}
      <Header 
        setPage={setPage} 
        urgentTasks={urgentTasks}
        setIsLoggedIn={setIsLoggedIn} 
        onLogout={onLogout} // 🌟 เปลี่ยนจาก handleLogout เป็น onLogout ตามชื่อ Props ที่รับมา
      />

      <div className="home-content-wrapper">
        {/* 2. Sidebar คงที่ */}
        <aside className="sidebar-members">
          {/* ใส่โครง Sidebar รอไว้เลยครับ */}
          {schildren}
        </aside>

        {/* 3. Main Content (ส่วนที่เปลี่ยนไปตามหน้า) */}
        <main className="main-tasks">
          {children} 
        </main>
      </div>

      {/* 4. Footer คงที่ */}
      {/* <footer className="notice-bar">
        <span className="notice-title">Notices!</span>
        <div className="notice-content-wrapper">
          <div className="notice-text-scroll">
            ⚠️ ยินดีต้อนรับสมาชิกใหม่ทุกท่าน! อย่าลืมตรวจสอบกำหนดส่งงาน (Deadline)...
          </div>
        </div>
      </footer>
      <div className="version-text">Version 0.1</div> */}
    </div>
  );
}

export default MainLayout;