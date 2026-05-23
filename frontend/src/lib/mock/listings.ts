export type Region =
  | "Bole"
  | "Kazanchis"
  | "Piazza"
  | "Old Airport"
  | "Sarbet"
  | "Lalibela"
  | "Gondar"
  | "Bahir Dar"
  | "Axum"
  | "Harar Jugol"
  | "Hawassa"
  | "Simien"
  | "Omo Valley";

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Guesthouse"
  | "Tukul"
  | "Lodge"
  | "Heritage House"
  | "Eco-cabin";

export type Listing = {
  id: string;
  title: string;
  neighborhood: Region;     // kept name for compatibility with existing code
  city: string;
  country: "Ethiopia";
  propertyType: PropertyType;
  pricePerNight: number;    // ETB
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: number;
  reviews: number;
  amenities: string[];
  tags: string[];
  images: string[];
  description: string;
  hostId: string;
  hostName: string;
  hostSince: string;        // year
  superhost: boolean;
  instantBook: boolean;
  cancellationPolicy: "Flexible" | "Moderate" | "Strict";
  location: { lat: number; lng: number };
};

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Anchor coordinates for each Ethiopian destination. */
const anchors: Record<Region, { lat: number; lng: number; city: string }> = {
  Bole:           { lat: 8.9939, lng: 38.7894, city: "Addis Ababa" },
  Kazanchis:      { lat: 9.0149, lng: 38.7689, city: "Addis Ababa" },
  Piazza:         { lat: 9.0345, lng: 38.7510, city: "Addis Ababa" },
  "Old Airport":  { lat: 8.9870, lng: 38.7570, city: "Addis Ababa" },
  Sarbet:         { lat: 9.0050, lng: 38.7470, city: "Addis Ababa" },
  Lalibela:       { lat: 12.0316, lng: 39.0473, city: "Lalibela" },
  Gondar:         { lat: 12.6090, lng: 37.4671, city: "Gondar" },
  "Bahir Dar":    { lat: 11.5938, lng: 37.3908, city: "Bahir Dar" },
  Axum:           { lat: 14.1213, lng: 38.7245, city: "Axum" },
  "Harar Jugol":  { lat: 9.3110, lng: 42.1283, city: "Harar" },
  Hawassa:        { lat: 7.0621, lng: 38.4764, city: "Hawassa" },
  Simien:         { lat: 13.2333, lng: 38.0667, city: "Debark" },
  "Omo Valley":   { lat: 5.7833, lng: 36.5833, city: "Jinka" },
};

/** Photo pool — mixed interiors + Ethiopian landscape shots. */
const photos = [
  "photo-1505693416388-ac5ce068fe85", // bedroom warm
  "photo-1522708323590-d24dbb6b0267", // interior plants
  "photo-1493809842364-78817add7ffb", // cozy reading
  "photo-1560448204-e02f11c3d0e2",    // architectural interior
  "photo-1600585154340-be6161a56a0c", // modern living
  "photo-1512917774080-9991f1c4c750", // villa
  "photo-1582268611958-ebfd161ef9cf", // bath
  "photo-1505691938895-1758d7feb511", // earthy interior
  "photo-1484154218962-a197022b5858", // kitchen warm
  "photo-1501183638710-841dd1904471", // sofa
  "photo-1564013799919-ab600027ffc6", // boho bedroom
  "photo-1502672260266-1c1ef2d93688", // exterior
  "photo-1469474968028-56623f02e42e", // ethiopian highland landscape
  "photo-1523805009345-7448845a9e53", // mountain village
  "photo-1535941339077-2dd1c7963098", // safari lodge
  "photo-1542751371-adc38448a05e",    // african sunset
];

