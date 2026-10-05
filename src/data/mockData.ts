export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isVeg?: boolean;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    avatar?: string;
    initials: string;
    phone: string;
    address: string;
  };
  restaurant: {
    name: string;
    logo?: string;
    cuisine: string;
  };
  items: OrderItem[];
  amount: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  timeElapsed: string;
  createdAt: string;
  rider?: {
    name: string;
    avatar?: string;
    phone: string;
    vehicle: string;
  };
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Cash on Delivery' | 'Digital Wallet';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  revenue: number;
  growth: number;
  status: 'Active' | 'Closed' | 'Busy';
  address: string;
  prepTime: string;
  featured?: boolean;
  menuCategories: {
    name: string;
    itemCount: number;
    items: {
      id: string;
      name: string;
      description: string;
      price: number;
      isVeg: boolean;
      isBestseller?: boolean;
      image: string;
      available: boolean;
    }[];
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  favoriteCuisine: string;
  status: 'Active' | 'VIP' | 'Inactive';
  joinedDate: string;
  lastOrderDate: string;
  address: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  vehicle: 'Motorbike' | 'E-Bike' | 'Scooter' | 'Car';
  activeOrders: number;
  rating: number;
  totalDeliveries: number;
  earningsToday: number;
  status: 'Online' | 'Delivering' | 'Offline';
  currentLocation: string;
  batteryOrFuel?: string;
}

export interface LiveDelivery {
  id: string;
  orderId: string;
  riderName: string;
  riderAvatar: string;
  riderPhone: string;
  vehicle: string;
  restaurant: string;
  customerName: string;
  destination: string;
  status: 'Assigning' | 'Picking Up' | 'On The Way' | 'Near Dropoff' | 'Delivered';
  etaMinutes: number;
  progressPercent: number;
  orderValue: number;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  restaurantName: string;
  amount: number;
  fee: number;
  netPayout: number;
  method: 'Visa' | 'Mastercard' | 'Apple Pay' | 'PayPal' | 'Wallet';
  status: 'Completed' | 'Processing' | 'Refunded';
  date: string;
}

export interface OfferCampaign {
  id: string;
  code: string;
  title: string;
  discount: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  minSpend: number;
  usageCount: number;
  usageLimit: number;
  expiresAt: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  targetAudience: string;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  restaurantName: string;
  rating: number;
  comment: string;
  date: string;
  dishName?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  replyStatus: 'Replied' | 'Unanswered';
  adminReply?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: 'order' | 'revenue' | 'alert' | 'rider' | 'system';
}

// ---------------- MOCK DATA COLLECTIONS ----------------

export const MOCK_KPIS = {
  totalOrders: {
    value: 8421,
    display: '8,421',
    trend: '+12.4%',
    isPositive: true,
    subtitle: 'vs previous month (7,492)',
  },
  revenue: {
    value: 184920.5,
    display: '$184,920',
    trend: '+18.2%',
    isPositive: true,
    subtitle: '+$28,450 net monthly gain',
  },
  activeCustomers: {
    value: 42850,
    display: '42,850',
    trend: '+8.6%',
    isPositive: true,
    subtitle: '2,140 new signups this week',
  },
  deliveryPartners: {
    value: 156,
    display: '156 Active',
    trend: '98.2% On-Time',
    isPositive: true,
    subtitle: '94 delivering right now',
  },
};

export const MOCK_REVENUE_CHART = [
  { time: '08:00', revenue: 2400, orders: 84 },
  { time: '10:00', revenue: 4200, orders: 145 },
  { time: '12:00', revenue: 12800, orders: 480 },
  { time: '14:00', revenue: 9500, orders: 360 },
  { time: '16:00', revenue: 6100, orders: 210 },
  { time: '18:00', revenue: 16400, orders: 620 },
  { time: '20:00', revenue: 18900, orders: 740 },
  { time: '22:00', revenue: 11200, orders: 410 },
];

