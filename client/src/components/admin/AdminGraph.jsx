import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", in: 0, out: 0 },
  { day: "Tue", in: 0, out: 0 },
  { day: "Wed", in: 0, out: 0 },
  { day: "Thu", in: 0, out: 0 },
  { day: "Fri", in: 0, out: 0 },
  { day: "Sat", in: 0, out: 0 },
  { day: "Sun", in: 0, out: 0 },
];

function AdminGraph() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-[#003459]">
          Weekly Movement Overview
        </h2>
        <p className="text-xs text-gray-400">
          Entries and exits recorded per day
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F5" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="in"
              name="Inside"
              stroke="#007EA7"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="out"
              name="Outside"
              stroke="#DC2626"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminGraph;