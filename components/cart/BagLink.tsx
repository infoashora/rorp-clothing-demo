'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function BagLink() {
  const { itemCount, ready } = useCart();

  return (
    <Link
      href="/bag"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '44px',
        fontSize: '10px',
        letterSpacing: '.14em',
        whiteSpace: 'nowrap',
      }}
    >
      BAG ({ready ? itemCount : '—'})
    </Link>
  );
}