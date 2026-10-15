import { MemorizationSubmission } from '@/types';

export interface JuzBoundary {
  juz: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  name: string; // e.g. "Al-Fatihah 1 - Al-Baqarah 141"
}

export const JUZ_BOUNDARIES: JuzBoundary[] = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, name: 'Al-Fatihah 1 — Al-Baqarah 141' },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, name: 'Al-Baqarah 142 — Al-Baqarah 252' },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, name: 'Al-Baqarah 253 — Ali \'Imran 92' },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, name: 'Ali \'Imran 93 — An-Nisa\' 23' },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, name: 'An-Nisa\' 24 — An-Nisa\' 147' },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, name: 'An-Nisa\' 148 — Al-Ma\'idah 81' },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, name: 'Al-Ma\'idah 82 — Al-An\'am 110' },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, name: 'Al-An\'am 111 — Al-A\'raf 87' },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, name: 'Al-A\'raf 88 — Al-Anfal 40' },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, name: 'Al-Anfal 41 — At-Taubah 92' },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, name: 'At-Taubah 93 — Hud 5' },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, name: 'Hud 6 — Yusuf 52' },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, name: 'Yusuf 53 — Ibrahim 52' },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, name: 'Al-Hijr 1 — An-Nahl 128' },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, name: 'Al-Isra\' 1 — Al-Kahf 74' },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, name: 'Al-Kahf 75 — Taha 135' },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, name: 'Al-Anbiya\' 1 — Al-Hajj 78' },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, name: 'Al-Mu\'minun 1 — Al-Furqan 20' },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, name: 'Al-Furqan 21 — An-Naml 55' },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, name: 'An-Naml 56 — Al-\'Ankabut 45' },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, name: 'Al-\'Ankabut 46 — Al-Ahzab 30' },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, name: 'Al-Ahzab 31 — Yasin 27' },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, name: 'Yasin 28 — Az-Zumar 31' },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, name: 'Az-Zumar 32 — Fussilat 46' },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, name: 'Fussilat 47 — Al-Jasiyah 37' },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, name: 'Al-Ahqaf 1 — Az-Zariyat 30' },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, name: 'Az-Zariyat 31 — Al-Hadid 29' },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, name: 'Al-Mujadilah 1 — At-Tahrim 12' },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, name: 'Al-Mulk 1 — Al-Mursalat 50' },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, name: 'An-Naba\' 1 — An-Nas 6 (Juz \'Amma)' }
];

/**
 * Memeriksa apakah surah dan nomor ayat berada di dalam rentang Juz tertentu
 */
export function isAyahInJuz(surah: number, ayah: number, b: JuzBoundary): boolean {
  if (surah < b.startSurah || surah > b.endSurah) return false;
  if (surah === b.startSurah && ayah < b.startAyah) return false;
  if (surah === b.endSurah && ayah > b.endAyah) return false;
  return true;
}

/**
 * Menemukan nomor Juz (1 - 30) untuk Surah dan Nomor Ayat tertentu
 */
export function getJuzForAyah(surah: number, ayah: number = 1): number {
  for (const b of JUZ_BOUNDARIES) {
    if (isAyahInJuz(surah, ayah, b)) {
      return b.juz;
    }
  }
  // Fallback estimasi jika di luar batas
  if (surah >= 78) return 30;
  if (surah >= 67) return 29;
  return 1;
}

/**
 * Memeriksa apakah suatu setoran hafalan termasuk ke dalam Juz tertentu
 */
export function isSubmissionInJuz(sub: MemorizationSubmission, juzNumber: number): boolean {
  const boundary = JUZ_BOUNDARIES.find((b) => b.juz === juzNumber);
  if (!boundary) return false;

  // Cek apakah startAyah atau endAyah berada di juz ini
  const startIn = isAyahInJuz(sub.surahNumber, sub.startAyah, boundary);
  const endIn = isAyahInJuz(sub.surahNumber, sub.endAyah, boundary);
  if (startIn || endIn) return true;

  // Cek jika seluruh rentang surah berada di dalam juz
  if (sub.surahNumber > boundary.startSurah && sub.surahNumber < boundary.endSurah) {
    return true;
  }

  return false;
}

export type JuzStatus = 'selesai' | 'proses' | 'belum';

export interface JuzDetailProgress {
  juz: number;
  boundary: JuzBoundary;
  status: JuzStatus;
  submissions: MemorizationSubmission[];
  verifiedAyahsCount: number;
}

/**
 * Menghitung status dan progres 30 Juz secara dinamis berdasarkan data setoran spesifik anggota
 */
export function calculateMemberJuzProgress(memberSubmissions: MemorizationSubmission[]): {
  juzDetails: JuzDetailProgress[];
  verifiedJuzList: number[];
  inProgressJuzList: number[];
  totalVerifiedAyahs: number;
  totalApprovedSubmissions: number;
} {
  const juzDetails: JuzDetailProgress[] = [];
  const verifiedJuzList: number[] = [];
  const inProgressJuzList: number[] = [];
  let totalVerifiedAyahs = 0;
  let totalApprovedSubmissions = 0;

  for (const b of JUZ_BOUNDARIES) {
    const subsInJuz = memberSubmissions.filter((sub) => isSubmissionInJuz(sub, b.juz));
    const approvedSubs = subsInJuz.filter((s) => s.status === 'diterima');
    const pendingSubs = subsInJuz.filter(
      (s) => s.status === 'menunggu' || s.status === 'sedang_diperiksa' || s.status === 'perlu_perbaikan'
    );

    let status: JuzStatus = 'belum';
    if (approvedSubs.length > 0) {
      status = 'selesai';
      verifiedJuzList.push(b.juz);
    } else if (pendingSubs.length > 0) {
      status = 'proses';
      inProgressJuzList.push(b.juz);
    }

    // Hitung jumlah ayat terverifikasi pada juz ini
    const juzVerifiedAyahs = approvedSubs.reduce((acc, curr) => {
      return acc + Math.abs(curr.endAyah - curr.startAyah) + 1;
    }, 0);

    juzDetails.push({
      juz: b.juz,
      boundary: b,
      status,
      submissions: subsInJuz,
      verifiedAyahsCount: juzVerifiedAyahs
    });
  }

  // Hitung total ayat yang telah disahkan
  const allApproved = memberSubmissions.filter((s) => s.status === 'diterima');
  totalApprovedSubmissions = allApproved.length;
  totalVerifiedAyahs = allApproved.reduce((acc, curr) => {
    return acc + Math.abs(curr.endAyah - curr.startAyah) + 1;
  }, 0);

  return {
    juzDetails,
    verifiedJuzList,
    inProgressJuzList,
    totalVerifiedAyahs,
    totalApprovedSubmissions
  };
}
