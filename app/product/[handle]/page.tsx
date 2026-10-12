import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  formatPrice,
  getProductByHandle,
} from '@/lib/catalogue/products';
import BagLink from '@/components/cart/BagLink';
import ProductOptions from './ProductOptions';
import styles from './ProductPage.module.css';

type ProductPageProps = {
  params: {
    handle: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← BACK TO RORP
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <Link
            href="/"
            className={styles.wordmark}
            aria-label="RORP homepage"
          >
            RORP
          </Link>

          <BagLink />
        </div>
      </header>

      <main>
        <div className={styles.index}>
          <span>PRODUCT INDEX / {product.category}</span>
          <span>{product.collection}</span>
        </div>

        <div className={styles.layout}>
          <section
            className={styles.gallery}
            aria-label={`${product.name} photographs`}
          >
            {product.images.map((image, index) => (
              <figure key={image} className={styles.imageFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${product.name} — view ${index + 1}`}
                  className={styles.image}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </figure>
            ))}
          </section>

          <section
            className={styles.details}
            aria-labelledby="product-title"
          >
            <p className={styles.collection}>
              {product.collection}
            </p>

            <h1 id="product-title" className={styles.title}>
              {product.name}
            </h1>

            <div className={styles.prices}>
              <span>
                <span className="sr-only">Current price: </span>
                {formatPrice(product.price)}
              </span>

              {product.compareAtPrice !== undefined &&
                product.compareAtPrice > product.price && (
                  <del className={styles.originalPrice}>
                    <span className="sr-only">Original price: </span>
                    {formatPrice(product.compareAtPrice)}
                  </del>
                )}
            </div>

            <dl className={styles.specs}>
              <div className={styles.specRow}>
                <dt>Colour</dt>
                <dd>{product.colour}</dd>
              </div>

              <div className={styles.specRow}>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>

              <div className={styles.specRow}>
                <dt>Collection</dt>
                <dd>{product.collection}</dd>
              </div>
            </dl>

            <ProductOptions sizes={product.sizes} />
          </section>
        </div>
      </main>
    </div>
  );
}