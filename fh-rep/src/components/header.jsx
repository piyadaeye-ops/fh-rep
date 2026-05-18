import { useState } from 'react';
import homeIcon from '../assets/home_icon.svg';
import tabIcon from '../assets/tab_icon.svg';
import notiIcon from '../assets/noti_icon.svg';
import userIcon from '../assets/user_icon.svg';
import '../styles/header.css';

function Header({ setPage, setIsLoggedIn,onLogout, urgentTasks }) {
  const [showMenu, setShowMenu] = useState(false); 
  const [showNoti, setShowNoti] = useState(false);
  const [showTab, setShowTab] = useState(false);
  
  const handleLogout = () => {
  // 1. ลบข้อมูลออกจาก localStorage ให้เกลี้ยง
  localStorage.removeItem('userSession');
  localStorage.clear(); // (ทางเลือก) ล้างทุกอย่างที่ค้างใน storage ของโดเมนนี้
  
  // 2. รีเซ็ต State กลับเป็นค่าเริ่มต้น
  setIsLoggedIn(false);
  setUser(null);
  
  // 3. ดีดกลับไปหน้า Login
  setPage('login');
  
  console.log("Logged out successfully");
};


  return (
    
    <div className="header-box">
      <div className="header-box-icon-left">
        <div className="icon-bg">
          <button className="icon-btn" onClick={() => setPage('home')}>
            <img src={homeIcon} alt="Home" style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
        <div className="dropdown-wrapper">
            <div className="icon-bg"> 
              <button className="icon-btn" onClick={() => {setShowTab(!showTab);setShowNoti(false); setShowMenu(false); }}>
                <img src={tabIcon} alt="Tab" style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className={`tab-dropdown-label ${showTab? 'active' : ''}`}>
              <div className="tab-dropdown-item" onClick={() => { if (typeof setPage === 'function') { // เช็คก่อนว่าเป็นฟังก์ชันไหม
                  setPage('boss'); 
                  setShowTab(false); 
              } else {
                  console.error("setPage is missing!");
              }
              }}>
                BOSS
              </div>
                {/* <div className="tab-dropdown-item" onClick={() => { if (typeof setPage === 'function') { // เช็คก่อนว่าเป็นฟังก์ชันไหม
                  // setPage('admin'); 
                  // setShowMenu(false); 
                  console.log("go page");
              } else {
                  console.log("setPage is missing!");
              }
              }}> */}
                <div className="tab-dropdown-item" onClick={() => console.log("go dfjkl")}>
                Programs
              </div>
              <div className="tab-dropdown-item" onClick={() =>console.log("go page")}>
                Helps!
              </div>
            </div>
        </div>
        
      </div>

      <div className="header-box-icon-right">
        {/* 🌟 ส่วนปุ่มแจ้งเตือนพร้อม Dropdown รายการ */}
        <div className="dropdown-wrapper">
          <div className='icon-bg'>
            <button className="icon-btn" onClick={() => { setShowNoti(!showNoti); setShowMenu(false); setShowTab(false);}}>
              <img src={notiIcon} alt="Notification" style={{ width: '20px', height: '20px' }} />
              {urgentTasks?.length > 0 && (
                <span className="noti-badge">{urgentTasks.length}</span>
              )}
            </button>
          </div>

          {/* {showNoti && ( */}
            <div className={`dropdown-label noti-dropdown ${showNoti ? 'active' : ''}`}>
              <div className="noti-header">งานด่วนที่ต้องส่ง</div>
              <div className="noti-list">
                {urgentTasks?.length > 0 ? (
                  urgentTasks.map((task) => (
                    <div key={task._id} className="noti-item">
                      <p className="noti-detail">{task.detail}</p>
                      <span className="noti-date">📅 {new Date(task.deadLine_date).toLocaleDateString('en-GB')}</span>
                    </div>
                  ))
                ) : (
                  <div className="noti-empty">ไม่มีงานด่วนค้างอยู่</div>
                )}
              </div>
            </div>

        </div>
        
        
        <div className="dropdown-wrapper ">
          <div className='icon-bg'>
            <button className="icon-btn" onClick={() =>{ setShowMenu(!showMenu); setShowNoti(false);setShowTab(false);}}>
              <img src={userIcon} alt="Users" style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* {showMenu && ( */}
            
            <div className={`dropdown-label ${showMenu ? 'active' : ''}`}>
              <div className="dropdown-item" onClick={() => console.log('Profile')}>
                โปรไฟล์
              </div>
                <div className="dropdown-item" onClick={() => { if (typeof setPage === 'function') { // เช็คก่อนว่าเป็นฟังก์ชันไหม
                  setPage('admin'); 
                  setShowMenu(false); 
              } else {
                  console.error("setPage is missing!");
              }
              }}>
                จัดการระบบ
              </div>
              <div className="dropdown-item logout" onClick={() => {
                  if (onLogout) {
                      onLogout(); // เรียกใช้ฟังก์ชันจาก App.jsx
                  } else {
                      // กรณีไม่ได้ส่ง onLogout มา ให้จัดการเองตรงนี้
                      localStorage.removeItem('userSession');
                      setIsLoggedIn(false);
                      setPage('login');
                  }
                  setShowMenu(false); // ปิดเมนู dropdown
                }}>
                ออกจากระบบ
              </div>
            </div>
          
        </div>
      </div>

      
    </div>
  );
} // ✅ ปีกกาปิดตัวสุดท้ายของ Header ต้องอยู่ตรงนี้!

export default Header;

{/* <div className="dropdown-item logout" onClick={setIsLoggedIn(false)}>  */}
  {/* ปรับเป็นแบบนี้แทน
  <div className="dropdown-item logout" onClick={() => {
      localStorage.removeItem('userSession'); // ล้าง session
      setIsLoggedIn(false);
      setPage('login');
  }}>
    ออกจากระบบ
  </div> */}
// </div>