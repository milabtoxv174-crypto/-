export function generateICSFile() {
  const title = "Свадьба Петра и Виктории";
  const description = "Приглашение на свадьбу Петра и Виктории. 15:00 — Роспись в Дворце бракосочетания (г. Смоленск, ул. Глинки, д. 4). 16:00 — Велком-зона в Клуб-Отеле «Высокое». 17:00 — Банкет в Клуб-Отеле «Высокое».";
  const location = "Клуб-Отель Высокое, Смоленская область, д. Высокое";
  const startDate = "20260930T150000";
  const endDate = "20260930T230000";

  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PetrAndViktoriaWedding//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "DESCRIPTION:Напоминание: Завтра свадьба Петра и Виктории!",
    "ACTION:DISPLAY",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Wedding_Petr_and_Viktoria_2026.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getGoogleCalendarLink() {
  const title = encodeURIComponent("Свадьба Петра и Виктории");
  const details = encodeURIComponent("15:00 — Роспись (г. Смоленск, ул. Глинки, д. 4)\n16:00 — Велком-зона (Клуб-Отель «Высокое»)\n17:00 — Банкет (Клуб-Отель «Высокое»)");
  const location = encodeURIComponent("Клуб-Отель Высокое, Смоленская область, Смоленский район, д. Высокое");
  const dates = "20260930T120000Z/20260930T200000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}
