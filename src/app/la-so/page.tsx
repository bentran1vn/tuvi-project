import type { Metadata } from "next";
import {
  fetchTuViData,
  type CungData,
  type TuViData,
} from "@/lib/tuvi-scraper";
import Link from "next/link";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button";
import { AdsenseAd } from "@/components/adsense-ad";
import { ShopeeAd } from "@/components/shopee-ad";

export const metadata: Metadata = {
  title: "Kết Quả Lá Số Tử Vi",
  description: "Xem kết quả lá số tử vi của bạn.",
};

type SearchParams = Promise<{
  name?: string;
  day?: string;
  month?: string;
  year?: string;
  solar?: string;
  hour?: string;
  gender?: string;
  viewYear?: string;
  viewMonth?: string;
}>;

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

function CungCard({ cung }: { cung: CungData }) {
  const chinhTinhDisplay = cung.chinhTinh.map((ct) => {
    const ds = ct.doSang ? ` (${ct.doSang})` : "";
    return `${ct.amDuong} ${ct.name}${ds}`;
  });

  const formatPhuTinh = (s: (typeof cung.phuTinh)[number]) =>
    s.doSang ? `${s.name} (${s.doSang})` : s.name;

  const saoTot = cung.phuTinh.filter((s) => s.status === "C");
  const saoXau = cung.phuTinh.filter((s) => s.status === "H");

  const saoTotDisplay = saoTot.map(formatPhuTinh);
  const saoXauDisplay = saoXau.map(formatPhuTinh);

  const vanHanParts = [cung.daiVanText, cung.trangSinh, cung.luuNien].filter(
    Boolean,
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-amber-700 dark:text-amber-400">
          {cung.index + 1}. Cung {cung.cungName}
          {cung.isThan && (
            <span className="ml-1.5 inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
              THÂN
            </span>
          )}
          {cung.hasTriet && (
            <span className="ml-1.5 inline-block rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
              Triệt
            </span>
          )}
          {cung.hasTuan && (
            <span className="ml-1.5 inline-block rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
              Tuần
            </span>
          )}
        </h3>
        <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          tại {cung.viTri}
        </span>
      </div>

      <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        {cung.diaChi} | {cung.nguHanh} | {cung.cungName}
      </p>

      {chinhTinhDisplay.length > 0 ? (
        <div className="mb-3">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Chính tinh:{" "}
          </span>
          <span className="text-sm text-zinc-900 dark:text-zinc-100">
            {chinhTinhDisplay.join(" , ")}
          </span>
        </div>
      ) : (
        <div className="mb-3">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Chính tinh:{" "}
          </span>
          <span className="text-sm italic text-zinc-500 dark:text-zinc-400">
            (Vô chính diệu)
          </span>
        </div>
      )}

      <div className="mb-3 flex gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          <strong>Tuổi/Tháng:</strong> {cung.daiVan} | {cung.khoiNguyetHan}
        </span>
      </div>

      {(saoTotDisplay.length > 0 || saoXauDisplay.length > 0) && (
        <div className="mb-3">
          <div className="mb-1">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Sao tốt:{" "}
            </span>
            <span className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {saoTotDisplay.length > 0
                ? saoTotDisplay.join(" , ")
                : "(không có)"}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Sao xấu:{" "}
            </span>
            <span className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {saoXauDisplay.length > 0
                ? saoXauDisplay.join(" , ")
                : "(không có)"}
            </span>
          </div>
        </div>
      )}

      {vanHanParts.length > 0 && (
        <div className="border-t border-zinc-100 pt-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <strong>Vận hạn:</strong> {vanHanParts.join(" ")}
        </div>
      )}

      <div className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        <strong>Vị trí:</strong> {cung.viTri}
      </div>
    </div>
  );
}

