/**
 * Prep/deliver toggle pill for a confirmed order:
 * "أكّد التسليم" (off, muted) ⇄ "تم التسليم" (on, amber).
 * Shared between the won banner and the offers-table row action.
 */
export default function DeliverToggle({ offerId, on, onToggle, testid }) {
  return (
    <button
      type="button"
      className={`deliver-toggle ${on ? 'on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
      data-testid={testid || `deliver-${offerId}`}
    >
      {on ? '✓ تم التسليم' : 'أكّد التسليم'}
    </button>
  )
}
