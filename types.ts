
export enum CategoryType {
  PAYMENT = 'Payment & Billing',
  SUBSCRIPTIONS = 'Subscriptions & Activation',
  CONTENT = 'Course Content & Reset',
  TECHNICAL = 'Technical & Troubleshooting',
  REFUNDS = 'Refunds',
  LOGIN = 'Logins & Passwords',
  LEGAL = 'Legal (Bar Prep)',
  FINANCE = 'Finance (CFA/CPA/CMA)',
  GENERAL = 'General Support'
}

export interface FAQItem {
  id: string;
  category: CategoryType;
  question: string;
  answer: string;
}

export interface DummyUser {
  email: string;
  orderId: string;
  purchaseDate: string;
  product: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export enum TicketStatus {
  NEW = 'new',
  RESPONDED = 'responded',
  CLOSED = 'closed'
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: CategoryType;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: TicketStatus;
  createdAt: number;
  adminReply?: string;
  repliedAt?: number;
}
