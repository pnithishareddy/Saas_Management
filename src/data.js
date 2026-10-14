
import React from 'react';
import htm from 'htm';

const mk = (t, p, ...c) => {
  if (p) {
    const q = {};

    for (const k in p) {
      q[
        k === 'class'
          ? 'className'
          : k === 'for'
            ? 'htmlFor'
            : /^(aria|data)-/.test(k)
              ? k
              : k.replace(/-(\w)/g, (_, x) => x.toUpperCase())
      ] = p[k];
    }

    p = q;
  }

  return React.createElement(t, p, ...c);
};

export const h = htm.bind(mk);
export const DAY = 864e5;

export const money = n =>
  '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');

export const num = n =>
  Math.round(Number(n) || 0).toLocaleString('en-IN');

export const fd = t => {
  const d = new Date(t);

  return (
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
  );
};

export const pd = v => new Date(v + 'T00:00:00').getTime();

export function rng(s) {
  return () => {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;

    let t = Math.imul(s ^ (s >>> 15), 1 | s);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rd = rng(11);
export const pick = a => a[Math.floor(rd() * a.length)];

export const TODAY = new Date().setHours(0, 0, 0, 0);

export const DAYS = Array.from({ length: 730 }, (_, i) => ({
  t: TODAY - (729 - i) * DAY,
  rev: (
    1500 +
    i * 3.4 +
    Math.sin(i / 7) * 170 +
    rd() * 240
  ) * 80,
  api: 40000 + i * 70 + Math.sin(i / 5) * 5000 + rd() * 7000,
  gb: 120 + i * 0.5 + rd() * 6
}));

export const PLANS0 = [
  {
    id: 'p1',
    name: 'Starter',
    price: 1499,
    interval: 'monthly',
    seats: 3,
    api: 50000,
    features: 'Email support, 3 seats, Basic reports',
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Growth',
    price: 5999,
    interval: 'monthly',
    seats: 15,
    api: 400000,
    features: 'Priority support, 15 seats, Advanced reports, Webhooks',
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Scale',
    price: 19999,
    interval: 'monthly',
    seats: 60,
    api: 2000000,
    features: 'Dedicated manager, SSO, Audit log, 99.9% SLA',
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Enterprise',
    price: 149999,
    interval: 'yearly',
    seats: 500,
    api: 10000000,
    features: 'Custom contracts, On-prem option, 24/7 support',
    status: 'active'
  }
];

export const CO = [
  'Tata Nova', 'Infosys', 'Reliance Retail', 'Wipro',
  'Mahindra', 'Godrej', 'Bajaj', 'Zoho', 'Freshworks',
  'Razorpay', 'Swiggy', 'Zomato', 'Paytm', 'Flipkart',
  'Myntra', 'Ola', 'Byju', 'Nykaa', 'Dream11', 'Meesho',
  'Cred', 'PhonePe', 'Lenskart', 'Boat', 'Mamaearth',
  'Dunzo', 'Urban Ladder', 'Pine Labs', 'Delhivery',
  'Ather', 'Sharechat', 'Cars24', 'Groww', 'Zerodha',
  'Policybazaar', 'Unacademy', 'Vedantu', 'Pepperfry',
  'Tanishq', 'Haldiram'
];

export const ST = [
  'active', 'active', 'active', 'active',
  'trialing', 'trialing', 'past_due', 'paused', 'canceled'
];

export const CUS0 = CO.slice(0, 10).map((c, i) => ({
  id: 'c' + i,
  company: c + ' ' + pick([
    'Technologies', 'Pvt Ltd', 'Solutions', 'Systems', 'Industries'
  ]),
  contact: pick([
    'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram',
    'Sneha', 'Arjun', 'Kavya', 'Ishaan', 'Meera'
  ]) + ' ' + pick([
    'Sharma', 'Iyer', 'Reddy', 'Patel',
    'Nair', 'Gupta', 'Singh', 'Rao'
  ]),
  email: c.toLowerCase() + '@example.com',
  planId: pick(['p1', 'p1', 'p2', 'p2', 'p3', 'p4']),
  status: pick(ST),
  joined: TODAY - Math.floor(rd() * 500) * DAY,
  usage: rd() * 1.15,
  seatsUsed: Math.floor(rd() * 100)
}));

export const USR0 = Array.from({ length: 15 }, (_, i) => {
  const c = CUS0[i % CUS0.length];

  return {
    id: 'u' + i,
    name: pick([
      'Aditya', 'Divya', 'Karthik', 'Lakshmi', 'Nikhil',
      'Pooja', 'Rahul', 'Swati', 'Suresh', 'Deepa'
    ]) + ' ' + pick([
      'Venkatesh', 'Menon', 'Naidu', 'Joshi',
      'Kulkarni', 'Bose', 'Chopra', 'Pillai'
    ]),
    email: 'user' + i + '@' + c.email.split('@')[0] + '.com',
    role: pick(['Admin', 'Member', 'Member', 'Viewer']),
    customerId: c.id,
    status: pick(['active', 'active', 'active', 'invited', 'suspended']),
    last: TODAY - Math.floor(rd() * 60) * DAY
  };
});

export const planMrr = p =>
  p.interval === 'yearly' ? p.price / 12 : p.price;
