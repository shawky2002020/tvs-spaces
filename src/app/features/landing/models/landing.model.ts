import { BookingPlan, Space, SpaceAmenity } from '../../../shared/constants/space.model';

/**
 * Opening hours mirrored from the backend booking service
 * (`BookingService.OPENING_HOUR` / `CLOSING_HOUR`). Everything the landing page
 * says about time is derived from these two numbers rather than written by hand.
 */
export const OPENING_HOUR = 9;
export const CLOSING_HOUR = 18;

/** `createInterval` normalises an unspecified Half-day to OPENING_HOUR + 4. */
export const HALF_DAY_HOURS = 4;

export const CURRENCY = 'EGP';

export type SpaceKind = 'desk' | 'room';

/**
 * How the three prices on a Space actually behave, taken from
 * `BookingService.calculatePriceInternal`. Hourly multiplies by hours; Half-day
 * and Daily are flat rates. The unit string is what keeps the page honest.
 */
export interface LandingPlanRate {
  plan: Extract<BookingPlan, 'Hourly' | 'Half-day' | 'Daily'>;
  /** Short label used on the day rule and plan chips. */
  label: string;
  /** The price as stored, with no arithmetic applied. */
  amount: number;
  /** "per hour" / "per half day" / "per day" - never omitted next to a number. */
  unit: string;
  /** Hours the plan occupies inside the 09:00-18:00 day. */
  startHour: number;
  endHour: number;
  /** Plain-language description of the window this plan books. */
  window: string;
}

export interface LandingSpace {
  id: string;
  slug: string;
  name: string;
  kind: SpaceKind;
  description: string;
  imageUrl: string;
  gallery: string[];
  amenities: SpaceAmenity[];
  capacity: number;
  /** Honest reading of `capacity`: bookable units, not seats. */
  capacityLabel: string;
  rates: LandingPlanRate[];
  /** Cheapest way in, with its unit attached. */
  entryRate: LandingPlanRate;
  /** Real route to the existing detail page. */
  detailRoute: (string | number)[];
}

export type LandingCatalogStatus = 'loading' | 'ready' | 'error';

export interface LandingCatalogState {
  status: LandingCatalogStatus;
  spaces: LandingSpace[];
  desks: LandingSpace[];
  rooms: LandingSpace[];
  message: string;
}

/**
 * Editorial framing for the "choose by the way you work" section. Only the
 * *need* is written here; every fact (name, price, capacity, amenities, route)
 * is resolved from the API response at runtime. A scenario whose space is not
 * in the catalogue is dropped rather than rendered with placeholder data.
 */
export interface WorkScenarioSeed {
  slug: string;
  need: string;
  detail: string;
  recommendedPlan: Extract<BookingPlan, 'Hourly' | 'Half-day' | 'Daily'>;
}

export const WORK_SCENARIO_SEEDS: WorkScenarioSeed[] = [
  {
    slug: 'solo-desk',
    need: 'You need to finish something without being interrupted',
    detail: 'A desk of your own in the shared office, taken by the hour so a short session does not cost you a day.',
    recommendedPlan: 'Hourly',
  },
  {
    slug: 'shared-desk',
    need: 'You are working the whole day and want the flat rate',
    detail: 'Open seating from opening to closing. The day rate is charged once, whatever time you arrive.',
    recommendedPlan: 'Daily',
  },
  {
    slug: 'pc-station',
    need: 'Your work needs a machine you do not have to carry',
    detail: 'A dual-monitor workstation with the software installed. Book the hours you actually need it for.',
    recommendedPlan: 'Hourly',
  },
  {
    slug: 'team-room',
    need: 'Your team needs a door that closes',
    detail: 'A private room for working sessions, with a table and a screen. The half day covers a morning of work.',
    recommendedPlan: 'Half-day',
  },
  {
    slug: 'big-meeting-room',
    need: 'You are presenting to people who are not on your team',
    detail: 'The large room, with the projector and sound. Booked as a block so the room is yours before people arrive.',
    recommendedPlan: 'Half-day',
  },
];

function capacityLabel(kind: SpaceKind, capacity: number): string {
  if (kind === 'room') {
    return capacity === 1 ? 'One room, booked whole' : `${capacity} rooms, booked whole`;
  }
  return capacity === 1
    ? 'One desk, booked on its own'
    : `${capacity} desks, bookable separately`;
}

function buildRates(space: Space): LandingPlanRate[] {
  const halfDayEnd = OPENING_HOUR + HALF_DAY_HOURS;
  return [
    {
      plan: 'Hourly',
      label: 'By the hour',
      amount: space.pricing.hourly,
      unit: 'per hour',
      startHour: OPENING_HOUR,
      endHour: CLOSING_HOUR,
      window: `Any hours between ${formatHour(OPENING_HOUR)} and ${formatHour(CLOSING_HOUR)}`,
    },
    {
      plan: 'Half-day',
      label: 'Half day',
      amount: space.pricing.halfDay,
      unit: 'per half day',
      startHour: OPENING_HOUR,
      endHour: halfDayEnd,
      window: `A ${HALF_DAY_HOURS} hour block, ${formatHour(OPENING_HOUR)} to ${formatHour(halfDayEnd)} by default`,
    },
    {
      plan: 'Daily',
      label: 'Full day',
      amount: space.pricing.day,
      unit: 'per day',
      startHour: OPENING_HOUR,
      endHour: CLOSING_HOUR,
      window: `The full day, ${formatHour(OPENING_HOUR)} to ${formatHour(CLOSING_HOUR)}`,
    },
  ];
}

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function toLandingSpace(space: Space): LandingSpace {
  const kind: SpaceKind = space.type === 'room' ? 'room' : 'desk';
  const rates = buildRates(space);
  const gallery = (space.additionalImages ?? []).filter(Boolean);

  return {
    id: space.id,
    slug: space.slug,
    name: space.name,
    kind,
    description: space.description,
    imageUrl: space.imageUrl,
    gallery,
    amenities: space.amenities ?? [],
    capacity: space.capacity ?? 1,
    capacityLabel: capacityLabel(kind, space.capacity ?? 1),
    rates,
    // Cheapest entry point. With the current rate card this is the day rate,
    // which is genuinely the cheapest single charge - so it is labelled as such
    // rather than presented as a generic "from" price.
    entryRate: rates.reduce((cheapest, rate) => (rate.amount < cheapest.amount ? rate : cheapest)),
    detailRoute: kind === 'room' ? ['/rooms', space.slug] : ['/desks', space.slug],
  };
}
