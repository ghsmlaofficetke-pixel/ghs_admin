import { useEffect, useState, lazy, Suspense } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ModalLayout } from "../../../components/HeadlessUI";

const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";

/* ======================= Types ======================= */
interface EventForm {
  time: string;
  description: string;
  location?: string;
}

interface TPFormValues {
  date: string;
  events: EventForm[];
}

interface AddEditEventProps {
  isOpen: boolean;
  onClose: () => void;
  isEditable?: boolean;
  eventData?: any | null;
  defaultDate?: string;
  onAddEvent: (data: TPFormValues) => void;
  onUpdateEvent: (data: TPFormValues) => void;
  onRemoveEvent: () => void;
}

/* ======================= Time Options ======================= */
const generateTimeOptions = () => {
  const times: string[] = [];
  const periods = ["AM", "PM"];
  for (let h = 1; h <= 12; h++) {
    for (let m = 0; m < 60; m += 15) {
      const mm = m.toString().padStart(2, "0");
      periods.forEach((p) => times.push(`${h}:${mm} ${p}`));
    }
  }
  return times;
};
const TIME_OPTIONS = generateTimeOptions();

/* ======================= Input Class ======================= */
const INPUT_CLASS =
  "w-full rounded-xl border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

/* ======================= Quill Modules ======================= */
const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ color: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

/* ======================= Helpers ======================= */
const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const toInputDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/* ======================= Validation ======================= */
const schema = yup.object({
  date: yup.string().required("Date is required / ದಿನಾಂಕ ಅಗತ್ಯವಿದೆ"),
  events: yup
    .array()
    .of(
      yup.object({
        time: yup.string().nullable(),
        description: yup
          .string()
          .required("Description is required / ವಿವರ ಅಗತ್ಯವಿದೆ"),
        location: yup.string().nullable(),
      })
    )
    .min(1, "At least one event is required"),
});

/* ======================= Component ======================= */
const AddEditEvent = ({
  isOpen,
  onClose,
  isEditable,
  eventData,
  defaultDate,
  onAddEvent,
  onUpdateEvent,
}: AddEditEventProps) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<TPFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: defaultDate || "",
      events: [{ time: "", description: "", location: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "events",
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEditable && eventData) {
      reset({
        date: toInputDate(eventData.date),
        events: (eventData.events || []).map((ev: any) => ({
          time: ev.time || "",
          description: ev.description || "",
          location: ev.location || "",
        })),
      });
    } else {
      reset({
        date: defaultDate || "",
        events: [{ time: "", description: "", location: "" }],
      });
    }
  }, [isOpen, isEditable, eventData, defaultDate, reset]);

  const onSubmit = (data: TPFormValues) => {
  const cleanedData = {
    ...data,
    events: data.events.map((ev) => ({
      ...ev,
      description: ev.description, // ✅ KEEP HTML
    })),
  };

  isEditable ? onUpdateEvent(cleanedData) : onAddEvent(cleanedData);
  onClose();
};

  return (
    <ModalLayout
      showModal={isOpen}
      toggleModal={onClose}
      panelClassName="w-[95%] sm:w-[90%] md:w-full max-w-3xl mx-auto dark:bg-white rounded-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
        <h3 className="text-base sm:text-lg font-bold">
          {isEditable
            ? "Edit Today Plan"
            : "Add Today Plan"}
        </h3>
        <button onClick={onClose} className="text-xl font-bold">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4 sm:px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Date */}
          <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">
              Date (ದಿನಾಂಕ)
            </label>
            <input
              type="date"
              {...register("date")}
              className={INPUT_CLASS}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Events */}
          {fields?.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm sm:text-base">
                  Event ಕಾರ್ಯಕ್ರಮ {index + 1}
                </h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Time */}
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    Time (ಸಮಯ)
                  </label>
                  <select
                    {...register(`events.${index}.time`)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Select Time</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    Location (ಸ್ಥಳ)
                  </label>
                  <input
                    type="text"
                    {...register(`events.${index}.location`)}
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-sm">
                    Description (ವಿವರಣೆ)
                  </label>
                  <Controller
                    control={control}
                    name={`events.${index}.description`}
                    render={({ field }) => (
                      <Suspense fallback={<div>Loading editor...</div>}>
                        <ReactQuill
                          {...field}
                          modules={QUILL_MODULES}
                          className="w-full dark:text-black bg-white rounded-xl"
                        />
                      </Suspense>
                    )}
                  />
                  {errors.events?.[index]?.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.events[index].description?.message}
                    </p>
                  )}
                </div>

              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({ time: "", description: "", location: "" })
            }
            className="w-full rounded-xl bg-green-600 text-white py-2 sm:py-3 text-sm sm:text-base font-semibold"
          >
            + Add Another Event (ಮತ್ತೊಂದು ಕಾರ್ಯಕ್ರಮ ಸೇರಿಸಿ)
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-4 sm:px-6 py-4 border-t">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white font-semibold"
          >
            Save
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default AddEditEvent;