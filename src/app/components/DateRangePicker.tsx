import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
	startDate: Date;
	endDate: Date;
	onStartDateChange: (date: Date) => void;
	onEndDateChange: (date: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}) => {
	return (
		<div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-600">From:</span>
				<DatePicker
					className="datepicker_custom"
					selected={startDate}
					onChange={(date) => date && onStartDateChange(date)}
					selectsStart
					startDate={startDate}
					endDate={endDate}
					dateFormat="MM/yyyy"
					showMonthYearPicker
				/>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-600">To:</span>
				<DatePicker
					className="datepicker_custom"
					selected={endDate}
					onChange={(date) => date && onEndDateChange(date)}
					selectsEnd
					startDate={startDate}
					endDate={endDate}
					minDate={startDate}
					dateFormat="MM/yyyy"
					showMonthYearPicker
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;
