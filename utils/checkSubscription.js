export function isSubscriptionActive(subscription) {
  if (!subscription || !subscription.expiresAt) return false;

  const now = new Date();
  return new Date(subscription.expiresAt) > now;
}
