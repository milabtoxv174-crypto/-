export interface RSVPResponse {
  id: string;
  guestName: string;
  plusOneName?: string;
  attendance: 'yes' | 'no' | 'maybe';
  drinks: string[];
  transferNeeded: boolean;
  message?: string;
  submittedAt: string;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  venueName: string;
  address: string;
  description: string;
  yandexMapUrl: string;
  gis2MapUrl: string;
  googleMapUrl: string;
  badge?: string;
  iconName: 'heart' | 'glass' | 'mapPin' | 'clock';
}

export interface GuestWish {
  id: string;
  authorName: string;
  message: string;
  litCandle: boolean;
  createdAt: string;
  likesCount: number;
}
