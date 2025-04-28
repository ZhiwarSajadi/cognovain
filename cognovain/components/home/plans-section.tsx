type PlanType = {
  id: string;
  name: string;
  price: number;
  description: string;
  items: string[];
};

const plans: PlanType[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    description: "For regular use",
    items: [
      "Unlimited entries",
      "Registration required",
      "Cognitive error analysis"
    ]
  }
];

import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

function PlansCard({ plan }: { plan: PlanType }) {
  return (
    <div className={`rounded-lg p-8 flex flex-col h-full transform transition-transform duration-300 hover:scale-105 border border-gray-200`}>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        <div className="flex items-baseline mb-8">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-gray-600 ml-2">/mo</span>
        </div>
        <ul className="space-y-4 mb-8">
          {plan.items.map((item, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="h-5 w-5 text-rose-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <SignedIn>
        <Link href="/submit">
          <button className="w-full py-3 px-4 rounded-md font-medium bg-rose-100 text-rose-600 hover:bg-rose-200">
            Try Now →
          </button>
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <button className="w-full py-3 px-4 rounded-md font-medium bg-rose-100 text-rose-600 hover:bg-rose-200">
            Try Now →
          </button>
        </Link>
      </SignedOut>
    </div>
  );
}

export default function PlansSection() {
  return (
    <section id="plans" className="relative mx-auto flex flex-col z-0 items-center justify-center min-h-[80vh] py-32 sm:py-40 lg:py-48 transition-all animate-in lg:px-12 max-w-7xl">
      <div className="flex flex-col items-center justify-center w-full px-4">
        <p className="text-rose-600 font-medium mb-4">PLANS</p>
        <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-center max-w-3xl">
          Choose the plan that fits your needs
        </h2>
        <div className="grid gap-8 w-full max-w-5xl justify-center">
          {plans.map((plan) => (
            <PlansCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}