import { useState } from 'react'

/**
 * "تصفية حسب الماركة" — multi-select car-brand filter grouped by origin
 * (فرنسية / كورية / ألمانية / يابانية). Controlled: the parent owns the
 * `selected` Set of car makes and narrows the request grid.
 */
export default function BrandFilter({ groups, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false)
  const count = selected.size

  return (
    <div className="brand-filter">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-testid="brand-filter"
      >
        تصفية حسب الماركة
        {count > 0 && (
          <span className="bf-badge" data-testid="brand-filter-count">
            {count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="bf-backdrop" onClick={() => setOpen(false)} />
          <div className="bf-menu" role="dialog" aria-label="تصفية حسب الماركة">
            <div className="bf-head">
              <b style={{ fontSize: 13 }}>اختر الماركات</b>
              <button
                type="button"
                className="bf-clear"
                onClick={onClear}
                disabled={count === 0}
                data-testid="brand-filter-clear"
              >
                مسح الكل
              </button>
            </div>

            {groups.map((g) => (
              <div className="bf-group" key={g.country}>
                <div className="bf-group-title">{g.country}</div>
                <div className="bf-chips">
                  {g.brands.map((b) => (
                    <button
                      type="button"
                      key={b}
                      className={`chip ${selected.has(b) ? 'on' : ''}`}
                      onClick={() => onToggle(b)}
                      data-testid={`brand-opt-${b}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
