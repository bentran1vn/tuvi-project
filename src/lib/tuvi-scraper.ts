const API_BASE = 'https://tuvi.vn/api/v1';

export interface SaoInfo {
  name: string;
  colorCode: string;
  status: string; // C = tốt, H = xấu
  doSang: string; // M, V, Đ, B, H or ''
  isSpecial: boolean;
}

export interface ChinhTinhInfo {
  name: string;
  amDuong: string; // + or -
  colorCode: string;
  doSang: string;
}

export interface CungData {
  index: number;
  cungName: string;
  cungSlug: string;
  diaChi: string;
  fullName: string;
  nguHanh: string;
  nguHanhColor: string;
  chinhTinh: ChinhTinhInfo[];
  phuTinh: SaoInfo[];
  daiVan: number;
  daiVanText: string;
  luuNien: string;
  trangSinh: string;
  khoiNguyetHan: string;
  viTri: string;
  isThan: boolean;
  hasTriet: boolean;
  hasTuan: boolean;
}

export interface ThienBanInfo {
  hoTen: string;
  solarDate: string;
  lunarDate: string;
  canChiFull: string;
  namSinh: number;
  gioSinh: string;
  amDuong: string;
  banMenh: string;
  cucFull: string;
  canLuong: string;
  menhChu: string;
  thanChu: string;
  namXem: string;
  laiNhanCung: string;
  gender: string;
}

export interface TuViData {
  thienBan: ThienBanInfo;
  cungs: CungData[];
}

function formatSao(saoObj: ApiSao): SaoInfo {
  const sao = saoObj.sao;
  if (!sao) return { name: '', colorCode: '', status: '', doSang: '', isSpecial: false };

  let doSang = '';
  if (saoObj.do_sang?.abbr) {
    doSang = saoObj.do_sang.abbr;
  }

  return {
    name: sao.name || '',
    colorCode: sao.color_code || '',
    status: sao.status || '',
    doSang,
    isSpecial: sao.is_special || false,
  };
}

function formatChinhTinh(ct: ApiChinhTinh): ChinhTinhInfo {
  const sao = ct.sao;
  return {
    name: sao?.name || '',
    amDuong: sao?.am_duong || '',
    colorCode: sao?.color_code || '',
    doSang: ct.do_sang?.abbr || '',
  };
}

function shouldShowSao(saoObj: ApiSao): boolean {
  const sao = saoObj.sao;
  if (!sao || !sao.name) return false;
  const saoType = sao.type || '';
  if (saoType === 'luu-theo-dai-van') return false;
  if (saoType === 'luu-tu-duc') return false;
  if (sao.name === 'TRIỆT' || sao.name === 'TUẦN') return false;
  return true;
}

interface ApiSaoInner {
  id?: number;
  name?: string;
  color_code?: string;
  status?: string;
  am_duong?: string;
  is_special?: boolean;
  type?: string;
}

interface ApiDoSang {
  name?: string;
  abbr?: string;
  bold?: number;
}

interface ApiSao {
  sao: ApiSaoInner;
  vi_tri?: { id?: number; name?: string };
  do_sang?: ApiDoSang | null;
}

interface ApiChinhTinh {
  sao: ApiSaoInner;
  vi_tri?: { id?: number; name?: string };
  do_sang?: ApiDoSang | null;
}

interface ApiCung {
  id: number;
  name: string;
  full_name: string;
  cung: {
    id: number;
    name: string;
    ngu_hanh: { id: number; name: string; color_code: string };
    slug: string;
  };
  chi: { id: number; name: string };
  dai_van: number;
  khoi_tieu_han: string;
  khoi_nguyet_han: string;
  chinh_tinh: ApiChinhTinh[];
  sao: ApiSao[];
  dai_van_text: string;
  luu_nien: string;
  trang_sinh: { id: number; name: string; status: string; is_special: boolean } | null;
  tu_hoa_phais: unknown[];
}

interface ApiResponse {
  code: string;
  msg: string;
  data: {
    slug: string;
    hour: string;
    hour_id: number;
    name: string | null;
    solar_year: number;
    solar_month: number;
    solar_day: number;
    lunar_year: number;
    lunar_month: number;
    lunar_day: number;
    gender: string;
    time_full: string;
    solar_full: string;
    current_time_full: string;
    can_chi_full: string;
    cuc_full: string;
    am_duong_cua_ban_menh: string;
    loai_hanh_cua_ban_menh: string;
    vi_tri_cung_menh: string;
    vi_tri_cung_than: string;
    menh_chu: string;
    than_chu: string;
    can_xuong: string;
    lai_nhan_cung: string;
    cung_model: ApiCung[];
  };
}

const CUNG_ORDER = [
  'menh', 'phu-mau', 'phuc-duc', 'dien-trach',
  'quan-loc', 'no-boc', 'thien-di', 'tat-ach',
  'tai-bach', 'tu-tuc', 'phu-the', 'huynh-de',
];

function buildApiHeaders() {
  const isBrowser = typeof window !== "undefined";

  // In browsers, many headers (User-Agent, Origin, Referer) are forbidden.
  const base = {
    "Content-Type": "application/json",
    Accept: "application/json,text/plain,*/*",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    "X-Requested-With": "XMLHttpRequest",
  } as const;

  if (isBrowser) return base;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "";
  return {
    ...base,
    "User-Agent": "Mozilla/5.0 (compatible; TuviProject/1.0)",
    ...(siteUrl ? { Origin: siteUrl, Referer: siteUrl } : {}),
  } as const;
}

