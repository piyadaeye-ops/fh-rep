import { useState } from 'react';

function RegisterPage({ goToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert("สมัครสำเร็จ! กรุณารอ Admin อนุมัติการใช้งาน");
      goToLogin();
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <div className="login-card">
      <h2>สมัครสมาชิก</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">ส่งคำขอสมัคร</button>
      </form>
      <button onClick={goToLogin}>ย้อนกลับไปหน้า Login</button>
    </div>
  );
}
export default RegisterPage;