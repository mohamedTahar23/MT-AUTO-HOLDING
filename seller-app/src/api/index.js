// ===========================================================================
// API boundary — THE SINGLE SWAP-IN POINT.
//
// Every screen imports `api` from here and never touches the mock directly.
// To go live, implement a Supabase-backed adapter with the SAME method
// signatures and swap the one line below. Nothing else in the app changes.
//
//   Reads (RLS-guarded):  getShop, getShopUsers, getTasks (seller_task_v),
//                         getOffers, getOrders, getPayouts, getPerformance,
//                         getMessages, getAnnouncements, getMeta,
//                         getWholesaleDemo (static Buy-landing demo catalog)
//   Auth:                 requestOtp, verifyOtp, signInWithGoogle,
//                         applyShop (apply_shop), currentSession, signOut
//   RPC mutations:        submitOffer (submit_offer), withdrawOffer (withdraw_offer),
//                         uploadProof (upload_proof), markHandover (mark_handover),
//                         reconfirmOffer (reconfirm_offer),
//                         confirmPayoutReceipt (confirm_payout_receipt)
//
// Real adapter sketch (supabase.js):
//   verifyOtp(email, code) -> supabase.auth.verifyOtp({ email, token: code, type: 'email' })
//   signInWithGoogle()     -> supabase.auth.signInWithOAuth({ provider: 'google' })
//   getTasks()             -> supabase.from('seller_task_v').select('*')
//   submitOffer(payload)   -> supabase.rpc('submit_offer', { ...payload })  // carries acted_by server-side
//   uploadProof(id, file)  -> upload to the private `proof-raw` bucket, then rpc('upload_proof', ...)
// ===========================================================================
import { mockApi } from './mock.js'

// SWAP-IN: replace with `import { supabaseApi } from './supabase.js'` and export that.
export const api = mockApi

export default api
