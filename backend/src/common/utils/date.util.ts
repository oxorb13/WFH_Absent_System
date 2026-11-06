/**
 * Helper to compute the local start and end of day for date filtering
 */
export function getStartAndEndOfDay(date: Date = new Date()): {
  startOfDay: Date;
  endOfDay: Date;
} {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
  return { startOfDay, endOfDay };
}

