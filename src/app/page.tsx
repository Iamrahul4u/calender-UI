"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  startOfMonth,
} from "date-fns";
import "react-day-picker/dist/style.css";
import "@/app/calender.css";
import { toast } from "sonner";

// Fake Demo Data Only for testing purpose
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

  // Calculate available days per month dynamically
  const availableDaysPerMonth = useMemo(() => {
    const months: { [key: string]: number } = {};

    const current = new Date(calendarData.calStart);
    const endDate = new Date(calendarData.calEnd);

    while (current <= endDate) {
      const monthKey = format(current, "MMMM yyyy"); // Example: "March 2025"
      const totalDays = getDaysInMonth(current); // Total days in the month

      const firstDay = startOfMonth(current);
      const lastDay = endOfMonth(current);
      const monthDays = eachDayOfInterval({ start: firstDay, end: lastDay });

      // Count holidays, weekends, and unavailable days
      const holidaysInMonth = allHolidays.filter(
        (date) => format(date, "MMMM yyyy") === monthKey
      ).length;
      const weekendsInMonth = monthDays.filter(
        (date) => getDay(date) === 0 || getDay(date) === 6
      ).length;
      const unavailableInMonth = availableDates.filter(
        (date) => format(date, "MMMM yyyy") === monthKey
      ).length;

      // Calculate remaining available days
      const availableDays =
        totalDays - (holidaysInMonth + weekendsInMonth + unavailableInMonth);

      months[monthKey] = availableDays;
      current.setMonth(current.getMonth() + 1); // Move to next month
    }

    return months;
  }, [availableDates, allHolidays]);

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
    // Replace the url with the real backend endpoint
    try {
      const endpointUrl = process.env.VITE_ENDPOINT_URL;
      if (!endpointUrl) {
        toast.error("Endpoint URL is not defined");
        return;
      }

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
    <div className="calendar-container flex">
      {/* Calendar Section */}
      <div className="calendar-content">
        <div className="flex md:flex-row flex-col  justify-around align-middle">
          {/* Single Calendar */}
          <div className="calendar-card">
            <h1 className="calendar-title">Select Available Dates</h1>
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
          {/* Side Panel: Remaining Available Days per Month */}
          <div className="side-panel p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="side-panel-title text-xl font-semibold mb-4">
              Remaining Available Days
            </h2>
            <table className="side-table w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 p-2">Month</th>
                  <th className="border-b-2 p-2">Available Days</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(availableDaysPerMonth).map(([month, days]) => (
                  <tr key={month}>
                    <td className="border-b p-2">{month}</td>
                    <td
                      className={`border-b p-2 ${
                        days > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {days > 0 ? days : "Fully Booked"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <button
          className="submit-btn cursor-pointer bg-blue-500 p-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {output && (
          <pre className="output">
            <code>{output}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
