// Pure display-status derivation for the عروضي screen.
//
// Offers keep their stored statuses (sent | won | lost | withdrawn — written by
// submitOffer / reconfirmOffer / withdrawOffer). The richer UI vocabulary is
// derived at render time; "needs a proof video" lives on the ORDER
// (order.offerId ⟷ offer.id, proofStatus 'بانتظار'), never on the offer row.

/**
 * @returns 'video' | 'won' | 'submitted' | 'lost' | 'withdrawn'
 */
export function deriveStatus(offer, orderByOfferId) {
  if (offer.status === 'won') {
    const order = orderByOfferId.get(offer.id)
    return order && order.proofStatus === 'بانتظار' ? 'video' : 'won'
  }
  if (offer.status === 'sent') return 'submitted'
  return offer.status // 'lost' | 'withdrawn'
}

/** Arabic count label for a request group: 1→'', 2→'عرضان', n→'{n} عروض'. */
export function countLabel(n) {
  if (n === 2) return 'عرضان'
  return `${n} عروض`
}

/**
 * Group offers by request (taskId), preserving offer order.
 * @returns {{ groups: Array<{taskId, offers}>, counts: {video,review,won} }}
 */
export function groupByRequest(offers, orderByOfferId) {
  const byTask = new Map()
  const counts = { video: 0, review: 0, won: 0 }

  for (const o of offers) {
    const derived = deriveStatus(o, orderByOfferId)
    if (derived === 'video') counts.video += 1
    else if (derived === 'submitted') counts.review += 1
    else if (derived === 'won') counts.won += 1
    // The won banner counts CONFIRMED orders; المطلوب فيديو has its own tile.

    if (!byTask.has(o.taskId)) byTask.set(o.taskId, [])
    byTask.get(o.taskId).push({ ...o, derived })
  }

  return { groups: [...byTask.entries()].map(([taskId, list]) => ({ taskId, offers: list })), counts }
}
