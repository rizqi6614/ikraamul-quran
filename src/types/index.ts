export type UserRole = 'admin' | 'member';
export type MembershipStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nim: string;
  programStudi: string;
  angkatan: string;
  photoURL?: string;
  password?: string;
  role: UserRole;
  membershipStatus: MembershipStatus;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionType = 'hafalan_baru' | 'murojaah' | 'perbaikan';
export type SubmissionStatus = 'menunggu' | 'sedang_diperiksa' | 'diterima' | 'perlu_perbaikan';

export interface MemorizationSubmission {
  id: string;
  memberId: string;
  memberName: string;
  memberNim: string;
  surahNumber: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  submissionType: SubmissionType;
  mentorId: string;
  mentorName: string;
  status: SubmissionStatus;
  fluencyScore?: number; // 0 - 100
  tajwidScore?: number;  // 0 - 100
  makhrajScore?: number; // 0 - 100
  feedback?: string;
  recordingURL?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface MemorizationProgress {
  memberId: string;
  totalAyahMemorized: number;
  totalJuzMemorized: number;
  targetDailyJuz: number;
  targetWeeklyAyah: number;
  verifiedSurahs: {
    surahNumber: number;
    surahName: string;
    startAyah: number;
    endAyah: number;
    completed: boolean;
  }[];
  updatedAt: string;
}

export interface QuranBookmark {
  id: string;
  memberId: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  createdAt: string;
}

export interface QuranReadingHistory {
  id?: string;
  memberId: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  updatedAt: string;
}

export type ActivityCategory =
  | 'Kajian'
  | 'Tahfidz'
  | 'Murojaah'
  | 'Pelatihan'
  | 'Kegiatan Sosial'
  | 'Rapat Organisasi'
  | 'Kegiatan Umum';

export type ActivityStatus = 'akan_datang' | 'berlangsung' | 'selesai' | 'dibatalkan';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  posterURL?: string;
  startAt: string;
  endAt: string;
  location: string;
  registrationEnabled: boolean;
  capacity: number;
  registeredCount: number;
  status: ActivityStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRegistration {
  id: string;
  activityId: string;
  memberId: string;
  memberName: string;
  memberNim: string;
  registrationStatus: 'registered' | 'cancelled';
  registeredAt: string;
}

export interface AttendanceSession {
  id: string;
  activityId: string;
  activityTitle: string;
  sessionTokenHash: string;
  sessionCode: string;
  startAt: string;
  endAt: string;
  status: 'open' | 'closed';
  createdBy: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  activityId: string;
  activityTitle?: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  memberNim: string;
  attendanceStatus: 'hadir' | 'izin' | 'sakit' | 'alpa';
  checkInAt: string;
  verificationMethod: 'qr_scan' | 'manual';
  notes?: string;
  updatedBy?: string;
}

export type DonationCategory = 'Tahfidz' | 'Sosial' | 'Masjid' | 'Al-Qur\'an' | 'Infaq Siswa' | 'Infaq Jumat';
export type DonationStatus =
  | 'menunggu_pembayaran'
  | 'menunggu_verifikasi'
  | 'terverifikasi'
  | 'ditolak'
  | 'dibatalkan';

export interface DonationProgram {
  id: string;
  title: string;
  description: string;
  category: DonationCategory;
  targetAmount: number;
  collectedAmount: number;
  coverImageURL?: string;
  status: 'active' | 'completed' | 'paused';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  memberId: string;
  memberName: string;
  programId: string;
  programTitle: string;
  category: string;
  amount: number;
  paymentMethod: 'gopay' | 'qris' | 'transfer_bca' | 'transfer_mandiri' | 'transfer_bsi' | 'cash' | string;
  paymentReference?: string;
  proofURL?: string;
  notes?: string;
  status: DonationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface FundDisbursement {
  id: string;
  programId: string;
  programTitle: string;
  amount: number;
  description: string;
  recipient: string;
  proofURL?: string;
  createdBy: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  content: string;
  imageURL?: string;
  category: string;
  published: boolean;
  publishedAt: string;
  createdBy: string;
  createdAt?: string;
  updatedAt: string;
}

export interface TalaqqiSchedule {
  id: string;
  title: string;
  description: string;
  scheduleType: 'talaqqi' | 'murojaah';
  startAt: string;
  endAt: string;
  mentorId: string;
  mentorName: string;
  location: string;
  capacity: number;
  participantCount: number;
  createdBy: string;
}

export interface UserNotification {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: 'announcement' | 'schedule' | 'submission' | 'approval' | 'donation' | 'attendance';
  relatedDocumentId?: string;
  readAt?: string;
  createdAt: string;
}

export interface AppSettings {
  appName: string;
  logoURL: string;
  organizationName: string;
  contactInformation: string;
  featureFlags: {
    registrationOpen: boolean;
    requireAdminVerification: boolean;
    audioUploadEnabled: boolean;
    donationsEnabled: boolean;
  };
  updatedBy: string;
  updatedAt: string;
}

/* Surah & Ayah definition for Al-Qur'an Digital */
export interface SurahMeta {
  number: number;
  name: string;          // Latin name: Al-Fatihah
  nameArabic: string;    // الفاتحة
  translation: string;   // Pembukaan
  revelation: 'Makkiyah' | 'Madaniyah';
  numberOfAyahs: number;
  audioFull?: string;
}

export interface AyahItem {
  number: number;        // Nomor ayat dalam surah
  arabic: string;        // Text Arab lengkap
  translation: string;   // Terjemahan Bahasa Indonesia Kemenag
  latin?: string;        // Transliterasi Latin persis seperti di NU Online
  audio?: string;        // Audio link murattal per ayat
}

export interface SurahDetail extends SurahMeta {
  bismillah?: {
    arabic: string;
    translation: string;
  };
  ayahs: AyahItem[];
}

export interface DoaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference: string;
  counterTarget?: number;
}
