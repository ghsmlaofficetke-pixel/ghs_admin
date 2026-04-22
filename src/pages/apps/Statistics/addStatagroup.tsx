import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { createStatgroup } from "../../../api/statgroup";

const AddGroupModal = ({ close, taluk }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    dispatch(createStatgroup({ name, taluk }));
    close();
  };

  return (

     <div
    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
    onClick={close}
  >
    <div
      className="bg-white p-5 rounded w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >


        <h2 className="text-lg font-bold mb-4">
          Add Group
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
          className="w-full border p-2 mb-4 rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddGroupModal;