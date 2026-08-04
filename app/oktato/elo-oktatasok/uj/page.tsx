'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save, Eye, Send, Upload, Clock, Users, Video, Calendar,
  PlusCircle, Trash2, AlertCircle, CheckCircle2, X,
  ChevronUp, ChevronDown, Radio, Mic, Camera, MessageSquare,
  ScreenShare, Disc,
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { useToast } from '@/components/providers/ToastProvider';
import { categories } from '@/lib/categories';

const DRAFT_KEY = 'elvark-live-draft';

const eventTypeOptions = [
  { value: 'interaktiv-ora', label: 'Interaktív óra' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'konzultacio', label: 'Konzultáció' },
];
const eventTypeLabel = (v: string) => eventTypeOptions.find((o) => o.value === v)?.label ?? v;
const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all';
const labelClass = 'text-sm font-medium text-navy-700 mb-1.5 block';

function Section({
  index, title, icon, open, onToggle, children,
}: {
  index: number; title: string; icon: React.ReactNode;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-navy-50/40 transition-colors">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-cobalt-50 text-cobalt-600 flex-shrink-0">{icon}</span>
        <span className="text-xs font-semibold text-cobalt-600 w-6 flex-shrink-0">{index}.</span>
        <span className="text-base font-semibold text-navy-900 flex-1">{title}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

function Toggle({ checked, onChange, label, icon }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; icon: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-100 hover:bg-navy-50/50 transition-colors">
      <span className="text-cobalt-600">{icon}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded" />
      <span className="text-sm text-navy-700">{label}</span>
    </label>
  );
}

function RepeatableList({
  label, items, onAdd, onUpdate, onRemove, placeholder,
}: {
  label: string; items: string[];
  onAdd: () => void; onUpdate: (i: number, v: string) => void;
  onRemove: (i: number) => void; placeholder: (i: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-navy-700">{label}</label>
        <button type="button" onClick={onAdd}
          className="inline-flex items-center gap-1 text-sm text-cobalt-600 hover:text-cobalt-700 font-medium">
          <PlusCircle className="w-4 h-4" /> Tétel hozzáadása
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-xs text-gray-400">Még nincs tétel hozzáadva.</p>}
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => onUpdate(i, e.target.value)}
              placeholder={placeholder(i)} className={inputClass} />
            <button type="button" onClick={() => onRemove(i)} aria-label="Törlés"
              className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorBox({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="p-4 rounded-xl border-2 border-red-300 bg-red-50">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-sm font-semibold text-red-700">{errors.length} hiba az űrlapon:</span>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((e, i) => <li key={i} className="text-sm text-red-700">{e}</li>)}
      </ul>
    </div>
  );
}

export default function NewLiveClassPage() {
  const { showToast } = useToast();

  // 1. Alapadatok
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [category, setCategory] = useState('');
  const [eventType, setEventType] = useState('');

  // 2. Időpont és férőhelyek
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timezone, setTimezone] = useState('Europe/Budapest');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [price, setPrice] = useState('');
  const [minParticipants, setMinParticipants] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  // 3. Résztvevői beállítások
  const [cameraAllowed, setCameraAllowed] = useState(true);
  const [micAllowed, setMicAllowed] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(true);

  // 4. Felvétel és segédanyagok
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [recordingAccessDays, setRecordingAccessDays] = useState('');
  const [agenda, setAgenda] = useState<string[]>([]);
  const [equipmentList, setEquipmentList] = useState<string[]>([]);

  // 5. Lemondási feltételek
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // UI state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    s1: true, s2: true, s3: true, s4: true, s5: true, s6: true,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoring = useRef(false);

  const collectState = useCallback(() => ({
    title, shortDesc, fullDesc, category, eventType,
    date, startTime, endTime, timezone, registrationDeadline,
    price, minParticipants, maxParticipants,
    cameraAllowed, micAllowed, chatEnabled, screenShareEnabled,
    recordingEnabled, recordingAccessDays,
    agenda, equipmentList, cancellationPolicy,
  }), [
    title, shortDesc, fullDesc, category, eventType,
    date, startTime, endTime, timezone, registrationDeadline,
    price, minParticipants, maxParticipants,
    cameraAllowed, micAllowed, chatEnabled, screenShareEnabled,
    recordingEnabled, recordingAccessDays,
    agenda, equipmentList, cancellationPolicy,
  ]);

  const restoreState = useCallback((s: ReturnType<typeof collectState>) => {
    isRestoring.current = true;
    setTitle(s.title ?? ''); setShortDesc(s.shortDesc ?? ''); setFullDesc(s.fullDesc ?? '');
    setCategory(s.category ?? ''); setEventType(s.eventType ?? '');
    setDate(s.date ?? ''); setStartTime(s.startTime ?? ''); setEndTime(s.endTime ?? '');
    setTimezone(s.timezone ?? 'Europe/Budapest'); setRegistrationDeadline(s.registrationDeadline ?? '');
    setPrice(s.price ?? ''); setMinParticipants(s.minParticipants ?? ''); setMaxParticipants(s.maxParticipants ?? '');
    setCameraAllowed(s.cameraAllowed ?? true); setMicAllowed(s.micAllowed ?? true);
    setChatEnabled(s.chatEnabled ?? true); setScreenShareEnabled(s.screenShareEnabled ?? true);
    setRecordingEnabled(s.recordingEnabled ?? false); setRecordingAccessDays(s.recordingAccessDays ?? '');
    setAgenda(Array.isArray(s.agenda) ? s.agenda : []);
    setEquipmentList(Array.isArray(s.equipmentList) ? s.equipmentList : []);
    setCancellationPolicy(s.cancellationPolicy ?? '');
    setTimeout(() => { isRestoring.current = false; }, 0);
  }, []);

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        restoreState(parsed);
        if (parsed.savedAt) setLastSaved(parsed.savedAt);
        showToast('A mentett piszkozat visszaállítva.', 'info');
      }
    } catch { /* ignore corrupt draft */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save with debounce + dirty tracking
  useEffect(() => {
    if (isRestoring.current) return;
    setIsDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const now = new Date().toLocaleTimeString('hu-HU');
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...collectState(), savedAt: now }));
        setLastSaved(now);
        setIsDirty(false);
      } catch { /* storage unavailable */ }
    }, 2000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [collectState]);

  // beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const manualSave = () => {
    const now = new Date().toLocaleTimeString('hu-HU');
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...collectState(), savedAt: now }));
      setLastSaved(now); setIsDirty(false);
      showToast('A piszkozat elmentve.', 'success');
    } catch {
      showToast('A mentés sikertelen.', 'warning');
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null); setIsDirty(false);
    showToast('A piszkozat törölve.', 'info');
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('A cím megadása kötelező.');
    if (!date) errs.push('A dátum megadása kötelező.');
    if (!startTime) errs.push('A kezdési időpont megadása kötelező.');
    if (!endTime) errs.push('A befejezési időpont megadása kötelező.');
    if (startTime && endTime && endTime <= startTime)
      errs.push('A befejezési időpont később legyen, mint a kezdési időpont.');
    if (date && registrationDeadline && registrationDeadline >= date)
      errs.push('A jelentkezési határidő az esemény dátuma előtt legyen.');
    if (maxParticipants && Number(maxParticipants) <= 0)
      errs.push('A maximális résztvevők száma nagyobb kell legyen, mint nulla.');
    if (minParticipants && maxParticipants && Number(minParticipants) > Number(maxParticipants))
      errs.push('A minimális résztvevők száma nem lehet nagyobb, mint a maximális.');
    if (price && Number(price) < 0) errs.push('Az ár nem lehet negatív.');
    if (recordingEnabled && !recordingAccessDays)
      errs.push('A felvétel hozzáférési idejének megadása kötelező, ha a felvétel engedélyezve van.');
    return errs;
  };

  const submit = () => {
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) {
      showToast('Hibák vannak az űrlapon.', 'warning');
      setOpenSections((p) => ({ ...p, s6: true }));
      return;
    }
    showToast('Az élő oktatás beküldve ELVARK-jóváhagyásra.', 'success');
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null); setIsDirty(false);
  };

  // Repeatable list helpers
  const addAgenda = () => setAgenda((a) => [...a, '']);
  const updateAgenda = (i: number, v: string) => setAgenda((a) => a.map((x, idx) => (idx === i ? v : x)));
  const removeAgenda = (i: number) => setAgenda((a) => a.filter((_, idx) => idx !== i));
  const addEquipment = () => setEquipmentList((e) => [...e, '']);
  const updateEquipment = (i: number, v: string) => setEquipmentList((e) => e.map((x, idx) => (idx === i ? v : x)));
  const removeEquipment = (i: number) => setEquipmentList((e) => e.filter((_, idx) => idx !== i));

  const toggleSection = (key: string) => setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const permChips = [
    cameraAllowed && { icon: <Camera className="w-3.5 h-3.5" />, label: 'Kamera' },
    micAllowed && { icon: <Mic className="w-3.5 h-3.5" />, label: 'Mikrofon' },
    chatEnabled && { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Chat' },
    screenShareEnabled && { icon: <ScreenShare className="w-3.5 h-3.5" />, label: 'Képernyőmegosztás' },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cobalt-50 text-cobalt-600">
              <Radio className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-navy-900">Új élő oktatás létrehozása</h1>
          </div>
          <p className="text-sm text-navy-500 mb-4">Töltsd ki az alábbi mezőket, majd küldd be jóváhagyásra.</p>

          {/* Draft status bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-xl bg-cobalt-50 border border-cobalt-100">
            <Clock className="w-4 h-4 text-cobalt-600" />
            <span className="text-sm text-navy-700">
              {lastSaved ? `Piszkozat automatikusan mentve. ${lastSaved}` : 'A piszkozat automatikusan mentésre kerül.'}
            </span>
            <div className="ml-auto flex gap-2">
              <button onClick={manualSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-navy-700 hover:bg-navy-50 transition-colors">
                <Save className="w-3.5 h-3.5" /> Mentés most
              </button>
              <button onClick={clearDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Piszkozat törlése
              </button>
            </div>
          </div>

          {/* Top-level validation errors */}
          {errors.length > 0 && (
            <div className="mb-6"><ErrorBox errors={errors} /></div>
          )}

          {showPreview ? (
            /* PREVIEW MODE */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-cobalt-600 to-navy-700 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {eventType && (
                      <span className="px-3 py-1 rounded-full bg-cobalt-50 text-cobalt-700 text-xs font-medium">{eventTypeLabel(eventType)}</span>
                    )}
                    {category && (
                      <span className="px-3 py-1 rounded-full bg-navy-50 text-navy-700 text-xs font-medium">{categoryName(category)}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">{title || 'Cím nélküli esemény'}</h2>
                  {shortDesc && <p className="text-sm text-navy-600 mb-4">{shortDesc}</p>}
                  {fullDesc && <p className="text-sm text-navy-700 whitespace-pre-wrap mb-4">{fullDesc}</p>}

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-navy-700">
                      <Calendar className="w-4 h-4 text-cobalt-600" />
                      {date || '—'} {startTime && endTime && `${startTime}–${endTime}`}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-navy-700">
                      <Users className="w-4 h-4 text-cobalt-600" /> {maxParticipants || '—'} fő
                    </div>
                    <div className="flex items-center gap-2 text-sm text-navy-700">
                      <Clock className="w-4 h-4 text-cobalt-600" /> Jelentkezés: {registrationDeadline || '—'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-navy-700">
                      <span className="text-cobalt-600 font-semibold">Ár:</span>
                      {price ? `${Number(price).toLocaleString('hu-HU')} Ft` : 'Ingyenes'}
                    </div>
                  </div>

                  {permChips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {permChips.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-navy-50 text-navy-600 text-xs">
                          {c.icon} {c.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {recordingEnabled && (
                    <div className="flex items-center gap-2 text-sm text-navy-700 mb-4">
                      <Disc className="w-4 h-4 text-cobalt-600" />
                      Felvétel elérhető {recordingAccessDays || '—'} napig
                    </div>
                  )}

                  {agenda.some(Boolean) && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-navy-900 mb-2">Agenda</h3>
                      <ol className="list-decimal list-inside space-y-1">
                        {agenda.filter(Boolean).map((a, i) => <li key={i} className="text-sm text-navy-700">{a}</li>)}
                      </ol>
                    </div>
                  )}

                  {equipmentList.some(Boolean) && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-navy-900 mb-2">Szükséges eszközök</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {equipmentList.filter(Boolean).map((e, i) => <li key={i} className="text-sm text-navy-700">{e}</li>)}
                      </ul>
                    </div>
                  )}

                  {cancellationPolicy && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-navy-900 mb-1">Lemondási feltételek</h3>
                      <p className="text-sm text-navy-700 whitespace-pre-wrap">{cancellationPolicy}</p>
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => setShowPreview(false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                <X className="w-4 h-4" /> Előnézet bezárása
              </button>
            </div>
          ) : (
            /* EDIT MODE - collapsible sections */
            <div className="space-y-4">
              <Section index={1} title="Alapadatok" icon={<Video className="w-5 h-5" />}
                open={openSections.s1} onToggle={() => toggleSection('s1')}>
                <div>
                  <label className={labelClass}>Cím</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="pl. Kezdő Excel élő workshop" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Rövid leírás</label>
                  <input type="text" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Egy mondatban foglald össze az eseményt" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Teljes leírás</label>
                  <textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} rows={4}
                    placeholder="Részletes leírás az eseményről" className={`${inputClass} resize-none`} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Kategória</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} bg-white`}>
                      <option value="">Válassz kategóriát</option>
                      {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Esemény típus</label>
                    <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={`${inputClass} bg-white`}>
                      <option value="">Válassz típust</option>
                      {eventTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              </Section>

              <Section index={2} title="Időpont és férőhelyek" icon={<Calendar className="w-5 h-5" />}
                open={openSections.s2} onToggle={() => toggleSection('s2')}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Dátum</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Kezdés</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Befejezés</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Időzóna</label>
                    <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} disabled
                      className={`${inputClass} bg-gray-50 text-gray-500`} />
                  </div>
                  <div>
                    <label className={labelClass}>Jelentkezési határidő</label>
                    <input type="date" value={registrationDeadline} onChange={(e) => setRegistrationDeadline(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ár (Ft)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" min="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Minimum résztvevő</label>
                    <input type="number" value={minParticipants} onChange={(e) => setMinParticipants(e.target.value)} placeholder="5" min="1" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Maximum résztvevő</label>
                    <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} placeholder="25" min="1" className={inputClass} />
                  </div>
                </div>
              </Section>

              <Section index={3} title="Résztvevői beállítások" icon={<Users className="w-5 h-5" />}
                open={openSections.s3} onToggle={() => toggleSection('s3')}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Toggle checked={cameraAllowed} onChange={setCameraAllowed} label="Kamera használata" icon={<Camera className="w-4 h-4" />} />
                  <Toggle checked={micAllowed} onChange={setMicAllowed} label="Mikrofon használata" icon={<Mic className="w-4 h-4" />} />
                  <Toggle checked={chatEnabled} onChange={setChatEnabled} label="Chat engedélyezése" icon={<MessageSquare className="w-4 h-4" />} />
                  <Toggle checked={screenShareEnabled} onChange={setScreenShareEnabled} label="Képernyőmegosztás engedélyezése" icon={<ScreenShare className="w-4 h-4" />} />
                </div>
              </Section>

              <Section index={4} title="Felvétel és segédanyagok" icon={<Disc className="w-5 h-5" />}
                open={openSections.s4} onToggle={() => toggleSection('s4')}>
                <Toggle checked={recordingEnabled} onChange={setRecordingEnabled} label="Felvétel készítése az eseményről" icon={<Disc className="w-4 h-4" />} />
                {recordingEnabled && (
                  <div>
                    <label className={labelClass}>Felvétel hozzáférési ideje (nap)</label>
                    <input type="number" value={recordingAccessDays} onChange={(e) => setRecordingAccessDays(e.target.value)}
                      placeholder="30" min="1" className={`${inputClass} sm:w-48`} />
                  </div>
                )}
                <RepeatableList label="Agenda" items={agenda} onAdd={addAgenda}
                  onUpdate={updateAgenda} onRemove={removeAgenda}
                  placeholder={(i) => `Agenda tétel ${i + 1}`} />
                <div>
                  <label className="text-sm font-medium text-navy-700 mb-1.5 block">Segédanyag feltöltése</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-cobalt-300 hover:text-cobalt-600 hover:bg-cobalt-50/40 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Húzd ide a fájlokat, vagy kattints a feltöltéshez
                    <input type="file" multiple className="hidden" />
                  </label>
                </div>
                <RepeatableList label="Szükséges eszközök" items={equipmentList} onAdd={addEquipment}
                  onUpdate={updateEquipment} onRemove={removeEquipment}
                  placeholder={(i) => `Eszköz ${i + 1}`} />
              </Section>

              <Section index={5} title="Lemondási feltételek" icon={<AlertCircle className="w-5 h-5" />}
                open={openSections.s5} onToggle={() => toggleSection('s5')}>
                <div>
                  <label className={labelClass}>Lemondási feltételek</label>
                  <textarea value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} rows={3}
                    placeholder="pl. Az esemény előtt 48 órával ingyenesen lemondható." className={`${inputClass} resize-none`} />
                </div>
              </Section>

              <Section index={6} title="Előnézet és beküldés" icon={<Send className="w-5 h-5" />}
                open={openSections.s6} onToggle={() => toggleSection('s6')}>
                {errors.length > 0 ? (
                  <ErrorBox errors={errors} />
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Az űrlap jelenleg nem tartalmaz érvényesítési hibát.</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button onClick={manualSave}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                    <Save className="w-4 h-4" /> Piszkozat mentése
                  </button>
                  <button onClick={() => setShowPreview(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                    <Eye className="w-4 h-4" /> Előnézet
                  </button>
                  <button onClick={submit}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-700 transition-colors shadow-soft">
                    <Send className="w-4 h-4" /> Beküldés jóváhagyásra
                  </button>
                </div>
              </Section>
            </div>
          )}
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
