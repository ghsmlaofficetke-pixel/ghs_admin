interface TaskWidgetProps {
  title: string;
  time: number;
}

const TaskWidget = ({ title, time }: TaskWidgetProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50  rounded-xl shadow-md p-4 font-bold hover:shadow-lg transition">
      <h4 className="text-[#275799] mb-1 text-[18px]  tracking-wide">
  {title}
</h4>

      <p className="text-[20px] font-semibold bg-gradient-to-r text-[#9c1315] bg-clip-text">
        ಒಟ್ಟು = {time}
      </p>
    </div>
  );
};

export default TaskWidget;