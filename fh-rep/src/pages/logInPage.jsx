import { useState } from 'react';
import '../styles/LoginPage.css';

function LoginPage({ onLoginSuccess,goToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log("Data from Server:", data);
      if (response.ok) {
        alert("เข้าสู่ระบบสำเร็จ!");
        // ส่งข้อมูล user กลับไปที่ App.jsx (ถ้าต้องการ)
        onLoginSuccess(data.user); 
      } else {
        // แสดงข้อความจาก Backend เช่น "รหัสผ่านไม่ถูกต้อง"
        alert(data.message || "เกิดข้อผิดพลาด"); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("ไม่สามารถติดต่อ Server ได้ (ลองเช็คว่า node server.cjs รันอยู่หรือไม่)");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>เข้าสู่ระบบ</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} // เพิ่ม value
          onChange={(e) => setUsername(e.target.value)} 
          required // บังคับกรอก
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} // เพิ่ม value
          onChange={(e) => setPassword(e.target.value)} 
          required // บังคับกรอก
        />
        <button type="submit">Login</button>

        <div className="auth-footer" style={{ marginTop: '15px', fontSize: '14px' }}>
          <span>ยังไม่มีบัญชีใช่ไหม? </span>
          <button 
            type="button" 
            onClick={goToRegister} 
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            สมัครสมาชิกที่นี่
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;


