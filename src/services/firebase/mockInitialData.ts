import {
  UserProfile,
  MemorizationSubmission,
  MemorizationProgress,
  Activity,
  AttendanceSession,
  AttendanceRecord,
  DonationProgram,
  Donation,
  FundDisbursement,
  Announcement,
  TalaqqiSchedule,
  QuranBookmark,
  QuranReadingHistory
} from '@/types';

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user-rizqi-01',
    fullName: 'Rizqi Maulana Abdul Aziz',
    email: 'rizqi@uninus.ac.id',
    phoneNumber: '081234567890',
    nim: '221011400234',
    programStudi: 'Pendidikan Agama Islam',
    angkatan: '2022',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    role: 'member',
    membershipStatus: 'approved',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z'
  },
  {
    uid: 'admin-iqbal-01',
    fullName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    email: 'admin@uninus.ac.id',
    phoneNumber: '081298765432',
    nim: 'ADMIN-IQ-001',
    programStudi: 'Dosen Pembimbing Tahfidz',
    angkatan: '2020',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    role: 'admin',
    membershipStatus: 'approved',
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z'
  },
  {
    uid: 'user-ahmad-02',
    fullName: 'Ahmad Fadli',
    email: 'ahmad@uninus.ac.id',
    phoneNumber: '081345678901',
    nim: '221011400190',
    programStudi: 'Teknik Informatika',
    angkatan: '2022',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    role: 'member',
    membershipStatus: 'approved',
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z'
  },
  {
    uid: 'user-nurul-03',
    fullName: 'Siti Nurhaliza',
    email: 'nurul@uninus.ac.id',
    phoneNumber: '081356789012',
    nim: '231011400512',
    programStudi: 'Ilmu Komunikasi',
    angkatan: '2023',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    role: 'member',
    membershipStatus: 'pending',
    createdAt: '2026-10-05T09:30:00Z',
    updatedAt: '2026-10-05T09:30:00Z'
  },
  {
    uid: 'user-dika-04',
    fullName: 'Dika Pratama',
    email: 'dika@uninus.ac.id',
    phoneNumber: '081367890123',
    nim: '231011400871',
    programStudi: 'Ilmu Hukum',
    angkatan: '2023',
    photoURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
    role: 'member',
    membershipStatus: 'approved',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  }
];

export const INITIAL_SUBMISSIONS: MemorizationSubmission[] = [
  {
    id: 'sub-01',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    startAyah: 1,
    endAyah: 10,
    submissionType: 'hafalan_baru',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    status: 'diterima',
    fluencyScore: 95,
    tajwidScore: 92,
    makhrajScore: 94,
    feedback: 'Alhamdulillah hafalan sangat lancar dan tartil. Jaga terus makhraj huruf ‘Ain dan Ghain.',
    submittedAt: '2026-10-10T08:30:00Z',
    reviewedAt: '2026-10-10T14:15:00Z',
    reviewedBy: 'admin-iqbal-01'
  },
  {
    id: 'sub-02',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    startAyah: 1,
    endAyah: 7,
    submissionType: 'murojaah',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    status: 'diterima',
    fluencyScore: 98,
    tajwidScore: 96,
    makhrajScore: 98,
    feedback: 'Mumtaz. Mad wajib dan mad jaiz sudah sangat konsisten.',
    submittedAt: '2026-09-01T09:00:00Z',
    reviewedAt: '2026-09-01T11:00:00Z',
    reviewedBy: 'admin-iqbal-01'
  },
  {
    id: 'sub-03',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    surahNumber: 114,
    surahName: 'An-Nas',
    startAyah: 1,
    endAyah: 6,
    submissionType: 'murojaah',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    status: 'diterima',
    fluencyScore: 95,
    tajwidScore: 95,
    makhrajScore: 95,
    feedback: 'Bagus dan lancar. Silakan lanjutkan ke surah Al-Falaq dan Al-Ikhlas.',
    submittedAt: '2026-08-15T10:00:00Z',
    reviewedAt: '2026-08-15T13:30:00Z',
    reviewedBy: 'admin-iqbal-01'
  },
  {
    id: 'sub-04',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    startAyah: 11,
    endAyah: 20,
    submissionType: 'hafalan_baru',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    status: 'menunggu',
    submittedAt: '2026-10-12T16:00:00Z'
  },
  {
    id: 'sub-05',
    memberId: 'user-ahmad-02',
    memberName: 'Ahmad Fadli',
    memberNim: '221011400190',
    surahNumber: 36,
    surahName: 'Yasin',
    startAyah: 1,
    endAyah: 25,
    submissionType: 'hafalan_baru',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    status: 'sedang_diperiksa',
    submittedAt: '2026-10-11T13:20:00Z'
  }
];