function buildCopyText(thienBan: TuViData["thienBan"], cungs: CungData[]) {
  const lines: string[] = [];

  lines.push("Thông Tin Tổng Quan");
  lines.push("");
  lines.push(`Họ tên: ${thienBan.hoTen || ""}`);
  lines.push(
    `Năm sinh: ${thienBan.namSinh || ""}${thienBan.canChiFull ? ` (${thienBan.canChiFull.split(",")[0]?.trim() || thienBan.canChiFull})` : ""}`,
  );
  if (thienBan.solarDate || thienBan.lunarDate) {
    lines.push(
      `Ngày sinh: ${thienBan.solarDate || ""} (Dương lịch) — ${thienBan.lunarDate || ""} (Âm lịch)`,
    );
  }
  if (thienBan.gioSinh) {
    lines.push(`Giờ sinh: ${thienBan.gioSinh}`);
  }
  if (thienBan.banMenh) {
    lines.push(
      `Bản mệnh: ${thienBan.banMenh}${thienBan.cucFull ? ` - ${thienBan.cucFull}` : ""}`,
    );
  }
  if (thienBan.namXem) {
    lines.push(`Năm xem: ${thienBan.namXem}`);
  }
  lines.push("");

  lines.push("Sắp Xếp 12 Cung Số");
  lines.push("");

  cungs.forEach((cung, idx) => {
    const thanPart = cung.isThan ? " <THÂN>" : "";
    lines.push(
      `${idx + 1}. Cung ${cung.cungName}${thanPart} (tại ${cung.viTri})`,
    );
    lines.push("");

    if (cung.chinhTinh.length > 0) {
      const main = cung.chinhTinh
        .map((ct) => {
          const doSang = ct.doSang ? ` (${ct.doSang})` : "";
          return `${ct.amDuong} ${ct.name}${doSang}`.trim();
        })
        .join(" , ");
      lines.push(`Chính tinh: ${main}`);
    } else {
      lines.push(`Chính tinh: (Vô chính diệu)`);
    }

    lines.push(`Tuổi/Tháng: ${cung.daiVan} | ${cung.khoiNguyetHan}`);

    const saoTot = cung.phuTinh.filter((s) => s.status === "C");
    const saoXau = cung.phuTinh.filter((s) => s.status === "H");

    if (saoTot.length > 0) {
      lines.push(
        `Sao tốt: ${saoTot
          .map((s) => (s.doSang ? `${s.name} (${s.doSang})` : s.name))
          .join(" , ")}.`,
      );
    }
    if (saoXau.length > 0) {
      lines.push(
        `Sao xấu: ${saoXau
          .map((s) => (s.doSang ? `${s.name} (${s.doSang})` : s.name))
          .join(" , ")}.`,
      );
    }

    if (cung.trangSinh || cung.luuNien || cung.daiVanText) {
      const parts = [cung.daiVanText, cung.trangSinh, cung.luuNien].filter(
        Boolean,
      );
      if (parts.length) lines.push(`Vận hạn: ${parts.join(" ")}`);
    }

    lines.push(`Vị trí: ${cung.viTri}`);
    lines.push("");
  });

  return lines.join("\n").trim();
}

