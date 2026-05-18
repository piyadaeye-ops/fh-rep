import { useEffect, useState } from "react"
import Header from "../components/header"
import "../styles/homePage.css"
import Footer from "../components/footer"

function HomePage({ setPage, setIsLoggedIn, user }) {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // 🌟 ดึงข้อมูล User ที่ Login มาจาก localStorage (เพื่อให้ระบบจำได้ว่าเป็นใคร)
  const [currentUser, setCurrentUser] = useState(null);

  

  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      setCurrentUser(sessionData.user);
    }
  }, []);

  const [newTask, setNewTask] = useState({ 
    detail: '', 
    owner: '', 
    deadLine_date: '', 
    assigner: '' 
  });

  const isUrgent = (deadLineDate) => {
  if (!deadLineDate) return false;

  // 1. ตั้งค่าเฉพาะวันที่ของวันนี้ (ตัดเศษชั่วโมง/นาที/วินาที ทิ้งทั้งหมด)
  const today = new Date();
  const todayTimestamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  // 2. ตั้งค่าเฉพาะวันที่ของวันส่งงาน (ตัดเศษชั่วโมง/นาที/วินาที ทิ้งทั้งหมด)
  const deadline = new Date(deadLineDate);
  const deadlineTimestamp = Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

  // 3. คำนวณหาจำนวนต่างของวันแบบเป๊ะๆ 
  const diffTime = deadlineTimestamp - todayTimestamp;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // ใช้ Math.floor แทนเพื่อให้ได้เลขจำนวนเต็มของวันจริง

  // 🌟 เงื่อนไขใหม่: 
  // diffDays <= 1  -> คือวันนี้ (0) และวันพรุ่งนี้ (1)
  // diffDays < 0   -> คือรวมงานที่ "เกินกำหนดส่งแล้ว" (เช่น เกินมา 1 วัน จะเป็น -1)
  return diffDays <= 1; 
};

  const filteredTasks = selectedUser 
    ? tasks.filter(task => task.owner === selectedUser)
    : tasks;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('${import.meta.env.VITE_API_URL}/users'); 
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

  const handleAddTask = async (e) => {
    e.preventDefault();
    // 🌟 ใส่ชื่อคนล็อกอินเป็น Assigner อัตโนมัติ
    const taskData = { ...newTask, assigner: currentUser?.username || 'System' };
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (response.ok) {
        fetchTasks();
        setIsModalOpen(false);
        setNewTask({ detail: '', owner: '', deadLine_date: '', assigner: '' });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const myUrgentTasks = tasks.filter(task => 
  task.owner === currentUser?.username && isUrgent(task.deadLine_date)
  
);


  return (
    <>
    <div className="home-container">
      {/* 1. Header คงที่ */}
      {/* <Header 
        setPage={setPage} 
        urgentTasks={myUrgentTasks}
        setIsLoggedIn={setIsLoggedIn} 
        // onLogout={onLogout} // 🌟 เปลี่ยนจาก handleLogout เป็น onLogout ตามชื่อ Props ที่รับมา
      /> */}

      <div className="home-content-wrapper">

      
    <aside className="sidebar-members">
      <h3>Members</h3>
          <div className="members-list">
            <div
              className={`member-item all-users ${!selectedUser ? 'active' : ''}`}
              onClick={() => setSelectedUser(null)}
            >
              <p>แสดงงานทั้งหมด</p>
            </div>
            
            {members.map((member) => (
              <div 
                className={`member-item ${selectedUser === member.username ? 'active' : ''}`} 
                key={member._id}
                onClick={() => setSelectedUser(member.username)}
              >
                <div className="member-avatar">
                  <span className="avatar-letter">
                    {member.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="member-info">
                  <p className="member-name">{member.username}</p>
                  <span className="online-dot"></span>
                </div>
              </div>
            ))}
          </div>
    </aside>
    
    <main className="main-tasks">
          
        
     {/* 🌟 ใช้ Fragment แทน home-container เพื่อไม่ให้โครงสร้างซ้อน */}
      <div className="task-header">
        <h4>
          {selectedUser ? `Tasks for: ${selectedUser}` : "All Project/Tasks"} 
        </h4>
      </div>
      <table className="task-table">
        <thead>
          <tr>
            <th>รายละเอียด</th>
            <th>ผู้ดูแล</th>
            <th>กำหนดส่ง</th>
            <th>ผู้มอบหมาย</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? filteredTasks.map((task) => {
            const urgent = isUrgent(task.deadLine_date);
            const isMyTask = task.owner === currentUser?.username;

            const isOverdue = urgent && new Date(task.deadLine_date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);

            return (
              <tr 
                  key={task._id} 
                  className={urgent && isMyTask ? (isOverdue ? "row-overdue" : "row-urgent") : ""}
                >
                  <td>{task.detail}</td>
                  <td>{task.owner}</td>
                  <td style={{ 
                    color: urgent && isMyTask ? 'red' : 'inherit', 
                    fontWeight: urgent && isMyTask ? 'bold' : 'normal' 
                  }}>
                    {task.deadLine_date ? new Date(task.deadLine_date).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : '-'}
                    {/* 🌟 ถ้าเกินกำหนดให้โชว์ไฟกะพริบแดงเข้ม ถ้าใกล้ส่งโชว์แจ้งเตือนธรรมดา */}
                    {urgent && isMyTask && (isOverdue ? " 🚨 Overdue" : " ⚠️")}
                  </td>
                  <td>{task.assigner}</td>
                </tr>
            );
          }) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                ไม่มีงานที่มอบหมาย
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="fab-button" onClick={() => setIsModalOpen(true)}>+</button>

      {/* 🌟 Modal สำหรับเพิ่มงานคงไว้ที่นี่ */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>เพิ่มงานใหม่</h3>
            <form onSubmit={handleAddTask}>
              <input 
                type="text" 
                placeholder="รายละเอียดงาน" 
                value={newTask.detail}
                onChange={(e) => setNewTask({...newTask, detail: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="ชื่อผู้ดูแล" 
                value={newTask.owner}
                onChange={(e) => setNewTask({...newTask, owner: e.target.value})}
                required 
              />
              <input 
                type="date" 
                value={newTask.deadLine_date}
                onChange={(e) => setNewTask({...newTask, deadLine_date: e.target.value})}
                required 
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">บันทึก</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
    </div>
    {/* <Footer/> */}
    
    </div>
    </>
  )
}

export default HomePage

