import sourceProducts from './source-products.json';

export type Product = {
  id: string;
  handle: string;
  name: string;
  collection: string;
  category: string;
  colour: string;
  price: number;
  compareAtPrice?: number;
  currency: 'GBP';
  sizes: string[];
  sizeOptions: {
    label: string;
    available: boolean;
  }[];
  requiresSize: boolean;
  available: boolean;
  images: string[];
  searchTerms: string[];
};

const essentialHandles = new Set([
  'essential-stone-shorts',
  'essential-stone-tee',
  'essential-baby-blue-tee',
  'essential-black-shorts',
  'essential-perfect-grey-tee',
  'essential-white-classic-tee',
  'essential-classic-black-tee',
  'grey-shorts',
  'black-shorts',
  'essential-mocha-hoodie',
  'essential-khaki-hoodie',
  'essential-mocha-bottoms',
  'essential-khaki-bottoms',
]);

const concreteHandles = new Set([
  'motion-black-tee',
  'motion-white-tee',
  'frame-of-mind-black-tee',
  'frame-of-mind-white-tee',
  'reflecting-hoodie',
  'bridge-of-perception-hoodie',
  'un-masked-hoodie',
  'trapped-in-time-hoodie',
  'grey-straight-leg-bottoms',
  'cuffed-grey-bottoms',
  'black-cuffed-bottoms',
  'black-straight-leg-bottoms',
  'reflecting',
  'reflection',
  'clock',
]);

const hatHandles = new Set([
  'rorp-bone-script-hat',
  'rorp-dust-hat',
  'rorp-void-classic',
]);

const localHandles: Record<string, string> = {
  'essential-stone-shorts': 'essential-khaki-cargo-shorts',
  'essential-stone-tee': 'essential-khaki-tee',
};

const verifiedColours: Record<string, string> = {
  'rorp-void-classic': 'Black / White',
  'rorp-dust-hat': 'Khaki / White',
  'rorp-bone-script-hat': 'Cream / Beige',
  'disjointed-tee': 'Washed Black',
  'inteferance-tee': 'Washed Black',
  'unmasked-tee': 'Washed Black',
  'captured-tee': 'Washed Black',
};

function getCollection(handle: string) {
  if (essentialHandles.has(handle)) {
    return 'Essential Collection';
  }

  if (concreteHandles.has(handle)) {
    return 'Concrete Collection';
  }

  if (hatHandles.has(handle)) {
    return 'Hats';
  }

  return 'RORP Catalogue';
}

function getCategory(handle: string, name: string) {
  if (hatHandles.has(handle)) {
    return 'Hats';
  }

  const text = name.toLowerCase();

  if (text.includes('hoodie')) {
    return 'Hoodies';
  }

  if (text.includes('shorts')) {
    return 'Shorts';
  }

  if (text.includes('bottoms')) {
    return 'Bottoms';
  }

  return 'T-Shirts';
}

function getColour(handle: string, name: string) {
  if (verifiedColours[handle]) {
    return verifiedColours[handle];
  }

  const text = name.toLowerCase();

  if (text.includes('baby blue')) {
    return 'Baby Blue';
  }

  if (text.includes('khaki')) {
    return 'Khaki';
  }

  if (text.includes('mocha')) {
    return 'Mocha';
  }

  if (text.includes('black')) {
    return 'Black';
  }

  if (text.includes('white')) {
    return 'White';
  }

  if (text.includes('grey')) {
    return 'Grey';
  }

  if (handle === 'mystery-tee') {
    return 'Mystery selection';
  }

  return 'Not specified';
}

export const products: Product[] = sourceProducts.map((source) => {
  const handle = localHandles[source.handle] ?? source.handle;

  const sizeOption = source.options.find(
    (option) => option.name.toLowerCase() === 'size'
  );

  const requiresSize = Boolean(sizeOption);

  const sizeOptions = source.variants.map((variant) => {
    const optionKey =
      sizeOption?.position === 2
        ? 'option2'
        : sizeOption?.position === 3
          ? 'option3'
          : 'option1';

    const rawLabel = variant[optionKey] ?? variant.title;

    return {
      label: requiresSize ? rawLabel.trim().toUpperCase() : 'STANDARD',
      available: variant.available,
    };
  });

  const sizes = Array.from(
    new Set(
      sizeOptions
        .filter((option) => option.available)
        .map((option) => option.label)
    )
  );

  const firstVariant = source.variants[0];

  if (!firstVariant) {
    throw new Error(`Product has no variants: ${source.handle}`);
  }

  const price = Number(firstVariant.price);

  const originalPrice =
    firstVariant.compare_at_price === null
      ? undefined
      : Number(firstVariant.compare_at_price);

  const collection = getCollection(source.handle);
  const category = getCategory(source.handle, source.title);
  const colour = getColour(source.handle, source.title);

  const images = source.images.map((image, index) => {
    const url = image.src.startsWith('//')
      ? `https:${image.src}`
      : image.src;

    const extension = new URL(url).pathname
      .split('.')
      .pop()
      ?.toLowerCase();

    if (extension !== 'jpg' && extension !== 'png') {
      throw new Error(`Unexpected image format: ${source.handle}`);
    }

    const number = String(index + 1).padStart(2, '0');

    return `/images/products/${handle}/${number}.${extension}`;
  });

  return {
    id: handle,
    handle,
    name: source.title,
    collection,
    category,
    colour,
    price,
    ...(originalPrice !== undefined && originalPrice > price
      ? { compareAtPrice: originalPrice }
      : {}),
    currency: 'GBP',
    sizes,
    sizeOptions,
    requiresSize,
    available: sizes.length > 0,
    images,
    searchTerms: [
      source.handle.replace(/-/g, ' '),
      handle.replace(/-/g, ' '),
      collection,
      category,
      colour,
      ...(category === 'T-Shirts'
        ? ['tee', 't-shirt', 'tshirt', 't shirt', 'tops']
        : []),
      ...(category === 'Shorts' || category === 'Bottoms'
        ? ['bottoms']
        : []),
    ],
  };
});

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price);
}

export function getProductByHandle(handle: string) {
  return products.find((product) => product.handle === handle);
}