async function readResponseTextSafe(res: Response) {
  try {
    const txt = await res.text();
    return txt.slice(0, 800);
  } catch {
    return "";
  }
}

export async function fetchTuViData(params: {
  name: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  gender: string;
  viewYear: number;
  viewMonth: number;
  solar: boolean;
}): Promise<TuViData> {
  // Step 1: POST to create the la-so and get the slug
  const createRes = await fetch(`${API_BASE}/la-so`, {
    method: 'POST',
    headers: buildApiHeaders(),
    body: JSON.stringify({
      name: params.name,
      day: params.day,
      month: params.month,
      year: params.year,
      solar_calendar: params.solar,
      hour_id: params.hour,
      male: params.gender === 'M',
      nam_xem: params.viewYear,
      thang_xem: params.viewMonth,
    }),
    cache: "no-store",
  });

  if (!createRes.ok) {
    const bodySnippet = await readResponseTextSafe(createRes);
    throw new Error(
      `API create failed: ${createRes.status}${
        createRes.statusText ? ` ${createRes.statusText}` : ""
      }${bodySnippet ? ` - ${bodySnippet}` : ""}`,
    );
  }

  const createJson = (await createRes.json()) as ApiResponse;
  if (createJson.code !== '200' || !createJson.data?.slug) {
    throw new Error('API create returned invalid response');
  }

  const slug = createJson.data.slug;

  // Step 2: GET the full data by slug
  const dataRes = await fetch(
    `${API_BASE}/la-so/${slug}?thang-xem=${params.viewMonth}&nam-xem=${params.viewYear}`,
    {
      headers: buildApiHeaders(),
      cache: "no-store",
    }
  );

  if (!dataRes.ok) {
    const bodySnippet = await readResponseTextSafe(dataRes);
    throw new Error(
      `API fetch failed: ${dataRes.status}${
        dataRes.statusText ? ` ${dataRes.statusText}` : ""
      }${bodySnippet ? ` - ${bodySnippet}` : ""}`,
    );
  }

  const dataJson = (await dataRes.json()) as ApiResponse;
  if (dataJson.code !== '200' || !dataJson.data) {
    throw new Error('API returned invalid data');
  }

  const d = dataJson.data;

  // Parse thien ban info
  const thienBan: ThienBanInfo = {
    hoTen: d.name || params.name || '',
    solarDate: `${d.solar_day}/${d.solar_month}/${d.solar_year}`,
    lunarDate: `${d.lunar_day}/${d.lunar_month}`,
    canChiFull: d.can_chi_full || '',
    namSinh: d.solar_year || params.year,
    gioSinh: d.hour || '',
    amDuong: d.am_duong_cua_ban_menh || '',
    banMenh: d.loai_hanh_cua_ban_menh || '',
    cucFull: d.cuc_full || '',
    canLuong: d.can_xuong || '',
    menhChu: d.menh_chu || '',
    thanChu: d.than_chu || '',
    namXem: d.current_time_full || '',
    laiNhanCung: d.lai_nhan_cung || '',
    gender: d.gender || '',
  };

  // Parse cung models
  const cungModelMap = new Map<string, ApiCung>();
  const viTriCungThan = d.vi_tri_cung_than || '';

  for (const cm of d.cung_model || []) {
    if (cm.cung?.slug) {
      cungModelMap.set(cm.cung.slug, cm);
    }
  }

  const cungs: CungData[] = CUNG_ORDER.map((slug, index) => {
    const cm = cungModelMap.get(slug);
    if (!cm) {
      return {
        index,
        cungName: slug,
        cungSlug: slug,
        diaChi: '',
        fullName: '',
        nguHanh: '',
        nguHanhColor: '',
        chinhTinh: [],
        phuTinh: [],
        daiVan: 0,
        daiVanText: '',
        luuNien: '',
        trangSinh: '',
        khoiNguyetHan: '',
        viTri: '',
        isThan: false,
        hasTriet: false,
        hasTuan: false,
      };
    }

    const chinhTinh = (cm.chinh_tinh || []).map(formatChinhTinh);

    const phuTinh = (cm.sao || [])
      .filter(shouldShowSao)
      .map(formatSao)
      .filter((s) => s.name);

    const hasTriet = (cm.sao || []).some((s) => s.sao?.name === 'TRIỆT');
    const hasTuan = (cm.sao || []).some((s) => s.sao?.name === 'TUẦN');

    const isThan = cm.cung?.name === viTriCungThan ||
      cm.chi?.name === viTriCungThan;

    return {
      index,
      cungName: cm.cung?.name || '',
      cungSlug: slug,
      diaChi: cm.full_name || '',
      fullName: cm.full_name || '',
      nguHanh: cm.cung?.ngu_hanh?.name || '',
      nguHanhColor: cm.cung?.ngu_hanh?.color_code || '',
      chinhTinh,
      phuTinh,
      daiVan: cm.dai_van || 0,
      daiVanText: cm.dai_van_text || '',
      luuNien: cm.luu_nien || '',
      trangSinh: cm.trang_sinh?.name || '',
      khoiNguyetHan: cm.khoi_nguyet_han || '',
      viTri: cm.chi?.name || cm.name || '',
      isThan,
      hasTriet,
      hasTuan,
    };
  });

  return { thienBan, cungs };
}
