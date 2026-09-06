/**
 * Utility for formatting natural Russian salutations for wedding guests.
 * Correctly handles:
 * - Couples / Families: "Иван и Мария" -> "Дорогие Иван и Мария!"
 * - Female names: "Анна", "Екатерина" -> "Дорогая Анна!"
 * - Male names: "Александр", "Илья", "Петр" -> "Дорогой Александр!"
 */

export function formatGuestSalutation(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Дорогие родные и друзья!';

  const lower = trimmed.toLowerCase();

  // Plural checks: "и", "семья", "родители", "бабушка и дедушка", etc.
  if (
    lower.includes(' и ') ||
    lower.includes('&') ||
    lower.startsWith('семья') ||
    lower.includes('родители') ||
    lower.includes('друзья') ||
    lower.includes('родные')
  ) {
    return `Дорогие ${trimmed}!`;
  }

  // Male names ending with -а / -я
  const maleExceptionNames = [
    'илья',
    'никита',
    'лука',
    'фома',
    'кузьма',
    'данила',
    'миша',
    'саша',
    'дима',
    'паша',
    'ваня',
    'рома',
    'лена', // Ambiguous, but in Russian Lena is usually Elena (f)
    'сережа',
    'вова',
    'коля',
    'антон',
    'костя',
    'юра',
    'витя',
    'слава',
    'лева',
    'женя',
    'тима',
    'гриша',
  ];

  const firstWord = lower.split(' ')[0];
  const isKnownMaleShortName = [
    'илья',
    'никита',
    'лука',
    'фома',
    'кузьма',
    'данила',
    'миша',
    'дима',
    'паша',
    'ваня',
    'рома',
    'сережа',
    'вова',
    'коля',
    'костя',
    'юра',
    'витя',
    'лева',
    'тима',
    'гриша',
  ].includes(firstWord);

  if (isKnownMaleShortName) {
    return `Дорогой ${trimmed}!`;
  }

  // Female endings (-а, -я, -ь for Любовь)
  if (/[ая]$/i.test(firstWord) || firstWord === 'любовь') {
    return `Дорогая ${trimmed}!`;
  }

  // Default masculine
  return `Дорогой ${trimmed}!`;
}

/**
 * Builds the personalized guest URL for sharing
 */
export function buildGuestUrl(guestName: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');
  if (!guestName.trim()) return base;
  return `${base}?guest=${encodeURIComponent(guestName.trim())}`;
}
