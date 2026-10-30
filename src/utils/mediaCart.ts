// Media picked in the Marketplace, kept in this browser per user until it is paid for.
export interface MediaCart {
  bundles: any[];
  publications: any[];
}

const userKey = (): string => {
  try {
    const token = localStorage.getItem("token") || "";
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return `mediaCart:${payload?.userId || "guest"}`;
  } catch {
    return "mediaCart:guest";
  }
};

export const getCart = (): MediaCart | null => {
  try {
    const cart = JSON.parse(localStorage.getItem(userKey()) || "null");
    if (!cart?.bundles?.length && !cart?.publications?.length) return null;
    return { bundles: cart.bundles || [], publications: cart.publications || [] };
  } catch {
    return null;
  }
};

export const saveCart = (bundles: any[] = [], publications: any[] = []): void => {
  try {
    if (!bundles.length && !publications.length) {
      localStorage.removeItem(userKey());
      return;
    }
    localStorage.setItem(userKey(), JSON.stringify({ bundles, publications }));
  } catch {
    // storage blocked or full: the selection still lives in the page
  }
};

export const clearCart = (): void => {
  try {
    localStorage.removeItem(userKey());
  } catch {
    // nothing to clear
  }
};
