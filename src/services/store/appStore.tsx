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
import { isFirebaseConfigured, db, auth } from '@/services/firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { getJuzForAyah } from '@/utils/quranJuz';

interface AppStoreContextType {
  // Auth & User
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  register: (data: Omit<UserProfile, 'uid' | 'membershipStatus' | 'createdAt' | 'updatedAt'> & { role?: UserRole }) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  switchUser: (uid: string) => void;
  updateUserProfile: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  approveMember: (uid: string) => void;
  rejectMember: (uid: string) => void;
  deleteMember: (uid: string) => Promise<void>;

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
  deleteSubmission: (id: string) => Promise<void>;

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
  deleteAttendanceSession: (sessionId: string) => Promise<void>;
  recordAttendance: (sessionCode: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  manualMarkAttendance: (sessionId: string, memberId: string, status: 'hadir' | 'izin' | 'sakit' | 'alpa') => Promise<void>;

  // Donations & Funds
  donationPrograms: DonationProgram[];
  donations: Donation[];
  memberDonations: Donation[];
  disbursements: FundDisbursement[];
  createDonation: (data: Omit<Donation, 'id' | 'status' | 'createdAt' | 'memberName'>) => Promise<void>;
  verifyDonation: (donationId: string, approved: boolean) => Promise<void>;
  deleteDonation: (id: string) => Promise<void>;
  createDonationProgram: (data: Omit<DonationProgram, 'id' | 'collectedAmount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteDonationProgram: (id: string) => Promise<void>;
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
  USERS: 'iq_clean_users_v4',
  CURRENT_USER_ID: 'iq_clean_current_uid_v4',
  SUBMISSIONS: 'iq_clean_submissions_v4',
  PROGRESS: 'iq_clean_progress_v4',
  ACTIVITIES: 'iq_clean_activities_v4',
  SESSIONS: 'iq_clean_attendance_sessions_v4',
  ATTENDANCE: 'iq_clean_attendance_records_v4',
  PROGRAMS: 'iq_clean_donation_programs_v4',
  DONATIONS: 'iq_clean_donations_v4',
  DISBURSEMENTS: 'iq_clean_disbursements_v4',
  ANNOUNCEMENTS: 'iq_clean_announcements_v4',
  SCHEDULES: 'iq_clean_schedules_v4',
  BOOKMARKS: 'iq_clean_bookmarks_v4',
  LAST_READ: 'iq_clean_last_read_v4'
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
  const [isFirebaseLive] = useState<boolean>(isFirebaseConfigured());

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Primary State collections
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

  // Realtime Listeners for Firestore Collections
  useEffect(() => {
    if (!db) return;

    // Listen to users collection
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        if (!snap.empty) {
          const uList: UserProfile[] = [];
          snap.forEach((d) => uList.push(d.data() as UserProfile));
          setAllUsers(uList);
        }
      },
      (err) => console.warn('Firestore users realtime listener note:', err.message)
    );

    // Listen to memorizationSubmissions collection
    const unsubSubs = onSnapshot(
      collection(db, 'memorizationSubmissions'),
      (snap) => {
        if (!snap.empty) {
          const sList: MemorizationSubmission[] = [];
          snap.forEach((d) => sList.push(d.data() as MemorizationSubmission));
          sList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          setSubmissions(sList);
        }
      },
      (err) => console.warn('Firestore submissions realtime listener note:', err.message)
    );

    // Listen to activities collection
    const unsubActs = onSnapshot(
      collection(db, 'activities'),
      (snap) => {
        if (!snap.empty) {
          const aList: Activity[] = [];
          snap.forEach((d) => aList.push(d.data() as Activity));
          setActivities(aList);
        }
      },
      (err) => console.warn('Firestore activities listener note:', err.message)
    );

    // Listen to donations collection
    const unsubDonations = onSnapshot(
      collection(db, 'donations'),
      (snap) => {
        if (!snap.empty) {
          const dList: Donation[] = [];
          snap.forEach((d) => dList.push(d.data() as Donation));
          setDonations(dList);
        }
      },
      (err) => console.warn('Firestore donations listener note:', err.message)
    );

    // Listen to donationPrograms collection
    const unsubPrograms = onSnapshot(
      collection(db, 'donationPrograms'),
      (snap) => {
        if (!snap.empty) {
          const pList: DonationProgram[] = [];
          snap.forEach((d) => pList.push(d.data() as DonationProgram));
          setDonationPrograms(pList);
        }
      },
      (err) => console.warn('Firestore donationPrograms listener note:', err.message)
    );

    // Listen to attendanceSessions collection
    const unsubSessions = onSnapshot(
      collection(db, 'attendanceSessions'),
      (snap) => {
        if (!snap.empty) {
          const sesList: AttendanceSession[] = [];
          snap.forEach((d) => sesList.push(d.data() as AttendanceSession));
          sesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAttendanceSessions(sesList);
        }
      },
      (err) => console.warn('Firestore attendanceSessions listener note:', err.message)
    );

    // Listen to attendanceRecords collection
    const unsubRecords = onSnapshot(
      collection(db, 'attendanceRecords'),
      (snap) => {
        if (!snap.empty) {
          const recList: AttendanceRecord[] = [];
          snap.forEach((d) => recList.push(d.data() as AttendanceRecord));
          recList.sort((a, b) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime());
          setAttendanceRecords(recList);
        }
      },
      (err) => console.warn('Firestore attendanceRecords listener note:', err.message)
    );

    return () => {
      unsubUsers();
      unsubSubs();
      unsubActs();
      unsubDonations();
      unsubPrograms();
      unsubSessions();
      unsubRecords();
    };
  }, [isFirebaseLive]);

