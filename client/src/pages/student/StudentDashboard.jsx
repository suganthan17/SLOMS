import { useState, useEffect } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentNavbar from "../../components/student/StudentNavbar";
import { FileText, Clock, CheckCircle, IdCard } from "lucide-react";

function StudentDashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, outpasses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/leaves/my", { credentials: "include" });
        const data = await res.json();
        const leaves = data.leaves || [];

        setStats({
          pending: leaves.filter((l) => l.status === "Pending").length,
          approved: leaves.filter((l) => l.status === "Approved").length,
          rejected: leaves.filter((l) => l.status === "Rejected").length,
          outpasses: leaves.filter((l) => l.status === "Approved").length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Pending Requests", value: stats.pending, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Approved Leaves", value: stats.approved, icon: CheckCircle, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Rejected", value: stats.rejected, icon: FileText, bg: "bg-red-50", color: "text-red-500" },
    { label: "Active Outpasses", value: stats.outpasses, icon: IdCard, bg: "bg-blue-50", color: "text-[#007EA7]" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <StudentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StudentNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your leave and outpass activity.</p>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">{card.label}</p>
                      <h2 className="mt-2 text-3xl font-bold text-[#003459]">
                        {loading ? "—" : card.value}
                      </h2>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                      <Icon size={20} className={card.color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;