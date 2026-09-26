const User = require("../models/User");
const Leave = require("../models/Leave");

const getDashboardStats = async (req, res) => {
  try {
    const [studentCount, facultyCount, securityCount, recentUsers, outsideCount] =
      await Promise.all([
        User.countDocuments({ role: "Student" }),
        User.countDocuments({ role: "Faculty" }),
        User.countDocuments({ role: "Security" }),
        User.find({})
          .select("name department role photoUrl createdAt")
          .sort({ createdAt: -1 })
          .limit(5),
        Leave.countDocuments({ outpassStatus: "Outside" }),
      ]);

    const totalStudents = studentCount;

    const insideCount = Math.max(totalStudents - outsideCount, 0);

    const today = new Date();
    const day = today.getDay();

    const mondayOffset = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);
    sunday.setHours(0, 0, 0, 0);

    const movement = await Leave.aggregate([
      {
        $match: {
          $or: [
            {
              exitTime: {
                $gte: monday,
                $lt: sunday,
              },
            },
            {
              entryTime: {
                $gte: monday,
                $lt: sunday,
              },
            },
          ],
        },
      },
      {
        $project: {
          exitTime: 1,
          entryTime: 1,
        },
      },
    ]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const weeklyData = days.map((day) => ({
      day,
      in: 0,
      out: 0,
    }));

    movement.forEach((leave) => {
      if (leave.exitTime) {
        const date = new Date(leave.exitTime);
        const index = (date.getDay() + 6) % 7;

        if (index >= 0 && index < 7) {
          weeklyData[index].out += 1;
        }
      }

      if (leave.entryTime) {
        const date = new Date(leave.entryTime);
        const index = (date.getDay() + 6) % 7;

        if (index >= 0 && index < 7) {
          weeklyData[index].in += 1;
        }
      }
    });

    res.status(200).json({
      stats: {
        students: studentCount,
        faculty: facultyCount,
        security: securityCount,
      },
      campus: {
        inside: insideCount,
        outside: outsideCount,
      },
      recentUsers,
      weeklyMovement: weeklyData,
    });
  } catch (err) {
    console.error("GET ADMIN DASHBOARD ERROR:", err);

    res.status(500).json({
      message: "Server error while fetching dashboard data",
    });
  }
};

module.exports = {
  getDashboardStats,
};