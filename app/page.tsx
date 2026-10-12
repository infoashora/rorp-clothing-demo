'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { formatPrice, products } from '@/lib/catalogue/products';
import { useCart } from '@/components/cart/CartProvider';

const imageRoot = '/images/';

export default function Home() {
  const { itemCount, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [joined, setJoined] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return products.filter((product) => {
      const searchableContent = [
        product.name,
        product.collection,
        product.category,
        product.colour,
        ...product.searchTerms,
      ]
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(query);
    });
  }, [searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;

    searchInputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoined(true);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
  }

  function toggleMenu() {
    setSearchOpen(false);
    setSearchQuery('');
    setMenuOpen((current) => !current);
  }

  return (
    <main className="site-shell">
      <section className="hero" id="top">
        <img
          className="hero-image"
          src={`${imageRoot}hero/01-Hero-Estate-Stairs.jpeg`}
          alt="Models wearing the RORP Essential collection on an estate stairway"
        />

        <div className="hero-shade" />

        <header className="site-header">
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/shop">SHOP</Link>
            <a href="#identity">COLLECTIONS</a>
          </nav>

          <a
            className="wordmark wordmark-header"
            href="#top"
            aria-label="RORP home"
          >
            RORP
          </a>

          <div className="header-actions">
            <button
              className="header-action search-action"
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={openSearch}
            >
              <Search size={15} strokeWidth={1.5} />
              <span>SEARCH</span>
            </button>

            <Link className="header-action" href="/bag">
              BAG ({ready ? itemCount : '—'})
            </Link>

            <button
              className="menu-toggle"
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {searchOpen && (
          <div className="search-panel" role="search">
            <div className="search-panel-top">
              <p className="search-panel-label">SEARCH / RORP</p>

              <button
                className="search-close"
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </div>

            <form className="search-form" onSubmit={handleSearchSubmit}>
              <Search size={22} strokeWidth={1.4} aria-hidden="true" />

              <label className="sr-only" htmlFor="site-search">
                Search RORP
              </label>

              <input
                ref={searchInputRef}
                id="site-search"
                name="search"
                type="search"
                placeholder="SEARCH RORP"
                autoComplete="off"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>

            {!searchQuery.trim() && (
              <p className="search-hint">
                SEARCH PRODUCTS, COLLECTIONS, COLOURS OR CATEGORIES.
              </p>
            )}

            {searchQuery.trim() && (
              <div className="search-results">
                <div className="search-results-header">
                  <span>
                    {searchResults.length === 1
                      ? '1 RESULT'
                      : `${searchResults.length} RESULTS`}
                  </span>

                  <span>{searchQuery.toUpperCase()}</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="search-results-list">
                    {searchResults.map((product) => (
                      <Link
                        className="search-result"
                        key={product.id}
                        href={`/product/${product.handle}`}
                        onClick={closeSearch}
                      >
                        <div className="search-result-image">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                          />
                        </div>

                        <div className="search-result-info">
                          <span className="search-result-collection">
                            {product.collection}
                          </span>

                          <strong>{product.name}</strong>

                          <span className="search-result-meta">
                            {product.colour} / {product.category}
                          </span>
                        </div>

                        <div className="search-result-price">
                          <strong>{formatPrice(product.price)}</strong>

                          {product.compareAtPrice && (
                            <span>
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        <ArrowUpRight
                          className="search-result-arrow"
                          size={17}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="search-empty">
                    <span>NO RESULTS</span>
                    <p>
                      No RORP products currently match &ldquo;
                      {searchQuery}&rdquo;.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {menuOpen && (
          <div className="mobile-menu">
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
            >
              SHOP <ArrowUpRight size={16} />
            </Link>

            <a
              href="#identity"
              onClick={() => setMenuOpen(false)}
            >
              COLLECTIONS <ArrowUpRight size={16} />
            </a>

            <a
              href="#footer"
              onClick={() => setMenuOpen(false)}
            >
              CONTACT <ArrowUpRight size={16} />
            </a>
          </div>
        )}

        <div className="hero-meta hero-meta-top">
          <span>RORP / 001</span>
          <span>2026</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow light">ESSENTIAL COLLECTION</p>

          <h1>
            BUILT FOR
            <br />
            <em>EVERYDAY.</em>
          </h1>

          <Link className="text-link light" href="/shop">
            EXPLORE COLLECTION <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="hero-meta hero-meta-bottom">
          <span>LONDON / UNITED KINGDOM</span>

          <span>
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </span>
        </div>
      </section>

      <section
        className="identity-strip"
        id="identity"
        aria-label="Collection details"
      >
        <div className="identity-intro">
          <span className="section-index">01</span>
          <span>RORP / ESSENTIAL 001</span>
        </div>

        <div className="identity-detail">
          <span className="eyebrow">ORIGIN</span>
          <strong>LONDON, UK</strong>
        </div>

        <div className="identity-detail">
          <span className="eyebrow">FIT</span>
          <strong>RELAXED</strong>
        </div>

        <div className="identity-detail">
          <span className="eyebrow">PALETTE</span>
          <strong>GREY / BLACK</strong>
        </div>

        <div className="identity-detail">
          <span className="eyebrow">SEASON</span>
          <strong>2026</strong>
        </div>
      </section>

      <section
        className="uniform-section content-section"
        id="collection"
      >
        <div className="section-marker">
          <span>02</span>
          <span>COLLECTION STUDY</span>
        </div>

        <div className="uniform-heading">
          <p className="eyebrow">ESSENTIAL / 001</p>

          <h2>
            THE
            <br />
            <em>UNIFORM.</em>
          </h2>

          <p className="section-copy">
            Heavyweight layers. Relaxed silhouettes. Built for repeat wear
            across the city.
          </p>

          <Link className="text-link dark" href="/shop">
            VIEW ESSENTIALS <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="uniform-image image-frame">
          <img
            src={`${imageRoot}collections/essential/04-Essential-Collection-Group.jpeg`}
            alt="Three models wearing RORP essentials outside in London"
          />

          <span className="image-caption">
            LOOK 01 / GREY SET
          </span>
        </div>

        <div className="uniform-notes technical-list">
          <span>01 / 04</span>
          <span>GREY SET</span>
          <span>HEAVYWEIGHT</span>
          <span>RELAXED FIT</span>
          <span>EVERYDAY WEAR</span>
        </div>
      </section>

      <section className="form-section content-section">
        <div className="form-image image-frame">
          <img
            src={`${imageRoot}collections/essential/02-Grey-Collection-Rear-Graphic.jpeg`}
            alt="Rear graphic detail on a grey RORP hoodie"
          />

          <span className="image-caption">
            DETAIL / REAR GRAPHIC
          </span>
        </div>

        <div className="form-copy">
          <div className="section-marker">
            <span>03</span>
            <span>PRODUCT / DETAIL</span>
          </div>

          <p className="eyebrow">CONSTRUCTION STUDY</p>

          <h2>
            NO NOISE.
            <br />
            <em>JUST FORM.</em>
          </h2>

          <p className="section-copy">
            Clean construction, muted colour and strong shape. Nothing added
            unless it needs to be there.
          </p>

          <div className="spec-block">
            <div>
              <span>FABRIC</span>
              <strong>460 GSM COTTON</strong>
            </div>

            <div>
              <span>GRAPHIC</span>
              <strong>SCREEN PRINT / REAR</strong>
            </div>

            <div>
              <span>ORIGIN</span>
              <strong>MADE FOR LONDON</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="everyday-section content-section">
        <div className="everyday-topline">
          <span>04</span>
          <span>ESSENTIAL / 001 — IN CONTEXT</span>
          <span>05—06</span>
        </div>

        <div className="everyday-layout">
          <div className="everyday-copy">
            <p className="eyebrow">THE DAILY SET</p>

            <h2>
              EVERYDAY
              <br />
              <em>BY DESIGN.</em>
            </h2>

            <p className="section-copy">
              One silhouette, worn differently. Heavyweight construction with
              enough room to move and enough structure to hold its shape.
            </p>

            <Link className="text-link dark" href="/shop">
              SHOP THE COLLECTION <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="everyday-image image-frame">
            <img
              src={`${imageRoot}collections/essential/05-Brown-Single-Editorial.jpeg`}
              alt="Model wearing the RORP Essential collection in a concrete stairwell"
            />

            <span className="image-caption">
              LOOK 05 / BROWN ESSENTIAL
            </span>
          </div>

          <div className="everyday-side-note">
            <span>ROP / 001</span>
            <span>BUILT IN THE CITY</span>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-top">
          <div className="newsletter">
            <p className="eyebrow light">
              RORP / STAY CONNECTED
            </p>

            <h2>
              FIRST ACCESS.
              <br />
              <em>NO NOISE.</em>
            </h2>

            <p>
              Join the list for collection releases, restocks and RORP
              updates.
            </p>

            {joined ? (
              <p className="joined-message">
                YOU&apos;RE ON THE LIST. THANK YOU.
              </p>
            ) : (
              <form
                className="newsletter-form"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                />

                <button type="submit">
                  JOIN <ArrowUpRight size={15} />
                </button>
              </form>
            )}
          </div>

          <div className="footer-links">
            <div>
              <span className="eyebrow light">SHOP</span>
              <a href="#collection">NEW RELEASES</a>
              <Link href="/shop">ESSENTIALS</Link>
              <a href="#collection">HOODIES</a>
              <a href="#collection">BOTTOMS</a>
              <Link href="/shop">SHOP ALL</Link>
            </div>

            <div>
              <span className="eyebrow light">RORP</span>
              <a href="#identity">ABOUT</a>
              <a href="#footer">CONTACT</a>
              <a href="#footer">DELIVERY</a>
              <a href="#footer">RETURNS</a>

              <a href="#footer">
                INSTAGRAM <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-wordmark">RORP</div>

        <div className="footer-bottom">
          <span>© 2026 RORP CLOTHING</span>

          <div>
            <a href="#footer">PRIVACY</a>
            <a href="#footer">TERMS</a>
            <a href="#footer">COOKIES</a>
          </div>

          <span>UNITED KINGDOM / GBP</span>
        </div>
      </footer>
    </main>
  );
}