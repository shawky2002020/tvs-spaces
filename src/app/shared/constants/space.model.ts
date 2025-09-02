export interface ReservedDates {
  startDay: string;   // e.g. '2025-09-18'
  endDay: string;     // e.g. '2025-09-18' (same day if not multiple days)
  startTime: string;  // e.g. '09:00'
  endTime: string;    // e.g. '12:00'
  reason?: string;
  reservedUnits?: number; // how many desks are booked
}


export interface PricingPackage {
  hourly: number;
  halfDay: number;
  day: number;
  lite?: number; // Added lite package
  max?:number,
  pro?:number

}

export enum PricingPackageType {
  hourly = 'hourly',
  halfDay = 'halfDay',
  day = 'day'
}

export interface SpaceAmenity {
  name: string;
  icon: string;
}

export type BookingPlan = 'Hourly' | 'Daily' | 'Half-day' | 'Monthly';

export interface BookingSelection {
  spaceId?: string;
  plan?: BookingPlan;
  date?: Date | [Date, Date];
  startDate?: Date | [Date, Date];
  endDate?: Date | [Date, Date];
  startTime?: number;
  endTime?: number;
  price?: number;
  space?: Space;
  reservedUnits?: number; // Added field for quantity selection
}

export interface Space {
  id: string;
  type: 'desk' | 'room';
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  amenities: SpaceAmenity[];
  pricing: PricingPackage;
  capacity?: number;
  featured?: boolean;
  reservedDates?: ReservedDates[]; // Array of unavailable time periods
}

