"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputField from "../InputField/InputField";

interface DatePickerProps {
  id?: string;
  label?: boolean;
  labelName?: string;
  onDateChange?: (date: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
  className?: string;
  specialType?: string;
  isExpiryDate?: boolean; // still supported
  isDisablePast?: boolean; // 👈 new prop
  dateFormat?: string;
}

export function DatePicker({
  id,
  label = false,
  labelName,
  onDateChange,
  onKeyDown,
  placeholder = "YYYY-MM-DD",
  value: controlledValue,
  readOnly = false,
  className,
  isExpiryDate = false,
  isDisablePast = false,
  dateFormat = "yyyy-MM-dd",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    controlledValue ? new Date(controlledValue) : undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(
    controlledValue || (date ? format(date, dateFormat) : "")
  );
  const [isFocused, setIsFocused] = React.useState(false);

  // normalize to start of day (ignore hours/minutes)
  const startOfDay = (d: Date) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  // restriction logic (today allowed)
  const restrictPast = (d: Date) => {
    const today = startOfDay(new Date());
    const target = startOfDay(d);
    return (isExpiryDate || isDisablePast) && target < today;
  };

  // keep in sync with external `value`
  React.useEffect(() => {
    if (controlledValue) {
      const parsed = new Date(controlledValue);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
        setMonth(parsed);
        setValue(format(parsed, dateFormat));
      }
    }
  }, [controlledValue, dateFormat]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (restrictPast(selectedDate)) return;

    setDate(selectedDate);
    const formatted = format(selectedDate, dateFormat);
    setValue(formatted);
    setOpen(false);
    if (onDateChange) onDateChange(formatted);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={`relative w-full ${className || ""}`}>
        {label && (
          <label
            htmlFor={id || "date-picker-input"}
            className={`absolute z-10 px-1 text-xs font-semibold bg-white text-blue_light -top-2 left-3 ${
              isFocused || date ? "" : "hidden"
            }`}
          >
            {labelName}
          </label>
        )}

        {/* Input with full width */}
        <InputField
          id={id || "date-picker-input"}
          value={value}
          placeholder={placeholder}
          className={`bg-background pr-10 w-full ${className || ""}`}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const raw = e.target.value;
            setValue(raw);
            const parsed = parse(raw, dateFormat, new Date());
            if (!isNaN(parsed.getTime())) {
              if (restrictPast(parsed)) return;
              setDate(parsed);
              setMonth(parsed);
              if (onDateChange) onDateChange(format(parsed, dateFormat));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
            if (onKeyDown) onKeyDown(e);
          }}
          type="text"
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5 text-gray-500" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 z-[9999]"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
              disabled={(d) => restrictPast(d)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
