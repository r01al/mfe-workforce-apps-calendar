import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useWorkers } from '@r01al/mfe-workforce-common-client/hooks';
import './calendar.css';

function startOfWeek(date: Date): Date {
	const result = new Date(date);
	const day = result.getDay();
	result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
	result.setHours(0, 0, 0, 0);
	return result;
}

function addDays(date: Date, amount: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + amount);
	return result;
}

function formatHour(hour: number): string {
	return new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(new Date(2024, 0, 1, hour));
}

const hours = Array.from({ length: 11 }, (_, index) => index + 8);

function sameDay(first: Date, second: Date): boolean {
	return first.getFullYear() === second.getFullYear()
		&& first.getMonth() === second.getMonth()
		&& first.getDate() === second.getDate();
}

export default function Calendar() {
	const { workers, loading, error } = useWorkers();
	const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
	const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
	const weekEnd = days[6];
	const range = `${weekStart.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;
	const today = new Date();

	if (loading) return <div className="mfe-loading" role="status">Loading schedule…</div>;
	if (error) return <div className="mfe-error" role="alert">Unable to load schedule: {error}</div>;

	return (
		<section>
			<div className="page-heading calendar-heading">
				<div>
					<h1>Team calendar</h1>
					<p>A clear hour-by-hour view of weekly coverage.</p>
				</div>
				<div className="calendar-toolbar">
					<button className="button is-small is-quiet" type="button" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
					<button className="icon-button" type="button" aria-label="Previous week" onClick={() => setWeekStart((current) => addDays(current, -7))}><ChevronLeft size={14} /></button>
					<span className="calendar-range">{range}</span>
					<button className="icon-button" type="button" aria-label="Next week" onClick={() => setWeekStart((current) => addDays(current, 7))}><ChevronRight size={14} /></button>
					<button className="button is-small is-brand" type="button"><Plus size={13} /> Shift</button>
				</div>
			</div>

			<div className="panel-header">
				<div className="calendar-legend"><span><i /> Scheduled worker</span><span>1-hour slots · local time</span></div>
			</div>

			<div className="calendar-scroll">
				<div className="week-grid">
					<div className="week-corner" />
					{days.map((day) => (
						<div className={`day-heading${sameDay(day, today) ? ' today' : ''}`} key={day.toISOString()}>
							<span>{day.toLocaleDateString('en', { weekday: 'short' })}</span>
							<strong>{day.getDate()}</strong>
						</div>
					))}

					{hours.map((hour) => (
						<div style={{ display: 'contents' }} key={hour}>
							<div className="time-heading">{formatHour(hour)}</div>
							{days.map((day, dayIndex) => {
								const weekday = dayIndex + 1;
								const scheduled = workers.filter((worker) => worker.shifts.some((shift) => (
									shift.weekday === weekday && shift.startHour <= hour && shift.endHour > hour
								)));
								return (
									<div className={`time-slot${sameDay(day, today) ? ' today' : ''}`} key={`${day.toISOString()}-${hour}`}>
										<div className="slot-people">
											{scheduled.slice(0, 3).map((worker) => (
												<div className="slot-person" key={worker.id} title={`${worker.name} · ${worker.position}`} style={{ '--person-color': worker.color } as React.CSSProperties}>
													<span>{worker.name.split(' ')[0]}</span>
												</div>
											))}
											{scheduled.length > 3 && <span className="slot-more">+{scheduled.length - 3} more</span>}
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
