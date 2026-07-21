/**
 * Horizontal progress stepper (used by Deliveries & Payouts).
 * `steps` = full label list, `current` = index reached (0-based, inclusive).
 */
export default function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((label, i) => (
        <div className={`node ${i <= current ? 'done' : ''}`} key={label + i}>
          <span className="bar" />
          <span className="bead" />
          <span className="cap">{label}</span>
        </div>
      ))}
    </div>
  )
}
