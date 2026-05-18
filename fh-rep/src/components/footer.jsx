import { useEffect, useState } from "react"
import "../styles/footer.css"

function Footer() {

  return (
    <div className="home-container">
    <footer className="notice-bar">
        <span className="notice-title">Notices!</span>
        <div className="notice-content-wrapper">
          <div className="notice-text-scroll">
            ⚠️ อย่าลืมตรวจสอบกำหนดส่งงาน (Deadline)...
          </div>
        </div>
      </footer>
      <div className="version-text">Version 0.1</div>
    </div>
  )
}

export default Footer

