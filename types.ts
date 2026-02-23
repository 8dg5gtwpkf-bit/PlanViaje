
export interface Country {
  name: string;
  code: string;
  continent: string;
  capital: string;
  description?: string;
  bestTimeToVisit?: string;
  currency?: string;
  cultureTips?: string[];
  attractions?: string[];
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  cost: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  style: string;
  dailyPlans: DayPlan[];
  suggestedFlight?: Flight;
  totalEstimatedCost: number;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResults {
  text: string;
  sources: GroundingSource[];
}
