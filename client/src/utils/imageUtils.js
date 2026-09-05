// Centralized, deterministic image utility for LocalService marketplace
// Guarantees zero random image assignment and strict category-topic image matching

export const CATEGORY_FALLBACK_IMAGES = {
  'plumbing': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800',
  'electrical-services': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  'ac-repair': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
  'home-cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  'appliance-repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'beauty-salon': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
  'tutoring': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
  'car-bike-repair': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
  'painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
  'carpentry': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
  'laptop-mobile-repair': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
  'cctv-installation': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
  'pest-control': 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800',
  'ro-water-purifier': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&q=80&w=800',
  'car-wash-detailing': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800',
  'fitness-yoga': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
  'packers-movers': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'event-photography': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  'makeup-artist': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
  'solar-panel': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'
};

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300';
export const DEFAULT_SERVICE_COVER = 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800';

// Invalid/mismatched photo IDs to filter out automatically
const BLACKLISTED_IMAGE_IDS = [
  'photo-1618160702438-9b02ab6515c9' // cake photo
];

function isImageBlacklisted(url) {
  if (!url) return true;
  return BLACKLISTED_IMAGE_IDS.some(id => url.includes(id));
}

/**
 * Returns deterministic service cover image for a provider card
 */
export function getProviderServiceImage(provider) {
  const catSlug = provider?.category?.slug;

  // 1. If provider has a valid cover image that is not blacklisted
  if (provider?.coverImage && !isImageBlacklisted(provider.coverImage)) {
    // If pest control provider accidentally has old cake URL, override with topic image
    if (catSlug === 'pest-control' && provider.coverImage.includes('photo-1618160702438-9b02ab6515c9')) {
      return CATEGORY_FALLBACK_IMAGES['pest-control'];
    }
    return provider.coverImage;
  }

  // 2. Lookup by category slug
  if (catSlug && CATEGORY_FALLBACK_IMAGES[catSlug]) {
    return CATEGORY_FALLBACK_IMAGES[catSlug];
  }

  // 3. Category image if valid
  if (provider?.category?.image && !isImageBlacklisted(provider.category.image)) {
    return provider.category.image;
  }

  return DEFAULT_SERVICE_COVER;
}

/**
 * Returns provider profile avatar (separated from service cover image)
 */
export function getProviderAvatar(provider) {
  if (provider?.user?.profileImage) {
    return provider.user.profileImage;
  }
  return DEFAULT_AVATAR;
}
