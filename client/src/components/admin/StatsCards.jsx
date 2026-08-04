import { Users, GraduationCap, ShieldCheck } from "lucide-react";

const stats = [
  {
    title: "Students",
    value: 0,
    subtitle: "Registered Students",
    icon: Users,
    bg: "bg-blue-50",
    color: "text-[#007EA7]",
  },
  {
    title: "Faculty",
    value: 0,
    subtitle: "Teaching Staff",
    icon: GraduationCap,
    bg: "bg-indigo-50",
    color: "text-indigo-600",
  },
  {
    title: "Security",
    value: 0,
    subtitle: "Security Staff",
    icon: ShieldCheck,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {card.title}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#003459]">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}
              >
                <Icon size={20} className={card.color} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">{card.subtitle}</p>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                Total
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;