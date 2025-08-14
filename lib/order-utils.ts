// Utility functions for order management

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
} as const;

export function getOrderStatusColor(status: string) {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.PACKED:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.SHIPPED:
      return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.DELIVERED:
      return 'bg-green-100 text-green-800';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPaymentStatusColor(status: string) {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case PaymentStatus.SUCCESS:
      return 'bg-green-100 text-green-800';
    case PaymentStatus.FAILED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function formatOrderId(orderId: string) {
  return `#${orderId.slice(-8).toUpperCase()}`;
}

export function formatAmount(amount: number) {
  return `₹${amount.toFixed(2)}`;
}
