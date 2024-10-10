import { parse } from "date-fns";

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function parseDate(date: string): Date | undefined {
  const parsedDate = parse(date, "dd-MM-yyyy", new Date());
  return isValidDate(parsedDate) ? parsedDate : undefined;
}
