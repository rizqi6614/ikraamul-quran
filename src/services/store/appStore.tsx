import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
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
  QuranReadingHistory,
  SubmissionStatus,
  DonationStatus
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_SUBMISSIONS,
  INITIAL_PROGRESS,
  INITIAL_ACTIVITIES,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_DONATION_PROGRAMS,
  INITIAL_DONATIONS,
  INITIAL_DISBURSEMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TALAQQI_SCHEDULES,
  INITIAL_BOOKMARKS,
  INITIAL_READING_HISTORY
} from '@/services/firebase/mockInitialData';
import { isFirebaseConfigured, db } from '@/services/firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

interface AppStoreContextType {
  // Auth & User
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: Omit<UserProfile, 'uid' | 'membershipStatus' | 'createdAt' | 'updatedAt'> & { role?: UserRole }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (uid: string) => void;
  updateUserProfile: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  approveMember: (uid: string) => void;
  rejectMember: (uid: string) => void;

  // Memorization
  submissions: MemorizationSubmission[];
  memberSubmissions: MemorizationSubmission[];
  progress: MemorizationProgress | null;
  submitMemorization: (data: Omit<MemorizationSubmission, 'id' | 'status' | 'submittedAt' | 'memberName' | 'memberNim'>) => Promise<void>;
  reviewSubmission: (
    submissionId: string,
    status: SubmissionStatus,
    scores: { fluency: number; tajwid: number; makhraj: number },
    feedback: string
  ) => Promise<void>;

