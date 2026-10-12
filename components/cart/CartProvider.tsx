'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getProductByHandle } from '@/lib/catalogue/products';

type CartItem = {
  handle: string;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  addItem: (handle: string, size: string) => boolean;
  removeItem: (handle: string, size: string) => void;
  updateQuantity: (
    handle: string,
    size: string,
    quantity: number
  ) => void;
};

const STORAGE_KEY = 'rorp-bag-v1';

const CartContext = createContext<CartContextValue | null>(null);

function isValidItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<CartItem>;

  if (
    typeof item.handle !== 'string' ||
    typeof item.size !== 'string' ||
    typeof item.quantity !== 'number' ||
    !Number.isSafeInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return false;
  }

  const product = getProductByHandle(item.handle);

  return Boolean(product && product.sizes.includes(item.size));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isValidItem));
        }
      }
    } catch {
      // The bag still works if saved data cannot be read.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Keep the current bag usable if browser storage is unavailable.
    }
  }, [items, ready]);

  function addItem(handle: string, size: string) {
    const product = getProductByHandle(handle);

    if (!ready || !product || !product.sizes.includes(size)) {
      return false;
    }

    setItems((current) => {
      const existing = current.find(
        (item) => item.handle === handle && item.size === size
      );

      if (existing) {
        return current.map((item) =>
          item.handle === handle && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { handle, size, quantity: 1 }];
    });

    return true;
  }

  function removeItem(handle: string, size: string) {
    setItems((current) =>
      current.filter(
        (item) => !(item.handle === handle && item.size === size)
      )
    );
  }

  function updateQuantity(
    handle: string,
    size: string,
    quantity: number
  ) {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      return;
    }

    if (quantity === 0) {
      removeItem(handle, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.handle === handle && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce((total, item) => {
    const product = getProductByHandle(item.handle);

    return total + (product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        ready,
        addItem,
        removeItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }

  return context;
}