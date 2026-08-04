export function formatHUF(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('hu-HU').format(n);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('hu-HU', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDuration(minutes: number): string {
  if (minutes === 0) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} perc`;
  if (mins === 0) return `${hours} óra`;
  return `${hours} óra ${mins} perc`;
}

export function getDifficultyLabel(d: string): string {
  const map: Record<string, string> = {
    kezdő: 'Kezdő',
    kozepes: 'Közepes',
    halado: 'Haladó',
  };
  return map[d] ?? d;
}

export function getLiveEventTypeLabel(t: string): string {
  const map: Record<string, string> = {
    'interaktiv-ora': 'Interaktív óra',
    webinar: 'Webinar',
    workshop: 'Workshop',
    konzultacio: 'Konzultáció',
  };
  return map[t] ?? t;
}

export function getCourseStatusLabel(s: string): string {
  const map: Record<string, string> = {
    piszkozat: 'Piszkozat',
    'jovahagyasra-var': 'Jóváhagyásra vár',
    kozzeteva: 'Közzétéve',
    elutasitva: 'Elutasítva',
    archivalva: 'Archiválva',
  };
  return map[s] ?? s;
}

export function getLiveEventStatusLabel(s: string): string {
  const map: Record<string, string> = {
    piszkozat: 'Piszkozat',
    'jovahagyasra-var': 'Jóváhagyásra vár',
    meghirdetve: 'Meghirdetve',
    betelt: 'Betelt',
    folyamatban: 'Folyamatban',
    befejezve: 'Befejezve',
    lemondva: 'Lemondva',
  };
  return map[s] ?? s;
}

export function getOrderStatusLabel(s: string): string {
  const map: Record<string, string> = {
    'fizetesre-var': 'Fizetésre vár',
    fizetve: 'Fizetve',
    visszateritve: 'Visszatérítve',
    sikertelen: 'Sikertelen',
  };
  return map[s] ?? s;
}
