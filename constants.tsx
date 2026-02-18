
import { CategoryType, FAQItem } from './types';

export const FAQ_DATABASE: FAQItem[] = [
  // PAYMENT & BILLING
  {
    id: 'pay-1',
    category: CategoryType.PAYMENT,
    question: "What forms of payment do you accept?",
    answer: "You can subscribe using a credit or debit card with American Express, Discover, MasterCard, or Visa logo, or via PayPal. We also accept personal checks, money orders, or demand drafts in U.S. dollars mailed to our Dallas office. Financing is available via Affirm for eligible products."
  },
  {
    id: 'pay-2',
    category: CategoryType.PAYMENT,
    question: "Do you offer a Military Discount?",
    answer: "Yes, we offer a 10% discount for active duty members or veterans on new packages. Please submit a copy of your SCRA Status Report or VIC card to support@uworld.com using a .mil email if applicable."
  },
  {
    id: 'pay-3',
    category: CategoryType.PAYMENT,
    question: "What is your refund policy?",
    answer: "Refunds are evaluated case-by-case. Generally, Course or QBank purchases can be refunded within 1-week of activation if no more than 10% of the content has been used. A 10% cancellation fee applies to all refunded amounts."
  },
  {
    id: 'pay-4',
    category: CategoryType.PAYMENT,
    question: "How do I get a receipt for my purchase?",
    answer: "A receipt is automatically emailed to you upon purchase. You can also log into your account, go to the 'Profile' or 'Account' section, and view your 'Order History' to download past receipts."
  },
  {
    id: 'pay-5',
    category: CategoryType.PAYMENT,
    question: "Do you offer group or institutional discounts?",
    answer: "Yes, group discounts are available for institutions or student groups purchasing 10 or more subscriptions. Please visit our 'Institutions' page or contact sales@uworld.com for a custom quote."
  },

  // SUBSCRIPTIONS & ACTIVATION
  {
    id: 'sub-1',
    category: CategoryType.SUBSCRIPTIONS,
    question: "When does a new purchase or renewal begin?",
    answer: "New purchases begin from the moment of activation (not purchase). We recommend activating within 180 days. Renewals, however, are extensions of existing subscriptions and begin immediately from the current expiration date."
  },
  {
    id: 'sub-2',
    category: CategoryType.SUBSCRIPTIONS,
    question: "Can I pause my subscription?",
    answer: "No, subscriptions cannot be paused or put on hold once they have been activated. The time runs continuously until the expiration date."
  },
  {
    id: 'sub-3',
    category: CategoryType.SUBSCRIPTIONS,
    question: "How do I renew my subscription?",
    answer: "To renew, log into your account before your subscription expires. Click the 'Renew' button next to your active subscription. Renewals must be purchased before the current expiration to avoid losing your data."
  },
  {
    id: 'sub-4',
    category: CategoryType.SUBSCRIPTIONS,
    question: "What happens if I forget to activate my subscription?",
    answer: "Unactivated subscriptions expire 180 days after the purchase date. Please ensure you activate your product within this timeframe to utilize the full duration of your access."
  },
  {
    id: 'sub-5',
    category: CategoryType.SUBSCRIPTIONS,
    question: "Can I transfer my subscription to someone else?",
    answer: "No, UWorld subscriptions are for individual use only and are non-transferable. Account sharing is a violation of our Terms of Service and may result in permanent termination of the account."
  },

  // COURSE CONTENT & RESET
  {
    id: 'con-1',
    category: CategoryType.CONTENT,
    question: "Can I reset my QBank and start over?",
    answer: "A 'Reset' option is available with select 180-day or longer subscriptions. If your package includes a reset, you will see a 'Reset' button in your account. This will clear all your test history and performance data."
  },
  {
    id: 'con-2',
    category: CategoryType.CONTENT,
    question: "How do I create a custom flashcard?",
    answer: "While reviewing a question, you can highlight text or click on images to 'Add to Flashcard.' You can then organize these cards into decks within the 'Flashcards' tab in your course dashboard."
  },
  {
    id: 'con-3',
    category: CategoryType.CONTENT,
    question: "Are there explanations for the incorrect answers?",
    answer: "Yes, UWorld is famous for its detailed rationales. Every question includes a thorough explanation of why the correct answer is right and why each incorrect option is wrong, often including custom illustrations."
  },
  {
    id: 'con-4',
    category: CategoryType.CONTENT,
    question: "Can I print the questions or explanations?",
    answer: "No, printing and copying content is disabled to protect our intellectual property. However, you can use the 'My Notebook' feature to take notes and organize concepts within the platform."
  },
  {
    id: 'con-5',
    category: CategoryType.CONTENT,
    question: "How often is the question bank updated?",
    answer: "Our content team updates the question banks daily to reflect the latest exam patterns, clinical guidelines, and feedback from recent test-takers."
  },

  // TECHNICAL & TROUBLESHOOTING
  {
    id: 'tech-1',
    category: CategoryType.TECHNICAL,
    question: "What are the browser requirements?",
    answer: "UWorld is compatible with the latest versions of Chrome, Firefox, Safari, and Edge. We recommend a minimum 5Mbps stable internet connection and disabling all third-party browser extensions."
  },
  {
    id: 'tech-2',
    category: CategoryType.TECHNICAL,
    question: "Why do I see an 'Incompatible process' warning?",
    answer: "If you see an 'Incompatible process' warning, please close all screen-capturing software (Snagit, Skype, Discord, Zoom, Teams) before starting the UWorld software to ensure content security."
  },
  {
    id: 'tech-3',
    category: CategoryType.TECHNICAL,
    question: "Is there a mobile app available?",
    answer: "Yes, the UWorld app is available for iOS (App Store) and Android (Google Play). You can sync your progress across your desktop, tablet, and smartphone seamlessly."
  },
  {
    id: 'tech-4',
    category: CategoryType.TECHNICAL,
    question: "How do I clear my browser cache?",
    answer: "In Chrome, go to Settings > Privacy and Security > Clear browsing data. Select 'Cached images and files' and click 'Clear data.' This often resolves minor loading or display issues."
  },
  {
    id: 'tech-5',
    category: CategoryType.TECHNICAL,
    question: "Can I use UWorld on multiple devices simultaneously?",
    answer: "No, you can only be logged into one device at a time. Logging into a second device will automatically log you out of the first one."
  },

  // PRODUCT SPECIFIC (MEDICAL, NURSING, LEGAL, etc.)
  {
    id: 'med-1',
    category: CategoryType.MEDICAL,
    question: "Does the USMLE Step 1 QBank cover the new pass/fail format?",
    answer: "Yes, our Step 1 QBank is fully updated to reflect the current pass/fail testing environment, focusing on foundational knowledge and integrated concepts."
  },
  {
    id: 'med-2',
    category: CategoryType.MEDICAL,
    question: "How do the Self-Assessments work for USMLE?",
    answer: "UWorld Self-Assessments consist of 4 blocks of 40 questions. They provide a score report and an estimated 3-digit score to help you gauge your exam readiness."
  },
  {
    id: 'nur-1',
    category: CategoryType.NURSING,
    question: "Are Next Generation NCLEX (NGN) questions included?",
    answer: "Absolutely. Our NCLEX-RN and NCLEX-PN banks include NGN item types like case studies, bow-ties, and trend questions to prepare you for the current exam format."
  },
  {
    id: 'nur-2',
    category: CategoryType.NURSING,
    question: "What is a passing 'readiness' score for NCLEX?",
    answer: "While there is no official passing score, achieving a 'Very High' or 'High' chance of passing on our Self-Assessment exams is a strong indicator of readiness."
  },
  {
    id: 'leg-1',
    category: CategoryType.LEGAL,
    question: "Does the MBE QBank include real licensed questions?",
    answer: "Yes, our MBE QBank includes 1,375+ NCBE-licensed questions from past bar exams, supplemented by UWorld-authored questions for complete coverage."
  },
  {
    id: 'fin-1',
    category: CategoryType.FINANCE,
    question: "Are the CFA Level 1 questions updated for the current curriculum?",
    answer: "Yes, all our CFA materials are updated annually to match the current CFA Institute Learning Outcome Statements (LOS)."
  },

  // GENERAL SUPPORT
  {
    id: 'gen-1',
    category: CategoryType.GENERAL,
    question: "How do I change my registered email address?",
    answer: "To change your email, please email support@uworld.com from your currently registered email address with the new email you would like to use."
  },
  {
    id: 'gen-2',
    category: CategoryType.GENERAL,
    question: "What should I do if I forgot my password?",
    answer: "On the login page, click the 'Forgot Password' link. Enter your registered email address, and we will send you a secure link to reset your password."
  },
  {
    id: 'gen-3',
    category: CategoryType.GENERAL,
    question: "What are your support hours?",
    answer: "Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST. We respond to all email inquiries within 24 business hours."
  },
  {
    id: 'gen-4',
    category: CategoryType.GENERAL,
    question: "How can I provide feedback on a specific question?",
    answer: "Within any question block, you can click the 'Feedback' button. This sends the question ID and your comments directly to our content editorial team for review."
  }
];

