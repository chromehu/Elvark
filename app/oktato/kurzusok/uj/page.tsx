'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen, PlusCircle, Trash2, Save, Eye, Send,
  Video, FileText, Download, Type, Upload, Clock,
  ChevronUp, ChevronDown, Copy, AlertCircle, CheckCircle2, X, Radio,
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { useToast } from '@/components/providers/ToastProvider';
import { categories } from '@/lib/categories';
import { formatDuration } from '@/lib/format';
import type { LessonType } from '@/types';

const DRAFT_KEY = 'elvark-course-draft';

const lessonTypeOptions: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'video', label: 'Videó', icon: Video },
  { value: 'szoveg', label: 'Szöveg', icon: Type },
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'letoltheto-fajl', label: 'Letölthető fájl', icon: Download },
  { value: 'elo-alkalom', label: 'Élő alkalom', icon: Radio },
];

interface Module {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    description: string;
    type: string;
    durationMinutes: number;
    isFreePreview: boolean;
    isDownloadable: boolean;
  }[];
}

interface CourseDraft {
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  difficulty: string;
  price: string;
  estimatedDuration: string;
  learningOutcomes: string[];
  targetAudience: string[];
  requirements: string[];
  modules: Module[];
  hasDownloadable: boolean;
  hasLive: boolean;
  settings: { certificate: boolean; allowReviews: boolean; language: string };
}

const emptyDraft: CourseDraft = {
  title: '', shortDesc: '', fullDesc: '', category: '', difficulty: '',
  price: '', estimatedDuration: '', learningOutcomes: [''], targetAudience: [''],
  requirements: [''], modules: [{ id: 'm1', title: '', lessons: [] }],
  hasDownloadable: false, hasLive: false,
  settings: { certificate: false, allowReviews: true, language: 'magyar' },
};

const uid = () => Math.random().toString(36).slice(2, 10);

function newModule(): Module {
  return { id: uid(), title: '', lessons: [] };
}

function newLesson() {
  return {
    id: uid(), title: '', description: '', type: 'video',
    durationMinutes: 0, isFreePreview: false, isDownloadable: false,
  };
}

