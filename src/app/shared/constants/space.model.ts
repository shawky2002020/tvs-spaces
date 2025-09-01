
export interface ReservedDates {
  start: Date;
  end: Date;
  reason?: string; // Optional reason for unavailability
}

export interface PricingPackage {
  hourly: number;
  halfDay: number;
  day: number;
  lite?: number;
  pro?: number;
  max?: number;
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
      halfDay: 150,
      day: 200,
      lite: 2000,
      pro: 3200,
      max: 4000,
    },
    capacity: 7,
    reservedDates: [
      {
        start: new Date('2025-09-18T10:00:00'),
        end: new Date('2025-09-18T12:00:00'),
        reason: 'Reserved for client meeting'
      },
      {
        start: new Date('2025-09-18T12:00:00'),
        end: new Date('2025-09-18T14:00:00'),
        reason: 'Partial booking'
      },
      {
        start: new Date('2025-09-18T14:00:00'),
        end: new Date('2025-09-18T16:00:00'),
        reason: 'Reserved for team'
      },
      {
        start: new Date('2025-09-19T09:00:00'),
        end: new Date('2025-09-19T12:00:00'),
        reason: 'Team workshop'
      },
      {
        start: new Date('2025-09-20T08:00:00'),
        end: new Date('2025-09-20T18:00:00'),
        reason: 'Full day event'
      },
      {
        start: new Date('2025-09-22T14:00:00'),
        end: new Date('2025-09-22T17:00:00'),
        reason: 'Private booking'
      }
    ]
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
      halfDay: 180,
      day: 250,
      lite: 2500,
      pro: 3800,
      max: 4500,
    },
    featured: true,
    capacity: 1,
    reservedDates: [
      {
        start: new Date('2025-09-01T08:00:00'),
        end: new Date('2025-09-18T18:00:00'),
        reason: 'Monthly member reservation'
      },
      {
        start: new Date('2025-09-19T13:00:00'),
        end: new Date('2025-09-19T15:00:00'),
        reason: 'Maintenance'
      },
      {
        start: new Date('2025-09-23T10:00:00'),
        end: new Date('2025-09-23T16:00:00'),
        reason: 'Private booking'
      },
      {
        start: new Date('2025-09-25T09:00:00'),
        end: new Date('2025-09-25T11:00:00'),
        reason: 'Short booking'
      }
    ]
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
      halfDay: 220,
      day: 300,
      lite: 3000,
      pro: 4500,
      max: 5500,
    },
    capacity: 1,
    reservedDates: [
      {
        start: new Date('2025-09-18T09:00:00'),
        end: new Date('2025-09-18T17:00:00'),
        reason: 'Full-day rental'
      },
      {
        start: new Date('2025-09-20T10:00:00'),
        end: new Date('2025-09-20T14:00:00'),
        reason: 'Gaming session'
      },
      {
        start: new Date('2025-09-24T08:00:00'),
        end: new Date('2025-09-24T12:00:00'),
        reason: 'Training session'
      },
      {
        start: new Date('2025-09-26T15:00:00'),
        end: new Date('2025-09-26T18:00:00'),
        reason: 'Afternoon block'
      }
    ]
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
      halfDay: 450,
      day: 800,
      lite: 8000,
      pro: 12000,
      max: 15000,
    },
    capacity: 1,
    reservedDates: [
      {
        start: new Date('2025-09-18T09:00:00'),
        end: new Date('2025-09-18T12:00:00'),
        reason: 'Team meeting'
      },
      {
        start: new Date('2025-09-19T14:00:00'),
        end: new Date('2025-09-19T17:00:00'),
        reason: 'Client presentation'
      },
      {
        start: new Date('2025-09-22T10:00:00'),
        end: new Date('2025-09-22T16:00:00'),
        reason: 'Full-day workshop'
      },
      {
        start: new Date('2025-09-27T08:00:00'),
        end: new Date('2025-09-27T10:00:00'),
        reason: 'Morning block'
      }
    ]
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
      halfDay: 750,
      day: 1400,
      lite: 14000,
      pro: 20000,
      max: 25000,
    },
    capacity: 1,
    featured: true,
    reservedDates: [
      {
        start: new Date('2025-09-18T08:00:00'),
        end: new Date('2025-09-18T10:00:00'),
        reason: 'Morning briefing'
      },
      {
        start: new Date('2025-09-19T13:00:00'),
        end: new Date('2025-09-19T18:00:00'),
        reason: 'Company all-hands meeting'
      },
      {
        start: new Date('2025-09-23T09:00:00'),
        end: new Date('2025-09-23T17:00:00'),
        reason: 'Full-day conference'
      },
      {
        start: new Date('2025-09-25T11:00:00'),
        end: new Date('2025-09-25T15:00:00'),
        reason: 'Product launch event'
      },
      {
        start: new Date('2025-09-28T14:00:00'),
        end: new Date('2025-09-28T18:00:00'),
        reason: 'Afternoon block'
      }
    ]
  }
];