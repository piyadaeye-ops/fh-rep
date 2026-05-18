import { useEffect, useState } from "react"
import "../styles/tabBossPage.css"


function TabBossPage({ setPage, user }){
    const [menu, setMenu] = useState([]);
    const [showMenu, setshowMenu] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const handleMenuClick = (menuId) => {
    if (selectedMenu === menuId) {
      setSelectedMenu(null); // ถ้าคลิกตัวที่เปิดอยู่แล้ว ให้หุบเก็บขึ้นไป
    } else {
      setSelectedMenu(menuId); // ถ้าคลิกตัวอื่น ให้เปิดตัวนั้น (และปิดตัวเก่า)
    }
  };

    useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/menus`); 
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);


     return (
    
    <div className="boss-container">
        <>
        <div className="boss-container-wrapper">
          <aside className="boss-side-container">
          <h3>Boss Management</h3>
          <div className="menu-boss-management">
            {menu.map((menu) => {
          const isOpen = selectedMenu === menu._id;

          return (
            <div key={menu._id} className="menu-group-wrapper">
              
              {/* 🌟 เมนูหลัก (เช่น บัญชีระบบขาย) */}
              <div 
                className={`main-menu-item ${isOpen ? 'active-item' : ''}`}
                onClick={() => handleMenuClick(menu._id)}
              >
                <p>{menu.menu_name}</p>
                {/* เพิ่มลูกศรชี้ซ้าย/ล่าง เพื่อความสวยงาม */}
                <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▶</span>
              </div>

              {/* 🌟 ส่วนของ Submenu ย่อย (จะเลื่อน slide ลงมาเมื่อ isOpen เป็น true) */}
              <div className={`submenu-container ${isOpen ? 'show-submenu' : ''}`}>
                {menu.sub_menu_name && menu.sub_menu_name.map((sub, index) => (
                  <div key={index} className="submenu-item">
                    <p>{sub}</p>
                  </div>
                ))}
              </div>

            </div>
          );
        })}

          </div>
        </aside>
        
        <main className="main-tasks">

        </main>
        </div>
        
        </>
    </div>
    
  )

}
export default TabBossPage