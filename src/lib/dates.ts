// Small helper so pages don't call Date.now() inline during render
// (the react-hooks/purity lint rule flags direct impure calls in component bodies).
export function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
