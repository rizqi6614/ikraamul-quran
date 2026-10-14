import { SurahMeta, SurahDetail } from '@/types';

// Complete list of all 114 Surahs in the Holy Qur'an
export const SURAH_LIST: SurahMeta[] = [
  { number: 1, name: 'Al-Fatihah', nameArabic: 'الفاتحة', translation: 'Pembukaan', revelation: 'Makkiyah', numberOfAyahs: 7, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/001.mp3' },
  { number: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', translation: 'Sapi Betina', revelation: 'Madaniyah', numberOfAyahs: 286, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/002.mp3' },
  { number: 3, name: 'Ali \'Imran', nameArabic: 'آل عمران', translation: 'Keluarga Imran', revelation: 'Madaniyah', numberOfAyahs: 200, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/003.mp3' },
  { number: 4, name: 'An-Nisa\'', nameArabic: 'النساء', translation: 'Wanita', revelation: 'Madaniyah', numberOfAyahs: 176, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/004.mp3' },
  { number: 5, name: 'Al-Ma\'idah', nameArabic: 'المائدة', translation: 'Jamuan Hidangan', revelation: 'Madaniyah', numberOfAyahs: 120, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/005.mp3' },
  { number: 6, name: 'Al-An\'am', nameArabic: 'الأنعام', translation: 'Hewan Ternak', revelation: 'Makkiyah', numberOfAyahs: 165, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/006.mp3' },
  { number: 7, name: 'Al-A\'raf', nameArabic: 'الأعراف', translation: 'Tempat Tertinggi', revelation: 'Makkiyah', numberOfAyahs: 206, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/007.mp3' },
  { number: 8, name: 'Al-Anfal', nameArabic: 'الأنفال', translation: 'Harta Rampasan Perang', revelation: 'Madaniyah', numberOfAyahs: 75, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/008.mp3' },
  { number: 9, name: 'At-Taubah', nameArabic: 'التوبة', translation: 'Pengampunan', revelation: 'Madaniyah', numberOfAyahs: 129, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/009.mp3' },
  { number: 10, name: 'Yunus', nameArabic: 'يونس', translation: 'Nabi Yunus', revelation: 'Makkiyah', numberOfAyahs: 109, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/010.mp3' },
  { number: 11, name: 'Hud', nameArabic: 'هود', translation: 'Nabi Hud', revelation: 'Makkiyah', numberOfAyahs: 123, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/011.mp3' },
  { number: 12, name: 'Yusuf', nameArabic: 'يوسف', translation: 'Nabi Yusuf', revelation: 'Makkiyah', numberOfAyahs: 111, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/012.mp3' },
  { number: 13, name: 'Ar-Ra\'d', nameArabic: 'الرعد', translation: 'Guruh', revelation: 'Madaniyah', numberOfAyahs: 43, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/013.mp3' },
  { number: 14, name: 'Ibrahim', nameArabic: 'إبراهيم', translation: 'Nabi Ibrahim', revelation: 'Makkiyah', numberOfAyahs: 52, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/014.mp3' },
  { number: 15, name: 'Al-Hijr', nameArabic: 'الحجر', translation: 'Negeri Kaum Tsamud', revelation: 'Makkiyah', numberOfAyahs: 99, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/015.mp3' },
  { number: 16, name: 'An-Nahl', nameArabic: 'النحل', translation: 'Lebah', revelation: 'Makkiyah', numberOfAyahs: 128, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/016.mp3' },
  { number: 17, name: 'Al-Isra\'', nameArabic: 'الإسراء', translation: 'Perjalanan Malam', revelation: 'Makkiyah', numberOfAyahs: 111, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/017.mp3' },
  { number: 18, name: 'Al-Kahf', nameArabic: 'الكهف', translation: 'Gua', revelation: 'Makkiyah', numberOfAyahs: 110, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/018.mp3' },
  { number: 19, name: 'Maryam', nameArabic: 'مريم', translation: 'Maryam', revelation: 'Makkiyah', numberOfAyahs: 98, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/019.mp3' },
  { number: 20, name: 'Taha', nameArabic: 'طه', translation: 'Taha', revelation: 'Makkiyah', numberOfAyahs: 135, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/020.mp3' },
  { number: 21, name: 'Al-Anbiya\'', nameArabic: 'الأنبياء', translation: 'Para Nabi', revelation: 'Makkiyah', numberOfAyahs: 112, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/021.mp3' },
  { number: 22, name: 'Al-Hajj', nameArabic: 'الحج', translation: 'Haji', revelation: 'Madaniyah', numberOfAyahs: 78, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/022.mp3' },
  { number: 23, name: 'Al-Mu\'minun', nameArabic: 'المؤمنون', translation: 'Orang-Orang Mukmin', revelation: 'Makkiyah', numberOfAyahs: 118, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/023.mp3' },
  { number: 24, name: 'An-Nur', nameArabic: 'النور', translation: 'Cahaya', revelation: 'Madaniyah', numberOfAyahs: 64, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/024.mp3' },
  { number: 25, name: 'Al-Furqan', nameArabic: 'الفرقان', translation: 'Pembeda', revelation: 'Makkiyah', numberOfAyahs: 77, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/025.mp3' },
  { number: 26, name: 'Asy-Syu\'ara\'', nameArabic: 'الشعراء', translation: 'Penyair', revelation: 'Makkiyah', numberOfAyahs: 227, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/026.mp3' },
  { number: 27, name: 'An-Naml', nameArabic: 'النمل', translation: 'Semut', revelation: 'Makkiyah', numberOfAyahs: 93, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/027.mp3' },
  { number: 28, name: 'Al-Qasas', nameArabic: 'القصص', translation: 'Kisah-Kisah', revelation: 'Makkiyah', numberOfAyahs: 88, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/028.mp3' },
  { number: 29, name: 'Al-\'Ankabut', nameArabic: 'العنكبوت', translation: 'Laba-Laba', revelation: 'Makkiyah', numberOfAyahs: 69, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/029.mp3' },
  { number: 30, name: 'Ar-Rum', nameArabic: 'الروم', translation: 'Bangsa Romawi', revelation: 'Makkiyah', numberOfAyahs: 60, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/030.mp3' },
  { number: 31, name: 'Luqman', nameArabic: 'لقمان', translation: 'Luqman', revelation: 'Makkiyah', numberOfAyahs: 34, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/031.mp3' },
  { number: 32, name: 'As-Sajdah', nameArabic: 'السجدة', translation: 'Sujud', revelation: 'Makkiyah', numberOfAyahs: 30, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/032.mp3' },
  { number: 33, name: 'Al-Ahzab', nameArabic: 'الأحزاب', translation: 'Golongan yang Bersekutu', revelation: 'Madaniyah', numberOfAyahs: 73, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/033.mp3' },
  { number: 34, name: 'Saba\'', nameArabic: 'سبأ', translation: 'Kaum Saba\'', revelation: 'Makkiyah', numberOfAyahs: 54, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/034.mp3' },
  { number: 35, name: 'Fatir', nameArabic: 'فاطر', translation: 'Pencipta', revelation: 'Makkiyah', numberOfAyahs: 45, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/035.mp3' },
  { number: 36, name: 'Yasin', nameArabic: 'يس', translation: 'Yasin', revelation: 'Makkiyah', numberOfAyahs: 83, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/036.mp3' },
  { number: 37, name: 'As-Saffat', nameArabic: 'الصافات', translation: 'Barisan-Barisan', revelation: 'Makkiyah', numberOfAyahs: 182, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/037.mp3' },
  { number: 38, name: 'Sad', nameArabic: 'ص', translation: 'Sad', revelation: 'Makkiyah', numberOfAyahs: 88, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/038.mp3' },
  { number: 39, name: 'Az-Zumar', nameArabic: 'الزمر', translation: 'Rombongan-Rombongan', revelation: 'Makkiyah', numberOfAyahs: 75, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/039.mp3' },
  { number: 40, name: 'Gafir', nameArabic: 'غافر', translation: 'Maha Pengampun', revelation: 'Makkiyah', numberOfAyahs: 85, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/040.mp3' },
  { number: 41, name: 'Fussilat', nameArabic: 'فصلت', translation: 'Yang Dijelaskan', revelation: 'Makkiyah', numberOfAyahs: 54, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/041.mp3' },
  { number: 42, name: 'Asy-Syura', nameArabic: 'الشورى', translation: 'Musyawarah', revelation: 'Makkiyah', numberOfAyahs: 53, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/042.mp3' },
  { number: 43, name: 'Az-Zukhruf', nameArabic: 'الزخرف', translation: 'Perhiasan Emas', revelation: 'Makkiyah', numberOfAyahs: 89, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/043.mp3' },
  { number: 44, name: 'Ad-Dukhan', nameArabic: 'الدخان', translation: 'Kabut Asap', revelation: 'Makkiyah', numberOfAyahs: 59, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/044.mp3' },
  { number: 45, name: 'Al-Jasiyah', nameArabic: 'الجاثية', translation: 'Yang Berlutut', revelation: 'Makkiyah', numberOfAyahs: 37, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/045.mp3' },
  { number: 46, name: 'Al-Ahqaf', nameArabic: 'الأحقاف', translation: 'Bukit Pasir', revelation: 'Makkiyah', numberOfAyahs: 35, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/046.mp3' },
  { number: 47, name: 'Muhammad', nameArabic: 'محمد', translation: 'Nabi Muhammad', revelation: 'Madaniyah', numberOfAyahs: 38, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/047.mp3' },
  { number: 48, name: 'Al-Fath', nameArabic: 'الفتح', translation: 'Kemenangan', revelation: 'Madaniyah', numberOfAyahs: 29, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/048.mp3' },
  { number: 49, name: 'Al-Hujurat', nameArabic: 'الحجرات', translation: 'Kamar-Kamar', revelation: 'Madaniyah', numberOfAyahs: 18, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/049.mp3' },
  { number: 50, name: 'Qaf', nameArabic: 'ق', translation: 'Qaf', revelation: 'Makkiyah', numberOfAyahs: 45, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/050.mp3' },
  { number: 51, name: 'Az-Zariyat', nameArabic: 'الذاريات', translation: 'Angin yang Menerbangkan', revelation: 'Makkiyah', numberOfAyahs: 60, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/051.mp3' },
  { number: 52, name: 'At-Tur', nameArabic: 'الطور', translation: 'Bukit Tursina', revelation: 'Makkiyah', numberOfAyahs: 49, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/052.mp3' },
  { number: 53, name: 'An-Najm', nameArabic: 'النجم', translation: 'Bintang', revelation: 'Makkiyah', numberOfAyahs: 62, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/053.mp3' },
  { number: 54, name: 'Al-Qamar', nameArabic: 'القمر', translation: 'Bulan', revelation: 'Makkiyah', numberOfAyahs: 55, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/054.mp3' },
  { number: 55, name: 'Ar-Rahman', nameArabic: 'الرحمن', translation: 'Maha Pemurah', revelation: 'Madaniyah', numberOfAyahs: 78, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/055.mp3' },
  { number: 56, name: 'Al-Waqi\'ah', nameArabic: 'الواقعة', translation: 'Hari Kiamat', revelation: 'Makkiyah', numberOfAyahs: 96, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/056.mp3' },
  { number: 57, name: 'Al-Hadid', nameArabic: 'الحديد', translation: 'Besi', revelation: 'Madaniyah', numberOfAyahs: 29, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/057.mp3' },
  { number: 58, name: 'Al-Mujadilah', nameArabic: 'المجادلة', translation: 'Gugatan', revelation: 'Madaniyah', numberOfAyahs: 22, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/058.mp3' },
  { number: 59, name: 'Al-Hasyr', nameArabic: 'الحشر', translation: 'Pengusiran', revelation: 'Madaniyah', numberOfAyahs: 24, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/059.mp3' },
  { number: 60, name: 'Al-Mumtahanah', nameArabic: 'الممتحنة', translation: 'Wanita yang Diuji', revelation: 'Madaniyah', numberOfAyahs: 13, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/060.mp3' },
  { number: 61, name: 'As-Saff', nameArabic: 'الصف', translation: 'Barisan', revelation: 'Madaniyah', numberOfAyahs: 14, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/061.mp3' },
  { number: 62, name: 'Al-Jumu\'ah', nameArabic: 'الجمعة', translation: 'Hari Jumat', revelation: 'Madaniyah', numberOfAyahs: 11, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/062.mp3' },
  { number: 63, name: 'Al-Munafiqun', nameArabic: 'المنافقون', translation: 'Orang-Orang Munafik', revelation: 'Madaniyah', numberOfAyahs: 11, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/063.mp3' },
  { number: 64, name: 'At-Tagabun', nameArabic: 'التغابن', translation: 'Hari Ditampakkannya Kesalahan', revelation: 'Madaniyah', numberOfAyahs: 18, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/064.mp3' },
  { number: 65, name: 'At-Talaq', nameArabic: 'الطلاق', translation: 'Talak', revelation: 'Madaniyah', numberOfAyahs: 12, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/065.mp3' },
  { number: 66, name: 'At-Tahrim', nameArabic: 'التحريم', translation: 'Pengharaman', revelation: 'Madaniyah', numberOfAyahs: 12, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/066.mp3' },
  { number: 67, name: 'Al-Mulk', nameArabic: 'الملك', translation: 'Kerajaan', revelation: 'Makkiyah', numberOfAyahs: 30, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/067.mp3' },
  { number: 68, name: 'Al-Qalam', nameArabic: 'القلم', translation: 'Pena', revelation: 'Makkiyah', numberOfAyahs: 52, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/068.mp3' },
  { number: 69, name: 'Al-Haqqah', nameArabic: 'الحاقة', translation: 'Hari Kiamat yang Pasti', revelation: 'Makkiyah', numberOfAyahs: 52, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/069.mp3' },
  { number: 70, name: 'Al-Ma\'arij', nameArabic: 'المعارج', translation: 'Tempat Naik', revelation: 'Makkiyah', numberOfAyahs: 44, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/070.mp3' },
  { number: 71, name: 'Nuh', nameArabic: 'نوح', translation: 'Nabi Nuh', revelation: 'Makkiyah', numberOfAyahs: 28, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/071.mp3' },
  { number: 72, name: 'Al-Jinn', nameArabic: 'الجن', translation: 'Jin', revelation: 'Makkiyah', numberOfAyahs: 28, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/072.mp3' },
  { number: 73, name: 'Al-Muzzammil', nameArabic: 'المزمل', translation: 'Orang yang Berselimut', revelation: 'Makkiyah', numberOfAyahs: 20, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/073.mp3' },
  { number: 74, name: 'Al-Muddassir', nameArabic: 'المدثر', translation: 'Orang yang Berkemul', revelation: 'Makkiyah', numberOfAyahs: 56, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/074.mp3' },
  { number: 75, name: 'Al-Qiyamah', nameArabic: 'القيامة', translation: 'Hari Kiamat', revelation: 'Makkiyah', numberOfAyahs: 40, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/075.mp3' },
  { number: 76, name: 'Al-Insan', nameArabic: 'الإنسان', translation: 'Manusia', revelation: 'Madaniyah', numberOfAyahs: 31, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/076.mp3' },
  { number: 77, name: 'Al-Mursalat', nameArabic: 'المرسلات', translation: 'Malaikat yang Diutus', revelation: 'Makkiyah', numberOfAyahs: 50, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/077.mp3' },
  { number: 78, name: 'An-Naba\'', nameArabic: 'النبأ', translation: 'Berita Besar', revelation: 'Makkiyah', numberOfAyahs: 40, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/078.mp3' },
  { number: 79, name: 'An-Nazi\'at', nameArabic: 'النازعات', translation: 'Malaikat Pencabut Roh', revelation: 'Makkiyah', numberOfAyahs: 46, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/079.mp3' },
  { number: 80, name: '\'Abasa', nameArabic: 'عبس', translation: 'Ia Bermuka Masam', revelation: 'Makkiyah', numberOfAyahs: 42, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/080.mp3' },
  { number: 81, name: 'At-Takwir', nameArabic: 'التكوير', translation: 'Menggulung', revelation: 'Makkiyah', numberOfAyahs: 29, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/081.mp3' },
  { number: 82, name: 'Al-Infitar', nameArabic: 'الانفطار', translation: 'Terbelah', revelation: 'Makkiyah', numberOfAyahs: 19, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/082.mp3' },
  { number: 83, name: 'Al-Mutaffifin', nameArabic: 'المطففين', translation: 'Orang-Orang yang Curang', revelation: 'Makkiyah', numberOfAyahs: 36, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/083.mp3' },
  { number: 84, name: 'Al-Insyiqaq', nameArabic: 'الانشقاق', translation: 'Terbelah', revelation: 'Makkiyah', numberOfAyahs: 25, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/084.mp3' },
  { number: 85, name: 'Al-Buruj', nameArabic: 'البروج', translation: 'Gugusan Bintang', revelation: 'Makkiyah', numberOfAyahs: 22, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/085.mp3' },
  { number: 86, name: 'At-Tariq', nameArabic: 'الطارق', translation: 'Yang Datang di Malam Hari', revelation: 'Makkiyah', numberOfAyahs: 17, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/086.mp3' },
  { number: 87, name: 'Al-A\'la', nameArabic: 'الأعلى', translation: 'Maha Tinggi', revelation: 'Makkiyah', numberOfAyahs: 19, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/087.mp3' },
  { number: 88, name: 'Al-Gasyiyah', nameArabic: 'الغاشية', translation: 'Hari Pembalasan', revelation: 'Makkiyah', numberOfAyahs: 26, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/088.mp3' },
  { number: 89, name: 'Al-Fajr', nameArabic: 'الفجر', translation: 'Fajar', revelation: 'Makkiyah', numberOfAyahs: 30, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/089.mp3' },
  { number: 90, name: 'Al-Balad', nameArabic: 'البلد', translation: 'Negeri', revelation: 'Makkiyah', numberOfAyahs: 20, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/090.mp3' },
  { number: 91, name: 'Asy-Syams', nameArabic: 'الشمس', translation: 'Matahari', revelation: 'Makkiyah', numberOfAyahs: 15, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/091.mp3' },
  { number: 92, name: 'Al-Lail', nameArabic: 'الليل', translation: 'Malam', revelation: 'Makkiyah', numberOfAyahs: 21, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/092.mp3' },
  { number: 93, name: 'Ad-Duha', nameArabic: 'الضحى', translation: 'Waktu Duha', revelation: 'Makkiyah', numberOfAyahs: 11, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/093.mp3' },
  { number: 94, name: 'Asy-Syarh', nameArabic: 'الشرح', translation: 'Kelapangan', revelation: 'Makkiyah', numberOfAyahs: 8, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/094.mp3' },
  { number: 95, name: 'At-Tin', nameArabic: 'التين', translation: 'Buah Tin', revelation: 'Makkiyah', numberOfAyahs: 8, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/095.mp3' },
  { number: 96, name: 'Al-\'Alaq', nameArabic: 'العلق', translation: 'Segumpal Darah', revelation: 'Makkiyah', numberOfAyahs: 19, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/096.mp3' },
  { number: 97, name: 'Al-Qadr', nameArabic: 'القدر', translation: 'Kemuliaan', revelation: 'Makkiyah', numberOfAyahs: 5, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/097.mp3' },
  { number: 98, name: 'Al-Bayyinah', nameArabic: 'البيّنة', translation: 'Bukti Nyata', revelation: 'Madaniyah', numberOfAyahs: 8, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/098.mp3' },
  { number: 99, name: 'Az-Zalzalah', nameArabic: 'الزلزلة', translation: 'Goncangan', revelation: 'Madaniyah', numberOfAyahs: 8, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/099.mp3' },
  { number: 100, name: 'Al-\'Adiyat', nameArabic: 'العاديات', translation: 'Kuda Perang Berlari Kencang', revelation: 'Makkiyah', numberOfAyahs: 11, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/100.mp3' },
  { number: 101, name: 'Al-Qari\'ah', nameArabic: 'القارعة', translation: 'Hari Kiamat yang Mengguncang', revelation: 'Makkiyah', numberOfAyahs: 11, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/101.mp3' },
  { number: 102, name: 'At-Takasur', nameArabic: 'التكاثر', translation: 'Bermegah-Megahan', revelation: 'Makkiyah', numberOfAyahs: 8, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/102.mp3' },
  { number: 103, name: 'Al-\'Asr', nameArabic: 'العصر', translation: 'Masa', revelation: 'Makkiyah', numberOfAyahs: 3, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/103.mp3' },
  { number: 104, name: 'Al-Humazah', nameArabic: 'الهمزة', translation: 'Pengumpat', revelation: 'Makkiyah', numberOfAyahs: 9, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/104.mp3' },
  { number: 105, name: 'Al-Fil', nameArabic: 'الفيل', translation: 'Gajah', revelation: 'Makkiyah', numberOfAyahs: 5, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/105.mp3' },
  { number: 106, name: 'Quraisy', nameArabic: 'قريش', translation: 'Suku Quraisy', revelation: 'Makkiyah', numberOfAyahs: 4, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/106.mp3' },
  { number: 107, name: 'Al-Ma\'un', nameArabic: 'الماعون', translation: 'Barang-Barang Berguna', revelation: 'Makkiyah', numberOfAyahs: 7, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/107.mp3' },
  { number: 108, name: 'Al-Kausar', nameArabic: 'الكوثر', translation: 'Nikmat yang Banyak', revelation: 'Makkiyah', numberOfAyahs: 3, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/108.mp3' },
  { number: 109, name: 'Al-Kafirun', nameArabic: 'الكافرون', translation: 'Orang-Orang Kafir', revelation: 'Makkiyah', numberOfAyahs: 6, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/109.mp3' },
  { number: 110, name: 'An-Nasr', nameArabic: 'النصر', translation: 'Pertolongan', revelation: 'Madaniyah', numberOfAyahs: 3, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/110.mp3' },
  { number: 111, name: 'Al-Lahab', nameArabic: 'اللهب', translation: 'Gejolak Api', revelation: 'Makkiyah', numberOfAyahs: 5, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/111.mp3' },
  { number: 112, name: 'Al-Ikhlas', nameArabic: 'الإخلاص', translation: 'Kemurnian Keesaan Allah', revelation: 'Makkiyah', numberOfAyahs: 4, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/112.mp3' },
  { number: 113, name: 'Al-Falaq', nameArabic: 'الفلق', translation: 'Waktu Subuh', revelation: 'Makkiyah', numberOfAyahs: 5, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/113.mp3' },
  { number: 114, name: 'An-Nas', nameArabic: 'الناس', translation: 'Manusia', revelation: 'Makkiyah', numberOfAyahs: 6, audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/114.mp3' }
];

// Offline fallback for Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas
export const OFFLINE_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    name: 'Al-Fatihah',
    nameArabic: 'الفاتحة',
    translation: 'Pembukaan',
    revelation: 'Makkiyah',
    numberOfAyahs: 7,
    audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/001.mp3',
    bismillah: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang'
    },
    ayahs: [
      {
        number: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3'
      },
      {
        number: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translation: 'Segala puji bagi Allah, Tuhan seluruh alam,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001002.mp3'
      },
      {
        number: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'Yang Maha Pengasih, Maha Penyayang,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001003.mp3'
      },
      {
        number: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        translation: 'Pemilik hari pembalasan.',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001004.mp3'
      },
      {
        number: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001005.mp3'
      },
      {
        number: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translation: 'Tunjukilah kami jalan yang lurus,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001006.mp3'
      },
      {
        number: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001007.mp3'
      }
    ]
  },
  112: {
    number: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    translation: 'Kemurnian Keesaan Allah',
    revelation: 'Makkiyah',
    numberOfAyahs: 4,
    audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/112.mp3',
    bismillah: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang'
    },
    ayahs: [
      {
        number: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/112001.mp3'
      },
      {
        number: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        translation: 'Allah tempat meminta segala sesuatu.',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/112002.mp3'
      },
      {
        number: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translation: '(Allah) tidak beranak dan tidak pula diperanakkan,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/112003.mp3'
      },
      {
        number: 4,
        arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
        translation: 'dan tidak ada sesuatu yang setara dengan Dia.',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/112004.mp3'
      }
    ]
  },
  113: {
    number: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    translation: 'Waktu Subuh',
    revelation: 'Makkiyah',
    numberOfAyahs: 5,
    audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/113.mp3',
    bismillah: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang'
    },
    ayahs: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/113001.mp3'
      },
      {
        number: 2,
        arabic: 'مِنْ شَرِّ مَا خَلَقَ',
        translation: 'dari kejahatan (makhluk yang) Dia ciptakan,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/113002.mp3'
      },
      {
        number: 3,
        arabic: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        translation: 'dan dari kejahatan malam apabila telah gelap gulita,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/113003.mp3'
      },
      {
        number: 4,
        arabic: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        translation: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/113004.mp3'
      },
      {
        number: 5,
        arabic: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        translation: 'dan dari kejahatan orang yang dengki apabila dia dengki."',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/113005.mp3'
      }
    ]
  },
  114: {
    number: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    translation: 'Manusia',
    revelation: 'Makkiyah',
    numberOfAyahs: 6,
    audioFull: 'https://equran.nos.jkt-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/114.mp3',
    bismillah: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang'
    },
    ayahs: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/114001.mp3'
      },
      {
        number: 2,
        arabic: 'مَلِكِ النَّاسِ',
        translation: 'Raja manusia,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/114002.mp3'
      },
      {
        number: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        translation: 'sembahan manusia,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/114003.mp3'
      },
      {
        number: 4,
        arabic: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translation: 'dari kejahatan (bisikan) setan yang bersembunyi,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/114004.mp3'
      },
      {
        number: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        translation: 'yang membisikkan (kejahatan) ke dalam dada manusia,',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/114005.mp3'
      },
      {
        number: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        translation: 'dari (golongan) jin dan manusia."',
        audio: 'https://equran.nos.jkt-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/114006.mp3'
      }
    ]
  }
};

/**
 * Fetch surah detail from official Indonesian Quran API with offline cache & fallback
 */
export async function getSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const cacheKey = `iq_quran_surah_${surahNumber}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // ignore parse error and refetch
    }
  }

  // Check offline pre-bundled
  if (OFFLINE_SURAHS[surahNumber]) {
    return OFFLINE_SURAHS[surahNumber];
  }

  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!res.ok) throw new Error('Network response not ok');
    const json = await res.json();
    const data = json.data;

    const surahMeta = SURAH_LIST.find((s) => s.number === surahNumber);

    const surahDetail: SurahDetail = {
      number: data.nomor,
      name: data.namaLatin,
      nameArabic: data.nama,
      translation: data.arti,
      revelation: data.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah',
      numberOfAyahs: data.jumlahAyat,
      audioFull: data.audioFull ? ((data.audioFull['05'] || Object.values(data.audioFull)[0]) as string) : surahMeta?.audioFull,
      bismillah: surahNumber !== 9 ? {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang'
      } : undefined,
      ayahs: data.ayat.map((item: any) => ({
        number: item.nomorAyat,
        arabic: item.teksArab,
        latin: item.teksLatin,
        translation: item.teksIndonesia,
        audio: item.audio ? ((item.audio['05'] || Object.values(item.audio)[0]) as string) : undefined
      }))
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(surahDetail));
    } catch (storageError) {
      console.warn('Storage quota exceeded, caching skipped');
    }

    return surahDetail;
  } catch (error) {
    console.warn(`Failed to fetch surah ${surahNumber} from network, generating fallback view`, error);
    const meta = SURAH_LIST.find((s) => s.number === surahNumber) || SURAH_LIST[0];
    return {
      number: meta.number,
      name: meta.name,
      nameArabic: meta.nameArabic,
      translation: meta.translation,
      revelation: meta.revelation,
      numberOfAyahs: meta.numberOfAyahs,
      audioFull: meta.audioFull,
      bismillah: meta.number !== 9 ? {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang'
      } : undefined,
      ayahs: Array.from({ length: meta.numberOfAyahs }).map((_, i) => ({
        number: i + 1,
        arabic: `بِسْمِ اللَّهِ - آية ${i + 1}`,
        translation: `Ayat ${i + 1} dari surah ${meta.name}. Sambungkan koneksi internet untuk memuat teks lengkap secara otomatis.`
      }))
    };
  }
}