export const INITIAL_PROGRESS: Record<string, MemorizationProgress> = {
  'user-rizqi-01': {
    memberId: 'user-rizqi-01',
    totalAyahMemorized: 185,
    totalJuzMemorized: 2,
    targetDailyJuz: 5,
    targetWeeklyAyah: 50,
    verifiedSurahs: [
      { surahNumber: 1, surahName: 'Al-Fatihah', startAyah: 1, endAyah: 7, completed: true },
      { surahNumber: 2, surahName: 'Al-Baqarah', startAyah: 1, endAyah: 10, completed: false },
      { surahNumber: 114, surahName: 'An-Nas', startAyah: 1, endAyah: 6, completed: true }
    ],
    updatedAt: '2026-10-10T14:15:00Z'
  }
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-01',
    title: 'Kegiatan Rutin Murojaah Bersama',
    description: 'Kegiatan rutin murojaah bersama seluruh anggota Ikraamul Qur’an UNINUS guna menjaga mutqin hafalan.',
    category: 'Murojaah',
    posterURL: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    startAt: '2026-10-19T16:00:00Z',
    endAt: '2026-10-19T17:30:00Z',
    location: 'Ruang Kelas Al-Qur\'an Lt. 2, Gedung F UNINUS',
    registrationEnabled: true,
    capacity: 40,
    registeredCount: 28,
    status: 'akan_datang',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'act-02',
    title: 'Kajian Spesial Tafsir Al-Qur’an Tematik',
    description: 'Kajian bedah ayat-ayat Al-Qur’an bersama Ustadz Dr. Muhammad Iqbal mengenai adab dan karakter ahlul Qur’an.',
    category: 'Kajian',
    posterURL: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    startAt: '2026-10-23T15:30:00Z',
    endAt: '2026-10-23T17:30:00Z',
    location: 'Aula Pascasarjana UNINUS',
    registrationEnabled: true,
    capacity: 100,
    registeredCount: 64,
    status: 'akan_datang',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: '2026-10-02T09:00:00Z'
  },
  {
    id: 'act-03',
    title: 'Lomba Tahfidz Al-Qur\'an Tingkat Universitas',
    description: 'Kompetisi Tahfidz Al-Qur’an cabang 1 Juz, 5 Juz, dan 10 Juz antar mahasiswa se-UNINUS dalam memperingati Milad UNINUS.',
    category: 'Tahfidz',
    posterURL: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=800',
    startAt: '2026-10-28T08:00:00Z',
    endAt: '2026-10-28T14:00:00Z',
    location: 'Aula Utama Gedung Rektorat UNINUS',
    registrationEnabled: true,
    capacity: 60,
    registeredCount: 42,
    status: 'akan_datang',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z'
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'session-01',
    activityId: 'act-01',
    activityTitle: 'Kegiatan Rutin Murojaah Bersama',
    sessionTokenHash: 'IQ-ABSEN-20261019-RUTIN',
    sessionCode: 'IQ-7892',
    startAt: '2026-10-19T15:45:00Z',
    endAt: '2026-10-19T17:45:00Z',
    status: 'open',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-10-19T15:30:00Z'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec-01',
    activityId: 'act-01',
    activityTitle: 'Kegiatan Rutin Murojaah Bersama',
    sessionId: 'session-00',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    attendanceStatus: 'hadir',
    checkInAt: '2026-10-06T16:05:00Z',
    verificationMethod: 'qr_scan',
    notes: 'Tepat waktu'
  },
  {
    id: 'rec-02',
    activityId: 'act-02',
    activityTitle: 'Kajian Spesial Tafsir Al-Qur\'an',
    sessionId: 'session-prev-1',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    attendanceStatus: 'hadir',
    checkInAt: '2026-10-03T15:35:00Z',
    verificationMethod: 'qr_scan'
  },
  {
    id: 'rec-03',
    activityId: 'act-01',
    activityTitle: 'Murojaah Bersama Pekan Lalu',
    sessionId: 'session-prev-2',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    memberNim: '221011400234',
    attendanceStatus: 'hadir',
    checkInAt: '2026-10-01T16:00:00Z',
    verificationMethod: 'manual'
  }
];

