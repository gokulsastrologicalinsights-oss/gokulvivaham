export const subscriptionPlans = [
  {
    name: 'Free',
    price: 0,
    features: ['Basic search', 'Send interests', 'View 5 profiles/day'],
    notIncluded: ['Send messages', 'View contact details', 'Priority support'],
    color: 'bg-gray-100',
    buttonColor: 'bg-gray-800 hover:bg-gray-900',
    durationDays: 30, // Default duration
  },
  {
    name: 'Silver',
    price: 499,
    features: ['Advanced search', 'Send interests', 'View 20 profiles/day', 'Send 5 messages/day'],
    notIncluded: ['View contact details', 'Priority support'],
    color: 'bg-slate-100',
    buttonColor: 'bg-slate-600 hover:bg-slate-700',
    durationDays: 30,
  },
  {
    name: 'Gold',
    price: 999,
    features: ['Advanced search', 'Unlimited interests', 'Unlimited profiles', 'Unlimited messages', 'View 10 contact details/day'],
    notIncluded: ['Priority support'],
    color: 'bg-amber-50 border-amber-200 border-2',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    popular: true,
    durationDays: 30,
  },
  {
    name: 'Platinum',
    price: 1499,
    features: ['All Gold features', 'View unlimited contact details', 'Priority customer support', 'Profile highlighting'],
    notIncluded: [],
    color: 'bg-purple-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    durationDays: 30,
  },
];

export function getPlanByName(planName: string) {
  return subscriptionPlans.find((plan) => plan.name === planName);
}
