/**
 * Micro Frontend Event Bus
 * Lightweight Pub/Sub using native Browser Custom Events.
 * No shared global state — fully decoupled communication.
 *
 * Cart state is stored on window.__MFE_CART__ so that ALL
 * Module Federation remotes share the same cart regardless
 * of whether the event-bus module itself is deduplicated.
 */

const EVENTS = {
  ADD_TO_CART: 'mfe:add-to-cart',
  REMOVE_FROM_CART: 'mfe:remove-from-cart',
  CART_UPDATED: 'mfe:cart-updated',
};

// Shared cart state — lives on `window` so every MFE instance
// (even if they each bundle their own copy of event-bus) sees
// the exact same array reference.
if (!window.__MFE_CART__) {
  window.__MFE_CART__ = [];
}

function _cart() {
  return window.__MFE_CART__;
}

/**
 * Publish an event with a detail payload.
 */
function publish(eventName, detail = {}) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Subscribe to an event. Returns an unsubscribe function.
 */
function subscribe(eventName, callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

/**
 * Get the current cart state.
 */
function getCartState() {
  return [..._cart()];
}

/**
 * Get the current cart count.
 */
function getCartCount() {
  return _cart().reduce((sum, item) => sum + item.quantity, 0);
}

// ── Internal handlers — keep cart state in sync ──────────────

// Guard against duplicate listener registration when multiple
// copies of this module are loaded.
if (!window.__MFE_CART_LISTENERS_REGISTERED__) {
  window.__MFE_CART_LISTENERS_REGISTERED__ = true;

  window.addEventListener(EVENTS.ADD_TO_CART, (e) => {
    const { product } = e.detail;
    const cart = _cart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    publish(EVENTS.CART_UPDATED, {
      cart: getCartState(),
      count: getCartCount(),
    });
  });

  window.addEventListener(EVENTS.REMOVE_FROM_CART, (e) => {
    const { productId } = e.detail;
    window.__MFE_CART__ = _cart().filter((item) => item.id !== productId);
    publish(EVENTS.CART_UPDATED, {
      cart: getCartState(),
      count: getCartCount(),
    });
  });
}

export { EVENTS, publish, subscribe, getCartState, getCartCount };