const SYSTEM_PROMPT = `Bạn là “AI Luận Lá Số Tử Vi Chuyên Sâu” chuyên phân tích lá số Tử Vi dựa trên dữ liệu do người dùng cung cấp (đã copy từ bảng tử vi). Mục tiêu: tạo bản luận giải dài, sâu, có cấu trúc rõ ràng để người đọc có thể “đỡ phải đọc nhiều thứ” mà vẫn hiểu được cuộc đời theo các trục: năng lực – mâu thuẫn – lựa chọn – cơ hội – rủi ro – giai đoạn.

NGUYÊN TẮC BẮT BUỘC (KHÔNG ĐƯỢC PHÁ VỠ)
1) Chỉ dùng dữ liệu đầu vào trong khối “Thông Tin Tổng Quan” và “Sắp Xếp 12 Cung Số”. Không tự bịa sao/cung/vận hạn/ý nghĩa.
2) Nếu dữ liệu thiếu (thiếu sao, thiếu vận hạn, thiếu phần ghi chú…), hãy nói rõ “chưa đủ dữ liệu” cho đoạn đó và chuyển sang suy luận thận trọng theo phần có sẵn.
3) Tuyệt đối tránh câu khẳng định chắc nịch như “chắc chắn xảy ra”. Luận theo xu hướng/khuynh hướng/kịch bản.
4) Nếu có nội dung liên quan sức khỏe/tài chính/pháp lý/hành vi rủi ro: chỉ diễn giải tham khảo, ưu tiên phòng ngừa, khuyến nghị kiểm chứng thực tế/chuyên gia khi cần.
5) Ngôn ngữ: tiếng Việt, mạch lạc. Không gây hoang mang.

CHUẨN HOÁ VÀ PARSE DỮ LIỆU (BẮT BUỘC LÀM TRƯỚC KHI VIẾT)
A) Nhận diện các khối dữ liệu:
- “Thông Tin Tổng Quan”
  - Họ tên, Năm sinh (kèm Can Chi nếu có)
  - Ngày sinh (Dương lịch — Âm lịch nếu có)
  - Giờ sinh (kèm Can Chi nếu có)
  - Bản mệnh (cùng Cục nếu có)
  - Năm xem (có “(Năm/tuổi)” nếu có)
  - Tháng xem (âm lịch) nếu có
- “Sắp Xếp 12 Cung Số”
  - 12 cung: mỗi cung theo mẫu “{STT}. Cung {TÊN} (THÂN nếu có) (tại {VỊ_TRÍ})”
  - Mỗi cung có: “Chính tinh”, “Sao tốt”, “Sao xấu”, “Vận hạn …” (nếu có), “Vị trí …”

B) Với mỗi cung, trích xuất:
- chính tinh: danh sách sao chính tinh
- phụ tinh: tách “Sao tốt” và “Sao xấu”
- có Triệt/Tuần? ghi lại làm biến số “giảm/đổi tính chất”
- vận hạn: nếu có, lưu lại toàn bộ chuỗi “ĐV… LN…” để dùng trong Timeline

C) Tạo “bản đồ ký hiệu”:
- Với mỗi sao/phụ tinh, ghi lại tên sao (đúng như input).
- Nếu có (H)/(M)/(V)/(Đ)/(B)/(Hãm) kèm trong chính tinh/sao tốt/xấu, ghi lại để tăng độ sắc thái (nhưng vẫn không khẳng định tuyệt đối).

CÁCH LUẬN GIẢI CHUYÊN SÂU (BẮT BUỘC ÁP DỤNG)
Tư duy theo 3 lớp:
Lớp 1 — “Cấu trúc năng lực”:
- Trục chính tinh + phụ tinh tốt → năng lực cốt lõi, cách con người “tự nhiên làm được”
- Triệt/Tuần nếu có → năng lực có thể bị “đứt nhịp”/“đổi cách biểu hiện”
Lớp 2 — “Điểm ma sát”:
- phụ tinh xấu → loại rủi ro/mâu thuẫn (tâm lý, quan hệ, giấy tờ-thủ tục, tiêu hao, va chạm, dao động…)
- vận hạn/chỉ báo thời gian → rủi ro “tăng tần suất” ở giai đoạn nào (nêu theo chuỗi input)
Lớp 3 — “Chiến lược sống”:
- chuyển rủi ro xấu thành “quy tắc phòng ngừa cụ thể”
- chuyển điểm tốt thành “cách khai thác thực hành”

TRÌNH BÀY LUẬN GIẢI THEO OUTPUT BẮT BUỘC (AI PHẢI ĐÚNG KHUNG NÀY)
Chỉ trả kết quả theo thứ tự sau:
1) Tóm tắt nhanh (10–14 dòng)
- 3 điểm mạnh bền
- 3 điểm cần quản rủi ro
- 1–2 chiến lược sống cốt lõi
- nhắc về độ tin cậy: nếu dữ liệu thiếu, một số phần chỉ suy luận xu hướng

2) Luận giải chuyên sâu theo trục cuộc đời (5–8 mục)
- chia theo các trục sự nghiệp/tài vận/quan hệ/sức khỏe/tình huống & thời gian nếu có

3) Phân tích 12 cung (bắt buộc đủ 12 cung; nếu thiếu thì ghi rõ)
- mỗi cung: ý nghĩa, chính tinh, sao tốt, sao xấu, Triệt/Tuần (nếu có), vận hạn (nếu có)

4) Timeline (dựa theo Năm xem/Tháng xem)
- mốc đầu/giữa/cuối nếu đủ dữ liệu; nếu không đủ thì nêu khuynh hướng

5) Hành động cá nhân hoá (4 lĩnh vực)
- việc nên làm / việc nên tránh / kiểm nghiệm bằng đời thực

6) Câu hỏi để cá nhân hoá (5–8 câu)

RÀNG BUỘC AN TOÀN / CHẤT LƯỢNG
- Không bịa thêm dữ liệu không có trong input.
- Không dùng ngôn ngữ gây sợ hãi.
- Nếu phải suy luận: dùng “có xu hướng”, “khả năng cao”, không tuyệt đối hoá.
`;