  // Quran Bookmark & History
  bookmarks: QuranBookmark[];
  toggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number) => void;
  lastRead: QuranReadingHistory | null;
  setLastReadAyah: (surahNumber: number, surahName: string, ayahNumber: number) => void;

  // Activities & Attendance
  activities: Activity[];
  createActivity: (activity: Omit<Activity, 'id' | 'registeredCount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  memberAttendanceRecords: AttendanceRecord[];
  createAttendanceSession: (activityId: string, activityTitle: string, durationMinutes: number) => Promise<AttendanceSession>;
  closeAttendanceSession: (sessionId: string) => Promise<void>;
  recordAttendance: (sessionCode: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  manualMarkAttendance: (sessionId: string, memberId: string, status: 'hadir' | 'izin' | 'sakit' | 'alpa') => Promise<void>;

  // Donations & Funds
  donationPrograms: DonationProgram[];
  donations: Donation[];
  memberDonations: Donation[];
  disbursements: FundDisbursement[];
  createDonation: (data: Omit<Donation, 'id' | 'status' | 'createdAt' | 'memberName'>) => Promise<void>;
  verifyDonation: (donationId: string, approved: boolean) => Promise<void>;
  createDonationProgram: (data: Omit<DonationProgram, 'id' | 'collectedAmount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createDisbursement: (data: Omit<FundDisbursement, 'id' | 'createdAt'>) => Promise<void>;

  // Announcements & Schedules
  announcements: Announcement[];
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  schedules: TalaqqiSchedule[];
  createSchedule: (data: Omit<TalaqqiSchedule, 'id' | 'participantCount'>) => Promise<void>;

  // Network & Status
  isOnline: boolean;
  isFirebaseLive: boolean;
  resetAllDataToDefault: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'iq_clean_users_v3',
  CURRENT_USER_ID: 'iq_clean_current_uid_v3',
  SUBMISSIONS: 'iq_clean_submissions_v3',
  PROGRESS: 'iq_clean_progress_v3',
  ACTIVITIES: 'iq_clean_activities_v3',
  SESSIONS: 'iq_clean_attendance_sessions_v3',
  ATTENDANCE: 'iq_clean_attendance_records_v3',
  PROGRAMS: 'iq_clean_donation_programs_v3',
  DONATIONS: 'iq_clean_donations_v3',
  DISBURSEMENTS: 'iq_clean_disbursements_v3',
  ANNOUNCEMENTS: 'iq_clean_announcements_v3',
  SCHEDULES: 'iq_clean_schedules_v3',
  BOOKMARKS: 'iq_clean_bookmarks_v3',
  LAST_READ: 'iq_clean_last_read_v3'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
}

const DEFAULT_PROGRAMS: DonationProgram[] = [
  {
    id: 'prog-1',
    title: 'Wakaf Mushaf Al-Qur’an & Beasiswa Tahfidz UNINUS',
    description: 'Pengadaan mushaf Al-Qur’an dan beasiswa santri tahfidz Universitas Islam Nusantara.',
    targetAmount: 10000000,
    collectedAmount: 0,
    category: 'Tahfidz',
    createdBy: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(isFirebaseConfigured());

  // Listen to network status & clean legacy mock storage
  useEffect(() => {
    // Purge old mock storage keys
    if (localStorage.getItem('iq_current_uid_v2') === '"user-rizqi-01"' || localStorage.getItem('iq_users_v2')) {
      localStorage.removeItem('iq_users_v2');
      localStorage.removeItem('iq_current_uid_v2');
      localStorage.removeItem('iq_submissions_v2');
      localStorage.removeItem('iq_progress_v2');
      localStorage.removeItem('iq_activities_v2');
      localStorage.removeItem('iq_attendance_sessions_v2');
      localStorage.removeItem('iq_attendance_records_v2');
      localStorage.removeItem('iq_donations_v2');
      localStorage.removeItem('iq_disbursements_v2');
      localStorage.removeItem('iq_announcements_v2');
      localStorage.removeItem('iq_schedules_v2');
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Primary State collections - clean slate starting from 0
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() =>
    loadStorage(STORAGE_KEYS.USERS, [])
  );

  const [currentUid, setCurrentUid] = useState<string | null>(() =>
    loadStorage(STORAGE_KEYS.CURRENT_USER_ID, null)
  );

  const [submissions, setSubmissions] = useState<MemorizationSubmission[]>(() =>
    loadStorage(STORAGE_KEYS.SUBMISSIONS, [])
  );

  const [progressMap, setProgressMap] = useState<Record<string, MemorizationProgress>>(() =>
    loadStorage(STORAGE_KEYS.PROGRESS, {})
  );

  const [activities, setActivities] = useState<Activity[]>(() =>
    loadStorage(STORAGE_KEYS.ACTIVITIES, [])
  );

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() =>
    loadStorage(STORAGE_KEYS.SESSIONS, [])
  );

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadStorage(STORAGE_KEYS.ATTENDANCE, [])
  );

  const [donationPrograms, setDonationPrograms] = useState<DonationProgram[]>(() =>
    loadStorage(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS)
  );

  const [donations, setDonations] = useState<Donation[]>(() =>
    loadStorage(STORAGE_KEYS.DONATIONS, [])
  );

  const [disbursements, setDisbursements] = useState<FundDisbursement[]>(() =>
    loadStorage(STORAGE_KEYS.DISBURSEMENTS, [])
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadStorage(STORAGE_KEYS.ANNOUNCEMENTS, [])
  );

  const [schedules, setSchedules] = useState<TalaqqiSchedule[]>(() =>
    loadStorage(STORAGE_KEYS.SCHEDULES, [])
  );

  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>(() =>
    loadStorage(STORAGE_KEYS.BOOKMARKS, [])
  );

  const [lastRead, setLastRead] = useState<QuranReadingHistory | null>(() =>
    loadStorage(STORAGE_KEYS.LAST_READ, null)
  );

  // Sync to Firestore if live
  useEffect(() => {
    const firestore = db;
    if (!firestore) return;
    const syncFromFirestore = async () => {
      try {
        const usersSnap = await getDocs(collection(firestore, 'users'));
        if (!usersSnap.empty) {
          const uList: UserProfile[] = [];
          usersSnap.forEach((doc) => uList.push(doc.data() as UserProfile));
          setAllUsers(uList);
        }

        const subsSnap = await getDocs(collection(firestore, 'memorizationSubmissions'));
        if (!subsSnap.empty) {
          const sList: MemorizationSubmission[] = [];
          subsSnap.forEach((doc) => sList.push(doc.data() as MemorizationSubmission));
          setSubmissions(sList);
        }

        const actSnap = await getDocs(collection(firestore, 'activities'));
        if (!actSnap.empty) {
          const aList: Activity[] = [];
          actSnap.forEach((doc) => aList.push(doc.data() as Activity));
          setActivities(aList);
        }

        const donSnap = await getDocs(collection(firestore, 'donations'));
        if (!donSnap.empty) {
          const dList: Donation[] = [];
          donSnap.forEach((doc) => dList.push(doc.data() as Donation));
          setDonations(dList);
        }
      } catch (e) {
        console.warn('Firestore initial live sync note:', e);
      }
    };
    syncFromFirestore();
  }, [isFirebaseLive]);

  // Sync to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.USERS, allUsers), [allUsers]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUid), [currentUid]);
  useEffect(() => saveStorage(STORAGE_KEYS.SUBMISSIONS, submissions), [submissions]);
  useEffect(() => saveStorage(STORAGE_KEYS.PROGRESS, progressMap), [progressMap]);
  useEffect(() => saveStorage(STORAGE_KEYS.ACTIVITIES, activities), [activities]);
  useEffect(() => saveStorage(STORAGE_KEYS.SESSIONS, attendanceSessions), [attendanceSessions]);
  useEffect(() => saveStorage(STORAGE_KEYS.ATTENDANCE, attendanceRecords), [attendanceRecords]);
  useEffect(() => saveStorage(STORAGE_KEYS.PROGRAMS, donationPrograms), [donationPrograms]);
  useEffect(() => saveStorage(STORAGE_KEYS.DONATIONS, donations), [donations]);
  useEffect(() => saveStorage(STORAGE_KEYS.DISBURSEMENTS, disbursements), [disbursements]);
  useEffect(() => saveStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements), [announcements]);
  useEffect(() => saveStorage(STORAGE_KEYS.SCHEDULES, schedules), [schedules]);
  useEffect(() => saveStorage(STORAGE_KEYS.BOOKMARKS, bookmarks), [bookmarks]);
  useEffect(() => saveStorage(STORAGE_KEYS.LAST_READ, lastRead), [lastRead]);

  // Derived current user
  const currentUser = allUsers.find((u) => u.uid === currentUid) || null;
  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  // Filtered for current user
  const memberSubmissions = submissions.filter((s) => s.memberId === currentUid);
  const memberDonations = donations.filter((d) => d.memberId === currentUid);
  const memberAttendanceRecords = attendanceRecords.filter((r) => r.memberId === currentUid);
  const progress = currentUid && progressMap[currentUid] ? progressMap[currentUid] : {
    memberId: currentUid || 'guest',
    totalAyahMemorized: 0,
    totalJuzMemorized: 0,
    targetDailyJuz: 1,
    targetWeeklyAyah: 20,
    verifiedSurahs: [],
    updatedAt: new Date().toISOString()
  };

  // Auth actions
  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    let found = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    
    // Check firestore if not found in local cache
    const firestore = db;
    if (!found && firestore) {
      try {
        const qSnap = await getDocs(collection(firestore, 'users'));
        const fireUsers: UserProfile[] = [];
        qSnap.forEach((d) => fireUsers.push(d.data() as UserProfile));
        if (fireUsers.length > 0) {
          setAllUsers(fireUsers);
          found = fireUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        }
      } catch (e) {}
    }

    if (found) {
      if (password && found.password && found.password !== password) {
        return {
          success: false,
          message: 'Kata sandi salah. Silakan coba lagi.'
        };
      }
      if (found.membershipStatus === 'rejected') {
        return {
          success: false,
          message: 'Mohon maaf, pendaftaran akun Anda tidak disetujui. Hubungi pengurus.'
        };
      }
      setCurrentUid(found.uid);
      return { success: true };
    }
    return { success: false, message: 'Email tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu.' };
  };

  const register = async (
    data: Omit<UserProfile, 'uid' | 'membershipStatus' | 'createdAt' | 'updatedAt'> & { role?: UserRole }
  ): Promise<{ success: boolean; message?: string }> => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' };
    }

    const newUid = `user-${Date.now()}`;
    const newUser: UserProfile = {
      ...data,
      uid: newUid,
      role: data.role || 'member',
      membershipStatus: 'approved', // Auto approved so user can immediately use the app
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUid(newUid); // Automatically log in right after registration!

    // Also sync to Firestore if live
    if (db) {
      try {
        await setDoc(doc(db, 'users', newUid), newUser);
      } catch (err) {
        console.warn('Firestore user save note:', err);
      }
    }

    return {
      success: true,
      message: 'Pendaftaran berhasil! Akun Anda telah aktif dan tersimpan di database.'
    };
  };

  const logout = () => {
    setCurrentUid(null);
  };

  const switchUser = (uid: string) => {
    setCurrentUid(uid);
  };

  const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u))
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Firestore profile update error', e);
      }
    }
  };

  const approveMember = (uid: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, membershipStatus: 'approved', updatedAt: new Date().toISOString() } : u))
    );
  };

  const rejectMember = (uid: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, membershipStatus: 'rejected', updatedAt: new Date().toISOString() } : u))
    );
  };

  // Memorization Submissions
  const submitMemorization = async (
    data: Omit<MemorizationSubmission, 'id' | 'status' | 'submittedAt' | 'memberName' | 'memberNim'>
  ) => {
    if (!currentUser) return;
    const newSub: MemorizationSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      memberName: currentUser.fullName,
      memberNim: currentUser.nim,
      status: 'menunggu',
      submittedAt: new Date().toISOString()
    };
    setSubmissions((prev) => [newSub, ...prev]);

    if (isFirebaseLive && db) {
      try {
        await setDoc(doc(db, 'memorizationSubmissions', newSub.id), newSub);
      } catch (e) {
        console.warn('Firestore submission save error', e);
      }
    }
  };

  const reviewSubmission = async (
    submissionId: string,
    status: SubmissionStatus,
    scores: { fluency: number; tajwid: number; makhraj: number },
    feedback: string
  ) => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    const reviewedAt = new Date().toISOString();
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status,
              fluencyScore: scores.fluency,
              tajwidScore: scores.tajwid,
              makhrajScore: scores.makhraj,
              feedback,
              reviewedAt,
              reviewedBy: currentUser?.uid
            }
          : s
      )
    );

    // If accepted ('diterima'), calculate and update member's verified progress!
    if (status === 'diterima') {
      const memberId = targetSub.memberId;
      const ayahsMemorized = Math.abs(targetSub.endAyah - targetSub.startAyah) + 1;

      setProgressMap((prev) => {
        const cur = prev[memberId] || {
          memberId,
          totalAyahMemorized: 0,
          totalJuzMemorized: 0,
          targetDailyJuz: 2,
          targetWeeklyAyah: 30,
          verifiedSurahs: [],
          updatedAt: reviewedAt
        };

        const existingSurah = cur.verifiedSurahs.find((v) => v.surahNumber === targetSub.surahNumber);
        const updatedSurahs = existingSurah
          ? cur.verifiedSurahs.map((v) =>
              v.surahNumber === targetSub.surahNumber
                ? { ...v, endAyah: Math.max(v.endAyah, targetSub.endAyah) }
                : v
            )
          : [
              ...cur.verifiedSurahs,
              {
                surahNumber: targetSub.surahNumber,
                surahName: targetSub.surahName,
                startAyah: targetSub.startAyah,
                endAyah: targetSub.endAyah,
                completed: false
              }
            ];

        const newTotalAyah = cur.totalAyahMemorized + ayahsMemorized;
        const newTotalJuz = Math.min(30, Math.floor(newTotalAyah / 100) + 1);

        return {
          ...prev,
          [memberId]: {
            ...cur,
            totalAyahMemorized: newTotalAyah,
            totalJuzMemorized: newTotalJuz,
            verifiedSurahs: updatedSurahs,
            updatedAt: reviewedAt
          }
        };
      });
    }
  };

  // Quran Bookmarks & Last Read
  const toggleBookmark = (surahNumber: number, surahName: string, ayahNumber: number) => {
    if (!currentUser) return;
    const exists = bookmarks.find(
      (b) => b.memberId === currentUser.uid && b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.id !== exists.id));
    } else {
      const newBm: QuranBookmark = {
        id: `bm-${Date.now()}`,
        memberId: currentUser.uid,
        surahNumber,
        surahName,
        ayahNumber,
        createdAt: new Date().toISOString()
      };
      setBookmarks((prev) => [newBm, ...prev]);
    }
  };

  const setLastReadAyah = (surahNumber: number, surahName: string, ayahNumber: number) => {
    if (!currentUser) return;
    const item: QuranReadingHistory = {
      memberId: currentUser.uid,
      surahNumber,
      surahName,
      ayahNumber,
      updatedAt: new Date().toISOString()
    };
    setLastRead(item);
  };

  // Activities
  const createActivity = async (
    activity: Omit<Activity, 'id' | 'registeredCount' | 'createdAt' | 'updatedAt'>
  ) => {
    const newAct: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  // Attendance Sessions
  const createAttendanceSession = async (
    activityId: string,
    activityTitle: string,
    durationMinutes: number
  ): Promise<AttendanceSession> => {
    const now = new Date();
    const end = new Date(now.getTime() + durationMinutes * 60 * 1000);
    const code = `IQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const session: AttendanceSession = {
      id: `session-${Date.now()}`,
      activityId,
      activityTitle,
      sessionTokenHash: `SESSION-HASH-${Date.now()}`,
      sessionCode: code,
      startAt: now.toISOString(),
      endAt: end.toISOString(),
      status: 'open',
      createdBy: currentUser?.uid || 'admin',
      createdAt: now.toISOString()
    };

    setAttendanceSessions((prev) => [session, ...prev]);
    return session;
  };

  const closeAttendanceSession = async (sessionId: string) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'closed' } : s))
    );
  };

  const recordAttendance = async (
    sessionCode: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Harap masuk terlebih dahulu.' };

    const cleanCode = sessionCode.trim().toUpperCase();
    const session = attendanceSessions.find(
      (s) => s.sessionCode.toUpperCase() === cleanCode && s.status === 'open'
    );

    if (!session) {
      return { success: false, message: 'Kode sesi absensi tidak valid atau telah ditutup.' };
    }

    // Check expiry
    const now = new Date();
    if (new Date(session.endAt) < now) {
      return { success: false, message: 'Masa berlaku sesi absensi ini telah berakhir.' };
    }

    // Anti-duplication check for same member in same session
    const existing = attendanceRecords.find(
      (r) => r.sessionId === session.id && r.memberId === currentUser.uid
    );
    if (existing) {
      return { success: false, message: 'Anda sudah melakukan absensi untuk sesi kegiatan ini.' };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      activityId: session.activityId,
      activityTitle: session.activityTitle,
      sessionId: session.id,
      memberId: currentUser.uid,
      memberName: currentUser.fullName,
      memberNim: currentUser.nim,
      attendanceStatus: 'hadir',
      checkInAt: now.toISOString(),
      verificationMethod: 'qr_scan',
      notes: notes || 'Absensi mandiri'
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);
    return { success: true, message: `Absensi berhasil dicatat untuk ${session.activityTitle}!` };
  };

  const manualMarkAttendance = async (
    sessionId: string,
    memberId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa'
  ) => {
    const targetMember = allUsers.find((u) => u.uid === memberId);
    const session = attendanceSessions.find((s) => s.id === sessionId);
    if (!targetMember || !session) return;

    const existing = attendanceRecords.find(
      (r) => r.sessionId === sessionId && r.memberId === memberId
    );

    if (existing) {
      setAttendanceRecords((prev) =>
        prev.map((r) =>
          r.id === existing.id
            ? { ...r, attendanceStatus: status, updatedBy: currentUser?.uid }
            : r
        )
      );
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        activityId: session.activityId,
        activityTitle: session.activityTitle,
        sessionId: session.id,
        memberId: targetMember.uid,
        memberName: targetMember.fullName,
        memberNim: targetMember.nim,
        attendanceStatus: status,
        checkInAt: new Date().toISOString(),
        verificationMethod: 'manual',
        updatedBy: currentUser?.uid
      };
      setAttendanceRecords((prev) => [newRec, ...prev]);
    }
  };

  // Donations & Disbursements
  const createDonation = async (
    data: Omit<Donation, 'id' | 'status' | 'createdAt' | 'memberName'>
  ) => {
    if (!currentUser) return;
    const newDonation: Donation = {
      ...data,
      id: `don-${Date.now()}`,
      memberName: currentUser.fullName,
      status: 'menunggu_verifikasi',
      createdAt: new Date().toISOString()
    };
    setDonations((prev) => [newDonation, ...prev]);
  };

  const verifyDonation = async (donationId: string, approved: boolean) => {
    const donation = donations.find((d) => d.id === donationId);
    if (!donation) return;

    const newStatus: DonationStatus = approved ? 'terverifikasi' : 'ditolak';

    setDonations((prev) =>
      prev.map((d) =>
        d.id === donationId
          ? {
              ...d,
              status: newStatus,
              verifiedBy: currentUser?.uid,
              verifiedAt: new Date().toISOString()
            }
          : d
      )
    );

    // If verified, update program collected amount!
    if (approved) {
      setDonationPrograms((prev) =>
        prev.map((p) =>
          p.id === donation.programId
            ? { ...p, collectedAmount: p.collectedAmount + donation.amount }
            : p
        )
      );
    }
  };

  const createDonationProgram = async (
    data: Omit<DonationProgram, 'id' | 'collectedAmount' | 'createdAt' | 'updatedAt'>
  ) => {
    const newProgram: DonationProgram = {
      ...data,
      id: `prog-${Date.now()}`,
      collectedAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDonationPrograms((prev) => [newProgram, ...prev]);
  };

  const createDisbursement = async (data: Omit<FundDisbursement, 'id' | 'createdAt'>) => {
    const newDisb: FundDisbursement = {
      ...data,
      id: `disb-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDisbursements((prev) => [newDisb, ...prev]);
  };

  // Announcements & Schedules
  const createAnnouncement = async (
    data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const createSchedule = async (data: Omit<TalaqqiSchedule, 'id' | 'participantCount'>) => {
    const newSch: TalaqqiSchedule = {
      ...data,
      id: `tal-${Date.now()}`,
      participantCount: 0
    };
    setSchedules((prev) => [newSch, ...prev]);
  };

  // Reset data to clean state
  const resetAllDataToDefault = () => {
    setAllUsers([]);
    setCurrentUid(null);
    setSubmissions([]);
    setProgressMap({});
    setActivities([]);
    setAttendanceSessions([]);
    setAttendanceRecords([]);
    setDonationPrograms(DEFAULT_PROGRAMS);
    setDonations([]);
    setDisbursements([]);
    setAnnouncements([]);
    setSchedules([]);
    setBookmarks([]);
    setLastRead(null);
    localStorage.clear();
  };

  return (
    <AppStoreContext.Provider
      value={{
        currentUser,
        allUsers,
        isAdmin,
        isLoggedIn,
        login,
        register,
        logout,
        switchUser,
        updateUserProfile,
        approveMember,
        rejectMember,
        submissions,
        memberSubmissions,
        progress,
        submitMemorization,
        reviewSubmission,
        bookmarks,
        toggleBookmark,
        lastRead,
        setLastReadAyah,
        activities,
        createActivity,
        updateActivity,
        deleteActivity,
        attendanceSessions,
        attendanceRecords,
        memberAttendanceRecords,
        createAttendanceSession,
        closeAttendanceSession,
        recordAttendance,
        manualMarkAttendance,
        donationPrograms,
        donations,
        memberDonations,
        disbursements,
        createDonation,
        verifyDonation,
        createDonationProgram,
        createDisbursement,
        announcements,
        createAnnouncement,
        schedules,
        createSchedule,
        isOnline,
        isFirebaseLive,
        resetAllDataToDefault
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = (): AppStoreContextType => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
