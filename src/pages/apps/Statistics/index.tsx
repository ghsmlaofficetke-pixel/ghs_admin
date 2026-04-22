import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchGroupByTaluk,
  statgroupSelector,
} from "../../../api/statgroup";

import {
  fetchDataByGroup,
  statdataSelector,
  deleteStatdata,
} from "../../../api/statdata";

import AddGroupModal from "./addStatagroup";
import AddDataModal from "./addStatadata";

import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list: groups = [] } = useSelector(statgroupSelector);
  const { list: data = [] } = useSelector(statdataSelector);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [taluk, setTaluk] = useState("ತರೀಕೆರೆ ತಾಲ್ಲೂಕು");
  const [groupId, setGroupId] = useState("");
  const [search, setSearch] = useState("");

  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openDataModal, setOpenDataModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  /* ================= FETCH GROUPS ================= */
  useEffect(() => {
    if (taluk) {
      dispatch(fetchGroupByTaluk(taluk));
      setGroupId("");
    }
  }, [taluk]);

  /* ================= DEFAULT GROUP ================= */
  useEffect(() => {
    if (groups.length > 0 && !groupId) {
      const defaultGroup = groups.find((g: any) => g.name === "ಶಿಕ್ಷಣ");
      setGroupId(defaultGroup ? defaultGroup._id : groups[0]._id);
    }
  }, [groups]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (groupId) {
      dispatch(fetchDataByGroup(groupId));
    }
  }, [groupId]);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((item: any) =>
      item.title?.toLowerCase().includes(q) ||
      item.value?.toString().includes(q)
    );
  }, [data, search]);

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-gray-100">

      {/* ================= HEADER ================= */}
      <div className="bg-white shadow px-3 py-3 flex flex-col gap-3 sticky top-0 z-20">

        {/* MOBILE */}
        <div className="flex items-center justify-between sm:hidden">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
          >
            <FaArrowLeft size={14} />
          </button>

          <h1 className="font-bold text-sm flex-1 text-center">
            ಸಂಖ್ಯಾ ಮಾಹಿತಿ
          </h1>

          <div className="w-8" />
        </div>

        {/* DESKTOP */}
        <div className="hidden sm:flex items-center justify-between">

          <div className="flex items-center gap-3">
            {["ತರೀಕೆರೆ ತಾಲ್ಲೂಕು", "ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು"].map((t) => (
              <button
                key={t}
                onClick={() => setTaluk(t)}
                className={`px-3 py-1 rounded-full text-sm ${
                  taluk === t
                    ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <h1 className="font-bold text-lg">ಸಂಖ್ಯಾ ಮಾಹಿತಿ</h1>

          <div className="flex items-center gap-2">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />

            {groupId && (
              <button
                onClick={() => {
                  setEditData(null);
                  setOpenDataModal(true);
                }}
                className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-3 py-1 rounded text-sm"
              >
                + ಸೇರಿಸಿ
              </button>
            )}
          </div>
        </div>

        {/* GROUPS */}
        <div className="flex gap-2 overflow-x-auto">
          {groups?.map((g: any) => (
            <button
              key={g._id}
              onClick={() => setGroupId(g._id)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                groupId === g._id ? "bg-green-200" : "bg-gray-200"
              }`}
            >
              {g.name}
            </button>
          ))}

          <button
            onClick={() => setOpenGroupModal(true)}
            className="bg-blue-600 text-white px-3 rounded-full"
          >
            + 
          </button>
        </div>

        {/* MOBILE SEARCH */}
        <div className="flex gap-2 sm:hidden">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-2 rounded text-sm"
          />

          {groupId && (
            <button
              onClick={() => {
                setEditData(null);
                setOpenDataModal(true);
              }}
              className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-3 rounded"
            >
              + ಸೇರಿಸಿ
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="flex-1 overflow-hidden p-2">
  <div className="bg-white rounded-xl shadow h-full flex flex-col">

    {/* 🔥 SCROLL AREA */}
    <div className="flex-1 w-full overflow-x-auto">

      <table className="min-w-[600px] md:min-w-full border text-sm page-break-table">

        {/* HEADER */}
        <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-20 shadow">
          <tr>
            <th className="border p-2 w-[80px] text-center whitespace-nowrap">
              Sl.No
            </th>

            <th className="border p-2 min-w-[220px] md:min-w-[250px]">
              ವಿವರಣೆ
            </th>

            <th className="border p-2 w-[150px] text-right whitespace-nowrap">
              ಸಂಖ್ಯೆ
            </th>

            <th className="border p-2 w-[100px] text-center whitespace-nowrap">
              ಕ್ರಿಯೆ
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-400">
                No Data Found
              </td>
            </tr>
          ) : (
            filteredData.map((item: any, index: number) => (
              <tr key={item._id} className="hover:bg-gray-50">

                <td className="border p-2 text-center whitespace-nowrap">
                  {index + 1}
                </td>

                <td className="border p-2 break-words">
                  {item.title}
                </td>

                <td className="border p-2 text-right whitespace-nowrap">
                  {item.value}
                </td>

                <td className="border p-2 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-3">
                    <FiEdit
                      onClick={() => {
                        setEditData(item);
                        setOpenDataModal(true);
                      }}
                      className="text-blue-500 cursor-pointer"
                    />

                    <FiTrash2
                      onClick={() => setDeleteId(item._id)}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  </div>
</div>

      {/* MODALS */}
      {openGroupModal && (
        <AddGroupModal taluk={taluk} close={() => setOpenGroupModal(false)} />
      )}

      {openDataModal && (
        <AddDataModal
          group={groupId}
          groups={groups}
          taluk={taluk}
          editData={editData}
          close={() => {
            setOpenDataModal(false);
            setEditData(null);
          }}
        />
      )}

      {/* DELETE */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white p-5 rounded-xl w-full max-w-sm shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-3 text-red-600">
              ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
            </h2>

            <p className="text-sm text-gray-700 mb-4">
              ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?
              <br />
              ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                ರದ್ದುಮಾಡಿ
              </button>

              <button
                onClick={() => {
                  dispatch(deleteStatdata(deleteId, groupId));
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                ಅಳಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;