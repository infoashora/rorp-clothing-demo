'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { getProductByHandle } from '@/lib/catalogue/products';

type ProductOptionsProps = {
  sizes: string[];
};

export default function ProductOptions({ sizes }: ProductOptionsProps) {
  const params = useParams();
  const handle = params?.handle;
  const product =
    typeof handle === 'string' ? getProductByHandle(handle) : undefined;

  const { addItem, itemCount, ready } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const requiresSize = product?.requiresSize ?? true;
  const available = product?.available ?? sizes.length > 0;

  const options =
    product?.sizeOptions ??
    sizes.map((size) => ({ label: size, available: true }));

  const effectiveSize = requiresSize ? selectedSize : sizes[0] ?? null;

  const canAdd = Boolean(
    ready &&
      available &&
      effectiveSize &&
      sizes.includes(effectiveSize) &&
      typeof handle === 'string'
  );

  function handleAddToBag() {
    if (!canAdd || !effectiveSize || typeof handle !== 'string') {
      return;
    }

    const added = addItem(handle, effectiveSize);

    setMessage(
      added
        ? requiresSize
          ? `ADDED TO BAG / SIZE ${effectiveSize}`
          : 'ADDED TO BAG'
        : 'UNABLE TO ADD THIS ITEM. PLEASE TRY AGAIN.'
    );
  }

  return (
    <div style={{ marginTop: '32px' }}>
      <style>{`
        .rorp-size-input:focus-visible + span {
          outline: 2px solid var(--black);
          outline-offset: 4px;
        }

        .rorp-add-button:focus-visible {
          outline: 2px solid var(--black);
          outline-offset: 4px;
        }
      `}</style>

      {requiresSize ? (
        <fieldset
          style={{
            margin: 0,
            padding: 0,
            border: 0,
            minWidth: 0,
          }}
        >
          <legend
            style={{
              padding: 0,
              marginBottom: '14px',
              fontSize: '9px',
              letterSpacing: '.14em',
            }}
          >
            SELECT SIZE
          </legend>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {options.map((option) => {
              const selected = selectedSize === option.label;
              const disabled = !option.available;

              return (
                <label
                  key={option.label}
                  title={disabled ? 'Sold out' : `Size ${option.label}`}
                  style={{
                    position: 'relative',
                    display: 'block',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <input
                    className="rorp-size-input"
                    type="radio"
                    name="product-size"
                    value={option.label}
                    checked={selected}
                    disabled={disabled}
                    onChange={() => {
                      setSelectedSize(option.label);
                      setMessage('');
                    }}
                    aria-label={`Size ${option.label}${
                      disabled ? ', sold out' : ''
                    }`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      margin: 0,
                      opacity: 0,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  />

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '54px',
                      minHeight: '48px',
                      border: '1px solid var(--black)',
                      background: selected
                        ? 'var(--black)'
                        : 'transparent',
                      color: selected
                        ? 'var(--off-white)'
                        : 'var(--black)',
                      fontSize: '11px',
                      letterSpacing: '.08em',
                      opacity: disabled ? 0.3 : 1,
                      textDecoration: disabled ? 'line-through' : 'none',
                    }}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>

          <p
            style={{
              minHeight: '16px',
              margin: '14px 0 0',
              color: 'var(--mid-grey)',
              fontSize: '9px',
              lineHeight: 1.5,
              letterSpacing: '.1em',
            }}
          >
            {!available
              ? 'ALL SIZES SOLD OUT'
              : selectedSize
                ? `SELECTED SIZE / ${selectedSize}`
                : 'CHOOSE YOUR SIZE'}
          </p>

          {available && options.some((option) => !option.available) && (
            <p
              style={{
                margin: '8px 0 0',
                color: 'var(--mid-grey)',
                fontSize: '9px',
                lineHeight: 1.5,
                letterSpacing: '.08em',
              }}
            >
              CROSSED-OUT SIZES ARE SOLD OUT.
            </p>
          )}
        </fieldset>
      ) : (
        <p
          style={{
            margin: 0,
            color: 'var(--mid-grey)',
            fontSize: '9px',
            lineHeight: 1.5,
            letterSpacing: '.12em',
          }}
        >
          {available ? 'NO SIZE SELECTION REQUIRED' : 'SOLD OUT'}
        </p>
      )}

      <button
        className="rorp-add-button"
        type="button"
        disabled={!canAdd}
        onClick={handleAddToBag}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: '54px',
          marginTop: '22px',
          padding: '16px 20px',
          border: '1px solid var(--black)',
          background: 'var(--black)',
          color: 'var(--off-white)',
          fontSize: '10px',
          letterSpacing: '.14em',
          opacity: canAdd ? 1 : 0.45,
          cursor: canAdd ? 'pointer' : 'not-allowed',
        }}
      >
        <span>
          {!available
            ? 'SOLD OUT'
            : !ready
              ? 'LOADING BAG…'
              : requiresSize && !selectedSize
                ? 'SELECT A SIZE'
                : 'ADD TO BAG'}
        </span>
        <span aria-hidden="true">↗</span>
      </button>

      <p
        role="status"
        style={{
          minHeight: '16px',
          margin: '14px 0 0',
          fontSize: '9px',
          lineHeight: 1.5,
          letterSpacing: '.1em',
        }}
      >
        {message}
      </p>

      <p
        style={{
          margin: '12px 0 0',
          color: 'var(--mid-grey)',
          fontSize: '9px',
          letterSpacing: '.12em',
        }}
      >
        BAG / {ready ? itemCount : '—'} ITEMS
      </p>
    </div>
  );
}