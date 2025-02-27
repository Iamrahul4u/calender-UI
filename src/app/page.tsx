"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
import "react-day-picker/dist/style.css";
import "./calender.css";
import { toast } from "sonner";
const calendarData = {
  calStart: "2025-07-01",
  calEnd: "2026-06-30",
  holidays: [
    "2025-09-18",
    "2025-11-05",
    "2025-11-18",
    "2025-11-25",
    "2025-11-27",
  ],
  previouslySelectedDates: [
    "2025-07-16",
    "2025-07-08",
    "2025-07-23",
    "2025-07-29",
    "2025-07-28",
    "2025-07-17",
    "2025-07-24",
    "2025-07-03",
    "2025-09-17",
    "2025-09-16",
    "2025-09-09",
    "2025-09-10",
    "2025-09-11",
    "2025-12-18",
    "2026-02-18",
    "2026-02-17",
    "2026-02-16",
    "2026-02-23",
    "2026-02-24",
    "2026-02-25",
  ],
};

export default function CalendarPage() {
  const [holidayDates, setHolidayDates] = useState<Date[]>([]);
  const [calStart, setCalStart] = useState(new Date());
  const [calEnd, setCalEnd] = useState(new Date());
  const [month, setMonth] = useState(calStart || new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [output, setOutput] = useState("");

  const isHoliday = (date: Date) => {
    return holidayDates.some(
      (holiday) =>
        holiday.getDate() === date.getDate() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getFullYear() === date.getFullYear()
    );
  };

  // Function to check if a date is available
  const isAvailable = (date: Date) => {
    return availableDates.some(
      (available) =>
        available.getDate() === date.getDate() &&
        available.getMonth() === date.getMonth() &&
        available.getFullYear() === date.getFullYear()
    );
  };

  // CSS modifiers for the calendar
  const modifiers = {
    holiday: holidayDates,
    available: (date: Date) => isAvailable(date),
  };

  const modifiersStyles = {
    holiday: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "rgb(153, 27, 27)",
      border: "1px solid rgba(239, 68, 68, 0.5)",
    },
    available: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "rgb(21, 128, 61) ",
      border: `1px solid rgba(34, 197, 94, 0.5) `,
    },
  };

  const handleSubmit = async () => {
    // Convert selected dates to ISO strings
    const allSelected = availableDates.map((date) =>
      format(date, "yyyy-MM-dd")
    );
    const previouslySelected = calendarData.previouslySelectedDates;

    // Calculate newly selected and deselected dates
    const newlySelected = allSelected.filter(
      (date) => !previouslySelected.includes(date)
    );
    const newlyDeselected = previouslySelected.filter(
      (date) => !allSelected.includes(date)
    );

    // Prepare the payload
    const payload = [
      {
        urlParams: {
          UserID: "JohnDoe",
          RecID: "recvOsQGp6TgjCb5V",
          Action: "ShowCalendar",
        },
        newlySelectedDates: newlySelected,
        newlyDeselectedDates: newlyDeselected,
        allSelectedDates: allSelected,
      },
    ];
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
    } catch (error) {
      toast.error("Submission failed");
    }
  };

  useEffect(() => {
    console.log(holidayDates);
    console.log(availableDates);
  }, [holidayDates, availableDates]);
  return (
    <div className="calendar-container overflow-x-hidden">
      <h1 className="calendar-title">Calendar Selection</h1>

      {/* Calendars section */}
      <div className="time-range-picker flex justify-center items-center">
        <label htmlFor="calStart">Calendar Start:</label>
        <input
          type="date"
          id="calStart"
          min={format(new Date(), "yyyy-MM-dd")}
          value={format(calStart, "yyyy-MM-dd")}
          onChange={(e) => setCalStart(new Date(e.target.value))}
        />
        <label htmlFor="calEnd">Calendar End:</label>
        <input
          type="date"
          id="calEnd"
          min={format(new Date(), "yyyy-MM-dd")}
          className="ml-2 border-2 border-gray-300 rounded-md p-2"
          value={format(calEnd, "yyyy-MM-dd")}
          onChange={(e) => setCalEnd(new Date(e.target.value))}
        />
      </div>
      <div className="calendars-grid">
        {/* Holiday Calendar */}
        <div className="calendar-card">
          <h2 className="calendar-card-title holiday-title">Holiday Dates</h2>
          <DayPicker
            required
            mode="multiple"
            selected={holidayDates}
            onSelect={setHolidayDates}
            disabled={[
              { dayOfWeek: [0, 6] },
              { before: new Date() },
              { after: calEnd },
            ]}
            month={month}
            startMonth={calStart}
            endMonth={calEnd}
            onMonthChange={setMonth}
            className="holiday-calendar"
          />
        </div>

        {/* Available Dates Calendar */}
        <div className="calendar-card">
          <h2 className="calendar-card-title available-title">
            Available Dates
          </h2>
          <DayPicker
            required
            mode="multiple"
            selected={availableDates}
            onSelect={setAvailableDates}
            disabled={[
              { dayOfWeek: [0, 6] },
              { before: new Date() },

              { after: calEnd },
            ]}
            month={month}
            startMonth={calStart}
            endMonth={calEnd}
            onMonthChange={setMonth}
            className="available-calendar"
          />
        </div>

        {/* Combined View Calendar */}
        <div className="calendar-card">
          <h2 className="calendar-card-title">Combined View</h2>
          <DayPicker
            mode="single"
            modifiers={modifiers}
            month={month}
            onMonthChange={setMonth}
            modifiersStyles={modifiersStyles}
            className="combined-calendar"
            disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
            selected={(availableDates.from, availableDates.to)}
          />
        </div>
      </div>

      {/* Selected dates display */}
      <div className="selected-dates">
        {/* Holiday Dates Summary */}
        <div className="dates-summary holiday-summary">
          <h3>Selected Holiday Dates</h3>
          <div className="dates-list">
            {holidayDates.length > 0 ? (
              holidayDates.map((date, index) => (
                <span key={index} className="date-badge holiday-badge">
                  {format(date, "MMM d, yyyy")}
                </span>
              ))
            ) : (
              <p className="no-dates">No holiday dates selected</p>
            )}
          </div>
          {holidayDates.length > 0 && (
            <p className="dates-count">
              {holidayDates.length} holiday date
              {holidayDates.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
        <div className="dates-summary ">
          <h3>Selected Available Dates</h3>
          <div className="dates-list">
            {availableDates.length > 0 ? (
              availableDates.map((date, index) => (
                <span key={index} className="date-badge available-badge">
                  {format(date, "MMM d, yyyy")}
                </span>
              ))
            ) : (
              <p className="no-dates">No holiday dates selected</p>
            )}
          </div>
          {availableDates.length > 0 && (
            <p className="dates-count">
              {availableDates.length} holiday date
              {availableDates.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Available Dates Summary */}

        <div className="flex justify-center items-center">
          <button
            className="bg-blue-500 cursor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
          {output && (
            <button className="bg-blue-500 cursor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
              <a href="#output">See Output</a>
            </button>
          )}
        </div>
      </div>
      {output && (
        <div className="output" id="output">
          <h2>Output</h2>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
