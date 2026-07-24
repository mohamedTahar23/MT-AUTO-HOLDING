// Single source of truth for the full-page dashboard screens.
//
// Each entry ties a route `name` to the `Component` AppShell renders AND the
// `label` the dev menu shows. Add a screen here once and it becomes both
// routable (AppShell) and listed in DevPanel — there is no second list to keep
// in sync.
//
// Not derived from this list, on purpose:
//   • the sell sidebar (Sidebar.jsx `SELL`) is a curated subset with per-role
//     perms and count badges;
//   • the owner account area (settings / team / activity) is not routed — it
//     opens as a modal (store.accountModal → AccountModal).
import Queue from './Queue.jsx'
import MyOffers from './MyOffers.jsx'
import Deliveries from './Deliveries.jsx'
import Payouts from './Payouts.jsx'
import Performance from './Performance.jsx'
import Messages from './Messages.jsx'

export const SCREENS = [
  { name: 'queue', label: 'طابور التسعير', Component: Queue },
  { name: 'quotes', label: 'عروضي', Component: MyOffers },
  { name: 'deliveries', label: 'التسليمات', Component: Deliveries },
  { name: 'payouts', label: 'الأرباح', Component: Payouts },
  { name: 'performance', label: 'الأداء', Component: Performance },
  { name: 'messages', label: 'الرسائل', Component: Messages },
]

// name → component map, for AppShell's route lookup.
export const SCREEN_COMPONENTS = Object.fromEntries(SCREENS.map((s) => [s.name, s.Component]))