const amenityPool = [
  "Jebena coffee ceremony",
  "Injera kitchen",
  "Eucalyptus steam room",
  "Private compound",
  "24/7 guard",
  "Backup generator",
  "Solar hot water",
  "Filtered drinking water",
  "High-speed Wi-Fi",
  "Air conditioning",
  "Fireplace",
  "Mountain view",
  "Lake view",
  "Rooftop terrace",
  "Airport pickup",
  "Tej & tella bar",
  "Traditional mesob seating",
  "Habesha bath salts",
  "Bunna roastery",
  "Curated Tigrinya music",
];

const tagPool = [
  "Highland", "Walkable", "Lakefront", "Rock-hewn nearby", "Coffee-region",
  "Family-friendly", "Romantic", "Long stays", "Workation-ready",
];

const seedListings: Array<
  Pick<Listing,
    "title" | "neighborhood" | "propertyType" | "pricePerNight" | "maxGuests"
    | "bedrooms" | "beds" | "baths" | "hostName" | "description"
  >
> = [
  {
    title: "Bole Penthouse with Entoto View",
    neighborhood: "Bole", propertyType: "Apartment",
    pricePerNight: 4800, maxGuests: 4, bedrooms: 2, beds: 2, baths: 2,
    hostName: "Selam Tadesse",
    description: "A composed two-bedroom on the 14th floor — Entoto on the horizon, Edna Mall a short walk away, and a kitchen built for a slow Sunday firfir.",
  },
  {
    title: "Kazanchis Loft above the Coffee Roastery",
    neighborhood: "Kazanchis", propertyType: "Apartment",
    pricePerNight: 3600, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Yonas Bekele",
    description: "Wake to the smell of fresh-roasted Yirgacheffe rising through the floorboards. Walk to the UN compound, Meskel Square and the National Theatre.",
  },
  {
    title: "Piazza Heritage Flat near St. George's",
    neighborhood: "Piazza", propertyType: "Heritage House",
    pricePerNight: 3200, maxGuests: 3, bedrooms: 1, beds: 2, baths: 1,
    hostName: "Hiwot Mengistu",
    description: "An Italian-era apartment with original parquet, restored shutters and a balcony over the old Piazza. Two minutes from Tomoca.",
  },
  {
    title: "Old Airport Garden Villa",
    neighborhood: "Old Airport", propertyType: "Villa",
    pricePerNight: 8200, maxGuests: 6, bedrooms: 3, beds: 4, baths: 3,
    hostName: "Dawit Alemu",
    description: "Walled compound, jacaranda-shaded garden, full house staff on request. Embassies a short drive in any direction.",
  },
  {
    title: "Sarbet Family House with Jebena Corner",
    neighborhood: "Sarbet", propertyType: "Guesthouse",
    pricePerNight: 4400, maxGuests: 5, bedrooms: 2, beds: 3, baths: 2,
    hostName: "Marta Girma",
    description: "Run by a family of three generations. Every morning starts with a full bunna ceremony in the courtyard.",
  },
  {
    title: "Lalibela Stone Lodge above Bete Giyorgis",
    neighborhood: "Lalibela", propertyType: "Lodge",
    pricePerNight: 5800, maxGuests: 4, bedrooms: 2, beds: 3, baths: 2,
    hostName: "Tesfaye Wolde",
    description: "Hand-cut stone walls, a fire each evening, and a terrace that looks straight down onto the rock-hewn church of St. George.",
  },
  {
    title: "Pilgrim's Tukul, Lalibela",
    neighborhood: "Lalibela", propertyType: "Tukul",
    pricePerNight: 2200, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Abebe Haile",
    description: "A traditional round tukul with a thatched roof, restored with comfort in mind. Five minutes' walk to the northern cluster of churches.",
  },
  {
    title: "Gondar Castle View Apartment",
    neighborhood: "Gondar", propertyType: "Apartment",
    pricePerNight: 3000, maxGuests: 3, bedrooms: 1, beds: 2, baths: 1,
    hostName: "Aster Tekle",
    description: "A bright one-bedroom flat with a window seat looking onto Fasil Ghebbi. Strong Wi-Fi, good coffee, attentive host.",
  },
  {
    title: "Bahir Dar Lakefront Cabin",
    neighborhood: "Bahir Dar", propertyType: "Eco-cabin",
    pricePerNight: 4200, maxGuests: 4, bedrooms: 2, beds: 2, baths: 1,
    hostName: "Eyob Asfaw",
    description: "Wood-and-glass cabin steps from Lake Tana. Watch the papyrus boats at sunrise; book the monastery tour with the host.",
  },
  {
    title: "Tana Monastery Garden Suite",
    neighborhood: "Bahir Dar", propertyType: "Guesthouse",
    pricePerNight: 3400, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Lily Negussie",
    description: "A quiet suite in a private garden, a short tuk-tuk to the Blue Nile Falls turn-off.",
  },
  {
    title: "Axum Stelae Heritage House",
    neighborhood: "Axum", propertyType: "Heritage House",
    pricePerNight: 2900, maxGuests: 4, bedrooms: 2, beds: 2, baths: 2,
    hostName: "Berhan Gebremariam",
    description: "Stone walls, high ceilings, and an inner courtyard. Walk to the stelae field at dawn before the heat sets in.",
  },
  {
    title: "Harar Jugol Walled-City Riad",
    neighborhood: "Harar Jugol", propertyType: "Heritage House",
    pricePerNight: 3800, maxGuests: 3, bedrooms: 2, beds: 2, baths: 1,
    hostName: "Fatuma Ahmed",
    description: "Inside the old walls — colour-washed plaster, a niched-wall salon, and a host who arranges the hyena-man visit at dusk.",
  },
  {
    title: "Hawassa Lake House with Sunrise Deck",
    neighborhood: "Hawassa", propertyType: "Villa",
    pricePerNight: 6200, maxGuests: 6, bedrooms: 3, beds: 4, baths: 2,
    hostName: "Robel Kassa",
    description: "On the lake, with a wooden deck for breakfast and a private path down to the water. Birding map provided.",
  },
  {
    title: "Hawassa Fish Market Loft",
    neighborhood: "Hawassa", propertyType: "Apartment",
    pricePerNight: 2700, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Helen Tadesse",
    description: "A clean modern loft near Amora Gedel — watch the pelicans, eat the fresh tilapia, sleep with the windows open.",
  },
  {
    title: "Simien Eco-Lodge at 3,200m",
    neighborhood: "Simien", propertyType: "Lodge",
    pricePerNight: 7800, maxGuests: 4, bedrooms: 2, beds: 3, baths: 2,
    hostName: "Mulu Gebru",
    description: "Off-grid, solar powered, hot showers from a wood boiler. Gelada baboons graze past the window most mornings.",
  },
  {
    title: "Trekker's Bunkhouse, Debark Gateway",
    neighborhood: "Simien", propertyType: "Guesthouse",
    pricePerNight: 1600, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Solomon Adane",
    description: "Simple, warm, well-run. The right base for a three-day Simien trek — host arranges scout, mules and meals.",
  },
  {
    title: "Omo Valley Riverside Camp",
    neighborhood: "Omo Valley", propertyType: "Eco-cabin",
    pricePerNight: 5400, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Lale Biwa",
    description: "Two canvas-and-timber cabins on the Omo, run with the local Kara community. Visits arranged respectfully, with their consent.",
  },
  {
    title: "Bole Atlas Studio for Long Stays",
    neighborhood: "Bole", propertyType: "Apartment",
    pricePerNight: 2400, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Rahel Worku",
    description: "Studio designed for remote workers — fibre internet, standing desk, and a kettle that knows how to brew bunna.",
  },
  {
    title: "Kazanchis Designer One-Bedroom",
    neighborhood: "Kazanchis", propertyType: "Apartment",
    pricePerNight: 3900, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Surafel Mengesha",
    description: "Local artists on the walls, Sheger FM on the speakers, and a balcony that catches the late afternoon light.",
  },
  {
    title: "Piazza Rooftop Studio with Mt Entoto View",
    neighborhood: "Piazza", propertyType: "Apartment",
    pricePerNight: 2600, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Genet Asrat",
    description: "Top-floor studio, private rooftop, panoramic view of Entoto. The owner's father runs the bakery on the corner.",
  },
  {
    title: "Old Airport Embassy-Quarter Townhouse",
    neighborhood: "Old Airport", propertyType: "Villa",
    pricePerNight: 7400, maxGuests: 5, bedrooms: 3, beds: 3, baths: 3,
    hostName: "Nardos Bekele",
    description: "Quiet street, private parking, full backup power and water — the practical luxury Addis residents know to ask for.",
  },
  {
    title: "Gondar Castle-Quarter Family Suite",
    neighborhood: "Gondar", propertyType: "Guesthouse",
    pricePerNight: 2500, maxGuests: 4, bedrooms: 2, beds: 3, baths: 2,
    hostName: "Tewodros Alemayehu",
    description: "Two-bedroom suite in a family home. Mother cooks dinner on request — her doro wat is locally famous.",
  },
  {
    title: "Harar Old-Wall Coffee House Stay",
    neighborhood: "Harar Jugol", propertyType: "Heritage House",
    pricePerNight: 2900, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Munir Abdullahi",
    description: "Above a working coffee house run by the host's grandmother. Bunna, hilbet bread and stories included.",
  },
  {
    title: "Bahir Dar Papyrus Cottage",
    neighborhood: "Bahir Dar", propertyType: "Eco-cabin",
    pricePerNight: 3100, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
    hostName: "Kalkidan Ayele",
    description: "A small cottage built with traditional papyrus and timber, modern bathroom, hammock on the porch.",
  },
];

