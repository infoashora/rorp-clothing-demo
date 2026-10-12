'use client';

import { useState } from 'react';
import Link from 'next/link';
import BagLink from '@/components/cart/BagLink';
import { formatPrice, products } from '@/lib/catalogue/products';

const collections = [
  { label: 'SHOP ALL', value: 'all' },
  { label: 'ESSENTIAL COLLECTION', value: 'Essential Collection' },
  { label: 'CONCRETE COLLECTION', value: 'Concrete Collection' },
  { label: 'HATS', value: 'Hats' },
];

const categoryOrder = ['T-Shirts', 'Hoodies', 'Shorts', 'Bottoms', 'Hats'];

export default function ShopPage() {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const collectionProducts =
    selectedCollection === 'all'
      ? products
      : products.filter(
          (product) => product.collection === selectedCollection
        );

  const categories = categoryOrder.filter((category) =>
    collectionProducts.some((product) => product.category === category)
  );

  const visibleProducts =
    selectedCategory === 'all'
      ? collectionProducts
      : collectionProducts.filter(
          (product) => product.category === selectedCategory
        );

  const heading =
    selectedCollection === 'all'
      ? 'SHOP ALL.'
      : `${selectedCollection.toUpperCase()}.`;

  function selectCollection(collection: string) {
    setSelectedCollection(collection);
    setSelectedCategory('all');
  }

  return (
    <div className="rorp-shop">
      <style>{`
        .rorp-shop {
          min-height: 100vh;
          background: var(--off-white);
          color: var(--black);
        }
        .rorp-shop-header {
          min-height: 84px;
          padding: 0 4.2vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid var(--line);
        }
        .rorp-shop-back {
          font-size: 10px;
          letter-spacing: .14em;
        }
        .rorp-shop-header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .rorp-shop-logo {
          font-size: 29px;
          font-weight: 900;
          letter-spacing: -.1em;
          line-height: 1;
        }
        .rorp-shop-main {
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 4.2vw 64px;
        }
        .rorp-shop-eyebrow {
          margin: 0 0 18px;
          color: var(--mid-grey);
          font-size: 9px;
          letter-spacing: .17em;
        }
        .rorp-shop-title {
          margin: 0;
          max-width: 100%;
          font-size: clamp(44px, 5.5vw, 80px);
          line-height: .95;
          letter-spacing: -.06em;
          overflow-wrap: break-word;
        }
        .rorp-shop-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 32px;
        }
        .rorp-shop-filter {
          min-height: 44px;
          padding: 12px 16px;
          border: 1px solid var(--line);
          background: transparent;
          color: var(--black);
          font-size: 9px;
          line-height: 1.4;
          letter-spacing: .1em;
        }
        .rorp-shop-filter[aria-pressed=true] {
          border-color: var(--black);
          background: var(--black);
          color: var(--off-white);
        }
        .rorp-shop-filter:hover {
          border-color: var(--black);
        }
        .rorp-shop-category-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }
        .rorp-shop-category-label {
          color: var(--mid-grey);
          font-size: 9px;
          letter-spacing: .12em;
        }
        .rorp-shop-category-select {
          min-height: 44px;
          max-width: 100%;
          padding: 10px 32px 10px 12px;
          border: 1px solid var(--line);
          border-radius: 0;
          background: var(--off-white);
          color: var(--black);
          font: inherit;
          font-size: 11px;
          cursor: pointer;
        }
        .rorp-shop-index {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-top: 24px;
          padding: 16px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          color: var(--mid-grey);
          font-size: 9px;
          line-height: 1.5;
          letter-spacing: .12em;
        }
        .rorp-shop-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 32px 20px;
          margin-top: 24px;
        }
        .rorp-shop-card {
          display: block;
          min-width: 0;
        }
        .rorp-shop-image-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: var(--light-grey);
        }
        .rorp-shop-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .35s ease;
        }
        .rorp-shop-card:hover .rorp-shop-image {
          transform: scale(1.025);
        }
        .rorp-shop-sold-out {
          position: absolute;
          left: 10px;
          bottom: 10px;
          padding: 8px 10px;
          background: var(--black);
          color: var(--off-white);
          font-size: 8px;
          letter-spacing: .12em;
        }
        .rorp-shop-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-top: 14px;
        }
        .rorp-shop-card-title {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: .03em;
          text-transform: uppercase;
        }
        .rorp-shop-arrow {
          flex-shrink: 0;
          font-size: 16px;
          line-height: 1;
        }
        .rorp-shop-card-meta {
          margin: 8px 0 0;
          color: var(--mid-grey);
          font-size: 8px;
          line-height: 1.6;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .rorp-shop-prices {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 9px;
          margin-top: 12px;
          font-size: 11px;
        }
        .rorp-shop-original-price {
          color: var(--mid-grey);
          font-size: 10px;
        }
        .rorp-shop-empty {
          padding: 40px 0;
          color: var(--mid-grey);
          font-size: 11px;
          line-height: 1.6;
          letter-spacing: .1em;
        }
        .rorp-shop a:focus-visible,
        .rorp-shop button:focus-visible,
        .rorp-shop select:focus-visible {
          outline: 2px solid var(--black);
          outline-offset: 5px;
        }
        @media (max-width: 1100px) {
          .rorp-shop-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 800px) {
          .rorp-shop-header {
            min-height: 68px;
            padding: 0 20px;
          }
          .rorp-shop-back {
            font-size: 9px;
          }
          .rorp-shop-logo {
            font-size: 25px;
          }
          .rorp-shop-header-right {
            gap: 18px;
          }
          .rorp-shop-main {
            padding: 30px 20px 48px;
          }
          .rorp-shop-title {
            font-size: clamp(36px, 10vw, 64px);
          }
          .rorp-shop-filters {
            gap: 8px;
            margin-top: 26px;
          }
          .rorp-shop-filter {
            padding: 12px;
            font-size: 8px;
          }
          .rorp-shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 28px 12px;
          }
          .rorp-shop-card-title {
            font-size: 10px;
          }
          .rorp-shop-card-meta {
            font-size: 7px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rorp-shop-image {
            transition: none;
          }
        }
      `}</style>

      <header className="rorp-shop-header">
        <Link href="/" className="rorp-shop-back">
          ← BACK TO RORP
        </Link>

        <div className="rorp-shop-header-right">
          <Link
            href="/"
            className="rorp-shop-logo"
            aria-label="RORP homepage"
          >
            RORP
          </Link>
          <BagLink />
        </div>
      </header>

      <main className="rorp-shop-main">
        <p className="rorp-shop-eyebrow">RORP / PRODUCT INDEX</p>
        <h1 className="rorp-shop-title">{heading}</h1>

        <div
          className="rorp-shop-filters"
          role="group"
          aria-label="Filter products by collection"
        >
          {collections.map((collection) => (
            <button
              key={collection.value}
              className="rorp-shop-filter"
              type="button"
              aria-pressed={selectedCollection === collection.value}
              onClick={() => selectCollection(collection.value)}
            >
              {collection.label}
            </button>
          ))}
        </div>

        <div className="rorp-shop-category-row">
          <label
            htmlFor="shop-category"
            className="rorp-shop-category-label"
          >
            CATEGORY
          </label>

          <select
            id="shop-category"
            className="rorp-shop-category-select"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="rorp-shop-index">
          <span>
            {selectedCategory !== 'all'
              ? selectedCategory.toUpperCase()
              : selectedCollection === 'all'
                ? 'THE CATALOGUE'
                : selectedCollection.toUpperCase()}
          </span>

          <span role="status" aria-atomic="true">
            {visibleProducts.length}{' '}
            {visibleProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
          </span>
        </div>

        {visibleProducts.length === 0 ? (
          <p className="rorp-shop-empty">
            NO PRODUCTS MATCH THESE FILTERS.
          </p>
        ) : (
          <section className="rorp-shop-grid" aria-label="RORP products">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className="rorp-shop-card"
              >
                <div className="rorp-shop-image-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="rorp-shop-image"
                    loading="lazy"
                    decoding="async"
                  />

                  {!product.available && (
                    <span className="rorp-shop-sold-out">SOLD OUT</span>
                  )}
                </div>

                <div className="rorp-shop-card-top">
                  <h2 className="rorp-shop-card-title">{product.name}</h2>
                  <span className="rorp-shop-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <p className="rorp-shop-card-meta">
                  {product.collection}
                  <br />
                  {product.colour === 'Not specified'
                    ? product.category
                    : `${product.colour} / ${product.category}`}
                </p>

                <div className="rorp-shop-prices">
                  <span>{formatPrice(product.price)}</span>
                  {product.compareAtPrice !== undefined &&
                    product.compareAtPrice > product.price && (
                      <del className="rorp-shop-original-price">
                        {formatPrice(product.compareAtPrice)}
                      </del>
                    )}
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}