export type Role = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN';

export interface UserProfile {
  id?: number;
  firebaseUid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  emailVerified?: boolean;
  status?: string;
  profileImage?: string;
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id?: number;
  label: string; // 'Home' | 'Work' | 'Other'
  streetAddress: string;
  aptSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface MenuItemCustomization {
  size?: 'Small' | 'Medium' | 'Large';
  sizePrice?: number;
  addOns?: Array<{ name: string; price: number }>;
  instructions?: string;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  categoryName?: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  customizable?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: number;
  ownerId?: string;
  name: string;
  cuisine: string;
  address: string;
  phone?: string;
  rating: number;
  reviewCount?: number;
  prepTime?: string;
  deliveryTime?: string;
  priceForTwo?: number;
  costForTwoText?: string;
  isOpen: boolean;
  image?: string;
  featured?: boolean;
  distance?: string;
  offerText?: string;
  menuItems?: MenuItem[];
  menuCategories?: MenuCategory[];
}

export interface CartItem {
  id?: number;
  menuItemId: number;
  restaurantId: number;
  restaurantName?: string;
  itemName: string;
  quantity: number;
  price: number;
  subTotal: number;
  isVeg?: boolean;
  image?: string;
  customization?: MenuItemCustomization;
}

export interface Cart {
  id?: number;
  userId: string;
  restaurantId?: number;
  restaurantName?: string;
  items: CartItem[];
  totalAmount: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id?: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface Order {
  id: number;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  restaurantId: number;
  restaurantName?: string;
  deliveryAddressId?: number;
  deliveryAddress?: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
  driverName?: string;
  driverPhone?: string;
  etaMinutes?: number;
}

export interface DeliveryPartner {
  id: number;
  driverId: string;
  name: string;
  avatar: string;
  phone: string;
  vehicle: string;
  vehicleType: string;
  status: string;
  rating: number;
  totalDeliveries: number;
  batteryLevel: number;
  currentLatitude: number;
  currentLongitude: number;
  activeOrderId?: number;
  destinationAddress?: string;
  estimatedTimeMinutes?: number;
}

export interface LiveDelivery {
  id: string;
  orderId: number;
  driverName: string;
  driverAvatar: string;
  driverPhone: string;
  vehicle: string;
  status: string;
  batteryLevel: number;
  currentLatitude: number;
  currentLongitude: number;
  destinationAddress: string;
  etaMinutes: number;
}

export interface NotificationItem {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: number;
  orderId: number;
  userId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  paymentMethod: string;
  currency?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENT' | 'FLAT' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  image: string;
  itemCount?: string;
}
