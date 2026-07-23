import Modal from '../ui/Modal.jsx'
import SettingsSection, { useSettingsForm } from './SettingsSection.jsx'
import TeamSection from './TeamSection.jsx'
import ActivitySection from './ActivitySection.jsx'
import { Spinner } from '../ui/bits.jsx'

// The owner "Account area" popup — settings / team / activity render inside
// ONE blurred-backdrop modal (ui/Modal variant="blur") instead of routing to
// full-page screens. Only the Settings section has footer actions.
const SECTIONS = {
  settings: {
    title: 'إعدادات الحساب',
    sub: 'بيانات المحل وموقعه ومعلومات الدخول — التغييرات تُحفَظ من أسفل النافذة.',
    testid: 'settings-screen',
  },
  team: {
    title: 'الفريق والصلاحيات',
    sub: 'ادعُ موظفيك وتحكّم في صلاحيات كل مقعد — ما لا تمنحه لا يظهر لهم إطلاقاً.',
    testid: 'team-screen',
  },
  activity: {
    title: 'سجل نشاط الموظفين',
    sub: 'كل إجراء يقوم به موظفوك يُنسَب إلى صاحبه — للمالك وحده.',
    testid: 'activity-screen',
  },
}

export default function AccountModal({ section, onClose, restoreFocus }) {
  const meta = SECTIONS[section]
  // Settings form state lives here so its save/reset can sit in the modal
  // footer. The hook is cheap, so it simply runs for every section.
  const settings = useSettingsForm()

  const footer =
    section === 'settings' ? (
      <>
        <button
          className="btn btn-primary"
          disabled={!settings.dirty || settings.saving}
          onClick={settings.save}
          data-testid="settings-save"
        >
          {settings.saving ? <Spinner /> : 'حفظ التغييرات'}
        </button>
        <button
          className="btn btn-ghost"
          disabled={!settings.dirty || settings.saving}
          onClick={settings.reset}
          data-testid="settings-reset"
        >
          تراجع عن التعديلات
        </button>
      </>
    ) : null

  return (
    <Modal
      variant="blur"
      testid="account-modal"
      bodyTestid={meta.testid}
      title={meta.title}
      sub={meta.sub}
      footer={footer}
      onClose={onClose}
      restoreFocus={restoreFocus}
    >
      {section === 'settings' && <SettingsSection form={settings} />}
      {section === 'team' && <TeamSection />}
      {section === 'activity' && <ActivitySection />}
    </Modal>
  )
}
