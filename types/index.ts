export type UserRole = 'hallgato' | 'oktato' | 'admin';

export type CourseStatus =
  | 'piszkozat'
  | 'jovahagyasra-var'
  | 'kozzeteva'
  | 'elutasitva'
  | 'archivalva';

export type LiveEventStatus =
  | 'piszkozat'
  | 'jovahagyasra-var'
  | 'meghirdetve'
  | 'betelt'
  | 'folyamatban'
  | 'befejezve'
  | 'lemondva';

export type OrderStatus = 'fizetesre-var' | 'fizetve' | 'visszateritve' | 'sikertelen';

export type Difficulty = 'kezdő' | 'kozepes' | 'halado';

export type CourseType = 'video' | 'pdf' | 'live' | 'mixed';

export type LiveEventType = 'interaktiv-ora' | 'webinar' | 'workshop' | 'konzultacio';

export type LessonType = 'video' | 'szoveg' | 'pdf' | 'letoltheto-fajl';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  courseCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  isFreePreview: boolean;
  isDownloadable: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  categorySlug: string;
  instructorId: string;
  instructorName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  durationMinutes: number;
  difficulty: Difficulty;
  type: CourseType;
  hasDownloadableMaterials: boolean;
  hasLiveSession: boolean;
  coverColor: string;
  lastUpdated: string;
  benefits: string[];
  sections: CourseSection[];
  reviews: Review[];
  status: CourseStatus;
}

export interface LiveEvent {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  categorySlug: string;
  instructorId: string;
  instructorName: string;
  type: LiveEventType;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  price: number;
  maxParticipants: number;
  registeredParticipants: number;
  durationMinutes: number;
  agenda: string[];
  equipment: string[];
  recordingAvailable: boolean;
  recordingAccessDays?: number;
  cancellationPolicy: string;
  status: LiveEventStatus;
  coverColor: string;
}

export interface Order {
  id: string;
  date: string;
  itemTitle: string;
  itemType: 'course' | 'live';
  amount: number;
  status: OrderStatus;
  itemId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface EnrolledCourse {
  courseId: string;
  courseSlug: string;
  title: string;
  instructorName: string;
  coverColor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
}

export interface UpcomingLive {
  liveEventId: string;
  liveEventSlug: string;
  title: string;
  instructorName: string;
  date: string;
  startTime: string;
  coverColor: string;
}

export interface RecentLesson {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  lessonTitle: string;
  coverColor: string;
  watchedAt: string;
}
