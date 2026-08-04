import { LogIn, LogOut } from "lucide-react";

function CampusStatus() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Students Inside Campus
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#003459]">0</h2>
            <p className="mt-1 text-xs text-gray-400">
              Students currently present inside campus
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <LogIn size={20} className="text-green-600" />
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Students Outside Campus
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#003459]">0</h2>
            <p className="mt-1 text-xs text-gray-400">
              Students currently outside campus
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <LogOut size={20} className="text-red-500" />
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-red-500"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default CampusStatus;