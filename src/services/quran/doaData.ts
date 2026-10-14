import { DoaItem } from '@/types';

export const DOA_CATEGORIES = [
  'Semua',
  'Doa Belajar',
  'Doa Harian',
  'Doa Masjid',
  'Doa Orang Tua',
  'Dzikir Pagi',
  'Dzikir Petang',
  'Dzikir Setelah Salat'
];

export const DOA_LIST: DoaItem[] = [
  {
    id: 'doa-1',
    category: 'Doa Belajar',
    title: 'Doa Sebelum Belajar Al-Qur\'an',
    arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا وَاجْعَلْنِي مِنَ الصَّالِحِينَ',
    transliteration: 'Rabbi zidnii \'ilman warzuqnii fahman waj\'alnii minash-shaalihiin.',
    translation: 'Ya Tuhanku, tambahkanlah ilmuku dan karuniakanlah aku kepahaman, serta jadikanlah aku termasuk golongan orang-orang yang shalih.',
    reference: 'Doa Ma\'tsur & QS. Thaha: 114',
    counterTarget: 1
  },
  {
    id: 'doa-2',
    category: 'Doa Belajar',
    title: 'Doa Memohon Kemudahan Menghafal Al-Qur\'an',
    arabic: 'اللَّهُمَّ نَوِّرْ بِكِتَابِكَ بَصَرِيْ وَاشْرَحْ بِهِ صَدْرِيْ وَاسْتَعْمِلْ بِهِ بَدَنِيْ وَأَطْلِقْ بِهِ لِسَانِيْ',
    transliteration: 'Allaahumma nawwir bikitaabika basharii, wasyrah bihii shadrii, wasta\'mil bihii badanii, wa athliq bihii lisaanii.',
    translation: 'Ya Allah, terangilah pandanganku dengan kitab-Mu, lapangkanlah dadaku dengannya, gerakkanlah badanku untuk mengamalkannya, dan fasihkanlah lisanku dengannya.',
    reference: 'Doa Tahfidz Para Ulama Salaf',
    counterTarget: 1
  },
  {
    id: 'doa-3',
    category: 'Doa Belajar',
    title: 'Doa Khatam Al-Qur\'an',
    arabic: 'اللَّهُمَّ ارْحَمْنَا بِالقُرْءَانِ وَاجْعَلْهُ لَنَا إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً',
    transliteration: 'Allaahummarhamnaa bil-qur\'aan, waj\'al-hu lanaa imaaman wa nuuran wa hudan wa rahmah.',
    translation: 'Ya Allah, rahmatilah kami dengan Al-Qur\'an. Jadikanlah ia bagi kami sebagai pemimpin, cahaya, petunjuk, dan rahmat.',
    reference: 'Doa Khatmil Qur\'an Riwayat Masyhur',
    counterTarget: 1
  },
  {
    id: 'doa-4',
    category: 'Doa Orang Tua',
    title: 'Doa untuk Kedua Orang Tua',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    translation: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah keduanya sebagaimana mereka mendidikku sewaktu kecil.',
    reference: 'QS. Al-Isra\': 24',
    counterTarget: 3
  },
  {
    id: 'doa-5',
    category: 'Doa Masjid',
    title: 'Doa Masuk Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allaahummaftah lii abwaaba rahmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    reference: 'HR. Muslim no. 713',
    counterTarget: 1
  },
  {
    id: 'doa-6',
    category: 'Doa Masjid',
    title: 'Doa Keluar Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allaahumma innii as-aluka min fadhlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon karunia-Mu.',
    reference: 'HR. Muslim no. 713',
    counterTarget: 1
  },
  {
    id: 'doa-7',
    category: 'Dzikir Setelah Salat',
    title: 'Istighfar dan Permohonan Keselamatan',
    arabic: 'أَسْتَغْفِرُ اللهَ (٣×) اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
    transliteration: 'Astaghfirullah (3x). Allaahumma antas-salaam wa minkas-salaam tabaarakta yaa dzal-jalaali wal-ikraam.',
    translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau Mahasejahtera dan dari-Mulah keselamatan. Mahaberkah Engkau wahai Rabb Pemilik keagungan dan kemuliaan.',
    reference: 'HR. Muslim no. 591',
    counterTarget: 3
  },
  {
    id: 'doa-8',
    category: 'Dzikir Setelah Salat',
    title: 'Tasbih, Tahmid, Takbir',
    arabic: 'سُبْحَانَ اللهِ (٣٣×) الحَمْدُ لِلَّهِ (٣٣×) اللهُ أَكْبَرُ (٣٣×)',
    transliteration: 'Subhaanallaah (33x), Alhamdulillah (33x), Allaahu Akbar (33x).',
    translation: 'Mahasuci Allah (33x), Segala puji bagi Allah (33x), Allah Mahabesar (33x).',
    reference: 'HR. Muslim no. 597',
    counterTarget: 33
  },
  {
    id: 'doa-9',
    category: 'Dzikir Pagi',
    title: 'Sayyidul Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    transliteration: 'Allaahumma anta Rabbii laa ilaaha illaa anta, khalaqtanii wa ana \'abduka, wa ana \'alaa \'ahdika wa wa\'dika mastatha\'tu, a\'uudzu bika min syarri maa shana\'tu, abuu-u laka bini\'matika \'alayya wa abuu-u bidzanbii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illaa anta.',
    translation: 'Ya Allah, Engkaulah Rabbku, tiada Tuhan selain Engkau. Engkaulah yang menciptakanku dan aku adalah hamba-Mu. Aku berada dalam perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang kuperbuat. Aku mengakui nikmat-Mu atasku dan aku mengakui dosaku, maka ampunilah aku karena sesungguhnya tidak ada yang mengampuni dosa selain Engkau.',
    reference: 'HR. Bukhari no. 6306',
    counterTarget: 1
  },
  {
    id: 'doa-10',
    category: 'Dzikir Petang',
    title: 'Doa Perlindungan di Waktu Petang',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (٣×)',
    transliteration: 'A\'uudzu bikalimaatillaahit-taammaati min syarri maa khalaq.',
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang Dia ciptakan (3x).',
    reference: 'HR. Muslim no. 2709',
    counterTarget: 3
  },
  {
    id: 'doa-11',
    category: 'Doa Harian',
    title: 'Doa Kebaikan Dunia dan Akhirat',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbanaa aatinaa fid-dunyaa hasanah wa fil-aakhirati hasanah wa qinaa \'adzaaban-naar.',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa neraka.',
    reference: 'QS. Al-Baqarah: 201',
    counterTarget: 1
  }
];
