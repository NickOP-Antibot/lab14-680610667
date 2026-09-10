import { useEffect, useState } from "react";
import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

export default function DashboardPage() {
  const [users, setUsers] = useState<Registrant[]>([]);

  useEffect(() => {
    // ดึงข้อมูลจาก LocalStorage เมื่อคอมโพเนนต์โหลดขึ้นมา
    const storedUsers = localStorage.getItem("marathon-users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <h2>Dashboard</h2>
      
      {/* Conditional Rendering + Render Component */}
      {users.length > 0 ? (
        <>
          <p className="mt-3 mb-2">ผู้ลงทะเบียนแล้ว ({users.length} คน)</p>
          <div className="d-flex flex-column">
            {users.map((user) => (
              // ใช้ user.id เป็น key ได้เลยเพราะเราสร้างไว้ตอนบันทึกข้อมูล
              <UserRegisterCard key={user.id} registrant={user} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-muted mt-3">ยังไม่มีผู้ลงทะเบียน</p>
      )}
    </div>
  );
}