function buildCopyTextWithSystemPrompt(
  thienBan: TuViData["thienBan"],
  cungs: CungData[],
) {
  const resultText = buildCopyText(thienBan, cungs);
  return `${resultText}\n\n====================\nSYSTEM PROMPT\n====================\n${SYSTEM_PROMPT}`.trim();
}

export default async function LasoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const adsenseClientSlotLasoBottom =
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_LASO_BOTTOM || "";

  const params = await searchParams;

  const name = params.name || "";
  const day = parseInt(params.day || "1", 10);
  const month = parseInt(params.month || "1", 10);
  const year = parseInt(params.year || "2000", 10);
  const isSolar = params.solar !== "0";
  const hour = parseInt(params.hour || "1", 10);
  const gender = params.gender || "M";
  const viewYear = parseInt(
    params.viewYear || new Date().getFullYear().toString(),
    10,
  );
  const viewMonth = parseInt(params.viewMonth || "1", 10);

  let data: TuViData | null = null;
  let error: string | null = null;

  try {
    data = await fetchTuViData({
      name,
      day,
      month,
      year,
      hour,
      gender,
      viewYear,
      viewMonth,
      solar: isSolar,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Có lỗi xảy ra";
  }

  if (error || !data) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
          Không thể lập lá số
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          {error || "Không nhận được dữ liệu từ server."}
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Quay lại trang chủ
        </Link>
      </section>
    );
  }

  const { thienBan, cungs } = data;
  const displayName = thienBan.hoTen || name || "Chưa nhập tên";
  const copyText = buildCopyText(thienBan, cungs);
  const copyTextWithPrompt = buildCopyTextWithSystemPrompt(thienBan, cungs);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Lá Số Tử Vi —{" "}
          <span className="text-amber-600 dark:text-amber-400">
            {displayName}
          </span>
        </h1>
      </div>

      {/* Thông tin tổng quan */}
      <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <CopyToClipboardButton text={copyText} label="Copy lá số" />
        <CopyToClipboardButton
          text={copyTextWithPrompt}
          label="Copy lá số + System prompt"
        />
      </div>
      <div className="mb-10 rounded-xl border border-amber-200/60 bg-amber-50/50 p-6 shadow-sm dark:border-amber-900/40 dark:bg-zinc-900">
        <h2 className="mb-5 text-lg font-bold text-amber-800 dark:text-amber-400">
          Thông Tin Tổng Quan
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Họ tên" value={displayName} />
          <InfoRow label="Năm sinh" value={`${thienBan.namSinh}`} />
          <InfoRow
            label="Ngày sinh"
            value={`${thienBan.solarDate} (Dương lịch) — ${thienBan.lunarDate} (Âm lịch)`}
          />
          <InfoRow label="Giờ sinh" value={thienBan.gioSinh} />
          <InfoRow label="Âm dương" value={thienBan.amDuong} />
          <InfoRow
            label="Bản mệnh"
            value={
              thienBan.banMenh && thienBan.cucFull
                ? `${thienBan.banMenh} - ${thienBan.cucFull}`
                : thienBan.banMenh || thienBan.cucFull
            }
          />
          <InfoRow label="Cân lượng" value={thienBan.canLuong} />
          <InfoRow label="Can chi" value={thienBan.canChiFull} />
          <InfoRow label="Năm xem" value={thienBan.namXem} />
          <InfoRow label="Lai nhân cung" value={thienBan.laiNhanCung} />
        </dl>
      </div>

      {/* 12 Cung */}
      <div className="mb-6">
        <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Sắp Xếp 12 Cung Số
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cungs.map((cung) => (
            <CungCard key={cung.cungSlug} cung={cung} />
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← Lập lá số mới
        </Link>
      </div>

      {/* la-so-bottom: cuối trang trước phần System prompt */}
      <div className="mt-6">
        <AdsenseAd
          slotId={adsenseClientSlotLasoBottom}
          minHeight={260}
        />
        <div className="mt-4">
          <ShopeeAd placement="la-so-bottom" minHeight={120} />
        </div>
      </div>

      <details className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <summary className="cursor-pointer select-none text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          System prompt (dành cho AI khác)
        </summary>
        <div className="mt-3">
          <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Dùng nút “Copy lá số + System prompt” ở trên để copy cả 2 phần.
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg bg-zinc-950 p-3 text-xs leading-6 text-zinc-100 dark:bg-black">
            {SYSTEM_PROMPT}
          </pre>
        </div>
      </details>
    </section>
  );
}
