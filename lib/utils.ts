export function formatMileage(mileage: number): string {
  return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

