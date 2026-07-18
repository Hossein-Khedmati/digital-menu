import { DayKey } from "../../schemas";

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "saturday",  label: "شنبه"       },
  { key: "sunday",    label: "یکشنبه"     },
  { key: "monday",    label: "دوشنبه"     },
  { key: "tuesday",   label: "سه‌شنبه"   },
  { key: "wednesday", label: "چهارشنبه"  },
  { key: "thursday",  label: "پنجشنبه"   },
  { key: "friday",    label: "جمعه"       },
];

export const DEFAULT_FROM = "09:00";
export const DEFAULT_TO   = "22:00";