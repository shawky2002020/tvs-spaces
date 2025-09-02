import { Space, ReservedDates } from '../constants/space.model';

export class SpaceAvailabilityUtils {
  private static timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  /**
   * Expand reservedDates into an availability map:
   * {
   *   "2025-09-19": { "13": 2, "14": 7 }
   * }
   */
  static buildAvailabilityMap(
    space: Space
  ): Record<string, Record<number, number>> {
    const map: Record<string, Record<number, number>> = {};

    if (!space.reservedDates) return map;

    space.reservedDates.forEach((period) => {
      const startDay = new Date(period.startDay);
      const endDay = new Date(period.endDay);

      const reservedUnits = period.reservedUnits || 1;
      const startTime = period.startTime
        ? this.timeToMinutes(period.startTime)
        : 0;
      const endTime = period.endTime
        ? this.timeToMinutes(period.endTime)
        : 24 * 60;

      const current = new Date(startDay);

      while (current <= endDay) {
        const dayKey = current.toISOString().split('T')[0]; // "YYYY-MM-DD"
        if (!map[dayKey]) map[dayKey] = {};

        // loop over hours
        const startHour = Math.floor(startTime / 60);
        const endHour = Math.ceil(endTime / 60);

        for (let h = startHour; h < endHour; h++) {
          map[dayKey][h] = (map[dayKey][h] || 0) + reservedUnits;
        }

        current.setDate(current.getDate() + 1);
      }
    });

    return map;
  }

  /**
   * Get available units for a specific date & hour
   */
  static getAvailableUnits(
    space: Space,
    map: Record<string, Record<number, number>>,
    date: Date
  ): number {
    const dayKey = date.toISOString().split('T')[0];
    const hour = date.getHours();
    const reserved = map[dayKey]?.[hour] || 0;
    return (space.capacity || 0) - reserved;
  }

  /**
   * Build full daily grid for UI
   * Example: [{ hour: 9, available: 6 }, { hour: 10, available: 7 }, ...]
   */
  static buildDailyGrid(
    space: Space,
    map: Record<string, Record<number, number>>,
    day: Date,
    startHour: number = 10,
    endHour: number = 23
  ): { hour: number; available: number }[] {
    const grid: { hour: number; available: number }[] = [];
    const dayKey = day.toISOString().split('T')[0];
    console.log(dayKey);
    console.log(map[dayKey]);
    
    

    for (let h = startHour; h <= endHour; h++) {
      const reserved = map[dayKey]?.[h] || 0;
      console.log('reserved',reserved);
      
      const available = (space.capacity || 0) - reserved;
      grid.push({ hour: h, available });
    }
    console.log(day,map);
    
    console.log(`grid of ${day}`,grid);
    
    return grid;
  }
}