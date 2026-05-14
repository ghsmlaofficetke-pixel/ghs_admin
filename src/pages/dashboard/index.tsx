import Tasks from "./Tasks";
import ProjectChart from "./ProjectChart";

const Dashboard = () => {
  return (
    // 70px topbar + 12px top padding + 12px bottom padding from main's p-3 = 94px
    // -m-3 to bleed out of main's padding, then add own px for content
    <div className="-m-3 h-[calc(100vh-130px)] overflow-y-auto overflow-x-hidden">

      {/* CONTENT WRAPPER */}
      <div className="w-full px-2 sm:px-3 pt-3 pb-6 flex flex-col gap-3">

        {/* TASKS CARD */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-1 sm:p-2">
          <Tasks />
        </div>

        {/* CHART CARD */}
        <div className="w-full bg-white rounded-2xl shadow-sm">
          <ProjectChart />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;