export default function NewCoursePage() {
  const { showToast } = useToast();
  const [d, setD] = useState<CourseDraft>(emptyDraft);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const initialized = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore draft after refresh
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { draft: CourseDraft; savedAt: string };
        setD({ ...emptyDraft, ...parsed.draft });
        setLastSaved(parsed.savedAt);
      }
    } catch { /* ignore corrupt draft */ }
    initialized.current = true;
  }, []);

  // Automatic debounced draft saving (2s of inactivity)
  useEffect(() => {
    if (!initialized.current) return;
    setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const savedAt = new Date().toLocaleTimeString('hu-HU');
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft: d, savedAt }));
      setLastSaved(savedAt);
      setDirty(false);
    }, 2000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [d]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = useCallback(<K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) =>
    setD((prev) => ({ ...prev, [key]: value })), []);

  // --- Repeatable string array helpers ---
  const setArr = (key: 'learningOutcomes' | 'targetAudience' | 'requirements', idx: number, val: string) =>
    setD((p) => ({ ...p, [key]: p[key].map((v, i) => (i === idx ? val : v)) }));
  const addArr = (key: 'learningOutcomes' | 'targetAudience' | 'requirements') =>
    setD((p) => ({ ...p, [key]: [...p[key], ''] }));
  const delArr = (key: 'learningOutcomes' | 'targetAudience' | 'requirements', idx: number) =>
    setD((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  // --- Module helpers ---
  const addModule = () => update('modules', [...d.modules, newModule()]);
  const delModule = (id: string) => update('modules', d.modules.filter((m) => m.id !== id));
  const dupModule = (id: string) => {
    const m = d.modules.find((x) => x.id === id);
    if (!m) return;
    const copy: Module = { id: uid(), title: `${m.title} (másolat)`, lessons: m.lessons.map((l) => ({ ...l, id: uid() })) };
    update('modules', [...d.modules, copy]);
  };
  const renameModule = (id: string, title: string) =>
    update('modules', d.modules.map((m) => (m.id === id ? { ...m, title } : m)));
  const moveModule = (idx: number, dir: -1 | 1) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= d.modules.length) return;
    const arr = [...d.modules];
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    update('modules', arr);
  };

  // --- Lesson helpers ---
  const addLesson = (mid: string) =>
    update('modules', d.modules.map((m) => (m.id === mid ? { ...m, lessons: [...m.lessons, newLesson()] } : m)));
  const delLesson = (mid: string, lid: string) =>
    update('modules', d.modules.map((m) => (m.id === mid ? { ...m, lessons: m.lessons.filter((l) => l.id !== lid) } : m)));
  const dupLesson = (mid: string, lid: string) =>
    update('modules', d.modules.map((m) => (m.id === mid ? {
      ...m, lessons: [...m.lessons, ...m.lessons.flatMap((l) => (l.id === lid ? [l, { ...l, id: uid() }] : []))],
    } : m)));
  const updLesson = (mid: string, lid: string, field: string, value: string | number | boolean) =>
    update('modules', d.modules.map((m) => (m.id === mid ? {
      ...m, lessons: m.lessons.map((l) => (l.id === lid ? { ...l, [field]: value } : l)),
    } : m)));
  const moveLesson = (mid: string, idx: number, dir: -1 | 1) =>
    update('modules', d.modules.map((m) => {
      if (m.id !== mid) return m;
      const ni = idx + dir;
      if (ni < 0 || ni >= m.lessons.length) return m;
      const arr = [...m.lessons];
      [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
      return { ...m, lessons: arr };
    }));

  const totalLessons = d.modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalDuration = d.modules.reduce((s, m) =>
    s + m.lessons.reduce((ls, l) => ls + (l.type === 'video' || l.type === 'elo-alkalom' ? l.durationMinutes : 0), 0), 0);

  // --- Validation ---
  const validate = (): string[] => {
    const e: string[] = [];
    if (!d.title.trim()) e.push('A kurzus címe kötelező.');
    if (!d.shortDesc.trim()) e.push('A rövid leírás kötelező.');
    if (!d.category) e.push('A kategória kiválasztása kötelező.');
    if (d.price === '' || Number(d.price) < 0) e.push('Az ár megadása kötelező (0 vagy nagyobb).');
    if (d.modules.length === 0) e.push('Legalább egy modul szükséges.');
    if (totalLessons === 0) e.push('Legalább egy lecke szükséges a modulokban.');
    d.modules.forEach((m, mi) => m.lessons.forEach((l, li) => {
      if (!l.title.trim()) e.push(`A(z) ${mi + 1}. modul ${li + 1}. leckéjének címe hiányzik.`);
    }));
    return e;
  };

  const handlePreview = () => {
    const e = validate();
    setErrors(e);
    if (e.length) { showToast('Hibák az előnézethez – ellenőrizd a kötelező mezőket.', 'warning'); return; }
    setShowPreview((v) => !v);
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (e.length) { showToast('Hibák a beküldéshez – ellenőrizd a kötelező mezőket.', 'warning'); return; }
    showToast('A kurzus beküldve ELVARK-jóváhagyásra.', 'success');
    setShowPreview(false);
  };

  const manualSave = () => {
    const savedAt = new Date().toLocaleTimeString('hu-HU');
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft: d, savedAt }));
    setLastSaved(savedAt);
    setDirty(false);
    showToast('A piszkozat elmentve.', 'success');
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setD(emptyDraft);
    setLastSaved(null);
    setErrors([]);
    setShowPreview(false);
    showToast('A piszkozat törölve.', 'info');
  };

  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  const catName = categories.find((c) => c.slug === d.category)?.name ?? d.category;

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all';
  const labelCls = 'text-sm font-medium text-navy-700 mb-1.5 block';

  // ---------- Repeatable list renderer ----------
  const Repeatable = ({ label, items, set, add, del, placeholder }: {
    label: string; items: string[]; set: (i: number, v: string) => void;
    add: () => void; del: (i: number) => void; placeholder: string;
  }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={it} onChange={(e) => set(i, e.target.value)} placeholder={placeholder}
              className={inputCls} />
            <button onClick={() => del(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0" aria-label="Törlés">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button onClick={add} className="text-sm text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1">
          <PlusCircle className="w-4 h-4" /> Új elem hozzáadása
        </button>
      </div>
    </div>
  );

  // ---------- Collapsible card ----------
  const Card = ({ id, title, icon: Icon, children }: {
    id: string; title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode;
  }) => {
    const open = !collapsed[id];
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        <button onClick={() => toggle(id)} className="w-full flex items-center justify-between p-5 hover:bg-navy-50/50 transition-colors">
          <span className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <Icon className="w-5 h-5 text-cobalt-600" /> {title}
          </span>
          <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {open && <div className="p-5 pt-0 space-y-4">{children}</div>}
      </div>
    );
  };

  // ---------- Preview ----------
  if (showPreview) {
    return (
      <PageContainer showFooter={false}>
        <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-navy-900">Előnézet</h1>
              <button onClick={() => setShowPreview(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-navy-700 hover:bg-navy-50">
                <X className="w-4 h-4" /> Előnézet bezárása
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-navy-700 to-cobalt-600 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white/70" />
              </div>
              <div className="p-6 space-y-4">
                <div className="text-xs text-cobalt-600 font-medium uppercase">{catName}</div>
                <h2 className="text-2xl font-bold text-navy-900">{d.title || 'Névtelen kurzus'}</h2>
                <p className="text-navy-700">{d.shortDesc}</p>
                <div className="flex flex-wrap gap-4 text-sm text-navy-700">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDuration(totalDuration)}</span>
                  <span className="font-semibold text-cobalt-700">{Number(d.price).toLocaleString('hu-HU')} Ft</span>
                  {d.hasLive && <span className="flex items-center gap-1 text-cobalt-600"><Radio className="w-4 h-4" /> Élő alkalom</span>}
                  {d.hasDownloadable && <span className="flex items-center gap-1"><Download className="w-4 h-4" /> Letölthető anyagok</span>}
                </div>
                {d.fullDesc && (
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Leírás</h3>
                    <p className="text-sm text-navy-700 whitespace-pre-wrap">{d.fullDesc}</p>
                  </div>
                )}
                {d.learningOutcomes.some((x) => x.trim()) && (
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">Tanulási eredmények</h3>
                    <ul className="list-disc list-inside text-sm text-navy-700 space-y-1">
                      {d.learningOutcomes.filter((x) => x.trim()).map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Tananyag felépítése</h3>
                  <div className="space-y-3">
                    {d.modules.map((m, mi) => (
                      <div key={m.id} className="border border-gray-100 rounded-xl p-4">
                        <p className="font-medium text-navy-900 mb-2">{mi + 1}. {m.title || 'Névtelen modul'}</p>
                        <ul className="space-y-1 pl-4">
                          {m.lessons.map((l, li) => {
                            const Ico = lessonTypeOptions.find((o) => o.value === l.type)?.icon ?? Video;
                            return (
                              <li key={l.id} className="flex items-center gap-2 text-sm text-navy-700">
                                <Ico className="w-4 h-4 text-cobalt-600" />
                                <span>{li + 1}. {l.title || 'Névtelen lecke'}</span>
                                {(l.type === 'video' || l.type === 'elo-alkalom') && l.durationMinutes > 0 && (
                                  <span className="text-xs text-gray-400">({l.durationMinutes} perc)</span>
                                )}
                                {l.isFreePreview && <span className="text-xs text-cobalt-600 font-medium">[Ingyenes előnézet]</span>}
                              </li>
                            );
                          })}
                          {m.lessons.length === 0 && <li className="text-xs text-gray-400">Nincsenek leckék</li>}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  // ---------- Builder ----------
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-navy-900">Új kurzus létrehozása</h1>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {lastSaved && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  Piszkozat automatikusan mentve. ({lastSaved})
                </span>
              )}
              {dirty && <span className="text-cobalt-600">Mentés folyamatban…</span>}
            </div>
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                <AlertCircle className="w-5 h-5" /> Hiányzó vagy érvénytelen mezők:
              </div>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* 1. Alapadatok */}
          <Card id="basics" title="1. Alapadatok" icon={BookOpen}>
            <div>
              <label className={labelCls}>Kurzus címe</label>
              <input value={d.title} onChange={(e) => update('title', e.target.value)} placeholder="pl. Excel az alapoktól a magabiztos használatig" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Rövid leírás</label>
              <input value={d.shortDesc} onChange={(e) => update('shortDesc', e.target.value)} placeholder="Egy mondatban foglald össze a kurzust" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Teljes leírás</label>
              <textarea value={d.fullDesc} onChange={(e) => update('fullDesc', e.target.value)} rows={4} placeholder="Részletes leírás a kurzus tartalmáról" className={`${inputCls} resize-none`} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Kategória</label>
                <select value={d.category} onChange={(e) => update('category', e.target.value)} className={`${inputCls} bg-white`}>
                  <option value="">Válassz kategóriát</option>
                  {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Nehézség</label>
                <select value={d.difficulty} onChange={(e) => update('difficulty', e.target.value)} className={`${inputCls} bg-white`}>
                  <option value="">Válassz nehézséget</option>
                  <option value="kezdő">Kezdő</option>
                  <option value="kozepes">Közepes</option>
                  <option value="halado">Haladó</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Becsült időtartam (perc)</label>
                <input type="number" min="0" value={d.estimatedDuration} onChange={(e) => update('estimatedDuration', e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Borítókép</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-cobalt-400 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Kattints a feltöltéshez vagy húzd ide a képet</p>
                  <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, max 5MB</p>
                </div>
              </div>
            </div>
            <Repeatable label="Tanulási eredmények" items={d.learningOutcomes}
              set={(i, v) => setArr('learningOutcomes', i, v)} add={() => addArr('learningOutcomes')}
              del={(i) => delArr('learningOutcomes', i)} placeholder="pl. Önállóan használja az Excelt" />
            <Repeatable label="Célközönség" items={d.targetAudience}
              set={(i, v) => setArr('targetAudience', i, v)} add={() => addArr('targetAudience')}
              del={(i) => delArr('targetAudience', i)} placeholder="pl. Pénzügyi munkatársak" />
            <Repeatable label="Előfeltételek" items={d.requirements}
              set={(i, v) => setArr('requirements', i, v)} add={() => addArr('requirements')}
              del={(i) => delArr('requirements', i)} placeholder="pl. Alapvető számítógép-használati ismeretek" />
          </Card>

          {/* 2. Tananyag felépítése */}
          <Card id="curriculum" title="2. Tananyag felépítése" icon={BookOpen}>
            <div className="space-y-3">
              {d.modules.map((m, mi) => (
                <div key={m.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex flex-col">
                      <button onClick={() => moveModule(mi, -1)} disabled={mi === 0} className="text-gray-400 hover:text-cobalt-600 disabled:opacity-30" aria-label="Modul fel"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => moveModule(mi, 1)} disabled={mi === d.modules.length - 1} className="text-gray-400 hover:text-cobalt-600 disabled:opacity-30" aria-label="Modul le"><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <span className="text-sm font-bold text-cobalt-600 w-6">{mi + 1}.</span>
                    <input value={m.title} onChange={(e) => renameModule(m.id, e.target.value)} placeholder="Modul címe" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cobalt-400" />
                    <button onClick={() => dupModule(m.id)} className="p-2 text-gray-400 hover:text-cobalt-600 transition-colors" aria-label="Modul duplikálása"><Copy className="w-4 h-4" /></button>
                    <button onClick={() => delModule(m.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Modul törlése"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 pl-8">
                    {m.lessons.map((l, li) => {
                      const Ico = lessonTypeOptions.find((o) => o.value === l.type)?.icon ?? Video;
                      return (
                        <div key={l.id} className="border border-gray-100 rounded-lg p-3 bg-navy-50/30 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <button onClick={() => moveLesson(m.id, li, -1)} disabled={li === 0} className="text-gray-400 hover:text-cobalt-600 disabled:opacity-30" aria-label="Lecke fel"><ChevronUp className="w-3 h-3" /></button>
                              <button onClick={() => moveLesson(m.id, li, 1)} disabled={li === m.lessons.length - 1} className="text-gray-400 hover:text-cobalt-600 disabled:opacity-30" aria-label="Lecke le"><ChevronDown className="w-3 h-3" /></button>
                            </div>
                            <Ico className="w-4 h-4 text-cobalt-600 shrink-0" />
                            <input value={l.title} onChange={(e) => updLesson(m.id, l.id, 'title', e.target.value)} placeholder="Lecke címe" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400" />
                            <select value={l.type} onChange={(e) => updLesson(m.id, l.id, 'type', e.target.value)} className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-400">
                              {lessonTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            {(l.type === 'video' || l.type === 'elo-alkalom') && (
                              <input type="number" min="0" value={l.durationMinutes || ''} onChange={(e) => updLesson(m.id, l.id, 'durationMinutes', parseInt(e.target.value) || 0)} placeholder="perc" className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-cobalt-400" />
                            )}
                            <button onClick={() => dupLesson(m.id, l.id)} className="p-1.5 text-gray-400 hover:text-cobalt-600" aria-label="Lecke duplikálása"><Copy className="w-3.5 h-3.5" /></button>
                            <button onClick={() => delLesson(m.id, l.id)} className="p-1.5 text-gray-400 hover:text-red-500" aria-label="Lecke törlése"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <textarea value={l.description} onChange={(e) => updLesson(m.id, l.id, 'description', e.target.value)} placeholder="Lecke leírása" rows={2} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 resize-none" />
                          <div className="flex flex-wrap items-center gap-4 pl-1">
                            <label className="flex items-center gap-1.5 text-xs text-navy-700 cursor-pointer">
                              <input type="checkbox" checked={l.isFreePreview} onChange={(e) => updLesson(m.id, l.id, 'isFreePreview', e.target.checked)} className="rounded" /> Ingyenes előnézet
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-navy-700 cursor-pointer">
                              <input type="checkbox" checked={l.isDownloadable} onChange={(e) => updLesson(m.id, l.id, 'isDownloadable', e.target.checked)} className="rounded" /> Letölthető
                            </label>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Upload className="w-3 h-3" /> {l.type === 'video' ? 'Videó feltöltés' : l.type === 'pdf' ? 'PDF feltöltés' : l.type === 'letoltheto-fajl' ? 'Fájl feltöltés' : 'Nincs feltöltés'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <button onClick={() => addLesson(m.id)} className="text-sm text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1">
                      <PlusCircle className="w-4 h-4" /> Lecke hozzáadása
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addModule} className="text-sm text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Modul hozzáadása
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                <Clock className="w-4 h-4" /> Összes lecke: {totalLessons} · Becsült időtartam: <span className="font-medium text-navy-900">{formatDuration(totalDuration)}</span>
              </div>
            </div>
          </Card>

          {/* 3. Ár és hozzáférés */}
          <Card id="price" title="3. Ár és hozzáférés" icon={BookOpen}>
            <div>
              <label className={labelCls}>Ár (Ft)</label>
              <input type="number" min="0" value={d.price} onChange={(e) => update('price', e.target.value)} placeholder="0" className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={d.hasDownloadable} onChange={(e) => update('hasDownloadable', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-navy-700">Letölthető tananyagok bekapcsolása</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={d.hasLive} onChange={(e) => update('hasLive', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-navy-700">A kurzus élő órát is tartalmaz</span>
            </label>
          </Card>

          {/* 4. Beállítások */}
          <Card id="settings" title="4. Beállítások" icon={BookOpen}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={d.settings.certificate} onChange={(e) => update('settings', { ...d.settings, certificate: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-navy-700">Tanúsítvány kiadása a kurzus elvégzése után</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={d.settings.allowReviews} onChange={(e) => update('settings', { ...d.settings, allowReviews: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-navy-700">Értékelések engedélyezése a hallgatók számára</span>
            </label>
            <div>
              <label className={labelCls}>Nyelv</label>
              <select value={d.settings.language} onChange={(e) => update('settings', { ...d.settings, language: e.target.value })} className={`${inputCls} bg-white`}>
                <option value="magyar">Magyar</option>
                <option value="angol">Angol</option>
                <option value="nemet">Német</option>
              </select>
            </div>
          </Card>

          {/* 5. Előnézet és beküldés */}
          <Card id="submit" title="5. Előnézet és beküldés" icon={Send}>
            <p className="text-sm text-navy-700">Ellenőrizd a kurzus adatait az előnézetben, majd küldd be jóváhagyásra. A jóváhagyás után az ELVARK csapat ellenőrzi a kurzust, és közzéteszi, ha megfelel a követelményeknek.</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={manualSave} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                <Save className="w-4 h-4" /> Piszkozat mentése
              </button>
              <button onClick={handlePreview} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                <Eye className="w-4 h-4" /> Előnézet
              </button>
              <button onClick={handleSubmit} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-700 transition-colors shadow-soft">
                <Send className="w-4 h-4" /> Beküldés jóváhagyásra
              </button>
            </div>
            <button onClick={clearDraft} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 pt-2">
              <Trash2 className="w-4 h-4" /> Piszkozat törlése
            </button>
          </Card>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
