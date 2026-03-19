'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const HOURS = [
  { id: 1, label: 'Tý (23h-1h)' },
  { id: 2, label: 'Sửu (1h-3h)' },
  { id: 3, label: 'Dần (3h-5h)' },
  { id: 4, label: 'Mão (5h-7h)' },
  { id: 5, label: 'Thìn (7h-9h)' },
  { id: 6, label: 'Tỵ (9h-11h)' },
  { id: 7, label: 'Ngọ (11h-13h)' },
  { id: 8, label: 'Mùi (13h-15h)' },
  { id: 9, label: 'Thân (15h-17h)' },
  { id: 10, label: 'Dậu (17h-19h)' },
  { id: 11, label: 'Tuất (19h-21h)' },
  { id: 12, label: 'Hợi (21h-23h)' },
];

const currentYear = new Date().getFullYear();

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

const DAYS = range(1, 31);
const MONTHS = range(1, 12);
const YEARS = range(1900, currentYear + 1).reverse();
const VIEW_YEARS = range(currentYear - 5, currentYear + 20);

export function TuViForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2000);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [hourId, setHourId] = useState(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      name,
      day: String(day),
      month: String(month),
      year: String(year),
      solar: calendarType === 'solar' ? '1' : '0',
      hour: String(hourId),
      gender: gender === 'male' ? 'M' : 'F',
      viewYear: String(viewYear),
      viewMonth: String(viewMonth),
    });

    router.push(`/la-so?${params.toString()}`);
  }

  const selectClass =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-amber-400';
  const inputClass = selectClass;
  const labelClass =
    'block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5';

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg rounded-2xl border border-amber-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8 dark:border-amber-900/40 dark:bg-zinc-900/80"
    >
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-amber-800 dark:text-amber-400">
        🏮 Lập Lá Số Tử Vi
      </h2>

      {/* Họ Tên */}
      <div className="mb-5">
        <label htmlFor="tuvi-name" className={labelClass}>
          Họ Tên
        </label>
        <input
          id="tuvi-name"
          type="text"
          placeholder="Nhập họ tên..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Ngày sinh */}
      <div className="mb-4">
        <label className={labelClass}>Ngày sinh</label>
        <div className="grid grid-cols-3 gap-3">
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className={selectClass}
            aria-label="Ngày"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={selectClass}
            aria-label="Tháng"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={selectClass}
            aria-label="Năm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lịch dương / Lịch âm */}
      <div className="mb-5 flex items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="calendarType"
            value="solar"
            checked={calendarType === 'solar'}
            onChange={() => setCalendarType('solar')}
            className="h-4 w-4 accent-amber-600"
          />
          Lịch dương
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="calendarType"
            value="lunar"
            checked={calendarType === 'lunar'}
            onChange={() => setCalendarType('lunar')}
            className="h-4 w-4 accent-amber-600"
          />
          Lịch âm
        </label>
      </div>

      {/* Giờ sinh */}
      <div className="mb-5">
        <label htmlFor="tuvi-hour" className={labelClass}>
          Giờ sinh
        </label>
        <select
          id="tuvi-hour"
          value={hourId}
          onChange={(e) => setHourId(Number(e.target.value))}
          className={selectClass}
        >
          {HOURS.map((h) => (
            <option key={h.id} value={h.id}>
              {h.label}
            </option>
          ))}
        </select>
      </div>

      {/* Giới tính */}
      <div className="mb-5">
        <label className={labelClass}>Giới tính</label>
        <div className="flex items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="h-4 w-4 accent-amber-600"
            />
            Nam
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="h-4 w-4 accent-amber-600"
            />
            Nữ
          </label>
        </div>
      </div>

      {/* Năm xem & Tháng xem */}
      <div className="mb-6">
        <label className={labelClass}>Năm xem & Tháng xem (Âm lịch)</label>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className={selectClass}
            aria-label="Năm xem"
          >
            {VIEW_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className={selectClass}
            aria-label="Tháng xem"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-lg bg-linear-to-r from-amber-600 to-amber-700 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:from-amber-700 hover:to-amber-800 hover:shadow-lg focus:ring-2 focus:ring-amber-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-700"
      >
        {loading ? 'Đang xử lý...' : '🔮 Lập Lá Số'}
      </button>
    </form>
  );
}
