const DAY_MS = 24 * 60 * 60 * 1000;

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayString() {
  return toLocalDateString(new Date());
}

export function recentDays(count = 14) {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(today, index - count + 1);
    return {
      date: toLocalDateString(date),
      label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      day: String(date.getDate()),
    };
  });
}

export function calculateCurrentStreak(doneDates: string[], todayString = getTodayString()) {
  const done = new Set(doneDates);
  const today = parseLocalDate(todayString);
  let cursor = done.has(todayString) ? today : addDays(today, -1);
  let count = 0;

  while (done.has(toLocalDateString(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }

  return count;
}

export function calculateBestStreak(doneDates: string[]) {
  const sorted = [...new Set(doneDates)].sort();
  if (sorted.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = parseLocalDate(sorted[index - 1]);
    const currentDate = parseLocalDate(sorted[index]);
    const diff = Math.round((currentDate.getTime() - previous.getTime()) / DAY_MS);

    if (diff === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (diff > 1) {
      current = 1;
    }
  }

  return best;
}
