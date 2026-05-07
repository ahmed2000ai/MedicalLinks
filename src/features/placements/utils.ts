export function calculatePlacementFee(
  monthlySalary: number,
  commissionRate: number
): number {
  return parseFloat((monthlySalary * (commissionRate / 100)).toFixed(2));
}
