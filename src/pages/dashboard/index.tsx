
import Tasks from "./Tasks";
import ProjectChart from "./ProjectChart";

const Dashboard = () => {
  return (
    <>

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-1 sm:px-2  xl:px-2 py-0">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">

          {/* LEFT MAIN CONTENT */}
          <div className="xl:col-span-5 flex flex-col gap-3">

            {/* TASKS CARD */}
            <div className="w-full bg-white rounded-2xl shadow-sm p-1 sm:p-2">
              <Tasks />
            </div>

            {/* CHART CARD */}
            <div className="w-full bg-white rounded-2xl shadow-sm  ">
              <ProjectChart />
            </div>

          </div>


        </div>

      </div>
    </>
  );
};

export default Dashboard;