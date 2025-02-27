"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
import "react-day-picker/dist/style.css";
import "./calender.css";
import { toast } from "sonner";

export default function CalendarPage() {
  const [holidayDates, setHolidayDates] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  const [availableDates, setAvailableDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

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
    if (!availableDates.from || !availableDates.to) return false;

    return (
      isWithinInterval(date, {
        start: availableDates.from,
        end: availableDates.to,
      }) && !isHoliday(date)
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
  useEffect(() => {
    console.log(holidayDates);
    console.log(availableDates);
  }, [holidayDates, availableDates]);
  return (
    <div className="calendar-container overflow-x-hidden">
      <h1 className="calendar-title">Calendar Selection</h1>

      {/* Calendars section */}
      <div className="calendars-grid">
        {/* Holiday Calendar */}
        <div className="calendar-card">
          <h2 className="calendar-card-title holiday-title">Holiday Dates</h2>
          <DayPicker
            required
            mode="multiple"
            selected={holidayDates}
            onSelect={setHolidayDates}
            disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
            month={month}
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
            mode="range"
            selected={availableDates}
            onSelect={(range) =>
              setAvailableDates({
                from: range?.from,
                to: range?.to ?? undefined,
              })
            }
            month={month}
            onMonthChange={setMonth}
            disabled={[
              ...holidayDates,
              { before: new Date() },
              { dayOfWeek: [0, 6] },
            ]}
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

        {/* Available Dates Summary */}
        <div className="dates-summary available-summary">
          <h3>Available Date Range</h3>
          {availableDates.from && availableDates.to ? (
            <div className="range-info">
              <div className="dates-list">
                <span className="date-badge available-badge">
                  From: {format(availableDates.from, "MMM d, yyyy")}
                </span>
                <span className="date-badge available-badge">
                  To: {format(availableDates.to, "MMM d, yyyy")}
                </span>
              </div>
              <p className="dates-count">
                {Math.abs(
                  Math.ceil(
                    (availableDates.to.getTime() -
                      availableDates.from.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                ) + 1}{" "}
                days total
              </p>
              <p className="dates-count">
                {
                  holidayDates.filter((date) =>
                    isWithinInterval(date, {
                      start: availableDates.from!,
                      end: availableDates.to!,
                    })
                  ).length
                }{" "}
                holiday(s) within this range
              </p>
            </div>
          ) : (
            <p className="no-dates">No available date range selected</p>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-blue-500 cursor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              toast.success("Submitted");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
