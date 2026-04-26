/**
 * Returns the date in local-timezone YYYY-MM-DD format.
 * Avoids the UTC shift you'd get from `Date.toISOString().split('T')[0]`.
 */
export const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