export const INITIAL_DONATION_PROGRAMS: DonationProgram[] = [
  {
    id: 'prog-01',
    title: 'Infaq Pengembangan Tahfidz & Quranic Corner UNINUS',
    description: 'Pengadaan mushaf tahfidz hafalan terjemah, Al-Qur’an braille, sound system talaqqi, serta fasilitas karpet ruang murojaah.',
    category: 'Tahfidz',
    targetAmount: 10000000,
    collectedAmount: 5250000,
    coverImageURL: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z'
  },
  {
    id: 'prog-02',
    title: 'Shadaqah Sosial Santunan Mahasiswa & Dhuafa',
    description: 'Bantuan biaya pendidikan, sembako, dan beasiswa beras bagi anggota dan dhuafa di lingkungan kampus UNINUS.',
    category: 'Sosial',
    targetAmount: 5000000,
    collectedAmount: 3400000,
    coverImageURL: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-10-08T08:00:00Z'
  },
  {
    id: 'prog-03',
    title: 'Infaq Renovasi & Pemeliharaan Masjid UNINUS',
    description: 'Dukungan kebersihan, peremajaan perlengkapan ibadah, dan mukena masjid kampus.',
    category: 'Masjid',
    targetAmount: 8000000,
    collectedAmount: 6150000,
    coverImageURL: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-08-20T08:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-01',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    programId: 'prog-01',
    programTitle: 'Infaq Pengembangan Tahfidz',
    category: 'Infaq - Siswa',
    amount: 50000,
    paymentMethod: 'qris',
    paymentReference: 'INV-IQ-20261010-001',
    notes: 'Semoga berkah untuk dakwah Quran UNINUS',
    status: 'terverifikasi',
    verifiedBy: 'admin-iqbal-01',
    verifiedAt: '2026-10-10T12:35:00Z',
    createdAt: '2026-10-10T12:30:00Z'
  },
  {
    id: 'don-02',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    programId: 'prog-02',
    programTitle: 'Shadaqah Sosial Santunan',
    category: 'Shadaqah - Sosial',
    amount: 100000,
    paymentMethod: 'transfer_bsi',
    paymentReference: 'INV-IQ-20261008-002',
    notes: 'Infaq atas nama keluarga',
    status: 'terverifikasi',
    verifiedBy: 'admin-iqbal-01',
    verifiedAt: '2026-10-08T15:25:00Z',
    createdAt: '2026-10-08T15:20:00Z'
  },
  {
    id: 'don-03',
    memberId: 'user-rizqi-01',
    memberName: 'Rizqi Maulana Abdul Aziz',
    programId: 'prog-01',
    programTitle: 'Infaq Pengembangan Tahfidz',
    category: 'Infaq - Jumat',
    amount: 75000,
    paymentMethod: 'qris',
    paymentReference: 'INV-IQ-20261005-003',
    status: 'terverifikasi',
    verifiedBy: 'admin-iqbal-01',
    verifiedAt: '2026-10-05T10:20:00Z',
    createdAt: '2026-10-05T10:15:00Z'
  }
];

