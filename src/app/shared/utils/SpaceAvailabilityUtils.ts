import { Space, ReservedDates } from '../constants/space.model';

export class SpaceAvailabilityUtils {
  // Check if a space is available for a given date range and quantity
  static isSpaceAvailable(
    space: Space,
    startDate: Date,
    endDate: Date,
    requestedUnits: number = 1
  ): boolean {
    if (!space.reservedDates || space.reservedDates.length === 0) {
      return space.capacity ? space.capacity >= requestedUnits : true;
    }

    // Get all bookings that overlap with the requested period
    const overlappingBookings = space.reservedDates.filter(availability => {
      const conflictStart = new Date(availability.start);
      const conflictEnd = new Date(availability.end);
      // Check for any overlap
      return startDate < conflictEnd && endDate > conflictStart;
    });

    // If there are no overlapping bookings, check if the requested units are within capacity
    if (overlappingBookings.length === 0) {
      return space.capacity ? space.capacity >= requestedUnits : true;
    }

    // Calculate total reserved units for each overlapping booking
    // For now, we'll assume each availability entry reserves 1 unit
    // In a real system, each availability would have its own reservedUnits property
    const totalReservedUnits = overlappingBookings.length;

    // Check if there's enough capacity left
    const availableUnits = space.capacity ? space.capacity - totalReservedUnits : 0;
    return availableUnits >= requestedUnits;
  }

  // Get all unavailable dates for a space (for calendar highlighting)
  static getUnavailableDates(space: Space): Date[] {
    if (!space.reservedDates) return [];

    const unavailableDates: Date[] = [];

    space.reservedDates.forEach((period) => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      const current = new Date(start);

      while (current <= end) {
        unavailableDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    return unavailableDates;
  }

  // Add new unavailable period (for admin/backend integration)
  static addUnavailablePeriod(
    space: Space,
    start: Date,
    end: Date,
    reason?: string
  ): Space {
    const newAvailability: ReservedDates = { start, end, reason };

    return {
      ...space,
      reservedDates: [...(space.reservedDates || []), newAvailability],
    };
  }

  // Remove unavailable period
  static removeUnavailablePeriod(space: Space, start: Date, end: Date): Space {
    return {
      ...space,
      reservedDates: (space.reservedDates || []).filter(
        (avail) =>
          avail.start.getTime() !== start.getTime() ||
          avail.end.getTime() !== end.getTime()
      ),
    };
  }
  // Compare date components (day, month, year)
  isSameDate = (dateCell: any, date: Date) => {
    return (
      dateCell.getDate() === date.getDate() &&
      dateCell.getMonth() === date.getMonth() &&
      dateCell.getFullYear() === date.getFullYear()
    );
  };
}
