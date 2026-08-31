export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface TicketCategory {
  id: string;
  eventId: string;
  name: string;
  price: string | number;
  totalCapacity: number;
  remainingCapacity: number;
}

export type EventCategory =
  | 'CONCERT'
  | 'SPORTS'
  | 'SEMINAR'
  | 'WEBINAR'
  | 'EXHIBITION'
  | 'WORKSHOP'
  | 'FESTIVAL';

export interface EventItem {
  id: string;
  slug?: string;
  title: string;
  category?: EventCategory;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  ticketCategories: TicketCategory[];
}

export type EventDetail = EventItem;

export interface OrderItem {
  id: string;
  orderId: string;
  ticketCategoryId: string;
  quantity: number;
  price: string | number;
  ticketCategory: {
    id?: string;
    name: string;
  };
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'CHECKED_IN';

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  status: OrderStatus;
  totalAmount: string | number;
  checkedInAt?: string | null;
  createdAt: string;
  updatedAt: string;
  transaction?: {
    id?: string;
    snapToken?: string | null;
    snapRedirectUrl?: string | null;
    status?: string;
  } | null;
  user?: {
    id: string;
    name?: string | null;
    email: string;
  };
  event: {
    id: string;
    slug?: string;
    title: string;
    location: string;
    date: string;
  };
  orderItems: OrderItem[];
}

export interface PlatformSummary {
  financials: {
    totalRevenue: string | number;
    successfulOrdersCount: number;
  };
  attendance: {
    checkedInAttendees: number;
  };
  capacity: {
    totalCapacity: number;
    totalSold: number;
    totalRemaining: number;
    overallSoldPercentage: string;
  };
  metrics?: {
    totalEvents: number;
    totalUsers: number;
  };
  eventId?: string;
  title?: string;
  location?: string;
  date?: string;
  categories?: Array<{
    id: string;
    name: string;
    price: string | number;
    totalCapacity: number;
    remainingCapacity: number;
    sold: number;
    soldPercentage: string;
  }>;
}
