"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";
import "@/app/calender.css";
import { toast } from "sonner";

const calendarData = {
  calStart: "2025-06-01",
  calEnd: "2026-06-30",
  holidays: ["2025-07-18", "2025-08-25", "2025-08-05", "2025-08-27"],
  previouslySelectedDates: [],
};

export default function CalendarPage() {
  const allHolidays = calendarData.holidays.map((date) => new Date(date));

  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [output, setOutput] = useState("");

  // Function to check if a date is a holiday
  const isHoliday = (date: Date) => {
    return allHolidays.some((holiday) => isSameDay(holiday, date));
  };

  // Handle user selecting available dates
  const handleAvailableClick = (day: Date) => {
    if (isHoliday(day)) return; // Prevent selecting holidays

    setAvailableDates((prevAvailable) => {
      const isAlreadySelected = prevAvailable.some((date) =>
        isSameDay(date, day)
      );

      return isAlreadySelected
        ? prevAvailable.filter((date) => !isSameDay(date, day)) // Remove if clicked again
        : [...prevAvailable, day]; // Add to available dates
    });
  };

  // Submit selected dates
  const handleSubmit = async () => {
    const allSelected = availableDates.map((date) =>
      format(date, "yyyy-MM-dd")
    );

    const payload = {
      UserID: "JohnDoe",
      RecID: "recvOsQGp6TgjCb5V",
      Action: "ShowCalendar",
      selectedAvailableDates: allSelected,
    };

    try {
      const response = await fetch(
        "https://hook.us1.make.com/27ks4hk5m8mjgyd1i8bhw19kpripluud",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      setOutput(JSON.stringify(payload, null, 2));
      if (response.ok) {
        toast.success("Dates submitted successfully!");
      } else {
        toast.error("Error submitting data");
      }
    } catch {
      toast.error("Submission failed");
    }
  };

  // Calendar styles
  const modifiers = {
    holiday: allHolidays,
    available: availableDates,
  };

  const modifiersStyles = {
    holiday: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "rgb(153, 27, 27)",
      border: "1px solid rgba(239, 68, 68, 0.5)",
    },
    available: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "rgb(21, 128, 61)",
      border: "1px solid rgba(34, 197, 94, 0.5)",
    },
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Select Available Dates</h1>

      {/* Single Calendar */}
      <div className="calendar-card">
        <DayPicker
          mode="multiple"
          selected={availableDates}
          onDayClick={handleAvailableClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          startMonth={new Date(calendarData.calStart)}
          endMonth={new Date(calendarData.calEnd)}
          disabled={[...allHolidays, { dayOfWeek: [0, 6] }]}
          showOutsideDays
        />
      </div>

      {/* Selected Available Dates Summary */}
      <div className="selected-dates">
        <h3>Selected Available Dates</h3>
        <div className="dates-list">
          {availableDates.length > 0 ? (
            availableDates.map((date, index) => (
              <span key={index} className="date-badge available-badge">
                {format(date, "MMM d, yyyy")}
              </span>
            ))
          ) : (
            <p className="no-dates">No dates selected</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button className="submit-btn bg-blue-500 p-2" onClick={handleSubmit}>
        Submit
      </button>

      {/* Output */}
      {output && (
        <div className="output">
          <h2>Submitted Data</h2>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
