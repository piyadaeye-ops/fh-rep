import { useEffect, useState } from "react"
// import Header from "../components/header"
import "../styles/AdminAuthorPage.css"

function adminAuthorPage({user,setPage,}){
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        console.log(user.role);
        if (user && user.role ==='admin'){
            setIsAdmin(true);
            console.log("Access Granted: Admin Detected");
        }else{
            alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!")
            setPage('home');
        }
    },[user,setPage]);

    useEffect(() => {
        if (isAdmin) {
            const fetchUsers = async () => {
                try {
                    // ปรับ URL ให้ตรงกับ Backend Port 5000 ของคุณ
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`); 
                    const data = await response.json();
                    setUsers(data);
                    // console.log(data[0]._id+data[0].username);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setLoading(false);
                }
            };
            fetchUsers();
        }
    }, [isAdmin]);

    if(!isAdmin){
        return <div style={{ padding: '20px' }}>กำลังตรวจสอบสิทธิ์...</div>;
    }

    const handleUpdateStatus= async (userId, currentStatus) => {
        const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    if (!window.confirm(`ยืนยันการเปลี่ยนสถานะ ${newStatus}?`)) return;
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

            if (response.ok) {
                // อัปเดต State ในหน้าจอทันทีโดยไม่ต้อง Refresh
                setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
                alert("อัปเดตสิทธิ์เรียบร้อยแล้ว");
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    }

    
    return (
    <div className="admin-page-layout">
            <div className="admin-table-container">
                <div className="admin-header">
                    <h1>รายชื่อผู้ขอสิทธิ์เข้าใช้งาน</h1>
                    <p>จัดการ Role และสถานะสมาชิกในระบบ</p>
                </div>

                {loading ? (
                    <p>กำลังโหลดข้อมูล...</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>ชื่อผู้ใช้งาน</th>
                                    <th>สถานะ </th>
                                    <th>Role</th>
                                    <th>การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.username}</td>
                                        <td>
                                            <span className={`role-badge ${item.status}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.role}</td>
                                        <td>
                                            {item.status !== 'approved' && (
                                                <button className="approve-btn-unapp" onClick={() => handleUpdateStatus(item._id, item.status)}>
                                                อัปเดตสถานะ
                                                </button>
                                            )
                                            }
                                            {item.status !== 'pending' && (
                                                <button className="approve-btn-app" onClick={() => handleUpdateStatus(item._id, item.status)}>
                                                เปลี่ยนสถานะ
                                                </button>
                                            )
                                            }
                                            {/* ปุ่มสมมติสำหรับการจัดการในอนาคต */}
                                            
                                            
                                            <button className="delete-btn" onClick={() => alert(`ลบ: ${item.username}`)}>
                                                ลบผู้ใช้
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
  );
};

export default adminAuthorPage