export const PRODUCT_DIRECTORY = {
  "Medical": {
    "url": "https://medical.uworld.com",
    "products": ["USMLE Step 1", "Step 2 CK", "Step 3", "ABIM", "ABFM", "PANCE", "UKMLA AKT"]
  },
  "Nursing": {
    "url": "https://nursing.uworld.com",
    "products": ["NCLEX-RN", "NCLEX-PN", "FNP", "Clinical Med Math"]
  },
  "Legal": {
    "url": "https://legal.uworld.com",
    "products": ["MBE", "Themis Bar Review"]
  },
  "Finance": {
    "url": "https://finance.uworld.com",
    "products": ["CFA Level 1, 2, 3", "CMT Level 1, 2, 3"]
  },
  "Accounting": {
    "url": "https://accounting.uworld.com",
    "products": ["CPA", "CMA", "CIA"]
  },
  "Grad School": {
    "url": "https://gradschool.uworld.com",
    "products": ["MCAT"]
  },
  "College Prep": {
    "url": "https://collegeprep.uworld.com",
    "products": ["SAT", "ACT", "AP Courses"]
  },
  "Pharmacy": {
    "url": "https://pharmacy.uworld.com",
    "products": ["NAPLEX", "MPJE", "CPJE"]
  }
};

export const APP_THEME = {
  primary: '#004C97',
  secondary: '#FFB81C',
  accent: '#E6F0FF',
};