  // Listen to Firebase Auth state change
  useEffect(() => {
    if (!auth) return;
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const found = allUsers.find(
          (u) => u.uid === fbUser.uid || u.email.toLowerCase() === (fbUser.email || '').toLowerCase()
        );
        if (found) {
          setCurrentUid(found.uid);
        } else if (db) {
          try {
            const userSnap = await getDoc(doc(db, 'users', fbUser.uid));
            if (userSnap.exists()) {
              const uData = userSnap.data() as UserProfile;
              setAllUsers((prev) => [uData, ...prev.filter((u) => u.uid !== fbUser.uid)]);
              setCurrentUid(fbUser.uid);
            }
          } catch (e) {
            console.warn('Firebase user doc note:', e);
          }
        }
      }
    });

    return () => unsubAuth();
  }, [allUsers]);

  // Derived current user
  const currentUser = allUsers.find((u) => u.uid === currentUid) || null;
  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  // Filtered for current user
  const memberSubmissions = submissions.filter((s) => s.memberId === currentUid);
  const memberDonations = donations.filter((d) => d.memberId === currentUid);
  const memberAttendanceRecords = attendanceRecords.filter((r) => r.memberId === currentUid);

  // Dynamic calculation of hafalan progress specific to current user's approved submissions
  const acceptedSubs = memberSubmissions.filter((s) => s.status === 'diterima');
  const dynamicAyahs = acceptedSubs.reduce(
    (acc, s) => acc + (Math.abs(s.endAyah - s.startAyah) + 1),
    0
  );
  const dynamicJuzNumbers = new Set(
    acceptedSubs.map((s) => getJuzForAyah(s.surahNumber, s.startAyah))
  );

  const rawUserProgress = currentUid ? progressMap[currentUid] : null;

  const progress: MemorizationProgress = {
    memberId: currentUid || 'guest',
    totalAyahMemorized: acceptedSubs.length > 0
      ? dynamicAyahs
      : (rawUserProgress?.totalAyahMemorized || 0),
    totalJuzMemorized: acceptedSubs.length > 0
      ? dynamicJuzNumbers.size
      : (rawUserProgress?.totalJuzMemorized || 0),
    targetDailyJuz: rawUserProgress?.targetDailyJuz || 5,
    targetWeeklyAyah: rawUserProgress?.targetWeeklyAyah || 30,
    verifiedSurahs: rawUserProgress?.verifiedSurahs || [],
    updatedAt: rawUserProgress?.updatedAt || new Date().toISOString()
  };

  // Auth actions
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Authentication
    if (auth && password) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUid = userCred.user.uid;

        // Try getting profile from Firestore
        if (db) {
          try {
            const snap = await getDoc(doc(db, 'users', fbUid));
            if (snap.exists()) {
              const uData = snap.data() as UserProfile;
              setAllUsers((prev) => [uData, ...prev.filter((u) => u.uid !== fbUid)]);
              setCurrentUid(fbUid);
              return { success: true, role: uData.role };
            }
          } catch (e) {
            console.warn('Firestore fetch user profile note:', e);
          }
        }

        // Check local users
        const localMatch = allUsers.find((u) => u.uid === fbUid || u.email.toLowerCase() === cleanEmail);
        if (localMatch) {
          setCurrentUid(localMatch.uid);
          return { success: true, role: localMatch.role };
        }

        // Fallback user profile
        const fallbackProfile: UserProfile = {
          uid: fbUid,
          fullName: userCred.user.displayName || email.split('@')[0],
          email: cleanEmail,
          phoneNumber: '',
          nim: '',
          role: 'member',
          membershipStatus: 'approved',
          programStudi: 'Pendidikan Agama Islam',
          angkatan: '2024',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setAllUsers((prev) => [fallbackProfile, ...prev]);
        setCurrentUid(fbUid);
        return { success: true, role: 'member' };
      } catch (authErr: any) {
        if (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential') {
          return { success: false, message: 'Kata sandi atau email salah. Silakan periksa kembali.' };
        }
        console.warn('Firebase login note, checking database store:', authErr.code);
      }
    }

    // 2. Check local users or Firestore collection directly
    let found = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found && db) {
      try {
        const qSnap = await getDocs(collection(db, 'users'));
        const fireUsers: UserProfile[] = [];
        qSnap.forEach((d) => fireUsers.push(d.data() as UserProfile));
        if (fireUsers.length > 0) {
          setAllUsers(fireUsers);
          found = fireUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        }
      } catch (e) {}
    }

    if (found) {
      if (password && found.password && found.password !== password) {
        return { success: false, message: 'Kata sandi salah. Silakan coba lagi.' };
      }
      if (found.membershipStatus === 'rejected') {
        return { success: false, message: 'Pendaftaran akun Anda ditolak. Hubungi pengurus.' };
      }
      setCurrentUid(found.uid);
      return { success: true, role: found.role };
    }

    return {
      success: false,
      message: 'Email tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu.'
    };
  };

  const register = async (
    data: Omit<UserProfile, 'uid' | 'membershipStatus' | 'createdAt' | 'updatedAt'> & { role?: UserRole }
  ): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      let uid = `user-${Date.now()}`;

      // 1. Create user in Firebase Authentication
      if (auth && data.password) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
          uid = userCred.user.uid;
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            return {
              success: false,
              message: 'Email sudah terdaftar. Silakan masuk menggunakan email dan password Anda.'
            };
          } else if (authErr.code === 'auth/weak-password') {
            return {
              success: false,
              message: 'Kata sandi minimal 6 karakter.'
            };
          } else if (authErr.code === 'auth/invalid-email') {
            return {
              success: false,
              message: 'Format alamat email tidak valid.'
            };
          }
          console.warn('Firebase Auth note:', authErr.message);
        }
      }

      // Check existing in local cache
      const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing && existing.uid !== uid) {
        return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' };
      }

      const newUser: UserProfile = {
        ...data,
        email: cleanEmail,
        uid,
        role: data.role || 'member',
        membershipStatus: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 2. Save directly to Firestore database 'users'
      if (db) {
        try {
          await setDoc(doc(db, 'users', uid), newUser);
          console.log('User profile successfully saved to Firestore:', uid);
        } catch (dbErr: any) {
          console.warn('Firestore user save note:', dbErr);
        }
      }

      // 3. Update local state and auto-login
      setAllUsers((prev) => [newUser, ...prev.filter((u) => u.uid !== uid)]);
      setCurrentUid(uid);

      return {
        success: true,
        message: 'Pendaftaran berhasil! Akun Anda telah aktif dan tersimpan di database.',
        role: newUser.role
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Pendaftaran gagal. Silakan coba kembali.'
      };
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {}
    }
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
    updateUserProfile(uid, { membershipStatus: 'approved' });
  };

  const rejectMember = (uid: string) => {
    updateUserProfile(uid, { membershipStatus: 'rejected' });
  };

  const deleteMember = async (uid: string) => {
    setAllUsers((prev) => prev.filter((u) => u.uid !== uid));
    if (db) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        console.log('Member deleted from Firestore:', uid);
      } catch (e) {
        console.warn('Firestore delete user error:', e);
      }
    }
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

    // Save directly to Firestore collection 'memorizationSubmissions'
    if (db) {
      try {
        await setDoc(doc(db, 'memorizationSubmissions', newSub.id), newSub);
        console.log('Memorization submission saved to Firestore:', newSub.id);
      } catch (e) {
        console.warn('Firestore submission save error:', e);
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
    const updatePayload = {
      status,
      fluencyScore: scores.fluency,
      tajwidScore: scores.tajwid,
      makhrajScore: scores.makhraj,
      feedback,
      reviewedAt,
      reviewedBy: currentUser?.uid || 'admin'
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, ...updatePayload } : s))
    );

    // Save review update to Firestore
    if (db) {
      try {
        await updateDoc(doc(db, 'memorizationSubmissions', submissionId), updatePayload);
      } catch (e) {
        console.warn('Firestore review submission error:', e);
      }
    }

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

        const updatedProgress = {
          ...cur,
          totalAyahMemorized: newTotalAyah,
          totalJuzMemorized: newTotalJuz,
          verifiedSurahs: updatedSurahs,
          updatedAt: reviewedAt
        };

        if (db) {
          setDoc(doc(db, 'memorizationProgress', memberId), updatedProgress).catch(() => {});
        }

        return {
          ...prev,
          [memberId]: updatedProgress
        };
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'memorizationSubmissions', id));
        console.log('Submission deleted from Firestore:', id);
      } catch (e) {
        console.warn('Firestore delete submission error:', e);
      }
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

    if (db) {
      try {
        await setDoc(doc(db, 'activities', newAct.id), newAct);
      } catch (e) {
        console.warn('Firestore activity save note:', e);
      }
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'activities', id), {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'activities', id));
        console.log('Activity deleted from Firestore:', id);
      } catch (e) {
        console.warn('Firestore delete activity error:', e);
      }
    }
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

    if (db) {
      try {
        await setDoc(doc(db, 'attendanceSessions', session.id), session);
        console.log('Attendance session saved to Firestore:', session.id);
      } catch (e) {
        console.warn('Firestore session save error:', e);
      }
    }

    return session;
  };

  const closeAttendanceSession = async (sessionId: string) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'closed' } : s))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'attendanceSessions', sessionId), { status: 'closed' });
      } catch (e) {
        console.warn('Firestore close session error:', e);
      }
    }
  };

  const deleteAttendanceSession = async (sessionId: string) => {
    setAttendanceSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (db) {
      try {
        await deleteDoc(doc(db, 'attendanceSessions', sessionId));
        console.log('Attendance session deleted from Firestore:', sessionId);
      } catch (e) {
        console.warn('Firestore delete session error:', e);
      }
    }
  };

  const recordAttendance = async (
    sessionCode: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Harap masuk terlebih dahulu.' };

    const cleanCode = sessionCode.trim().toUpperCase();
    // Match by sessionCode or sessionTokenHash
    const session = attendanceSessions.find(
      (s) => s.sessionCode.toUpperCase() === cleanCode || s.sessionTokenHash.toUpperCase() === cleanCode
    );

    if (!session) {
      return { success: false, message: `Kode sesi "${cleanCode}" tidak ditemukan. Pastikan kode benar.` };
    }

    if (session.status === 'closed') {
      return { success: false, message: 'Sesi absensi ini telah ditutup oleh pembimbing.' };
    }

    const existing = attendanceRecords.find(
      (r) => r.sessionId === session.id && r.memberId === currentUser.uid
    );
    if (existing) {
      return { success: false, message: 'Anda sudah melakukan absensi untuk sesi kegiatan ini.' };
    }

    const now = new Date();
    const newRecord: AttendanceRecord = {
      id: `rec-${Date.now()}`,
      sessionId: session.id,
      activityId: session.activityId,
      activityTitle: session.activityTitle,
      memberId: currentUser.uid,
      memberName: currentUser.fullName,
      memberNim: currentUser.nim,
      checkInAt: now.toISOString(),
      verificationMethod: 'qr_scan',
      attendanceStatus: 'hadir',
      notes
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'attendanceRecords', newRecord.id), newRecord);
        console.log('Attendance record saved to Firestore:', newRecord.id);
      } catch (e) {
        console.warn('Firestore record attendance error:', e);
      }
    }

    return { success: true, message: `Alhamdulillah, absensi Anda untuk "${session.activityTitle}" berhasil dicatat!` };
  };

  const manualMarkAttendance = async (
    sessionId: string,
    memberId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa'
  ) => {
    const session = attendanceSessions.find((s) => s.id === sessionId);
    const member = allUsers.find((u) => u.uid === memberId);
    if (!session || !member) return;

    const existing = attendanceRecords.find(
      (r) => r.sessionId === sessionId && r.memberId === memberId
    );

    if (existing) {
      setAttendanceRecords((prev) =>
        prev.map((r) => (r.id === existing.id ? { ...r, attendanceStatus: status } : r))
      );
      if (db) {
        try {
          await updateDoc(doc(db, 'attendanceRecords', existing.id), { attendanceStatus: status });
        } catch (e) {}
      }
    } else {
      const rec: AttendanceRecord = {
        id: `rec-${Date.now()}`,
        sessionId,
        activityId: session.activityId,
        activityTitle: session.activityTitle,
        memberId,
        memberName: member.fullName,
        memberNim: member.nim,
        checkInAt: new Date().toISOString(),
        verificationMethod: 'manual',
        attendanceStatus: status
      };
      setAttendanceRecords((prev) => [rec, ...prev]);
      if (db) {
        try {
          await setDoc(doc(db, 'attendanceRecords', rec.id), rec);
        } catch (e) {}
      }
    }
  };

  // Donations & Funds
  const createDonation = async (
    data: Omit<Donation, 'id' | 'status' | 'createdAt' | 'memberName'>
  ) => {
    if (!currentUser) return;
    const newDon: Donation = {
      ...data,
      id: `don-${Date.now()}`,
      memberName: currentUser.fullName,
      status: 'menunggu_verifikasi',
      createdAt: new Date().toISOString()
    };
    setDonations((prev) => [newDon, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'donations', newDon.id), newDon);
      } catch (e) {
        console.warn('Firestore donation save note:', e);
      }
    }
  };

  const verifyDonation = async (donationId: string, approved: boolean) => {
    const target = donations.find((d) => d.id === donationId);
    if (!target) return;

    const newStatus: DonationStatus = approved ? 'terverifikasi' : 'ditolak';
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, status: newStatus } : d))
    );

    if (approved) {
      setDonationPrograms((prev) =>
        prev.map((p) =>
          p.id === target.programId
            ? { ...p, collectedAmount: p.collectedAmount + target.amount }
            : p
        )
      );
    }
  };

  const deleteDonation = async (id: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'donations', id));
        console.log('Donation deleted from Firestore:', id);
      } catch (e) {
        console.warn('Firestore delete donation error:', e);
      }
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

    if (db) {
      try {
        await setDoc(doc(db, 'donationPrograms', newProgram.id), newProgram);
        console.log('Donation program saved to Firestore:', newProgram.id);
      } catch (e) {
        console.warn('Firestore donation program save error:', e);
      }
    }
  };

  const deleteDonationProgram = async (id: string) => {
    setDonationPrograms((prev) => prev.filter((p) => p.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'donationPrograms', id));
        console.log('Donation program deleted from Firestore:', id);
      } catch (e) {
        console.warn('Firestore delete donation program error:', e);
      }
    }
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
        deleteMember,
        submissions,
        memberSubmissions,
        progress,
        submitMemorization,
        reviewSubmission,
        deleteSubmission,
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
        deleteAttendanceSession,
        recordAttendance,
        manualMarkAttendance,
        donationPrograms,
        donations,
        memberDonations,
        disbursements,
        createDonation,
        verifyDonation,
        deleteDonation,
        createDonationProgram,
        deleteDonationProgram,
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