function pick<T>(arr: T[], n: number, offset = 0): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(arr[(i + offset) % arr.length]);
  return out;
}

export const listings: Listing[] = seedListings.map((s, i) => {
  const a = anchors[s.neighborhood];
  const jitter = () => (Math.random() - 0.5) * 0.012;
  const ratingBase = 4.62 + ((i * 13) % 35) / 100;
  return {
    id: `BET-${String(i + 1).padStart(3, "0")}`,
    title: s.title,
    neighborhood: s.neighborhood,
    city: a.city,
    country: "Ethiopia",
    propertyType: s.propertyType,
    pricePerNight: s.pricePerNight,
    maxGuests: s.maxGuests,
    bedrooms: s.bedrooms,
    beds: s.beds,
    baths: s.baths,
    rating: Math.min(4.98, Number(ratingBase.toFixed(2))),
    reviews: 18 + ((i * 23) % 320),
    amenities: pick(amenityPool, 7, i),
    tags: pick(tagPool, 3, i),
    images: pick(photos, 5, i).map((p) => img(p)),
    description: s.description,
    hostId: `H-${(i % 8) + 1}`,
    hostName: s.hostName,
    hostSince: String(2017 + (i % 7)),
    superhost: i % 3 === 0,
    instantBook: i % 2 === 0,
    cancellationPolicy: (["Flexible", "Moderate", "Strict"] as const)[i % 3],
    location: { lat: a.lat + jitter(), lng: a.lng + jitter() },
  };
});

export function getListing(id: string) {
  return listings.find((l) => l.id === id);
}

/** Currency helper — formats Ethiopian Birr. */
export function formatETB(amount: number): string {
  return `ETB ${amount.toLocaleString("en-ET")}`;
}

export const ALL_REGIONS: Region[] = [
  "Bole", "Kazanchis", "Piazza", "Old Airport", "Sarbet",
  "Lalibela", "Gondar", "Bahir Dar", "Axum", "Harar Jugol",
  "Hawassa", "Simien", "Omo Valley",
];

export const ALL_PROPERTY_TYPES: PropertyType[] = [
  "Apartment", "Villa", "Guesthouse", "Tukul", "Lodge", "Heritage House", "Eco-cabin",
];