export const SPACES: Space[] = [
  {
    id: '1',
    type: 'desk',
    name: 'Shared Desk',
    slug: 'shared-desk',
    description: 'Flexible seating in our open workspace areas.',
    imageUrl: 'assets/imgs/spaces/shared2.jpg',
    additionalImages: [
      'assets/imgs/spaces/shared0.jpg',
      'assets/imgs/spaces/shared1.jpg',
      'assets/imgs/spaces/shared2.jpg',
      'assets/imgs/spaces/shared3.jpg',
      'assets/imgs/spaces/shared4.jpg',
    ],
    amenities: [
      { name: 'Shared workspace', icon: 'users' },
      { name: 'High-speed Wi-Fi', icon: 'wifi' },
      { name: 'Power outlets', icon: 'plug' },
      { name: 'Storage lockers', icon: 'lock' },
    ],
    pricing: {
      hourly: 40,
      halfDay: 35,
      day: 32,
     
    },
    capacity: 7,
    reservedDates: [
      {
        startDay: '2025-09-15',
        endDay: '2025-09-15',
        startTime: '09:00',
        endTime: '11:00',
        reason: 'Morning bookings',
        reservedUnits: 2,
      },
      {
        startDay: '2025-09-16',
        endDay: '2025-09-16',
        startTime: '13:00',
        endTime: '15:00',
        reason: 'Afternoon work session',
        reservedUnits: 6,
      },
      {
        startDay: '2025-09-20',
        endDay: '2025-09-20',
        startTime: '10:00',
        endTime: '12:00',
        reason: 'Client meeting',
        reservedUnits: 4,
      },
      {
        startDay: '2025-09-20',
        endDay: '2025-09-20',
        startTime: '08:00',
        endTime: '18:00',
        reason: 'Full day event',
        reservedUnits: 4,
      },
    ],
  },
  {
    id: '2',
    type: 'desk',
    name: 'Solo Desk',
    slug: 'solo-desk',
    description: 'Your own desk in a shared office environment.',
    imageUrl: 'assets/imgs/spaces/solo0.jpg',
    amenities: [
      { name: 'Personal workspace', icon: 'user' },
      { name: 'Under-desk storage', icon: 'archive' },
      { name: 'Monitor support', icon: 'desktop' },
      { name: 'Member perks', icon: 'star' },
    ],
    additionalImages: [
      'assets/imgs/spaces/solo0.jpg',
      'assets/imgs/spaces/solo1.jpg',
      'assets/imgs/spaces/solo2.jpg',
      'assets/imgs/spaces/solo3.jpg',
    ],
    pricing: {
      hourly: 50,
      halfDay: 45,
      day: 42,
      
    },
    featured: true,
    capacity: 1,
    reservedDates: [
      {
        startDay: '2025-09-19',
        endDay: '2025-09-20',
        startTime: '14:00',
        endTime: '16:00',
        reason: 'Maintenance',
      },
      {
        startDay: '2025-09-01',
        endDay: '2025-09-18',
        startTime: '19:00',
        endTime: '23:00',
        reason: 'Monthly member reservation',
      },
      
      {
        startDay: '2025-09-23',
        endDay: '2025-09-23',
        startTime: '10:00',
        endTime: '16:00',
        reason: 'Private booking',
      },
    ],
  },
  {
    id: '3',
    type: 'desk',
    name: 'PC Station',
    slug: 'pc-station',
    description: 'Fully equipped workstation with high-performance PC.',
    imageUrl: 'assets/imgs/spaces/pc-station0.jpg',
    additionalImages: [
      'assets/imgs/spaces/pc-station1.jpg',
      'assets/imgs/spaces/pc-station2.jpg',
      'assets/imgs/spaces/pc-station3.jpg',
    ],
    amenities: [
      { name: 'High-performance PC', icon: 'desktop' },
      { name: 'Dual monitors', icon: 'tv' },
      { name: 'Ergonomic chair', icon: 'chair' },
      { name: 'Software suite', icon: 'code' },
    ],
    pricing: {
      hourly: 60,
      halfDay: 55,
      day: 52,
     
    },
    capacity: 3,
    reservedDates: [
      {
        startDay: '2025-09-18',
        endDay: '2025-09-18',
        startTime: '09:00',
        endTime: '12:00',
        reason: 'Morning rentals',
        reservedUnits: 2,
      },
      {
        startDay: '2025-09-19',
        endDay: '2025-09-19',
        startTime: '13:00',
        endTime: '17:00',
        reason: 'Gaming session',
        reservedUnits: 1,
      },
      {
        startDay: '2025-09-21',
        endDay: '2025-09-21',
        startTime: '08:00',
        endTime: '18:00',
        reason: 'Hackathon',
        reservedUnits: 3,
      },
    ],
  },
  {
    id: '4',
    type: 'room',
    name: 'Team Room',
    slug: 'team-room',
    description: 'Private office space for teams of 2-4 people.',
    imageUrl: 'assets/imgs/spaces/sm-meeting0.jpg',
    additionalImages: [
      'assets/imgs/spaces/sm-meeting0.jpg',
      'assets/imgs/spaces/sm-meeting1.jpg',
      'assets/imgs/spaces/sm-meeting2.jpg',
    ],
    amenities: [
      { name: 'Private space', icon: 'lock' },
      { name: 'Conference table', icon: 'table' },
      { name: 'Whiteboard', icon: 'edit' },
      { name: 'TV display', icon: 'tv' },
    ],
    pricing: {
      hourly: 120,
      halfDay: 115,
      day: 110,
      
    },
    capacity: 1,
    reservedDates: [
      {
        startDay: '2025-09-18',
        endDay: '2025-09-18',
        startTime: '09:00',
        endTime: '12:00',
        reason: 'Team meeting',
      },
      {
        startDay: '2025-09-20',
        endDay: '2025-09-20',
        startTime: '10:00',
        endTime: '16:00',
        reason: 'Workshop',
      },
      {
        startDay: '2025-09-22',
        endDay: '2025-09-22',
        startTime: '14:00',
        endTime: '17:00',
        reason: 'Client presentation',
      },
    ],
  },
  {
    id: '5',
    type: 'room',
    name: 'Big Meeting Room',
    slug: 'big-meeting-room',
    description: 'Spacious meeting room for larger teams and presentations.',
    imageUrl: 'assets/imgs/spaces/meeting2.jpg',
    additionalImages: [
      'assets/imgs/spaces/meeting1.jpg',
      'assets/imgs/spaces/meeting2.jpg',
      'assets/imgs/spaces/meeting3.jpg',
      'assets/imgs/spaces/meeting4.jpg',
      'assets/imgs/spaces/meeting5.jpg',
    ],
    amenities: [
      { name: 'Conference setup', icon: 'users' },
      { name: 'Projector', icon: 'film' },
      { name: 'Sound system', icon: 'volume-up' },
      { name: 'Catering option', icon: 'utensils' },
    ],
    pricing: {
      hourly: 200,
      halfDay: 190,
      day: 185,
      
    },
    capacity: 1,
    featured: true,
    reservedDates: [
      {
        startDay: '2025-09-19',
        endDay: '2025-09-19',
        startTime: '09:00',
        endTime: '12:00',
        reason: 'Morning briefing',
      },
      {
        startDay: '2025-09-23',
        endDay: '2025-09-23',
        startTime: '11:00',
        endTime: '15:00',
        reason: 'Company meeting',
      },
      {
        startDay: '2025-09-26',
        endDay: '2025-09-26',
        startTime: '13:00',
        endTime: '18:00',
        reason: 'Conference',
      },
    ],
  },
];