export const MOCK_ORDER_STATUS_DISTRIBUTION = [
  { name: 'Delivered', count: 6230, percentage: 74, color: '#006d37' },
  { name: 'Preparing', count: 1180, percentage: 14, color: '#434653' },
  { name: 'Out for Delivery', count: 670, percentage: 8, color: '#b51c00' },
  { name: 'Pending', count: 250, percentage: 3, color: '#ffb800' },
  { name: 'Cancelled', count: 91, percentage: 1, color: '#ba1a1a' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'FD-8892A',
    customer: {
      name: 'Eleanor Roosevelt',
      initials: 'ER',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Apt 4B, New York, NY 10001',
    },
    restaurant: {
      name: 'Trattoria Bella',
      cuisine: 'Italian Gourmet',
    },
    items: [
      { id: 'i1', name: 'Truffle Mushroom Risotto', quantity: 2, price: 45.0, isVeg: true },
      { id: 'i2', name: 'Bruschetta al Pomodoro', quantity: 1, price: 18.0, isVeg: true },
      { id: 'i3', name: 'San Pellegrino Sparkling', quantity: 2, price: 6.0, isVeg: true },
    ],
    amount: 120.0,
    status: 'Preparing',
    timeElapsed: '12m 45s',
    createdAt: '12 mins ago',
    rider: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 890-1234',
      vehicle: 'Yamaha NMAX (NY-8921)',
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
  },
  {
    id: 'FD-8891B',
    customer: {
      name: 'Liam Neeson',
      initials: 'LN',
      phone: '+1 (555) 345-6789',
      address: '104 West 40th St, Floor 18, Manhattan, NY 10018',
    },
    restaurant: {
      name: 'Zen Sushi & Grill',
      cuisine: 'Japanese & Sashimi',
    },
    items: [
      { id: 'i4', name: 'Dragon Roll Deluxe', quantity: 1, price: 28.5, isVeg: false },
      { id: 'i5', name: 'Salmon Nigiri Set (8pcs)', quantity: 1, price: 34.0, isVeg: false },
      { id: 'i6', name: 'Miso Soup & Edamame', quantity: 2, price: 9.5, isVeg: true },
    ],
    amount: 81.5,
    status: 'Out for Delivery',
    timeElapsed: '24m 10s',
    createdAt: '24 mins ago',
    rider: {
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-9012',
      vehicle: 'Honda PCX (NY-4420)',
    },
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
  },
  {
    id: 'FD-8890C',
    customer: {
      name: 'Sophia Loren',
      initials: 'SL',
      phone: '+1 (555) 456-7890',
      address: '12 Gramercy Park S, Penthouse A, NY 10003',
    },
    restaurant: {
      name: "Luigi's Wood-Fired Bistro",
      cuisine: 'Artisanal Pizza',
    },
    items: [
      { id: 'i7', name: 'Prosciutto & Burrata Pizza', quantity: 2, price: 32.0, isVeg: false },
      { id: 'i8', name: 'Tiramisu Classico', quantity: 2, price: 14.0, isVeg: true },
    ],
    amount: 92.0,
    status: 'Delivered',
    timeElapsed: '38m 00s',
    createdAt: '45 mins ago',
    rider: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-0123',
      vehicle: 'Vespa Elettrica',
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
  },
  {
    id: 'FD-8889D',
    customer: {
      name: 'Alexander Wright',
      initials: 'AW',
      phone: '+1 (555) 567-8901',
      address: '350 5th Avenue, Suite 2100, NY 10118',
    },
    restaurant: {
      name: 'Burger & Co. Craft Kitchen',
      cuisine: 'American Smash Burgers',
    },
    items: [
      { id: 'i9', name: 'Double Wagyu Truffle Smash', quantity: 3, price: 22.0, isVeg: false },
      { id: 'i10', name: 'Loaded Garlic Parmesan Fries', quantity: 2, price: 8.5, isVeg: true },
      { id: 'i11', name: 'Salted Caramel Milkshake', quantity: 3, price: 7.0, isVeg: true },
    ],
    amount: 104.0,
    status: 'Pending',
    timeElapsed: '3m 15s',
    createdAt: '3 mins ago',
    paymentMethod: 'Digital Wallet',
    paymentStatus: 'Paid',
  },
  {
    id: 'FD-8888E',
    customer: {
      name: 'Maya Patel',
      initials: 'MP',
      phone: '+1 (555) 678-9012',
      address: '45 Tudor City Pl, Apt 812, NY 10017',
    },
    restaurant: {
      name: 'Spice Symphony',
      cuisine: 'North Indian & Mughlai',
    },
    items: [
      { id: 'i12', name: 'Butter Chicken Masala', quantity: 1, price: 24.0, isVeg: false },
      { id: 'i13', name: 'Dal Makhani', quantity: 1, price: 18.0, isVeg: true },
      { id: 'i14', name: 'Garlic Butter Naan (4pcs)', quantity: 2, price: 6.0, isVeg: true },
    ],
    amount: 54.0,
    status: 'Preparing',
    timeElapsed: '16m 20s',
    createdAt: '16 mins ago',
    rider: {
      name: 'Carlos Gomez',
      phone: '+1 (555) 432-1098',
      vehicle: 'Avanza Electric Scooter',
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
  },
  {
    id: 'FD-8887F',
    customer: {
      name: 'Jonathan Miller',
      initials: 'JM',
      phone: '+1 (555) 789-0123',
      address: '88 Greenwich St, Apt 14C, NY 10006',
    },
    restaurant: {
      name: 'Golden Dragon Dim Sum',
      cuisine: 'Cantonese & Dim Sum',
    },
    items: [
      { id: 'i15', name: 'Steamed Xiao Long Bao (8pcs)', quantity: 2, price: 16.5, isVeg: false },
      { id: 'i16', name: 'Crispy Duck Pancakes', quantity: 1, price: 29.0, isVeg: false },
    ],
    amount: 62.0,
    status: 'Cancelled',
    timeElapsed: '45m ago',
    createdAt: '1 hour ago',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Refunded',
  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Trattoria Bella',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    cuisine: 'Italian Gourmet • Pasta • Risotto',
    rating: 4.9,
    reviewCount: 524,
    totalOrders: 1840,
    revenue: 48920,
    growth: 14.8,
    status: 'Active',
    address: '142 Rue de Rivoli, Fashion District, NY',
    prepTime: '20-25 min',
    featured: true,
    menuCategories: [
      {
        name: 'Appetizers',
        itemCount: 4,
        items: [
          {
            id: 'tb-1',
            name: 'Bruschetta al Pomodoro',
            description: 'Grilled artisanal sourdough, vine-ripened tomatoes, fresh basil & aged Modena balsamic.',
            price: 18.0,
            isVeg: true,
            isBestseller: true,
            image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&auto=format&fit=crop&q=80',
            available: true,
          },
          {
            id: 'tb-2',
            name: 'Burrata Pugliese',
            description: 'Fresh cream burrata, heirloom cherry tomatoes, cold pressed Ligurian olive oil.',
            price: 22.0,
            isVeg: true,
            image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=300&auto=format&fit=crop&q=80',
            available: true,
          },
        ],
      },
      {
        name: 'Main Courses',
        itemCount: 6,
        items: [
          {
            id: 'tb-3',
            name: 'Truffle Mushroom Risotto',
            description: 'Carnaroli rice, wild porcini mushrooms, 24-month Parmigiano-Reggiano, black truffle oil.',
            price: 45.0,
            isVeg: true,
            isBestseller: true,
            image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=300&auto=format&fit=crop&q=80',
            available: true,
          },
          {
            id: 'tb-4',
            name: 'Tagliolini al Tartufo & Ossobuco',
            description: 'Handmade egg tagliolini, slow-braised veal ragout, micro herbs.',
            price: 48.0,
            isVeg: false,
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&auto=format&fit=crop&q=80',
            available: true,
          },
        ],
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'Zen Sushi & Grill',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    cuisine: 'Japanese • Sushi • Robata Grill',
    rating: 4.8,
    reviewCount: 412,
    totalOrders: 1420,
    revenue: 39150,
    growth: 11.2,
    status: 'Active',
    address: '88 Madison Ave, Midtown, NY',
    prepTime: '25-30 min',
    featured: true,
    menuCategories: [
      {
        name: 'Signature Rolls',
        itemCount: 8,
        items: [
          {
            id: 'zs-1',
            name: 'Dragon Roll Deluxe',
            description: 'Grilled eel, tempura prawn, avocado, unagi reduction, flying fish roe.',
            price: 28.5,
            isVeg: false,
            isBestseller: true,
            image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&auto=format&fit=crop&q=80',
            available: true,
          },
        ],
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Burger & Co. Craft Kitchen',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    cuisine: 'American Smash Burgers • Shakes',
    rating: 4.7,
    reviewCount: 689,
    totalOrders: 2150,
    revenue: 41200,
    growth: 19.5,
    status: 'Active',
    address: '220 Bowery, Lower East Side, NY',
    prepTime: '15-20 min',
    featured: true,
    menuCategories: [],
  },
  {
    id: 'rest-4',
    name: 'Spice Symphony',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    cuisine: 'Authentic Indian • Curry • Biryani',
    rating: 4.9,
    reviewCount: 380,
    totalOrders: 1290,
    revenue: 29800,
    growth: 8.4,
    status: 'Busy',
    address: '150 E 50th St, Manhattan, NY',
    prepTime: '30-35 min',
    featured: false,
    menuCategories: [],
  },
];

export const MOCK_LIVE_DELIVERIES: LiveDelivery[] = [
  {
    id: 'ld-101',
    orderId: 'FD-8891B',
    riderName: 'David Chen',
    riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    riderPhone: '+1 (555) 678-9012',
    vehicle: 'Honda PCX Scooter',
    restaurant: 'Zen Sushi & Grill',
    customerName: 'Liam Neeson',
    destination: '104 West 40th St, Floor 18',
    status: 'On The Way',
    etaMinutes: 8,
    progressPercent: 70,
    orderValue: 81.5,
  },
  {
    id: 'ld-102',
    orderId: 'FD-8892A',
    riderName: 'Marcus Vance',
    riderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    riderPhone: '+1 (555) 890-1234',
    vehicle: 'Yamaha NMAX',
    restaurant: 'Trattoria Bella',
    customerName: 'Eleanor Roosevelt',
    destination: '742 Evergreen Terrace, Apt 4B',
    status: 'Picking Up',
    etaMinutes: 18,
    progressPercent: 35,
    orderValue: 120.0,
  },
  {
    id: 'ld-103',
    orderId: 'FD-8888E',
    riderName: 'Carlos Gomez',
    riderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    riderPhone: '+1 (555) 432-1098',
    vehicle: 'Avanza Electric Scooter',
    restaurant: 'Spice Symphony',
    customerName: 'Maya Patel',
    destination: '45 Tudor City Pl, Apt 812',
    status: 'Near Dropoff',
    etaMinutes: 3,
    progressPercent: 92,
    orderValue: 54.0,
  },
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Eleanor Roosevelt',
    email: 'eleanor.roosevelt@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalOrders: 48,
    totalSpent: 3420.5,
    favoriteCuisine: 'Italian & French',
    status: 'VIP',
    joinedDate: 'Jan 15, 2025',
    lastOrderDate: 'Today, 12:45 PM',
    address: '742 Evergreen Terrace, Apt 4B, NY',
  },
  {
    id: 'cust-2',
    name: 'Liam Neeson',
    email: 'liam.neeson@action.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalOrders: 32,
    totalSpent: 2150.0,
    favoriteCuisine: 'Japanese & Sushi',
    status: 'Active',
    joinedDate: 'Mar 10, 2025',
    lastOrderDate: 'Today, 01:10 PM',
    address: '104 West 40th St, Floor 18, NY',
  },
  {
    id: 'cust-3',
    name: 'Sophia Loren',
    email: 'sophia.loren@cinema.it',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    totalOrders: 86,
    totalSpent: 6240.0,
    favoriteCuisine: 'Wood-Fired Pizza',
    status: 'VIP',
    joinedDate: 'Aug 04, 2024',
    lastOrderDate: 'Today, 11:30 AM',
    address: '12 Gramercy Park S, NY',
  },
  {
    id: 'cust-4',
    name: 'Prabina Rout',
    email: 'prabina.rout@techventures.io',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    totalOrders: 14,
    totalSpent: 890.0,
    favoriteCuisine: 'Smash Burgers',
    status: 'Active',
    joinedDate: 'May 20, 2026',
    lastOrderDate: 'Today, 02:15 PM',
    address: '350 5th Avenue, Suite 2100, NY',
  },
];

export const MOCK_DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 'dp-1',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 890-1234',
    vehicle: 'Motorbike',
    activeOrders: 1,
    rating: 4.95,
    totalDeliveries: 1240,
    earningsToday: 142.5,
    status: 'Delivering',
    currentLocation: 'Midtown East (Lexington & 52nd)',
    batteryOrFuel: '88% Fuel',
  },
  {
    id: 'dp-2',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-9012',
    vehicle: 'Scooter',
    activeOrders: 1,
    rating: 4.88,
    totalDeliveries: 980,
    earningsToday: 118.0,
    status: 'Delivering',
    currentLocation: 'Garment District (7th Ave)',
    batteryOrFuel: '95% Battery',
  },
  {
    id: 'dp-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-0123',
    vehicle: 'E-Bike',
    activeOrders: 0,
    rating: 4.98,
    totalDeliveries: 1820,
    earningsToday: 165.0,
    status: 'Online',
    currentLocation: 'Gramercy Park North',
    batteryOrFuel: '74% Battery',
  },
  {
    id: 'dp-4',
    name: 'Carlos Gomez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 432-1098',
    vehicle: 'Scooter',
    activeOrders: 1,
    rating: 4.82,
    totalDeliveries: 740,
    earningsToday: 95.0,
    status: 'Delivering',
    currentLocation: 'Tudor City (1st Ave)',
    batteryOrFuel: '62% Battery',
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-9021',
    orderId: 'FD-8892A',
    customerName: 'Eleanor Roosevelt',
    restaurantName: 'Trattoria Bella',
    amount: 120.0,
    fee: 18.0,
    netPayout: 102.0,
    method: 'Visa',
    status: 'Completed',
    date: 'Today, 12:45 PM',
  },
  {
    id: 'TXN-9020',
    orderId: 'FD-8891B',
    customerName: 'Liam Neeson',
    restaurantName: 'Zen Sushi & Grill',
    amount: 81.5,
    fee: 12.2,
    netPayout: 69.3,
    method: 'Apple Pay',
    status: 'Completed',
    date: 'Today, 01:10 PM',
  },
  {
    id: 'TXN-9019',
    orderId: 'FD-8890C',
    customerName: 'Sophia Loren',
    restaurantName: "Luigi's Wood-Fired Bistro",
    amount: 92.0,
    fee: 13.8,
    netPayout: 78.2,
    method: 'Mastercard',
    status: 'Completed',
    date: 'Today, 11:30 AM',
  },
  {
    id: 'TXN-9018',
    orderId: 'FD-8887F',
    customerName: 'Jonathan Miller',
    restaurantName: 'Golden Dragon Dim Sum',
    amount: 62.0,
    fee: 0.0,
    netPayout: 0.0,
    method: 'Visa',
    status: 'Refunded',
    date: 'Today, 10:15 AM',
  },
];

export const MOCK_OFFERS: OfferCampaign[] = [
  {
    id: 'off-1',
    code: 'ITALY20',
    title: 'Italian Gourmet Delight',
    discount: '20% OFF',
    discountType: 'PERCENTAGE',
    minSpend: 40,
    usageCount: 428,
    usageLimit: 1000,
    expiresAt: 'Aug 31, 2026',
    status: 'Active',
    targetAudience: 'All Customers',
  },
  {
    id: 'off-2',
    code: 'FREESHIP50',
    title: 'Free Delivery Weekend',
    discount: 'Free Delivery',
    discountType: 'FIXED',
    minSpend: 35,
    usageCount: 890,
    usageLimit: 2000,
    expiresAt: 'Aug 25, 2026',
    status: 'Active',
    targetAudience: 'Orders above $35',
  },
  {
    id: 'off-3',
    code: 'WELCOME50',
    title: 'New Customer Welcome',
    discount: '50% OFF (up to $15)',
    discountType: 'PERCENTAGE',
    minSpend: 25,
    usageCount: 1420,
    usageLimit: 5000,
    expiresAt: 'Dec 31, 2026',
    status: 'Active',
    targetAudience: 'First Time Users',
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Eleanor Roosevelt',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    restaurantName: 'Trattoria Bella',
    rating: 5,
    comment: 'The Truffle Mushroom Risotto arrived piping hot and was cooked to absolute perfection. Best Italian in Manhattan!',
    date: '2 hours ago',
    dishName: 'Truffle Mushroom Risotto',
    sentiment: 'Positive',
    replyStatus: 'Replied',
    adminReply: 'Thank you Eleanor! Chef Marco is thrilled you enjoyed the black truffle infusion.',
  },
  {
    id: 'rev-2',
    customerName: 'Alexander Wright',
    customerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    restaurantName: 'Burger & Co. Craft Kitchen',
    rating: 5,
    comment: 'Double Wagyu smash burger with garlic fries is unbeatable. Fast 20 min delivery too.',
    date: '4 hours ago',
    dishName: 'Double Wagyu Truffle Smash',
    sentiment: 'Positive',
    replyStatus: 'Unanswered',
  },
  {
    id: 'rev-3',
    customerName: 'Jonathan Miller',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    restaurantName: 'Golden Dragon Dim Sum',
    rating: 2,
    comment: 'The restaurant was out of stock of xiao long bao and the order was cancelled after 25 minutes of waiting.',
    date: '5 hours ago',
    sentiment: 'Negative',
    replyStatus: 'Replied',
    adminReply: 'We deeply apologize Jonathan. We have credited $15 voucher to your wallet.',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High Demand Surge Alert',
    message: 'Midtown area experiencing 45% surge in orders. 14 new riders deployed.',
    timestamp: '5m ago',
    unread: true,
    type: 'alert',
  },
  {
    id: 'notif-2',
    title: 'VIP Order Placed (#FD-8892A)',
    message: 'Eleanor Roosevelt placed a $120 order at Trattoria Bella.',
    timestamp: '12m ago',
    unread: true,
    type: 'order',
  },
  {
    id: 'notif-3',
    title: 'Daily Revenue Target Reached',
    message: 'Surpassed $180,000 threshold for the rolling period (+18.2%).',
    timestamp: '1h ago',
    unread: false,
    type: 'revenue',
  },
  {
    id: 'notif-4',
    title: 'New Partner Onboarded',
    message: 'David Chen completed background check and is now active on scooter fleet.',
    timestamp: '2h ago',
    unread: false,
    type: 'rider',
  },
];
