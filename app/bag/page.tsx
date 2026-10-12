'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import {
  formatPrice,
  getProductByHandle,
} from '@/lib/catalogue/products';

export default function BagPage() {
  const {
    items,
    itemCount,
    subtotal,
    ready,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <div className="rorp-bag">
      <style>{`
        .rorp-bag {
          min-height: 100vh;
          background: var(--off-white);
          color: var(--black);
        }

        .rorp-bag-header {
          min-height: 84px;
          padding: 0 4.2vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--line);
        }

        .rorp-bag-back {
          font-size: 10px;
          letter-spacing: .14em;
        }

        .rorp-bag-logo {
          font-size: 29px;
          font-weight: 900;
          letter-spacing: -.1em;
          line-height: 1;
        }

        .rorp-bag-main {
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 4.2vw 64px;
        }

        .rorp-bag-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--line);
        }

        .rorp-bag-title {
          margin: 0;
          font-size: clamp(40px, 5vw, 72px);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .rorp-bag-count {
          font-size: 9px;
          letter-spacing: .14em;
        }

        .rorp-bag-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
          gap: 6vw;
          padding-top: 28px;
          align-items: start;
        }

        .rorp-bag-item {
          display: grid;
          grid-template-columns: 120px minmax(0, 1fr);
          gap: 24px;
          padding: 0 0 28px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--line);
        }

        .rorp-bag-image {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          background: var(--light-grey);
        }

        .rorp-bag-item-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -.02em;
          text-transform: uppercase;
        }

        .rorp-bag-meta {
          margin: 10px 0 0;
          color: var(--mid-grey);
          font-size: 9px;
          line-height: 1.6;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .rorp-bag-item-price {
          margin: 14px 0;
          font-size: 13px;
        }

        .rorp-bag-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .rorp-bag-quantity {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--line);
        }

        .rorp-bag-quantity button {
          width: 36px;
          height: 36px;
          border: 0;
          background: transparent;
          color: var(--black);
        }

        .rorp-bag-quantity button:disabled {
          opacity: .3;
          cursor: not-allowed;
        }

        .rorp-bag-quantity output {
          min-width: 30px;
          text-align: center;
          font-size: 11px;
        }

        .rorp-bag-remove {
          padding: 8px 0;
          border: 0;
          border-bottom: 1px solid var(--line);
          background: transparent;
          color: var(--mid-grey);
          font-size: 9px;
          letter-spacing: .1em;
        }

        .rorp-bag-summary {
          padding: 24px;
          border: 1px solid var(--line);
        }

        .rorp-bag-summary h2 {
          margin: 0 0 24px;
          font-size: 12px;
          line-height: 1.4;
          letter-spacing: .12em;
        }

        .rorp-bag-subtotal {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          font-size: 11px;
          letter-spacing: .08em;
        }

        .rorp-bag-subtotal strong {
          font-size: 20px;
          letter-spacing: -.02em;
        }

        .rorp-bag-note {
          margin: 20px 0 0;
          color: var(--mid-grey);
          font-size: 11px;
          line-height: 1.6;
        }

        .rorp-bag-continue {
          display: inline-block;
          margin-top: 24px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--black);
          font-size: 9px;
          letter-spacing: .12em;
        }

        .rorp-bag-empty {
          padding: 48px 0;
        }

        .rorp-bag-empty p {
          margin: 0;
          color: var(--mid-grey);
          font-size: 11px;
          letter-spacing: .1em;
        }

        .rorp-bag a:focus-visible,
        .rorp-bag button:focus-visible {
          outline: 2px solid var(--black);
          outline-offset: 4px;
        }

        @media (max-width: 800px) {
          .rorp-bag-header {
            min-height: 68px;
            padding: 0 20px;
          }

          .rorp-bag-logo {
            font-size: 25px;
          }

          .rorp-bag-main {
            padding: 30px 20px 48px;
          }

          .rorp-bag-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .rorp-bag-item {
            grid-template-columns: 90px minmax(0, 1fr);
            gap: 16px;
          }

          .rorp-bag-item-title {
            font-size: 12px;
          }

          .rorp-bag-summary {
            padding: 20px;
          }
        }
      `}</style>

      <header className="rorp-bag-header">
        <Link href="/" className="rorp-bag-back">
          ← BACK TO RORP
        </Link>

        <Link
          href="/"
          className="rorp-bag-logo"
          aria-label="RORP homepage"
        >
          RORP
        </Link>
      </header>

      <main className="rorp-bag-main">
        <div className="rorp-bag-top">
          <h1 className="rorp-bag-title">YOUR BAG.</h1>
          <span className="rorp-bag-count">
            {ready ? itemCount : '—'} ITEMS
          </span>
        </div>

        {!ready ? (
          <div className="rorp-bag-empty" role="status">
            <p>LOADING YOUR BAG…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rorp-bag-empty">
            <p>YOUR BAG IS EMPTY.</p>
            <Link href="/" className="rorp-bag-continue">
              EXPLORE RORP ↗
            </Link>
          </div>
        ) : (
          <div className="rorp-bag-layout">
            <section aria-label="Items in your bag">
              {items.map((item) => {
                const product = getProductByHandle(item.handle);

                if (!product) {
                  return null;
                }

                return (
                  <article
                    key={`${item.handle}/${item.size}`}
                    className="rorp-bag-item"
                  >
                    <Link href={`/product/${product.handle}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="rorp-bag-image"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </Link>

                    <div>
                      <h2 className="rorp-bag-item-title">
                        <Link href={`/product/${product.handle}`}>
                          {product.name}
                        </Link>
                      </h2>

                      <p className="rorp-bag-meta">
                        COLOUR / {product.colour}
                        <br />
                        SIZE / {item.size}
                      </p>

                      <p className="rorp-bag-item-price">
                        {formatPrice(product.price * item.quantity)}
                      </p>

                      <div className="rorp-bag-controls">
                        <div
                          className="rorp-bag-quantity"
                          role="group"
                          aria-label={`Quantity for ${product.name}, size ${item.size}`}
                        >
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(
                                item.handle,
                                item.size,
                                item.quantity - 1
                              )
                            }
                          >
                            −
                          </button>

                          <output aria-live="polite">
                            {item.quantity}
                          </output>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(
                                item.handle,
                                item.size,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="rorp-bag-remove"
                          type="button"
                          aria-label={`Remove ${product.name}, size ${item.size}`}
                          onClick={() =>
                            removeItem(item.handle, item.size)
                          }
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="rorp-bag-summary">
              <h2>BAG / SUMMARY</h2>

              <div className="rorp-bag-subtotal" aria-live="polite">
                <span>SUBTOTAL</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <p className="rorp-bag-note">
                This is a RORP website demo. Checkout is not available.
              </p>

              <Link href="/" className="rorp-bag-continue">
                CONTINUE EXPLORING ↗
              </Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}