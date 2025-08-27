import { Space, Availability } from "../constants/space.model";

export class SpaceAvailabilityUtils {
  
  // Check if a space is available for a given date range
  static isSpaceAvailable(space: Space, startDate: Date, endDate: Date): boolean {
    if (!space.availability || space.availability.length === 0) {
      return true;
    }

    return !space.availability.some(availability => {
      const conflictStart = new Date(availability.start);
      const conflictEnd = new Date(availability.end);
      
      // Check for any overlap
      return (startDate < conflictEnd && endDate > conflictStart);
    });
  }

  // Get all unavailable dates for a space (for calendar highlighting)
  static getUnavailableDates(space: Space): Date[] {
    if (!space.availability) return [];
    
    const unavailableDates: Date[] = [];
    
    space.availability.forEach(period => {
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
  static addUnavailablePeriod(space: Space, start: Date, end: Date, reason?: string): Space {
    const newAvailability: Availability = { start, end, reason };
    
    return {
      ...space,
      availability: [...(space.availability || []), newAvailability]
    };
  }

  // Remove unavailable period
  static removeUnavailablePeriod(space: Space, start: Date, end: Date): Space {
    return {
      ...space,
      availability: (space.availability || []).filter(avail => 
        avail.start.getTime() !== start.getTime() || avail.end.getTime() !== end.getTime()
      )
    };
  }
}