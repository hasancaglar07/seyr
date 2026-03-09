import type {
  ContactSettings,
  HomeResponse,
  Presenter,
  Program,
  ScheduleEntry,
  Stream,
  Page,
} from "@seyir/contracts";

const now = new Date().toISOString();

export const mockStreams: Stream[] = [
  {
    id: "4f899e86-72f9-4d9a-a933-b3ce2f32c100",
    name: "Seyr FM",
    key: "seyr-fm",
    streamUrl: "https://sslyayin.netyayin.net/8024",
    coverImageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    isLive: true,
    orderNo: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "6f5291e9-9c70-4cc1-a9df-d6abf6b50a28",
    name: "Seyr Sohbet",
    key: "seyr-sohbet",
    streamUrl: "https://sslyayin.netyayin.net:10914/stream?type=http&nocache=20",
    coverImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    isLive: false,
    orderNo: 2,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockPresenters: Presenter[] = [
  {
    id: "68f6641e-57d4-4539-a790-73958f2f4100",
    slug: "ali-ramazan-dinc-efendi",
    fullName: "Ali Ramazan Dinç Efendi",
    bio: "Tasavvuf, irfan ve ahlak ekseninde sohbetler sunar.",
    avatarUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2959c8f8-8dc9-4ea6-8489-ec05a6f4f337",
    slug: "fatih-cinar",
    fullName: "Fatih Çınar",
    bio: "Hadisler ve dini eserler üzerine programlar yapar.",
    avatarUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3aaa1111-57d4-4539-a790-73958f2f4111",
    slug: "haci-hasan-efendi",
    fullName: "Hacı Hasan Efendi (k.s.)",
    bio: "İslam tarihi, sohbetler ve kalemden süzülen öğretiler.",
    avatarUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "4bbb1111-57d4-4539-a790-73958f2f4122",
    slug: "emin-ozalp",
    fullName: "Emin Özalp",
    bio: "Hz. Hüseyin ve İslami Tarih üzerine araştırmalar ve sohbetler yapar.",
    avatarUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "5ccc1111-57d4-4539-a790-73958f2f4133",
    slug: "mehmet-dura",
    fullName: "Mehmet Dura",
    bio: "Türk Musikisinde Dini Eserler sunumları yapar.",
    avatarUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  }
];

export const mockPrograms: Program[] = [
  {
    id: "c1ea9fcf-0b9a-4f35-913d-efafe0f4b8cc",
    slug: "hadislerle-islam",
    title: "HADİSLERLE İSLAM",
    summary: "Hadis metinleri üzerinden gündelik hayata rehberlik.",
    body: "Program boyunca temel hadis kaynaklarından seçilmiş metinler açıklanır.",
    coverImageUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "dd51ed34-fa94-4c4f-ae70-1d1f13abc2f6",
    slug: "kalbi-selim-sohbetleri",
    title: "KALB-İ SELİM SOHBETLERİ",
    summary: "Kalp terbiyesi, ahlak ve tasavvuf dersleri.",
    body: "İrfan geleneği çerçevesinde haftalık canlı sohbet serisi.",
    coverImageUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "aa11ed34-fa94-4c4f-ae70-1d1f13abc222",
    slug: "kalemdardan-sohbetler",
    title: "KALEMDARDAN SOHBETLER",
    summary: "Sohbetler ve tavsiyeler.",
    body: "Kalemdar dergisinden kesitler eşliğinde derinlemesine analiz.",
    coverImageUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "bb11ed34-fa94-4c4f-ae70-1d1f13abc333",
    slug: "hz-huseyin-ve-kerbela-faciasi",
    title: "HZ. HÜSEYİN ve KERBELA FACİASI",
    summary: "Kerbela ve İslami Tarih üzerine araştırmalar.",
    body: "Kerbela Faciası'nın detayları ve İslam tarihindeki etkileri.",
    coverImageUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cc11ed34-fa94-4c4f-ae70-1d1f13abc444",
    slug: "turk-musiliksinde-dini-eserler",
    title: "TÜRK MUSİKİSİNDE DİNİ ESERLER",
    summary: "Musiki ve Tasavvuf bir araya geliyor.",
    body: "Tarihten bugüne dini repertuvar üzerine açıklamalar.",
    coverImageUrl: "https://seyrdijital.com/HaberResimleri/1312022162215999.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  }
];

export const mockProgramPresenterMap: Record<string, string[]> = {
  "c1ea9fcf-0b9a-4f35-913d-efafe0f4b8cc": ["2959c8f8-8dc9-4ea6-8489-ec05a6f4f337"],
  "dd51ed34-fa94-4c4f-ae70-1d1f13abc2f6": ["68f6641e-57d4-4539-a790-73958f2f4100"],
  "aa11ed34-fa94-4c4f-ae70-1d1f13abc222": ["3aaa1111-57d4-4539-a790-73958f2f4111"],
  "bb11ed34-fa94-4c4f-ae70-1d1f13abc333": ["4bbb1111-57d4-4539-a790-73958f2f4122"],
  "cc11ed34-fa94-4c4f-ae70-1d1f13abc444": ["5ccc1111-57d4-4539-a790-73958f2f4133"],
};

export const mockSchedule: ScheduleEntry[] = [
  {
    id: "7c1caec0-1abc-4772-9301-97d7ef189501",
    dayOfWeek: 1,
    startsAt: "10:00",
    endsAt: "11:00",
    title: "KALB-İ SELİM SOHBETLERİ",
    presenterName: "Ali Ramazan Dinç Efendi",
    programId: "dd51ed34-fa94-4c4f-ae70-1d1f13abc2f6",
    isReplay: false,
  },
  {
    id: "e2360ca9-df3a-401a-8493-cf90d3ebd092",
    dayOfWeek: 2,
    startsAt: "11:00",
    endsAt: "12:00",
    title: "HADİSLERLE İSLAM",
    presenterName: "Fatih Çınar",
    programId: "c1ea9fcf-0b9a-4f35-913d-efafe0f4b8cc",
    isReplay: false,
  },
  {
    id: "cabf6c3d-5b75-46f6-b1f5-d66f95d46e5a",
    dayOfWeek: 5,
    startsAt: "20:00",
    endsAt: "21:00",
    title: "Canlı Sohbet Tekrar",
    presenterName: "Seyr Editör",
    programId: null,
    isReplay: true,
  },
];

export const mockPages: Page[] = [
  {
    id: "273f6366-263e-42e3-b3b9-a3b1743832ff",
    slug: "kurumsal",
    title: "Kurumsal",
    content:
      "SeyrDijital, tasavvuf ve kültür yayıncılığını dijitalde sürdürülebilir bir içerik altyapısıyla sunar. Vizyonumuz, sahih bilgi ile modern deneyimi buluşturmaktır.",
    seoDescription: "SeyrDijital kurumsal bilgi sayfası",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockContactSettings: ContactSettings = {
  id: "93fd3f66-e9fc-4f7d-95f7-88395afbf22b",
  phone: "0 212 635 83 95",
  email: "seyriletisim@abymedya.com",
  address: "Dervişali Mah. Uçbey Sok. No:7 Fatih/İstanbul",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7570192590106!2d28.934807115277817!3d41.03057157929845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caabe852281827%3A0xa663a57ef12365a4!2sSeyr%20Fm!5e0!3m2!1str!2str!4v1600703896700!5m2!1str!2str",
  whatsapp: "+905522321022",
  instagram: "https://www.instagram.com/seyrfmradyo/",
  youtube: "https://youtube.com/@seyrmedya",
  facebook: "https://tr-tr.facebook.com/seyrfmradyo",
  updatedAt: now,
};

export const mockAnnouncements: HomeResponse["announcements"] = [
  {
    id: "63f1be0a-6c86-4a76-81e8-f6387ee1aee4",
    title: "Yeni Dijital Platform Yakında",
    body: "SeyrDijital yeni nesil web ve mobil deneyimiyle yakında yayında.",
    startsAt: now,
    endsAt: null,
  },
];