export const INITIAL_DISBURSEMENTS: FundDisbursement[] = [
  {
    id: 'disb-01',
    programId: 'prog-01',
    programTitle: 'Infaq Pengembangan Tahfidz & Quranic Corner',
    amount: 2500000,
    description: 'Pembelian 25 paket Mushaf Al-Qur\'an Tikrar hafalan dan stand Al-Qur\'an kayu jati.',
    recipient: 'Toko Kitab Darul Ulum Bandung',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'disb-02',
    programId: 'prog-02',
    programTitle: 'Shadaqah Sosial Santunan Mahasiswa & Dhuafa',
    amount: 1500000,
    description: 'Penyaluran beasiswa sembako dan biaya semester untuk 3 mahasiswa tahfidz berprestasi.',
    recipient: 'Mahasiswa Penerima Beasiswa Tahfidz UNINUS',
    createdBy: 'admin-iqbal-01',
    createdAt: '2026-10-07T11:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Murojaah Bersama Setiap Senin',
    content: 'Jangan lupa untuk mengikuti kegiatan rutin Murojaah setiap hari Senin pukul 16.00 WIB di Ruang Kelas Al-Qur’an Lt. 2.',
    category: 'Pengumuman',
    published: true,
    publishedAt: '2026-10-10T08:00:00Z',
    createdBy: 'admin-iqbal-01',
    updatedAt: '2026-10-10T08:00:00Z'
  },
  {
    id: 'ann-02',
    title: 'Pendaftaran Lomba Tahfidz Antar Mahasiswa UNINUS Dibuka',
    description: 'Daftarkan diri Anda untuk mengikuti Lomba Tahfidz Al-Qur\'an kategori 1 Juz, 5 Juz, dan 10 Juz.',
    content: 'Pendaftaran Lomba Tahfidz antar anggota dan mahasiswa UNINUS dibuka sampai tanggal 25 Oktober 2026.',
    category: 'Info',
    published: true,
    publishedAt: '2026-10-08T09:00:00Z',
    createdBy: 'admin-iqbal-01',
    updatedAt: '2026-10-08T09:00:00Z'
  },
  {
    id: 'ann-03',
    title: 'Kajian Islam Bersama Ustadz Dr. Muhammad Iqbal, Lc.',
    content: 'Kajian Islam dan motivasi istiqomah menghafal Al-Qur’an akan diselenggarakan pada hari Jumat, 23 Oktober 2026.',
    category: 'Kegiatan',
    published: true,
    publishedAt: '2026-10-05T10:00:00Z',
    createdBy: 'admin-iqbal-01',
    updatedAt: '2026-10-05T10:00:00Z'
  }
];

export const INITIAL_TALAQQI_SCHEDULES: TalaqqiSchedule[] = [
  {
    id: 'tal-01',
    title: 'Sesi Talaqqi Juz 30 Bersama Ustadz Iqbal',
    description: 'Bimbingan tartil dan koreksi makharijul huruf surah An-Naba s.d An-Nas.',
    scheduleType: 'talaqqi',
    startAt: '2026-10-16T16:00:00Z',
    endAt: '2026-10-16T17:30:00Z',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    location: 'Masjid Ulil Albab UNINUS',
    capacity: 20,
    participantCount: 14,
    createdBy: 'admin-iqbal-01'
  },
  {
    id: 'tal-02',
    title: 'Sesi Murojaah Akbar Juz 1-2 Bersama Pembimbing',
    description: 'Simakan berantai antar santri tahfidz UNINUS dengan pembagian kelompok.',
    scheduleType: 'murojaah',
    startAt: '2026-10-18T08:30:00Z',
    endAt: '2026-10-18T11:30:00Z',
    mentorId: 'admin-iqbal-01',
    mentorName: 'Ust. Muhammad Iqbal, Lc., M.Ag.',
    location: 'Ruang Seminar Perpustakaan UNINUS',
    capacity: 30,
    participantCount: 22,
    createdBy: 'admin-iqbal-01'
  }
];

export const INITIAL_BOOKMARKS: QuranBookmark[] = [
  {
    id: 'bm-01',
    memberId: 'user-rizqi-01',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    ayahNumber: 255,
    createdAt: '2026-10-10T12:00:00Z'
  }
];

export const INITIAL_READING_HISTORY: QuranReadingHistory = {
  memberId: 'user-rizqi-01',
  surahNumber: 2,
  surahName: 'Al-Baqarah',
  ayahNumber: 1,
  updatedAt: '2026-10-13T10:00:00Z'
};
