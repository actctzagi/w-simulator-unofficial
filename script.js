/* =====================================================================
   仮面ライダーW AtoZ／運命のシミュレーター  script.js
   ---------------------------------------------------------------------
     1. 基本設定
     2. メモリのデータ
     3. 保存データ・計測
     4. 画面全体のレイアウト
     5. ライダーの表示
     6. 初回の変身演出
     7. 4ボタン
     8. 戻る・進むボタン
     9. 二大メモリ
    10. メモリ一覧モーダル
    11. メニューと地球の本棚
    12. 画面の更新・ページ開始
===================================================================== */


/* =============================
   1. 基本設定
============================= */
const $ = id => document.getElementById(id);
const webp = name => `images_webp/${name}.webp`;
const isPC = () => document.documentElement.classList.contains("layout-pc");
const isZoomed = () => !!(window.visualViewport && window.visualViewport.scale > 1.02);
let lastViewSize = { W: window.innerWidth, H: window.innerHeight };
if (window.visualViewport) visualViewport.addEventListener("resize", () => document.documentElement.classList.toggle("zoomed", isZoomed()));
function viewSize() {
    if (!isZoomed()) lastViewSize = { W: window.innerWidth, H: window.innerHeight };
    return lastViewSize;
}

const reduceMotionMQ = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
const prefersReduce = () => !!(reduceMotionMQ && reduceMotionMQ.matches);
const REAL_SITE = location.hostname === "actctzagi.github.io";

// いま選んでいる左右のメモリ（初期値）
let currentLeft = "cyclone";
let currentRight = "joker";

let weaponsVisible = true;      // 武器ボタン
let animOn = true;              // アニメボタン
let henshinPlaying = false;     // 変身演出の最中（この間は操作を受け付けない）
let pending = null;             // 一覧で選んだ、まだ左右に入れていないメモリ
let pendingSide = null;         // 入れ替える側（"L" か "R"）を選んだ状態

function clearPick(redraw) {
    if (pending === null && pendingSide === null) return;
    pending = null; pendingSide = null;
    if (redraw) sync();
}


/* =============================
   2. メモリのデータ
============================= */
/* ---- メモリ名 ---- */
const forms = [
  { value: "accel", label: "アクセル" },
  { value: "bird", label: "バード" },
  { value: "cyclone", label: "サイクロン" },
  { value: "dummy", label: "ダミー" },
  { value: "eternal", label: "エターナル" },
  { value: "fang", label: "ファング" },
  { value: "gene", label: "ジーン" },
  { value: "heat", label: "ヒート" },
  { value: "iceage", label: "アイスエイジ" },
  { value: "joker", label: "ジョーカー" },
  { value: "key", label: "キー" },
  { value: "luna", label: "ルナ" },
  { value: "metal", label: "メタル" },
  { value: "nasca", label: "ナスカ" },
  { value: "ocean", label: "オーシャン" },
  { value: "puppeteer", label: "パペティアー" },
  { value: "queen", label: "クイーン" },
  { value: "rocket", label: "ロケット" },
  { value: "skull", label: "スカル" },
  { value: "trigger", label: "トリガー" },
  { value: "unicorn", label: "ユニコーン" },
  { value: "violence", label: "バイオレンス" },
  { value: "weather", label: "ウェザー" },
  { value: "xtreme", label: "エクストリーム" },
  { value: "yesterday", label: "イエスタデイ" },
  { value: "zone", label: "ゾーン" },

  { value: "prism", label: "プリズム" },
  { value: "engine", label: "エンジン" },
  { value: "trial", label: "トライアル" },
  { value: "bomb", label: "ボム" },
  { value: "terror", label: "テラー" },
  { value: "taboo", label: "タブー" },
  { value: "nasca3", label: "ナスカ" },
  { value: "claydoll", label: "クレイドール" },
  { value: "smilodon", label: "スミロドン" },
  { value: "utopia", label: "ユートピア" }
];

/* ---- メモリ解説文 ---- */
const memoryDescriptions = {
    accel: "｢加速の記憶｣を持つガイアメモリ｡ 使用者に加速能力を与え､ 高速移動を可能にする｡",
    bird: "｢始祖鳥の記憶｣を持つガイアメモリ｡ 使用者に飛翔能力を与える｡",
    cyclone: "｢疾風の記憶｣を持つガイアメモリ｡ 疾風を引き起こし､ 風を自由自在に操る｡",
    dummy: "｢偽物 (複製) の記憶｣を持つガイアメモリ｡ 他人や物体に擬態する｡",
    eternal: "｢永遠の記憶｣を持つガイアメモリ｡ T2以前のガイアメモリの能力を無力化する｡",
    fang: "｢牙の記憶｣を持つガイアメモリ｡ 闘争本能を増幅させ､ 全身に鋭利な刃を発生させる｡",
    gene: "｢遺伝子の記憶｣を持つガイアメモリ｡ 遺伝子操作能力を与える｡",
    heat: "｢熱き記憶｣を持つガイアメモリ｡ 感情を昂らせ､ 高熱や炎を自在に操る｡",
    iceage: "｢氷河期の記憶｣を持つガイアメモリ｡ あらゆる物体を氷結させる｡",
    joker: "｢切札の記憶｣を持つガイアメモリ｡ 運動能力を高め､ 格闘戦の技術を強化する｡",
    key: "｢鍵の記憶｣を持つガイアメモリ｡ 目標の対象物を探し当てる索敵能力と､ 解除能力を与える｡",
    luna: "｢幻想の記憶｣を持つガイアメモリ｡ 肉体の伸縮や分身といった幻想的な能力を与える｡",
    metal: "｢闘士の記憶｣を持つガイアメモリ｡ 使用者を鋼鉄の肉体と怪力を持つ闘士に変化させる｡",
    nasca: "｢ナスカ文明の記憶｣を持つガイアメモリ｡ 飛翔能力と超高速移動能力を与える｡",
    ocean: "｢大洋の記憶｣を持つガイアメモリ｡ 水弾の発砲に加えて､ 身体を液体化させる｡",
    puppeteer: "｢人形使いの記憶｣を持つガイアメモリ｡ 対象物を人形のごとく意のままに操る｡",
    queen: "｢女王の記憶｣を持つガイアメモリ｡ 鉄壁のバリアを発生させ､ 敵の攻撃を防ぐ｡",
    rocket: "｢ロケットの記憶｣を持つガイアメモリ｡ 攻撃対象に向かってミサイルを発射する｡",
    skull: "｢骸骨の記憶｣を持つガイアメモリ｡ 身体能力を極限まで高め､ その状態に耐えうる肉体へ作り変える｡",
    trigger: "｢銃撃手の記憶｣を持つガイアメモリ｡ 銃撃能力を与え､ 射撃力を強化する｡",
    unicorn: "｢一角獣の記憶｣を持つガイアメモリ｡ 打突攻撃の破壊力を高める｡",
    violence: "｢暴力の記憶｣を持つガイアメモリ｡ 全身の筋力､ 特に腕力を最も強化させる｡",
    weather: "｢気象の記憶｣を持つガイアメモリ｡ 雨､ 竜巻､ 雷､ 雪といった全ての気象現象を自由自在に操る｡",
    xtreme: "記憶を持たない特殊なガイアメモリ｡ 他のメモリの能力を取り込み､ その力を極限まで引き出す｡",
    yesterday: "｢昨日の記憶｣を持つガイアメモリ｡ 対象者の記憶を操作し､ 昨日と同じ行動を繰り返させる｡",
    zone: "｢地帯の記憶｣を持つガイアメモリ｡ 任意の対象物を他の場所へ自在に転送する｡",

    prism: "｢プリズムの記憶｣を持つガイアメモリ｡ 複数のメモリをリンクさせ､ 一つのエネルギーに収束させる｡",
    engine: "｢ジェット｣｢スチーム｣｢エレクトリック｣､ 3種のエンジンパワーを引き出せる多機能型メモリ｡",
    trial: "｢挑戦の記憶｣を持つガイアメモリ｡ 既存のメモリに超加速のプログラムパッチをあてることで､ 音速に到達する加速力を与える｡",
    bomb: "｢爆弾の記憶｣を持つガイアメモリ｡ 分裂･爆発する強力な光弾を放つ｡",
    terror: "｢恐怖の記憶｣を持つガイアメモリ｡ 恐怖領域｢テラーフィールド｣を展開し､ 敵に激しい恐怖心を与える｡",
    taboo: "｢禁忌の記憶｣を持つガイアメモリ｡ 強烈な破壊光球を発射する｡",
    nasca3: "｢ナスカ文明の記憶｣を持つガイアメモリ｡ レベル3に到達することで更なる進化を果たす｡",
    claydoll: "｢土偶の記憶｣を持つガイアメモリ｡ 重力エネルギー弾に加えて､ 自身の肉体を再生する能力を持つ｡",
    smilodon: "｢スミロドンの記憶｣を持つガイアメモリ｡ 鋭い爪と超高速移動能力を与える｡",
    utopia: "｢理想郷の記憶｣を持つガイアメモリ｡ 重力操作能力に加えて､ 触れた人間の感情を吸い取って己のエネルギーに変換する能力を持つ｡"
};

/* ---- 左右で仕様が変わるパターン ---- */
const SIDE_VARIANTS = {
    left: {
        fang: {
            btn: "btn-fangT1",   // T1ファングメモリ
            description: "｢牙の記憶｣を持つ自律行動型ガイアメモリ。闘争本能を増幅させ、全身に鋭利な刃を発生させる｡",
        },
    },
    right: {},
};


// メモリ画像と解説文を変える関数
const memoryBtnImage = (value, side) => webp(SIDE_VARIANTS[side]?.[value]?.btn ?? "btn-" + value);
const memoryDescription = (value, side) => SIDE_VARIANTS[side]?.[value]?.description ?? memoryDescriptions[value] ?? "";


// メモリの固有色
const MEMORY_COLORS = {
    accel: "#de0506", bird: "#ba0709", cyclone: "#0fad4f", dummy: "#dd4903", eternal: "#ece9f0", fang: "#6f8fbf",
    gene: "#9e7d0c", heat: "#da0f05", iceage: "#23accc", joker: "#7b02d6", key: "#2356a3", luna: "#e2cf02",
    metal: "#868689", nasca: "#03a8d6", ocean: "#03c9d4", puppeteer: "#9e1450", queen: "#cd499b", rocket: "#1a8b4f",
    skull: "#5230c1", trigger: "#057cd7", unicorn: "#0ec8b7", violence: "#c40646", weather: "#e9e6e5", xtreme: "#f4f6fa",
    yesterday: "#885645", zone: "#9c9da0",
    prism: "#6ab6b1", engine: "#9490a2", trial: "#0d40cf", bomb: "#dc0b05", terror: "#3f039d", taboo: "#e51004",
    nasca3: "#e47d02", claydoll: "#8e664b", smilodon: "#c8910c", utopia: "#b58f36",
};
const colorOf = v => MEMORY_COLORS[v] ?? "#888888";


// 表示用の名前など
const EXTRA_ORDER = [
    "prism", "engine", "trial", null,
    "bomb", null, "terror", "taboo",
    "nasca3", "claydoll", "smilodon", "utopia",
];
const rawName = v => forms.find(f => f.value === v)?.label ?? v;
const labelOf = v => v === "nasca3" ? "ナスカ (Lv3)" : rawName(v);
function memoryTitleText(labelText) {
    const m = labelText.trim().match(/^(.*?)\s*\((Lv\d+)\)\s*$/);
    return m ? `${m[1]}メモリ（${m[2]}）` : `${labelText.trim()}メモリ`;
}


// 引き継ぎコードは、この並びの番号で作られる。
const XFER_ORDER = ["accel", "bird", "cyclone", "dummy", "eternal", "fang", "gene", "heat", "iceage", "joker", "key", "luna", "metal", "nasca", "ocean", "puppeteer", "queen", "rocket", "skull", "trigger", "unicorn", "violence", "weather", "xtreme", "yesterday", "zone", "prism", "engine", "trial", "bomb", "terror", "taboo", "nasca3", "claydoll", "smilodon", "utopia"];



/* =============================
   3. 保存データ・計測
============================= */
const FOUND_KEY = "w-sim-found", BM_KEY = "w-sim-bookmarks", SET_KEY = "w-sim-settings", NEW_KEY = "w-sim-new", PID_KEY = "w-sim-pid", HIST_KEY = "w-sim-history";
const lsGet = k => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };


let savedSettings = {};
let libSort = "new";
let libFilter = "all";
function loadSettings() { savedSettings = lsGet(SET_KEY) || {}; animOn = savedSettings.a !== false; libSort = ["name", "new", "old"].includes(savedSettings.s) ? savedSettings.s : "new"; libFilter = savedSettings.f === "bm" ? "bm" : "all"; }
function saveSettings() { lsSet(SET_KEY, { w: weaponsVisible, a: animOn, s: libSort, f: libFilter }); }

const comboKey = (l, r) => l + "/" + r;
const validForm = v => forms.some(f => f.value === v);
const validKey = k => typeof k === "string" && k.split("/").length === 2 && k.split("/").every(validForm);
let found = (lsGet(FOUND_KEY) || []).filter(validKey);
let foundSet = new Set(found);
let bms = (lsGet(BM_KEY) || []).filter(b => b && validForm(b.l) && validForm(b.r));
const isBookmarked = (l, r) => bms.some(b => b.l === l && b.r === r);
const totalCombos = () => forms.length * forms.length;
const NEW_ALL = true;
let newSet = new Set((lsGet(NEW_KEY) || []).filter(k => typeof k === "string"));
function saveNew() { lsSet(NEW_KEY, [...newSet]); }
function updateNewBadge() { const b = $("libNew"); if (b) b.hidden = newSet.size === 0; }

const newPid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
let pid = lsGet(PID_KEY);
if (typeof pid !== "string" || pid.length < 8) { pid = newPid(); lsSet(PID_KEY, pid); }
try { if (REAL_SITE && window.gtag) window.gtag("set", "user_properties", { player_id: pid }); } catch (e) {}

// Google アナリティクスへ送る
function track(name, params) {
    try {
        if (REAL_SITE && window.gtag) window.gtag("event", name, { ...params, player_id: pid });
        else console.debug("[計測: 送信しない]", name, params);
    } catch (e) {}
}

function discover() {
    const k = comboKey(currentLeft, currentRight);
    if (foundSet.has(k)) return;
    found.push(k); foundSet.add(k); lsSet(FOUND_KEY, found); track("form_found", { combo: k, found_count: found.length });
    if (NEW_ALL) { newSet.add(k); saveNew(); updateNewBadge(); }
}



/* =============================
   4. 画面全体のレイアウト（スマホ／PC）
============================= */
const LOGO_PC = { scale: 1.6, dx: 0, dy: 20 };
const HB_SCALE = 0.7;
const BG = { zoom: 1.1, dx: -20, dy: -1 };
let layoutPC = null;
function layout() {
    if (isPC()) fillBtns();
    const st = $("stage");
    if (!st) return;
    const { W, H } = viewSize();
    const pc = W > 600 && W >= H;
    const root = document.documentElement;
    const modeChanged = layoutPC !== null && layoutPC !== pc;
    layoutPC = pc;
    root.classList.toggle("layout-pc", pc);
    root.classList.toggle("layout-sp", !pc);
    const set = (k, v) => st.style.setProperty(k, v);
    let ml, mt, mw, hm, pl, pt, pw, ph, f, sh, nbw, nbl, nbt;
    let shg;
    if (pc) {
        const gap = 24;
        let hm0 = H - 2 * Math.round(H * 0.04), mw0 = Math.round(hm0 * 0.75);
        pw = Math.max(380, Math.min(520, Math.round(W * 0.38)));
        mw = mw0;
        if (mw + gap + pw > W - 48) {
            pw = Math.max(300, Math.round((W - 48 - gap) * 0.42));
            mw = Math.min(mw0, W - 48 - gap - pw);
        }
        hm = Math.round(mw / 0.75);
        mt = Math.round((H - hm) / 2);
        ml = Math.max(24, Math.round((W - (mw + gap + pw)) / 2));
        pl = ml + mw + gap;
        f = hm / 500;
        const lgh = Math.round(Math.min(110, hm * 0.15)), lgw = Math.round(lgh * 16 / 9);
        pt = mt + lgh; ph = hm - lgh; sh = H;
        const lgh2 = Math.round(lgh * LOGO_PC.scale), lgw2 = Math.round(lgh2 * 16 / 9);
        set("--lgl", (pl + (pw - lgw2) / 2 + LOGO_PC.dx) + "px"); set("--lgt", Math.max(0, pt - lgh2 + LOGO_PC.dy) + "px"); set("--lgh", lgh2 + "px");
        set("--hbt", "10px"); set("--hbr", "10px"); set("--hbs", HB_SCALE);
        set("--tgd", "0px");
        const tx = ml + mw * 0.8, ty = mt + hm * 0.1;
        nbw = Math.ceil(Math.max(tx / 0.4453, (W - tx) / 0.5547, ty / 0.1375, (H - ty) / 0.425));
        nbl = Math.round(tx - 0.4453 * nbw); nbt = Math.round(ty - 0.1375 * nbw);
        set("--g1w", mw * 0.6 + "px"); set("--g1h", hm * 0.3 + "px"); set("--g1y", (mt + hm * 0.9) + "px");
        set("--g2w", mw * 0.56 + "px"); set("--g2h", hm * 0.4 + "px"); set("--g2y", (mt + hm * 0.45) + "px");
        set("--bgdx", "0px"); set("--bgdy", "0px");
    } else {
        const Wc = Math.min(W, 600), colL = Math.round((W - Wc) / 2);
        const psC = (Wc - 24) / 351;
        f = Wc / 375;
        mw = Math.round(375 * f); hm = Math.round(500 * f); mt = Math.round(45 * f);
        ml = colL + Math.round((Wc - mw) / 2);
        pl = colL; pw = Wc; pt = mt + hm;
        const sheetNeed = 8 + (78 + 6 + 127) * psC;
        sh = Math.round(pt + sheetNeed); ph = sh - pt; shg = sh;
        set("--tgd", (pl + 12 - (ml + 10 * f)) + "px");
        set("--lgl", (ml + 6 * f) + "px"); set("--lgt", 1 * f + "px"); set("--lgh", 44 * f + "px");
        set("--hbt", 10 * f + "px"); set("--hbr", (W - (ml + mw) + 10 * f) + "px"); set("--hbs", f * HB_SCALE);
        nbw = 1085 * f; nbl = ml + (-158 + BG.dx) * f; nbt = (-65 + BG.dy) * f;
        set("--g1w", W * 0.6 + "px"); set("--g1h", sh * 0.3 + "px"); set("--g1y", sh * 0.62 + "px");
        set("--g2w", W * 0.56 + "px"); set("--g2h", sh * 0.4 + "px"); set("--g2y", sh * 0.44 + "px");
    }

    { const hbs = parseFloat(st.style.getPropertyValue("--hbs")), rt = document.documentElement.style;
      rt.setProperty("--hb-top", st.style.getPropertyValue("--hbt")); rt.setProperty("--hb-right", st.style.getPropertyValue("--hbr"));
      rt.setProperty("--vw", W + "px"); rt.setProperty("--hb-w", 26 * hbs + "px"); rt.setProperty("--hb-h", 22 * hbs + "px"); rt.setProperty("--hb-t", 3 * hbs + "px"); }
    set("--shg", (pc ? sh : shg) + "px");
    const ps = (pw - 24) / 351;
    set("--ml", ml + "px"); set("--mt", mt + "px"); set("--mw", mw + "px"); set("--hm", hm + "px");
    set("--pl", pl + "px"); set("--pt", pt + "px"); set("--pw", pw + "px"); set("--phh", ph + "px"); set("--sh", sh + "px");
    set("--f", f.toFixed(4)); set("--ps", ps.toFixed(4)); set("--cs", ps.toFixed(4));
    set("--px", (ml + mw / 2) + "px"); set("--py", (mt + hm * 0.22) + "px"); set("--gx", mw * 0.264 + "px");
    set("--bld", hm * 0.38 + "px");
    set("--nbw", nbw + "px"); set("--nbl", nbl + "px"); set("--nbt", nbt + "px"); set("--bgz", BG.zoom);

    const lw = $("lwrap"), home = pc ? $("sheet") : $("mmList");
    if (lw && lw.parentNode !== home) home.appendChild(lw);
    if (modeChanged) { if (pc) closeModal(true); sync(); }

    if (document.querySelector(".tgt")) fitCaption(false);
    fitStageHeight();
}

function fitStageHeight() {
    const st = $("stage"), sheet = $("sheet");
    if (!st || !sheet) return;
    if (isPC()) { st.style.setProperty("--sh", viewSize().H + "px"); return; }
    const pt = parseFloat(st.style.getPropertyValue("--pt")) || 0, h = Math.ceil(sheet.getBoundingClientRect().height);
    if (h > 0) st.style.setProperty("--sh", Math.round(pt + h) + "px");
}



/* =============================
   5. ライダーの表示
============================= */
/* =============================
   レイヤー分岐表

   ・各表は先に書いた方が優先

   ・条件(cond)の書き方
       "a"          左右どちらかがaの時
       "a|b"        aまたはbの時
       "L:a"        左がaの時のみ
       "R:a"        右がaの時のみ
       "a>b"        左がaかつ右がbの時
       "a×b"        abの時またはbaの時
       "x,y"        xまたはyの時
       "*"          それ以外の常時

   ・値の書き方
       "画像名"              1枚目のレイヤーに全体を表示して、2枚目は不使用
       ["画像1", "画像2"]    1枚目と2枚目のレイヤーに、全体を表示
       { メモリ名: "画像名" } 1枚目は左半分に、2枚目は右半分に、各側の画像を表示
       null                 どちらも不使用
============================= */
// 分岐を判定する関数
const inAlts = (alts, form) => alts.split("|").includes(form);
const matchOne = (c, l, r) => {
    if (c === "*") return true;
    if (c.includes("×")) { const [a, b] = c.split("×"); return (inAlts(a, l) && inAlts(b, r)) || (inAlts(a, r) && inAlts(b, l)); }
    if (c.includes(">")) { const [a, b] = c.split(">"); return inAlts(a, l) && inAlts(b, r); }
    if (c.startsWith("L:")) return inAlts(c.slice(2), l);
    if (c.startsWith("R:")) return inAlts(c.slice(2), r);
    return inAlts(c, l) || inAlts(c, r);
};
const matches = (cond, l, r) => cond.split(",").some(c => matchOne(c, l, r));
const pickRule = (rules, l, r) => rules.find(([cond]) => matches(cond, l, r))?.[1] ?? null;


// 特殊分岐
const FANG_ETERNAL = { eyes: null, antenna: null, partition: null, neck: "black-neckF", cape: "damaged-cape" };
const SPECIALS = [
    ["accel×trial",     { half: { accel: "accelT" } }],
    ["claydoll×xtreme", { half: { claydoll: "claydollX" } }],
    ["fang>skull",      { full: "FangSkull" }],
    ["fang>eternal",    { full: "FangEternal", ...FANG_ETERNAL }],
    ["eternal>fang",    { full: "EternalFang", ...FANG_ETERNAL }],
    ["eternal>skull",   { full: "EternalSkull", eyes: null, antenna: null, partition: null, neck: "black-neck", cape: "damaged-cape" }],
    ["skull>joker",     { full: "SkullJoker", eyes: null, antenna: null, partition: null, neck: "skull-neck", muffler1: "skull-muffler" }],
    ["xtreme>xtreme",   { full: "xtremeX", eyes: null, antenna: null, partition: null, weapons: false, noGlow: true }],
    ["eternal×utopia",  { half: { eternal: "eternalRF" }, neck: null, cape: null }, "off"],
];
const findSpecial = (l, r) => {
    const state = weaponsVisible ? "on" : "off";
    return SPECIALS.find(([cond, , when]) => matches(cond, l, r) && (when ?? state) === state)?.[1] ?? {};
};


// halfの分岐
const HALF_RULES = [
    ["fang>fang", ["fang", "fang"]],
    ["L:fang",    ["fang", "{R}F"]],
    ["R:fang",    ["{L}F", "fang"]],
    ["skull>skull", ["skullS", "skullS"]],
    ["L:skull",   ["skull", "{R}"]],
    ["R:skull",   ["{L}S", "skullS"]],
    ["*",         ["{L}", "{R}"]],
];
const resolveHalves = (l, r, ov) => {
    let [ls, rs] = pickRule(HALF_RULES, l, r).map(f => f.replace("{L}", l).replace("{R}", r));
    if (ov.half) { ls = ov.half[l] ?? ls; rs = ov.half[r] ?? rs; }
    return [ov.full ?? ls, rs];
};


// half以外の分岐
const LAYER_RULES = {
    driver: [
        ["L:fang", "driverF"],
        ["*", "driver"],
    ],
    neck: [
        ["fang×terror|utopia", "black-neckF"],
        ["eternal|terror|utopia", "black-neck"],
        ["R:skull", "skull-neck"],
    ],
    eyes: [
        ["nasca×yesterday",  { nasca: "orange-eyes", yesterday: "brown-eyes" }],
        ["nasca×taboo",      { nasca: "orange-eyes", taboo: "purple-eyes" }],
        ["nasca×nasca3",     { nasca: "orange-eyes", nasca3: "white-eyes" }],
        ["nasca3×taboo",     { nasca3: "white-eyes", taboo: "purple-eyes" }],
        ["nasca3×weather",   { nasca3: "white-eyes", weather: "black-eyes" }],
        ["taboo×weather",    { taboo: "purple-eyes", weather: "black-eyes" }],
        ["nasca>joker,cyclone>nasca", "orange-eyes"],
        ["accel×fang",       "accel-eyesF"],
        ["trial×fang",       "trial-eyesF"],
        ["trial",            "trial-eyes"],
        ["accel",            "accel-eyes"],
        ["eternal",          "yellow-eyes"],
        ["fang",             "red-eyesF"],
        ["*",                "red-eyes"],
    ],
    antenna: [
        ["eternal",                 "antennaE"],
        ["fang×terror|utopia",      "gold-antennaF"],
        ["terror|utopia",           "gold-antenna"],
        ["fang",                    "antennaF"],
        ["nasca>joker,cyclone>nasca,nasca>nasca3,nasca×yesterday,nasca×taboo", "antennaN"],
        ["nasca3>nasca,nasca3×taboo,nasca3×weather",                           "antennaN3"],
        ["*",                       "antenna"],
    ],
    partition: [
        ["eternal", "partitionE"],
        ["*", "partition"],
    ],
    cape: [
        ["utopia×terror|eternal", "red-cape"],
        ["terror",  "gold-cape"],
        ["eternal", "black-cape"],
        ["utopia",  "slanted-cape"],
    ],
    waist: [
        ["claydoll×xtreme", { claydoll: "brown-waist", xtreme: "black-waist" }],
    ],
    wings: [
        ["nasca×yesterday", { nasca: "nasca-big-wings", yesterday: "nasca-big-wingsWhite" }],
        ["nasca×taboo",     { nasca: "nasca-big-wings", taboo: "nasca-big-wingsPink" }],
        ["nasca×nasca3",    { nasca: "nasca-big-wings", nasca3: "nasca3-big-wings" }],
        ["nasca3×taboo",    { nasca3: "nasca3-big-wings", taboo: "nasca-big-wingsPink" }],
        ["nasca3×weather",  { nasca3: "nasca3-big-wings", weather: "nasca-big-wingsWhite" }],
        ["nasca>joker,cyclone>nasca", "nasca-big-wings"],
        ["bird×nasca",      ["bird-wings", "nasca-wings"]],
        ["bird×nasca3",     ["bird-wings", "nasca3-wings"]],
        ["bird",   "bird-wings"],
        ["nasca",  "nasca-wings"],
        ["nasca3", "nasca3-wings"],
    ],
    muffler1: [
        ["R:skull",           "skull-muffler"],
        ["L:cyclone|nasca3",  "silver-muffler"],
        ["L:nasca",           "nasca-muffler"],
    ],
    muffler2: [
        ["R:cyclone|nasca3",  "silver-muffler"],
        ["R:nasca",           "nasca-muffler"],
    ],
};


// 分岐を成立させるための関数群
const layerValue = (name, l, r, ov) => (name in ov ? ov[name] : pickRule(LAYER_RULES[name], l, r));

const splitValue = (val, l, r) => {
    if (Array.isArray(val)) return [[val[0], ""], [val[1], ""]];
    if (val && typeof val === "object") return [[val[l], "l"], [val[r], "r"]];
    return [[val, ""], [null, ""]];
};



/* =============================
   武器分岐表
   ・① WEAPON_PAIRS: 組み合わせ全体の結果を、レイヤーごとに直接書く。
   ・② WEAPON_MEMBERS: 各メモリの武器画像を決める行（全体表示。層を指定しなければ DEFAULT_WEAPON_LAYER の層）。
   ・③ WEAPON_HALF: 「〇〇-weapon」1枚をトリミングして使うメモリ。メモリが左なら左半分、右なら右半分だけ表示する。
   ・層が決まっていないメモリは、左なら weapon1・右なら weapon2。すでに使われていれば空いている方に出す。
============================= */
const WEAPON_PAIRS = [
    ["fang>dummy",      { 1: "fang-weapon:l",  2: "fang-weapon~:r" }],
    ["dummy>fang",      { 1: "fang-weapon~:l", 2: "fang-weapon:r" }],
    ["utopia>utopia",   { 1: "utopia-weapon3" }],
    ["metal>metal",     { bg: "metal-weapon2" }],
    ["cyclone>joker",   { 2: "cyclone-weaponCJ" }],
    ["joker>cyclone",   { 2: "cyclone-weaponJC" }],
    ["cyclone×terror",  { 1: "cyclone-weaponDark", 2: "terror-weapon" }],
    ["cyclone×xtreme",  { 1: "cyclone-weapon", 2: "xtreme-weapon" }],
    ["xtreme×terror",   { 1: "xtreme-weaponCaped", 2: "terror-weapon" }],
    ["prism×xtreme",    { 1: "prism-weaponX", 2: "xtreme-weapon" }],
    ["claydoll×xtreme", { 2: "claydoll-weaponX" }],
    ["claydoll>gene",   { 1: "claydoll-weaponCG" }],
    ["gene>claydoll",   { 1: "claydoll-weaponGC" }],
];

const DEFAULT_WEAPON_LAYER = { cyclone: 2, xtreme: 2, terror: 2, utopia: 1, metal: "bg" };

const WEAPON_MEMBERS = [
    ["cyclone×accel|heat|engine|bomb|claydoll", "cyclone", "cyclone-weaponFire"],
    ["cyclone>nasca",                            "cyclone", "cyclone-weaponFire"],
    ["cyclone×iceage|ocean",                    "cyclone", "cyclone-weaponWater"],
    ["cyclone×smilodon",                        "cyclone", "cyclone-weapon", 1],
    ["*",                                       "cyclone", "cyclone-weapon"],
    ["fang×xtreme",         "xtreme", "xtreme-weaponF", 1],
    ["smilodon>xtreme",     "xtreme", "xtreme-weaponSmX", 1],
    ["xtreme>smilodon",     "xtreme", "xtreme-weaponXSm", 1],
    ["skull>xtreme",        "xtreme", "xtreme-weaponSkX"],
    ["xtreme>skull",        "xtreme", "xtreme-weaponXSk"],
    ["xtreme×eternal|utopia", "xtreme", "xtreme-weaponCaped"],
    ["*",                   "xtreme", "xtreme-weapon"],
    ["fang×terror",         "terror", "terror-weaponF"],
    ["terror×accel|trial",  "terror", "terror-weaponA"],
    ["*",                   "terror", "terror-weapon"],
    ["*",                   "utopia", "utopia-weapon{n}"],
    ["*",                   "queen",  "queen-weapon{f}"],
    ["fang×metal|trigger",  "fang",   null],
    ["fang>metal",          "metal",  "metal-weaponF"],
    ["metal>fang",          "metal",  "metal-weaponF~"],
    ["*",                   "metal",  "metal-weapon1{f}"],
];

const WEAPON_HALF = [
    "accel", "eternal", "gene", "heat", "iceage", "key", "nasca", "nasca3", "ocean", "puppeteer", "rocket", "skull",
    "trigger", "unicorn", "yesterday", "zone", "prism", "trial", "bomb", "taboo", "smilodon", "claydoll",
    "luna", "violence", "weather", "fang",
];

const WEAPON_HALF_VARIANTS = [
    ["fang×trigger",    "trigger",  "trigger-weaponF"],
    ["fang×luna",       "luna",     "luna-weaponF"],
    ["fang×violence",   "violence", "violence-weaponF"],
    ["fang×trial",      "trial",    "trial-weaponF"],
    ["xtreme×violence", "violence", "violence-weaponX"],
    ["weather×taboo|nasca3", "weather", "weather-weaponT"],
];

const ENGINE_UNDER = ["utopia", "queen"];
const ENGINE_FRONT = [
    ["accel×engine",    "engine-weaponA"],
    ["engine>skull",    "engine-weaponS"],
    ["xtreme×engine",   "engine-weaponX"],
    ["*",               "engine-weapon"],
];

const WEAPON_LAYERS = [["weapon1Layer", 1], ["weapon2Layer", 2], ["backgroundLayer", "bg"], ["foregroundLayer", "fg"]];

const parseFlip = (img) => {
    const [name, clip = ""] = img.split(":");
    return name.endsWith("~") ? { src: name.slice(0, -1), flip: true, clip } : { src: name, flip: false, clip };
};

const memberWeapon = (m, side, l, r) => {
    const n = side === "l" ? 1 : 2;
    const full = WEAPON_MEMBERS.find(([cond, who]) => who === m && matches(cond, l, r));
    if (full && !full[2]) return null;
    if (full) return { ...parseFlip(full[2].replace("{n}", n).replace("{f}", side === "r" ? "~" : "")), clip: "", layer: full[3] ?? DEFAULT_WEAPON_LAYER[m] };
    if (m === "engine") return { src: "accel-weapon", clip: side, front: ENGINE_FRONT.find(([cond]) => matches(cond, l, r))[1] };
    if (!WEAPON_HALF.includes(m)) return null;
    const v = WEAPON_HALF_VARIANTS.find(([cond, who]) => who === m && matches(cond, l, r));
    return { src: v ? v[2] : `${m === "nasca3" ? "nasca" : m}-weapon`, clip: side };
};

const resolveWeapons = (left, right) => {
    const out = {};
    const l = left === "dummy" ? right : left;
    const r = right === "dummy" ? left : right;
    if (l === "dummy") return out;

    const pair = WEAPON_PAIRS.find(([cond]) => matches(cond, left, right) || matches(cond, l, r));
    if (pair) {
        Object.entries(pair[1]).forEach(([slot, img]) => { const { src, flip, clip } = parseFlip(img); out[slot] = [src, clip, flip]; });
        return out;
    }
    const items = [["l", l], ["r", r]].map(([side, m]) => ({ side, m, ...memberWeapon(m, side, l, r) })).filter(i => i.src);
    const eng = items.filter(i => i.m === "engine"), ut = items.find(i => ENGINE_UNDER.includes(i.m));
    if (eng.length === 1 && ut) {
        out.fg = [ut.src, ut.clip, ut.flip];
        out[1] = [eng[0].front, eng[0].clip, false];
        out[2] = [eng[0].src, eng[0].clip, false];
        return out;
    }
    items.filter(i => i.layer).forEach(i => { out[i.layer] ??= [i.src, i.clip, i.flip]; });
    items.filter(i => !i.layer).forEach(i => {
        const want = i.side === "l" ? 1 : 2;
        out[out[want] ? 3 - want : want] ??= [i.src, i.clip, i.flip];
    });
    if (eng.length) out.fg = [eng[0].front, eng.length === 2 ? "" : eng[0].clip, false];
    return out;
};


/* ---- レイヤーの決定と描画 ---- */
const UNTRIMMED = ["skull-muffler"];
const LAYER_SINGLES = [
    ["driverLayer", "driver", ""], ["neckLayer", "neck", ""], ["antennaLayer", "antenna", ""],
    ["partitionLayer", "partition", ""], ["capeLayer", "cape", ""],
    ["muffler1Layer", "muffler1", "l"], ["muffler2Layer", "muffler2", "r"],
];
const LAYER_PAIRS = [["eyes1Layer", "eyes2Layer", "eyes"], ["wings1Layer", "wings2Layer", "wings"], ["waist1Layer", "waist2Layer", "waist"]];


function resolveLayers(left, right) {
    const ov = findSpecial(left, right), out = [];
    const weapons = ov.weapons === false ? {} : resolveWeapons(left, right);
    WEAPON_LAYERS.forEach(([id, slot]) => {
        const [src, clip, flip] = weapons[slot] || [null, "", false];
        out.push({ id, src, clip, flip, weapon: true });
    });
    const [leftSrc, rightSrc] = resolveHalves(left, right, ov);
    out.push({ id: "leftHalf", src: leftSrc, clip: ov.full ? "" : "l" }, { id: "rightHalf", src: ov.full ? null : rightSrc, clip: "r" });
    const val = Object.fromEntries(Object.keys(LAYER_RULES).map(name => [name, layerValue(name, left, right, ov)]));
    if (val.cape) val.muffler1 = val.muffler2 = null;
    LAYER_SINGLES.forEach(([id, name, clip]) => out.push({ id, src: val[name], clip: UNTRIMMED.includes(val[name]) ? "" : clip }));
    LAYER_PAIRS.forEach(([id1, id2, name]) => {
        const [a, b] = splitValue(val[name], left, right), weapon = name === "wings";
        out.push({ id: id1, src: a[0], clip: a[1], weapon }, { id: id2, src: b[0], clip: b[1], weapon });
    });
    return out;
}


const setLayer = (id, src, clip = "", flip = false) => {
    const layer = $(id);
    const url = src ? webp(src) : null;
    const same = layer.firstElementChild?.getAttribute("src") === url && layer.dataset.clip === clip && layer.dataset.flip === (flip ? "1" : "");
    if (same) return;
    layer.innerHTML = "";
    layer.dataset.clip = clip;
    layer.dataset.flip = flip ? "1" : "";
    if (!url) return;
    const img = document.createElement("img");
    img.src = url;
    layer.appendChild(img);
};


function updateHalf() {
    const hideW = !weaponsVisible;
    for (const l of resolveLayers(currentLeft, currentRight)) {
        setLayer(l.id, hideW && l.weapon ? null : l.src, l.clip, l.flip);
        if (l.weapon) $(l.id).dataset.hasWeapon = l.src ? "true" : "false";
    }
    updateWeaponsDisplay();
    prefetchWeaponsLater();
}


function updateWeaponsDisplay() {
    WEAPON_LAYERS.forEach(([id]) => {
        const layer = $(id);
        layer.style.display = (layer.dataset.hasWeapon === "true" && !weaponsVisible) ? "none" : "";
    });
}


/* ---- 背景2色の変更 ---- */
let bgHold = false, bgFrom = null, bgTo = null, bgRaf = 0, bgThawFn = null, bgFrozen = false, bgAnims = null;
function setBg(l, r) {
    const st = $("stage"); if (!st) return;
    if (bgHold) return;
    if (bgTo && bgTo.l === l && bgTo.r === r) return;
    const ph2 = st.querySelector(".ph2"), c1 = st.querySelector(".glowc"), c2 = st.querySelector(".glowc2"), els = [ph2, c2];
    const A = (a, b) => { st.style.setProperty("--bcl", a); st.style.setProperty("--bcr", b); };
    const finish = () => { if (bgAnims) { bgAnims.forEach(a => { a.onfinish = null; a.cancel(); }); bgAnims = null; } cancelAnimationFrame(bgRaf); bgRaf = 0; bgThawFn = null; bgFrozen = false; if (bgTo) A(bgTo.l, bgTo.r); st.classList.remove("bgfade"); [ph2, c1, c2].forEach(e => e.style.removeProperty("opacity")); bgFrom = bgTo; };
    if (st.classList.contains("bgfade")) finish();
    if (!bgTo || !animOn) { A(l, r); st.classList.remove("bgfade"); bgFrom = bgTo = { l, r }; return; }
    els.forEach(e => { e.style.setProperty("--bcl", l); e.style.setProperty("--bcr", r); });
    const ms = Math.max(0, (window.getSlideMs ? getSlideMs() : 1500));
    bgTo = { l, r };
    if (ms <= 0) { finish(); return; }
    st.classList.add("bgfade");
    if (ph2.animate) {    
        ph2.style.opacity = 0; c2.style.opacity = 0; c1.style.opacity = 1;
        const mk = (el, a, b) => el.animate([{ opacity: a }, { opacity: b }], { duration: ms, easing: "cubic-bezier(0.3333, 0, 0.6667, 1)", fill: "forwards" });     
        bgAnims = [mk(ph2, 0, 1), mk(c2, 0, 1), mk(c1, 1, 0)];
        bgAnims[0].onfinish = () => { if (bgAnims) finish(); };
        return;
    }
    let p = 0, last = 0;
    const step = now => {
        p = Math.min(1, p + (last ? Math.min(now - last, 50) : 0) / ms); last = now;
        const e = p * p * (3 - 2 * p);
        ph2.style.opacity = e; c2.style.opacity = e; c1.style.opacity = 1 - e;
        if (p >= 1) finish(); else bgRaf = requestAnimationFrame(step);
    };
    ph2.style.opacity = 0; c2.style.opacity = 0; c1.style.opacity = 1;
    bgThawFn = () => { last = 0; bgRaf = requestAnimationFrame(step); };
    bgRaf = requestAnimationFrame(step);
}

function bgFreeze() { const st = $("stage"); if (!st || !st.classList.contains("bgfade") || bgFrozen) return false; cancelAnimationFrame(bgRaf); bgRaf = 0; if (bgAnims) bgAnims.forEach(a => a.pause()); bgFrozen = true; return true; }
function bgThaw() { if (!bgFrozen) return; bgFrozen = false; if (bgAnims) bgAnims.forEach(a => a.play()); else if (bgThawFn) bgThawFn(); }
const syncBg = () => setBg(colorOf(currentLeft), colorOf(currentRight));


/* ---- 画像の先読み ---- */
const prefetched = new Map();
function prefetchImage(src) {
    if (prefetched.has(src)) return;
    const img = new Image(); img.src = webp(src); img.decode().catch(() => {});
    prefetched.set(src, img);
}
function sourcesFor(left, right, weaponsOnly) {
    return [...new Set(resolveLayers(left, right).filter(l => l.src && (weaponsOnly ? l.weapon : (weaponsVisible || !l.weapon))).map(l => l.src))];
}
let weaponIdleId = 0;
function prefetchWeaponsLater() {
    if (weaponsVisible) return;
    clearTimeout(weaponIdleId);
    weaponIdleId = setTimeout(() => {
        const run = () => sourcesFor(currentLeft, currentRight, true).forEach(prefetchImage);
        if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 5000 }); else run();
    }, 2500);
}
function prefetchFor(v) {
    new Set([...sourcesFor(v, currentRight), ...sourcesFor(currentLeft, v)]).forEach(prefetchImage);
}


let candTimer = 0;
function prefetchCandidates(side) {
    clearTimeout(candTimer);
    if (navigator.connection && navigator.connection.saveData) return;
    const cur = side === "L" ? currentLeft : currentRight;
    const list = forms.map(f => f.value).filter(v => v !== cur);
    const seen = new Set();
    let i = 0;
    const step = () => {
        if (pendingSide !== side) return;
        while (i < list.length) {
            const v = list[i++], srcs = sourcesFor(side === "L" ? v : currentLeft, side === "L" ? currentRight : v).filter(x => !seen.has(x));
            if (!srcs.length) continue;
            for (const x of srcs) { seen.add(x); fetch(webp(x), { priority: "low" }).catch(() => {}); }
            candTimer = setTimeout(step, 150);
            return;
        }
    };
    step();
}


/* ---- ランダム機能 ---- */
function shufflePick() {
    const unseen = [];
    for (const a of forms) for (const b of forms) if (!foundSet.has(comboKey(a.value, b.value))) unseen.push([a.value, b.value]);
    if (unseen.length) return unseen[Math.floor(Math.random() * unseen.length)];
    const pick = () => forms[Math.floor(Math.random() * forms.length)].value;
    return [pick(), pick()];
}
async function shuffleForm() {
    if (henshinPlaying || mmBusy) return;
    const [l, r] = shufflePick();
    clearPick(true);
    await changeForm(() => { currentLeft = l; currentRight = r; histPush(); });
}


function bindViewer() {
    let last = 0;
    $("viewer-area").addEventListener("pointerup", () => { const t = Date.now(); if (t - last < 320) { last = 0; if (!mmOpen) shuffleForm(); } else last = t; });
}



/* =============================
   6. 初回の変身演出
============================= */
const HENSHIN_DIM = 0.8;
const HENSHIN_FACE_FRAME = 3.08;
const HENSHIN_FACE_Y = 0.2;
const HENSHIN_POP_MS = 150, HENSHIN_HOLD_MS = 666, HENSHIN_OUT_MS = 700, HENSHIN_MIN_DARK_MS = 350, HENSHIN_LOAD_CAP_MS = 4000;
const HENSHIN_SHAKE_PX = 10;
const HENSHIN_SHAKE_MS = 250;

function shakeElements(els) {
    const pattern = [[-1, .6], [.9, -.8], [-.8, -.5], [.7, .7], [-.55, .35], [.4, -.3], [-.25, .2], [.12, -.1], [0, 0]];
    const keyframes = [{ translate: "0px 0px" }, ...pattern.map(([x, y]) => ({ translate: `${x * HENSHIN_SHAKE_PX}px ${y * HENSHIN_SHAKE_PX}px` }))];
    els.forEach(el => el.animate(keyframes, { duration: HENSHIN_SHAKE_MS, easing: "linear", composite: "add" }));
}

const eyesMaskPath = () => webp(currentLeft === "fang" || currentRight === "fang" ? "bright-eyesF" : "bright-eyes");

let tapWarm = [];
async function playIntroTo(l, r, bm, w) {
    const html = document.documentElement, dim = $("introDim"), lib = $("library");
    henshinPlaying = true;
    try {
        if (bm && w !== weaponsVisible) setWeapons(w);
        tapWarm = sourcesFor(l, r).map(src => { const im = new Image(); im.src = webp(src); im.decode().catch(() => {}); return im; });
        dim.style.opacity = "0";
        html.classList.add("intro-on", "intro-ui");
        const pre = dim.animate([{ opacity: 0 }, { opacity: .5 }], { duration: 200, easing: "ease-out", fill: "forwards" });
        await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
        window.scrollTo(0, 0);
        currentLeft = l; currentRight = r; histPush(); applyForm();
        await playIntro({ fromLib: true, dimFrom: () => { const d = +getComputedStyle(dim).opacity; pre.cancel(); return d; }, onDark: () => {
            lib.style.transition = "none"; closeMenu();
            setTimeout(() => { lib.style.transition = ""; }, 80);
        } });
    } catch (e) { console.error(e); }
    finally { dim.style.opacity = ""; lib.style.transition = ""; henshinPlaying = false; fitCaption(true); }
}

async function playIntro(opts = {}) {
    const html = document.documentElement;
    const viewer = $("viewer-area"), dim = $("introDim"), eff = $("introEffect"), vdim = $("viewerDim"), stage = $("stage");
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const play = (el, kf, ms, ease) => el.animate(kf, { duration: ms, easing: ease, fill: "forwards" }).finished;
    const decodeUrl = u => { const i = new Image(); i.src = u; return i.decode().catch(() => {}); };
    const ui = [...document.querySelectorAll(".nm,.tools,.fade,.top,#creditBox")];
    const t0 = performance.now();
    try {
        const imgs = [...viewer.querySelectorAll("img")].filter(i => i.id !== "watermarkImg" && i.getAttribute("src"));
        const isRest = i => !!i.closest("#weapon1Layer,#weapon2Layer,#backgroundLayer,#foregroundLayer");
        const hero = imgs.filter(i => !isRest(i)), rest = imgs.filter(isRest);
        await Promise.race([Promise.all([...hero.map(i => i.decode().catch(() => {})), decodeUrl(webp("henshin")), decodeUrl(webp("Fuuto")), decodeUrl(webp("windmill")), decodeUrl(eyesMaskPath())]), wait(HENSHIN_LOAD_CAP_MS)]);
        if (!opts.fromLib) await wait(Math.max(0, HENSHIN_MIN_DARK_MS - (performance.now() - t0)));
        const st = stage.getBoundingClientRect(), cx = st.left + st.width / 2, cy = st.top + Math.min(st.height, viewSize().H) / 2;
        eff.style.left = cx + "px"; eff.style.top = cy + "px"; eff.style.width = Math.min(600, st.width * 1.2) + "px";
        const vr = viewer.getBoundingClientRect();
        const S = Math.min(8, Math.max(2, HENSHIN_FACE_FRAME * Math.min(st.height, viewSize().H) / vr.height));
        viewer.style.transformOrigin = "50% " + (HENSHIN_FACE_Y * 100) + "%"; viewer.style.zIndex = 5500;
        const tx = cx - (vr.left + vr.width / 2), ty = cy - (vr.top + vr.height * HENSHIN_FACE_Y), zoomed = { translate: tx + "px " + ty + "px", scale: S };
        vdim.style.opacity = HENSHIN_DIM; vdim.style.setProperty("--eyes-mask", `url("${eyesMaskPath()}")`);
        viewer.style.opacity = 0; Object.assign(viewer.style, { translate: zoomed.translate, scale: S });
        const pop = Promise.all([
            play(dim, opts.fromLib ? [{ opacity: opts.dimFrom ? opts.dimFrom() : 0 }, { opacity: 1, offset: .67 }, { opacity: HENSHIN_DIM }] : [{ opacity: 1 }, { opacity: HENSHIN_DIM }], HENSHIN_POP_MS, "ease-out"),
            play(viewer, [{ ...zoomed, opacity: 0 }, { ...zoomed, opacity: 1 }], HENSHIN_POP_MS, "ease-out"),
            play(eff, [{ transform: "translate(-50%,-50%) scale(5)", opacity: 0 }, { transform: "translate(-50%,-50%) scale(1.25)", opacity: 1 }], HENSHIN_POP_MS, "cubic-bezier(.2,.8,.2,1)"),
        ]);
        shakeElements([viewer, eff]);
        if (opts.onDark) setTimeout(opts.onDark, HENSHIN_POP_MS * .67);
        await pop;
        await wait(Math.max(0, HENSHIN_HOLD_MS - HENSHIN_POP_MS));
        await Promise.race([Promise.all(rest.map(i => i.decode().catch(() => {}))), wait(1500)]);
        await Promise.all([
            play(eff, [{ transform: "translate(-50%,-50%) scale(1.25)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(.5)", opacity: 0 }], HENSHIN_OUT_MS, "linear"),
            play(dim, [{ opacity: HENSHIN_DIM }, { opacity: 0 }], HENSHIN_OUT_MS, "linear"),
            play(viewer, [{ ...zoomed, opacity: 1 }, { translate: "0px 0px", scale: 1, opacity: 1 }], HENSHIN_OUT_MS, "linear"),
            play(vdim, [{ opacity: HENSHIN_DIM }, { opacity: 0 }], HENSHIN_OUT_MS, "linear"),
            wait(Math.max(0, HENSHIN_OUT_MS - 450)).then(() => {
                html.classList.remove("intro-ui");
                ui.forEach(e => { e.style.opacity = 0; }); void document.body.offsetWidth;
                ui.forEach(e => { e.style.transition = "opacity .45s ease-out"; e.style.opacity = 1; });
            }),
        ]);
    } catch (e) { console.error(e); }
    finally {
        html.classList.remove("intro-on", "intro-ui");
        [dim, eff, viewer, vdim].forEach(el => el && el.getAnimations().forEach(a => a.cancel()));
        Object.assign(viewer.style, { translate: "", scale: "", transformOrigin: "", zIndex: "", opacity: "" });
        vdim.style.opacity = ""; vdim.style.removeProperty("--eyes-mask");
        eff.style.left = ""; eff.style.top = ""; eff.style.width = "";
        setTimeout(() => ui.forEach(e => { e.style.opacity = ""; e.style.transition = ""; }), 600);
    }
}


/* =============================
   7. 4ボタン
============================= */
/* ---- ブックマークボタン ---- */
function toggleBm(l, r, w) {
    const i = bms.findIndex(b => b.l === l && b.r === r), on = i < 0;
    if (on) bms.push({ l, r, w }); else { bms.splice(i, 1); newSet.delete(comboKey(l, r)); saveNew(); updateNewBadge(); }
    lsSet(BM_KEY, bms); refreshBm(); track(on ? "bookmark_add" : "bookmark_remove", { combo: comboKey(l, r) });
    return on;
}
function toggleBookmark() {
    if (toggleBm(currentLeft, currentRight, weaponsVisible)) {
        newSet.add(comboKey(currentLeft, currentRight)); saveNew(); updateNewBadge();
        glowMenu();
    }
}
function glowMenu() { const m = $("menuBtn"); m.classList.add("lit"); clearTimeout(glowMenu.t); glowMenu.t = setTimeout(() => m.classList.remove("lit"), 900); }


function refreshBm() { const b = $("bookmarkBtn"), on = isBookmarked(currentLeft, currentRight); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }


/* ---- Xボタン ---- */
function shareToX() {
    const baseUrl = "https://actctzagi.github.io/w-simulator-unofficial/";
    const weaponsParam = weaponsVisible ? "" : "&w=0";   // 武器表示の状態をリンクに引き継ぐ
    const shareUrl = `${baseUrl}?left=${encodeURIComponent(currentLeft)}&right=${encodeURIComponent(currentRight)}${weaponsParam}&v=2`;
    const comboName = rawName(currentLeft) + rawName(currentRight);
    const text =
`仮面ライダーW
今回のメモリは……

【${comboName}】

これで決まりだ！

#AtoZ運命のシミュレーター
でこのフォームを見る▼【非公式】
${shareUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}


/* ---- アニメボタン ---- */
let animFrozen = false;
function animFreeze() { if (animFrozen) return; const a = window.HenshinSlide ? HenshinSlide.freeze() : false, b = bgFreeze(); animFrozen = a || b; if (animFrozen) henshinPlaying = false; }
function animThaw() { if (!animFrozen) return; animFrozen = false; if (window.HenshinSlide) HenshinSlide.thaw(); bgThaw(); }
function animCancelFrozen() { if (!animFrozen) return; animFrozen = false; if (window.HenshinSlide) HenshinSlide.cancel(); }


// 見えていないときは、アニメの動きを止める（風車・航空障害灯）
let motionOn = true, stageVisible = true;
function updateMotion() {
    const on = !document.hidden && stageVisible && !MENU_HASHES.includes(location.hash) && !prefersReduce();
    if (on === motionOn) return;
    motionOn = on;
    $("stage").classList.toggle("motion-off", !on);
    updateBlink();
}
function initMotionPause() {
    document.addEventListener("visibilitychange", updateMotion);
    window.addEventListener("hashchange", updateMotion);
    if (reduceMotionMQ) reduceMotionMQ.addEventListener?.("change", updateMotion);
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(es => { stageVisible = es[es.length - 1].isIntersecting; updateMotion(); }, { threshold: 0 }).observe($("stage"));
    }
    updateMotion();
}


// 航空障害灯の点滅
const BLINK = { period: 3, rise: 0.5, on: 2, low: 0.2 };
function cubicBezier(x1, y1, x2, y2) {
    const bx = t => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t, by = t => 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
    return x => { let lo = 0, hi = 1, t = x; for (let i = 0; i < 20; i++) { t = (lo + hi) / 2; if (bx(t) < x) lo = t; else hi = t; } return by(t); };
}
const easeIn = cubicBezier(.42, 0, 1, 1), easeOut = cubicBezier(0, 0, .58, 1);
function blinkOpacity(sec) {
    const { period, rise, on, low } = BLINK, t = sec % period;
    if (t < rise) return low + (1 - low) * easeIn(t / rise);
    if (t < on - rise) return 1;
    if (t < on) return 1 - (1 - low) * easeOut((t - (on - rise)) / rise);
    return low;
}


let blinkEls = [], blinkRaf = 0, blinkLast = -1;
function blinkSet(v) {
    if (Math.abs(v - blinkLast) < 0.004) return;
    blinkLast = v;
    const s = v.toFixed(3);
    for (const el of blinkEls) el.style.opacity = s;
}
function blinkTick(now) {
    blinkRaf = requestAnimationFrame(blinkTick);
    blinkSet(blinkOpacity(now / 1000));
}
function updateBlink() {
    if (!blinkEls.length) return;
    if (motionOn && animOn) { if (!blinkRaf) blinkRaf = requestAnimationFrame(blinkTick); return; }
    cancelAnimationFrame(blinkRaf); blinkRaf = 0;
    if (!animOn) blinkSet(1); else if (prefersReduce()) blinkSet(BLINK.low);
}
function startBlink() {
    blinkEls = [...document.querySelectorAll(".lit-layer")];
    updateBlink();
}


/* ---- 武器ボタン ---- */
function setWeapons(v) { weaponsVisible = v; $("ckWeapons").checked = v; saveSettings(); }


function bindTools() {
    { const bm = $("bookmarkBtn"); let timer = 0, long = false;
      bm.addEventListener("pointerdown", () => { long = false; clearTimeout(timer); timer = setTimeout(() => { long = true; location.hash = "#library"; }, 550); });
      for (const t of ["pointerup", "pointerleave", "pointercancel"]) bm.addEventListener(t, () => clearTimeout(timer));
      bm.addEventListener("contextmenu", e => e.preventDefault());
      bm.addEventListener("click", () => { if (long) { long = false; return; } toggleBookmark(); }); }
    refreshBm();
    $("shareBtn").addEventListener("click", shareToX);
    $("ckWeapons").checked = weaponsVisible; $("ckAnim").checked = animOn; $("stage").classList.toggle("anim-off", !animOn);
    $("ckWeapons").addEventListener("change", e => {
        setWeapons(e.target.checked);
        updateHalf();
        sync();
    });
    $("ckAnim").addEventListener("change", e => { animOn = e.target.checked; saveSettings(); $("stage").classList.toggle("anim-off", !animOn); updateBlink(); if (animOn) animThaw(); else animFreeze(); });
}


/* =============================
   8. 戻る・進むボタン
============================= */
const HIST_MAX = 100;
let hist = [], histIdx = -1;
function histSave() { try { localStorage.setItem(HIST_KEY, JSON.stringify({ list: hist, idx: histIdx })); } catch (e) {} }
function histLoad() {
    try {
        const o = JSON.parse(localStorage.getItem(HIST_KEY) || "null");
        if (o && Array.isArray(o.list)) {
            hist = o.list.filter(p => Array.isArray(p) && validForm(p[0]) && validForm(p[1]));
            histIdx = Math.min(Math.max(o.idx | 0, 0), hist.length - 1);
        }
    } catch (e) { hist = []; histIdx = -1; }
}
function histCurrent() { return hist[histIdx] || null; }
function histPush() {
    discover();
    const cur = histCurrent();
    if (cur && cur[0] === currentLeft && cur[1] === currentRight) return;
    hist = hist.slice(0, histIdx + 1);
    hist.push([currentLeft, currentRight]);
    if (hist.length > HIST_MAX) hist.shift();
    histIdx = hist.length - 1;
    histSave();
}


async function stepHistory(d) {
    if (henshinPlaying || modalOn() || mmBusy) return false;
    const t = hist[histIdx + d];
    if (!t) return false;
    histIdx += d; histSave();
    clearPick();
    await changeForm(() => { currentLeft = t[0]; currentRight = t[1]; });
    return true;
}


function bindEdges() {
    for (const [id, d] of [["edgeL", -1], ["edgeR", 1]]) {
        const el = $(id);
        const hit = () => { el.classList.add("hit"); el.classList.toggle("none", !hist[histIdx + d] || henshinPlaying || mmOpen); };
        const rel = () => el.classList.remove("hit");
        el.addEventListener("pointerdown", hit);
        el.addEventListener("pointerup", rel); el.addEventListener("pointercancel", rel); el.addEventListener("pointerleave", rel);
        el.addEventListener("click", () => { stepHistory(d); });
    }
}


/* =============================
   9. 二大メモリ
============================= */
const INFO_FLIP_MS = 175;
let infoFlip = false, infoFlipTimer = 0;
let infoClosed = true;


function targetsHTML(neutral) {
    const pS = neutral ? null : pendingSide, pd = neutral ? null : pending;
    const one = (sd, v) => {
        const s = sd === "L" ? "left" : "right";
        const sel = pS === sd;
        const eligible = sel || (pS === null && pd !== null && v !== pd);
        const here = pS === null && pd !== null && v === pd;
        const arrow = eligible ? `<img class="target-arrow" src="${webp(sd === "L" ? "arrow1" : "arrow2")}?v=2" alt="">` : "";
        const vis = `<div class="vis"><img src="${memoryBtnImage(v, s)}" alt=""><span>${labelOf(v)}</span>${sel ? `<span class="lbl">メモリを選択</span>` : ""}</div>`;
        return `<div class="tbw"><div class="tb${here ? " dimmed" : ""}${eligible ? " go" : ""}${sel ? " sel" : ""}" data-side="${sd}">${vis}${arrow}</div></div>`;
    };
    const cap = (v, s) => `<div class="cm"><b>${memoryTitleText(labelOf(v))}</b><p>${memoryDescription(v, s)}</p></div>`;
    return `<div class="tgt${infoClosed ? "" : " open"}${infoFlip ? " flip" : ""}">${one("L", currentLeft)}<span class="sw2" data-swap="1" role="button" aria-label="左右を入れ替える"><i></i></span>${one("R", currentRight)}<div class="cap">${cap(currentLeft, "left")}${cap(currentRight, "right")}</div><button class="info-tg" type="button" data-info="1" aria-label="解説を開く／閉じる"><i></i></button></div>`;
}


function chooseSide(sd) {
    if (henshinPlaying || pending !== null) return;
    pendingSide = pendingSide === sd ? null : sd;
    sync();
    if (pendingSide !== null) prefetchCandidates(pendingSide);
}


async function putInto(side) {
    if (henshinPlaying || pending === null) return;
    const v = pending;
    clearPick();
    const mutate = () => { if (side === "L") currentLeft = v; else currentRight = v; histPush(); };
    if (modalOn()) { await commitViaModal(mutate); sync(); return; }
    sync();
    await changeForm(mutate);
}


/* 左右入れ替えボタン */
async function swapLR() {
    if (henshinPlaying || currentLeft === currentRight) return;
    if (pendingSide !== null) { pendingSide = null; sync(); }
    await changeForm(() => { [currentLeft, currentRight] = [currentRight, currentLeft]; histPush(); });
}


/* ---- 解説文のフォントサイズ ---- */
const FIT_TEXT = "｢疾風の記憶｣を持つガイアメモリ｡";
let fitSig = "", fitOk = false;
function fitCaption(force) {
    const st = $("stage"), tgt = document.querySelector(".tgt");
    if (!st || !tgt) return;
    const cs = parseFloat(getComputedStyle(st).getPropertyValue("--cs")) || 1, tw = tgt.getBoundingClientRect().width;
    const sig = Math.round(tw) + "|" + cs.toFixed(3);
    if (sig === fitSig && (!force || fitOk)) return;
    fitSig = sig; fitOk = !document.fonts || document.fonts.status === "loaded";
    const colW = (tw - 28 * cs - 26 * cs) / 2;
    if (!(colW > 20)) return;
    const lab = document.createElement("div");
    lab.className = "tgt open"; lab.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;width:${tw}px`;
    lab.innerHTML = `<div class="cap"><div class="cm"><b>x</b><p></p></div><div class="cm"><b>x</b><p></p></div></div>`;
    st.appendChild(lab);
    const ps = lab.querySelectorAll("p");
    ps.forEach(p => { p.textContent = memoryDescription("cyclone", "left"); });
    const tn = ps[0].firstChild, k = FIT_TEXT.length - 1, rg = document.createRange();
    const topOf = i => { rg.setStart(tn, i); rg.setEnd(tn, i + 1); const r = rg.getClientRects()[0]; return r ? Math.round(r.top) : null; };
    const fits = s => { lab.style.setProperty("--cfs", s + "px"); const a = topOf(0), z = topOf(k); return a !== null && a === z; };
    let lo = 5, hi = 16;
    for (let n = 0; n < 14; n++) { const m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; }
    lab.remove();
    st.style.setProperty("--cfs", (lo - 0.005).toFixed(3) + "px");
}


function bindTargets() {
    const tbClick = t => {
        if (pending !== null) { if (t.classList.contains("go")) putInto(t.dataset.side); }
        else chooseSide(t.dataset.side);
    };
    const infoEls = () => document.querySelectorAll("#tgt .tgt, #mtgt .tgt");
    const toggleInfo = () => {
        infoClosed = !infoClosed;
        infoEls().forEach(el => el.classList.toggle("open", !infoClosed));
        clearTimeout(infoFlipTimer);
        infoFlipTimer = setTimeout(() => { infoFlip = !infoClosed; infoEls().forEach(el => el.classList.toggle("flip", infoFlip)); }, INFO_FLIP_MS);
    };
    const onTap = (e, onTb) => {
        if (e.target.closest("[data-swap]")) { swapLR(); return; }
        if (e.target.closest("[data-info]")) { toggleInfo(); return; }
        const t = e.target.closest(".tb");
        if (t) onTb(t);
    };
    $("tgt").addEventListener("click", e => onTap(e, t => { if (!isPC()) openModal(); else tbClick(t); }));
    $("mtgt").addEventListener("click", e => onTap(e, t => { if (!mmBusy) tbClick(t); }));
}


/* =============================
   10. メモリ一覧モーダル
============================= */
const visHTML = (img, name, defer) => `<div class="vis"><img ${defer ? "data-src" : "src"}="${img}" alt=""><span>${name}</span></div>`;


function gridHTML() {
    const head = t => `<div class="gh">${t}</div>`;
    const curV = pendingSide === null ? null : pendingSide === "L" ? currentLeft : currentRight;
    const card = f => {
        const cur = f.value === curV;
        const vis = `<div class="vis"><img data-src="${webp("btn-" + f.value)}" alt="" decoding="async"><span>${labelOf(f.value)}</span>${cur ? `<span class="lbl">選択中</span>` : ""}</div>`;
        return `<div class="gc${pending !== null && pendingSide === null && f.value !== pending ? " dim" : ""}${cur ? " cur" : ""}" data-m="${f.value}">${vis}</div>`;
    };
    const locked = `<div class="gc locked">${visHTML(webp("btn-blank"), "？？？", true)}</div>`;
    const main = forms.filter(f => !EXTRA_ORDER.includes(f.value));
    const extra = EXTRA_ORDER.map(v => v ? card(forms.find(f => f.value === v)) : locked);
    return head("【A-Z MEMORIES】") + main.map(card).join("") + head("【EX MEMORIES】") + extra.join("");
}


function updateEndFade() {
    const sc = $("sc");
    if (!sc) return;
    $("lwrap").classList.toggle("end", sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1);
    const gc = sc.querySelector(".gc"), g = $("grid");
    if (gc && g) $("lwrap").style.setProperty("--rowp", (gc.offsetHeight + (parseFloat(getComputedStyle(g).rowGap) || 0)) + "px");
}


let mmOpen = false, mmBusy = false, mmTok = 0;
const modalOn = () => mmOpen && !isPC();

async function openModal() {
    if (henshinPlaying || isPC() || mmOpen || mmBusy) return;
    btnReady = true; fillBtns();
    clearPick(true);
    const mm = $("mm");
    const tok = ++mmTok;
    mm.classList.remove("instant"); mm.classList.add("on");
    mmOpen = true; mmBusy = true;
    document.documentElement.classList.add("mm-open");
    $("sc").scrollTop = 0;
    mm.getBoundingClientRect();
    mm.classList.add("show"); mm.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("mm-show");
    setTimeout(() => { if (tok === mmTok) { mmBusy = false; updateEndFade(); } }, 340);
}

function closeModal(instant) {
    if (!mmOpen || (!instant && mmBusy)) return;
    const mm = $("mm");
    mmOpen = false;
    const tok = ++mmTok;
    clearPick(true);
    const finish = () => {
        if (!instant && tok !== mmTok) return;
        mm.classList.remove("on", "show"); mm.setAttribute("aria-hidden", "true");
        document.documentElement.classList.remove("mm-open", "mm-show");
        mmBusy = false;
    };
    if (instant) { mm.classList.add("instant"); finish(); mm.getBoundingClientRect(); mm.classList.remove("instant"); return; }
    mmBusy = true;
    mm.classList.remove("show"); document.documentElement.classList.remove("mm-show");
    setTimeout(finish, 320);
}

async function commitViaModal(mutate) {
    if (!animOn) animCancelFrozen();
    henshinPlaying = true;
    const fromL = currentLeft, fromR = currentRight;
    bgHold = animOn;
    try {
        mutate();
        if (window.scrollY > 0) window.scrollTo(0, 0);
        if (!animOn) updateHalf();
        sync();
        closeModal(mmBusy);
        const t0 = performance.now();
        while ((mmOpen || mmBusy) && performance.now() - t0 < 1500) await new Promise(r => setTimeout(r, 16));
    } catch (e) { console.error(e); }
    bgHold = false;
    if (!animOn) { henshinPlaying = false; syncBg(); return; }
    syncBg();      
    await window.playHenshinTransition(() => updateHalf(), { from: [fromL, fromR] });
}


/* ---- ボタン画像の読み込み ---- */
const btnWarm = [];
let btnReady = false;
function fillBtns() { document.querySelectorAll("#grid img[data-src]").forEach(i => { i.src = i.dataset.src; i.removeAttribute("data-src"); }); }
function warmButtons() {
    const go = () => {
        if (henshinPlaying || document.hidden) return setTimeout(warmButtons, 2000);
        for (const f of forms) { const im = new Image(); im.src = webp("btn-" + f.value); btnWarm.push(im); }
        const b = new Image(); b.src = webp("btn-blank"); btnWarm.push(b);
        btnReady = true; fillBtns();
    };
    setTimeout(() => { if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 6000 }); else go(); }, 4000);
}


function bindMemoryList() {
    $("mm").addEventListener("click", e => { if (!henshinPlaying && e.target.closest("[data-close]")) closeModal(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && mmOpen && !henshinPlaying) closeModal(false); });
    $("grid").addEventListener("click", e => {
        const g = e.target.closest(".gc[data-m]");
        if (!g || henshinPlaying) return;
        if (pendingSide !== null) {
            if (g.classList.contains("cur")) return;
            pending = g.dataset.m; prefetchFor(pending); putInto(pendingSide);
            return;
        }
        pending = pending === g.dataset.m ? null : g.dataset.m;
        if (pending !== null) prefetchFor(pending);
        sync();
    });
    $("sc").addEventListener("scroll", updateEndFade);
    ["tgt", "mtgt"].forEach(id => $(id).addEventListener("transitionend", e => { if (e.target.classList.contains("cap")) updateEndFade(); }));
}


/* =============================
   11. メニューと地球の本棚
============================= */
/* ---- メニュー ---- */
const MENU_HASHES = ["#menu", "#about", "#history", "#library"];
function closeMenu() {
    const y = window.scrollY;
    location.hash = "";
    history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo(0, y);
}
function setupMenu() {
    const n = forms.length;
    $("memCount").textContent = n;
    $("comboCount").textContent = n * n;
    document.querySelectorAll(".mx").forEach(a => a.addEventListener("click", e => { e.preventDefault(); closeMenu(); }));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && MENU_HASHES.includes(location.hash)) closeMenu(); });
}


/* ---- 地球の本棚：一覧の元データ ---- */
const libWrap = () => document.querySelector("#library .mwrap");


function libEntries() {
    const bmMap = new Map(bms.map(b => [comboKey(b.l, b.r), b]));
    const all = []; const seen = new Set();
    found.forEach((k, i) => { const [l, r] = k.split("/"), b = bmMap.get(k); seen.add(k); all.push({ l, r, w: b ? b.w !== false : weaponsVisible, bm: !!b, idx: i }); });
    bms.forEach((b, i) => { const k = comboKey(b.l, b.r); if (seen.has(k)) return; seen.add(k); all.push({ l: b.l, r: b.r, w: b.w !== false, bm: true, idx: found.length + i }); });
    const byName = (a, b) => (a.l < b.l ? -1 : a.l > b.l ? 1 : 0) || (a.r < b.r ? -1 : a.r > b.r ? 1 : 0);
    const cmp = libSort === "name" ? byName : libSort === "new" ? (a, b) => b.idx - a.idx : (a, b) => a.idx - b.idx;
    return (libFilter === "bm" ? all.filter(e => e.bm) : all).sort(cmp);
}


/* ---- 地球の本棚：タイル表示 ---- */
const PERSP = { n: 5, dz: 30, p: 650, gx: 20, gy: 25, fade: 100, rf: 100, dw: 80, dv: 500, tx: 200 };
function perspRand(seed) { let h = 1779033703 ^ seed.length; for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
function perspApply() {
    const L = $("library"); if (!L) return;
    const set = (k, v) => L.style.setProperty(k, v);
    set("--dz", PERSP.dz + "px"); set("--persp", PERSP.p + "px"); set("--n", PERSP.n); set("--rf", PERSP.rf);
    set("--tgx", PERSP.gx + "px"); set("--tgy", PERSP.gy + "px");
    document.documentElement.style.setProperty("--dvms", PERSP.dv + "ms"); perspTw();
}

function perspTw() { const g = $("libGrid"); if (g && g.clientWidth) { g.style.setProperty("--tw", ((g.clientWidth - 3 * PERSP.gx) / 4) + "px"); } }
window.addEventListener("resize", perspTw);

let perspRel = 0;
const perspOpen = () => location.hash === "#library";
window.addEventListener("hashchange", e => {
    const f = ((e.oldURL || "").split("#")[1] || ""), t = ((e.newURL || "").split("#")[1] || "");
    if (f !== "library" && t !== "library") return;
    clearTimeout(perspRel);
    if (f === "library") perspRel = setTimeout(() => { if (window.requestIdleCallback) requestIdleCallback(perspRelease, { timeout: 5000 }); else perspRelease(); }, PERSP.dv + 1500);
});
function perspRelease() {
    if (perspOpen()) return;
    for (const i of libFilled) if (libTiles[i]) emptyTile(libTiles[i]);
    libFilled.clear();
    const bk = $("libBack"); if (bk) { bk.width = 1; bk.height = 1; }
    perspCy0 = null;
    libWarmSoon(1500);
}


/* ---- 地球の本棚：軽量化 ---- */
const PERSP_TEXN = 4;
const PERSP_BOOKS = ["#e6b8a2", "#efcaa9", "#e8d3ae", "#d8b48a", "#c9967a", "#b99a8e", "#a8c9c6", "#e3c0b8", "#cfa98a", "#9b8078", "#f0d9c0", "#b7b4a6"];
const PERSP_SEQ = Array.from({ length: PERSP_TEXN }, (_, v) => { const r = perspRand("seq" + v); return Array.from({ length: 40 }, (_, k) => k === 0 ? v : Math.floor(r() * PERSP_TEXN)); });
let perspTexKey = "", perspTex = [], perspTexReal = [], perspVar = [], perspBF = 0, perspCount = 0;
const PERSP_MB = new Image(); PERSP_MB.onload = () => { perspTexKey = ""; if (perspOpen() && $("libGrid")) libBuild(); }; PERSP_MB.src = webp("memorybackground");
const perspMBok = () => PERSP_MB.complete && PERSP_MB.naturalWidth > 0;

function perspDrawMB(x, W, H, alpha, op) {
    if (!perspMBok() || alpha <= 0) return;
    const k = Math.max(H / PERSP_MB.naturalWidth, W / PERSP_MB.naturalHeight), iw = PERSP_MB.naturalWidth * k, ih = PERSP_MB.naturalHeight * k;
    x.save(); x.translate(W / 2, H / 2); x.rotate(Math.PI / 2); x.globalAlpha = Math.min(1, alpha); x.globalCompositeOperation = op; x.drawImage(PERSP_MB, -iw / 2, -ih / 2, iw, ih); x.restore();
}

function perspGeom() {
    const g = $("libGrid"), m = libWrap(); if (!g || !m || !g.clientWidth) return null;
    const gx = PERSP.gx, gy = PERSP.gy, tw = (g.clientWidth - 3 * gx) / 4, th = tw * 4 / 3;
    return { g, m, gx, gy, tw, th, px: tw + gx, py: th + gy, vpx: m.clientWidth / 2 - g.offsetLeft, vpy: m.clientHeight / 2 - g.offsetTop };
}

function perspTexBuild(tw, th, dw) {
    const S = 2, W = Math.round(tw * S), H = Math.round(th * S), out = [], P = Math.max(0, PERSP.tx / 100), np = Math.ceil(P), ap = np ? P / np : 0;
    for (let v = 0; v < PERSP_TEXN; v++) {
        const r = perspRand("tex" + v), c = document.createElement("canvas"); c.width = W; c.height = H;
        const x = c.getContext("2d"), f = 3 * S, bd = 3 * S, inner = H - 2 * f - 3 * bd, bh = inner / 4;
        x.fillStyle = "#efe2cf"; x.fillRect(0, 0, W, H);
        for (let i = 0; i < 4; i++) {
            const y0 = f + i * (bh + bd), ws = [0, 1, 2, 3].map(() => .6 + r() * 1.0), tot = ws.reduce((p, q) => p + q, 0);
            let X = f; const span = W - 2 * f;
            ws.forEach((wv, j) => {
                const w = j === 3 ? W - f - X : span * wv / tot, gap = r() * .16 * bh;
                x.fillStyle = PERSP_BOOKS[Math.floor(r() * PERSP_BOOKS.length)]; x.fillRect(X, y0 + gap, w, bh - gap);
                x.fillStyle = "rgba(90,50,30,.18)"; x.fillRect(X + w - S, y0 + gap, S, bh - gap);
                X += w;
            });
            x.fillStyle = "#9a6a46"; x.fillRect(f, y0 + bh, W - 2 * f, bd);
        }
        x.fillStyle = "#a9794f"; x.fillRect(0, 0, W, f); x.fillRect(0, H - f, W, f); x.fillRect(0, 0, f, H); x.fillRect(W - f, 0, f, H);
        for (let q = 0; q < np; q++) perspDrawMB(x, W, H, ap, "overlay");
        if (dw > 0) { x.fillStyle = "rgba(255,255,255," + dw / 100 + ")"; x.fillRect(0, 0, W, H); }
        out.push(c);
    }
    return out;
}

function perspTexEnsure() {
    const G = perspGeom(); if (!G) return null;
    const key = [G.tw.toFixed(2), PERSP.dw, PERSP.tx, perspMBok() ? 1 : 0].join("|");
    if (key !== perspTexKey) {
        perspTex = perspTexBuild(G.tw, G.th, PERSP.dw);
        perspTexReal = perspTexBuild(G.tw, G.th, 0);
        perspTexKey = key;
    }
    return G;
}

const perspVC = new Map();
function perspCellV(c, r) { if (typeof c === "number") { c = ((c % 8) + 8) % 8; r = ((r % 8) + 8) % 8; }
    const k = c + "," + r; let v = perspVC.get(k); if (v === undefined) { v = Math.floor(perspRand("cv" + k)() * PERSP_TEXN); perspVC.set(k, v); } return v; }

function perspLayers(q, G, o) {
    const { tw, th, px, py } = G, N = PERSP.n + 1, nn = Math.max(1, PERSP.n);
    for (let k = N - 1; k >= 0; k--) {
        const s = PERSP.p / (PERSP.p + k * PERSP.dz), w = tw * s, h = th * s;
        for (let r = o.r0; r <= o.r1; r++) for (let c = o.c0; c <= o.c1; c++) {
            const real = r >= 0 && c >= 0 && c < 4 && r * 4 + c < perspCount;
            if (real && k === 0) continue;
            const cx = o.ox + c * px + tw / 2, cy = o.oy + r * py + th / 2, x = o.VX + (cx - o.VX) * s - w / 2, y = o.VY + (cy - o.VY) * s - h / 2;
            if (x + w <= 0 || x >= o.W || y + h <= 0 || y >= o.H) continue;
            const v = real ? perspVar[r * 4 + c] : perspCellV(c, r), set = real ? perspTexReal : perspTex;
            q.globalAlpha = Math.max(0, 1 - (real ? PERSP.rf : PERSP.fade) / 100 * k / nn);
            q.drawImage(set[PERSP_SEQ[v][k]], x * o.R, y * o.R, w * o.R, h * o.R);
        }
    }
    q.globalAlpha = 1;
}

let perspCy0 = null, perspLastSt = -1e9, perspBT = 0;
function perspBackSoon() { if (perspBF) return; perspBF = requestAnimationFrame(() => { perspBF = 0; libVirt(); perspBack(); }); }
function perspBack() {
    const cv = $("libBack"), m = libWrap(), g = $("libGrid"), bw = cv && cv.parentNode;
    if (!perspOpen() || !cv || !m || !g || !m.clientWidth || !m.clientHeight) return;
    if (!perspCount) { cv.width = 1; cv.height = 1; perspCy0 = null; return; }
    const G = perspTexEnsure(); if (!G) return;
    const W = m.clientWidth, H = m.clientHeight, CH = 3 * H, st = m.scrollTop, dpr = Math.min(2, window.devicePixelRatio || 1);
    const resized = cv.width !== Math.round(W * dpr) || cv.height !== Math.round(CH * dpr), inside = perspCy0 !== null && st >= perspCy0 + H * .25 && st + H <= perspCy0 + CH - H * .25;
    if (!resized && inside && Math.abs(st - perspLastSt) < 48) return;
    if (resized) { cv.width = Math.round(W * dpr); cv.height = Math.round(CH * dpr); }
    if (resized || !inside) { perspCy0 = st - H; bw.style.height = "0px"; bw.style.height = m.scrollHeight + "px"; }
    perspLastSt = st;
    cv.style.cssText = "left:0;top:" + perspCy0 + "px;width:" + W + "px;height:" + CH + "px";
    const q = cv.getContext("2d"); q.setTransform(dpr, 0, 0, dpr, 0, 0); q.clearRect(0, 0, W, CH);
    const { tw, th, px, py } = G, gl = g.offsetLeft, gt = g.offsetTop - perspCy0, VX = W / 2, VY = st + H / 2 - perspCy0, rows = Math.ceil(perspCount / 4);
    const sMin = PERSP.p / (PERSP.p + PERSP.n * PERSP.dz);
    const c0 = Math.ceil((VX - (VX + tw) / sMin - gl - tw / 2) / px), c1 = Math.floor((VX + (W - VX + tw) / sMin - gl - tw / 2) / px);
    const r0 = Math.ceil((VY - (VY + th) / sMin - gt - th / 2) / py), r1 = Math.min(rows - 1, Math.floor((VY + (CH - VY + th) / sMin - gt - th / 2) / py));
    perspLayers(q, G, { VX, VY, ox: gl, oy: gt, W, H: CH, R: 1, c0, c1, r0, r1 });
}


const libFilled = new Set(); let libTiles = [];
let libVirtRAF = 0;
function libVirt(all) {
    if (!perspOpen()) return;
    const G = perspGeom(); if (!G || !libTiles.length) return;
    const m = G.m, st = m.scrollTop, H = m.clientHeight, M = 350, top0 = G.g.offsetTop, BUDGET = all ? 1e9 : 8;
    const r0 = Math.max(0, Math.floor((st - M - top0) / G.py)), r1 = Math.floor((st + H + M - top0) / G.py);
    const i0 = r0 * 4, i1 = Math.min(libTiles.length - 1, r1 * 4 + 3);
    for (const i of [...libFilled]) if (i < i0 || i > i1) { emptyTile(libTiles[i]); libFilled.delete(i); }
    const mid = Math.min(i1, Math.max(i0, Math.floor((st + H / 2 - top0) / G.py) * 4));
    let left = BUDGET, more = false;
    for (let d = 0; d <= Math.max(i1 - mid, mid - i0); d++) for (const i of d ? [mid + d, mid - d] : [mid]) {
        if (i < i0 || i > i1 || libFilled.has(i)) continue;
        if (left-- <= 0) { more = true; continue; }
        fillTile(libTiles[i]); libFilled.add(i);
    }
    if (more && !libVirtRAF) libVirtRAF = requestAnimationFrame(() => { libVirtRAF = 0; libVirt(); });
}

function perspEmpty() {
    const em = $("libEmpty"), m = libWrap(); if (!em || !m) return;
    em.style.marginTop = "0px";
    if (em.hidden) return;
    em.style.marginTop = Math.max(0, m.clientHeight / 2 - em.offsetTop - em.offsetHeight / 2) + "px";
}
window.addEventListener("resize", () => { perspBackSoon(); perspEmpty(); });
function perspInit() {
    perspApply();
    const m = libWrap();
    if (m) m.addEventListener("scroll", () => { perspBackSoon(); clearTimeout(perspBT); perspBT = setTimeout(() => { perspLastSt = -1e9; perspBackSoon(); }, 140); }, { passive: true });
}

function perspStatic() {
    const L = $("library"); if (!L) return;
    perspTexEnsure();
    libVirt(true);
    perspCy0 = null; perspLastSt = -1e9; perspBackSoon();
}

let libWarmT = 0;
function libWarmSoon(delay) {
    clearTimeout(libWarmT);
    libWarmT = setTimeout(() => {
        const idle = fn => window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 60), busy = () => perspOpen() || henshinPlaying || document.hidden;
        idle(() => { if (busy()) return libWarmSoon(3000); try { perspTexEnsure(); } catch (e) {}
            idle(() => { if (busy()) return libWarmSoon(3000); try { libEnsure(); } catch (e) {} }); });
    }, delay || 1500);
}

const LAYER_Z = { backgroundLayer: 1, wings2Layer: 3, wings1Layer: 4, muffler1Layer: 5, muffler2Layer: 5, capeLayer: 7, leftHalf: 10, rightHalf: 10, waist1Layer: 11, waist2Layer: 11, partitionLayer: 12, antennaLayer: 13, eyes2Layer: 14, eyes1Layer: 15, neckLayer: 18, driverLayer: 20, weapon2Layer: 24, weapon1Layer: 25, foregroundLayer: 30 };
const TILE_BODY = new Set(["wings1Layer", "wings2Layer", "muffler1Layer", "muffler2Layer", "capeLayer", "leftHalf", "rightHalf", "waist1Layer", "waist2Layer", "partitionLayer", "antennaLayer", "eyes1Layer", "eyes2Layer", "neckLayer", "driverLayer"]);
const LIB_THUMB = true;
function fillTile(tile) {
    const tv = tile.firstElementChild; if (tv.dataset.f === "1") return; tv.dataset.f = "1";
    const l = tile.dataset.l, r = tile.dataset.r, w = tile.dataset.w === "1";
    const frag = document.createDocumentFragment(), grp = document.createElement("div"); grp.className = "bodygrp";
    for (const ly of resolveLayers(l, r)) {
        if (!ly.src || (!w && ly.weapon)) continue;
        const d = document.createElement("div"); d.className = "layer"; d.style.zIndex = LAYER_Z[ly.id] || 1;
        d.dataset.clip = ly.clip || ""; d.dataset.flip = ly.flip ? "1" : "";
        const im = document.createElement("img"); im.src = (LIB_THUMB ? "images_lib/" : "images_webp/") + ly.src + ".webp"; im.alt = ""; if (LIB_THUMB) im.onerror = () => { im.onerror = null; im.src = webp(ly.src); }; im.decoding = "async"; d.appendChild(im);
        (TILE_BODY.has(ly.id) ? grp : frag).appendChild(d);
    }
    frag.appendChild(grp);
    tv.appendChild(frag);
}

function emptyTile(tile) { const tv = tile.firstElementChild; if (tv.dataset.f !== "1") return; tv.dataset.f = ""; [...tv.querySelectorAll(".layer, .bodygrp")].forEach(e => e.remove()); }
let libNewSnap = new Set();
const libNorm = t => (t || "").toLowerCase().replace(/[\s　・･]+/g, "").replace(/[ァ-ン]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
let libSigDone = "";
const libSigNow = () => [found.length, bms.map(b => b.l + b.r + (b.w ? 1 : 0)).join(","), weaponsVisible ? 1 : 0, libSort, libFilter, $("libSearch") ? $("libSearch").value : "", $("libGrid") ? $("libGrid").clientWidth : 0].join("|");

function libEnsure() { if (libTiles.length && libSigDone === libSigNow()) libApplyNew(); else libBuild(); }
function libApplyNew() {
    for (const t of libTiles) {
        const want = libNewSnap.has(comboKey(t.dataset.l, t.dataset.r)), cur = t.querySelector(":scope > .nw");
        if (want && !cur) { const n = document.createElement("span"); n.className = "nw"; n.textContent = "NEW!"; t.appendChild(n); } else if (!want && cur) cur.remove();
    }
}

function libBuild() {
    const grid = $("libGrid"); if (!grid) return;
    perspTw();
    const all = libEntries(), raw = $("libSearch").value, q = raw.trim();
    const toks = raw.split(/[\s　]+/).filter(Boolean).map(libNorm);
    const list = toks.length ? all.filter(e => { const hay = libNorm(labelOf(e.l) + labelOf(e.r)); return toks.every(t => hay.includes(t)); }) : all;
    perspCount = list.length; perspVar = list.map(e => perspCellV(e.l, e.r));
    const rate = $("libRate");
    const sep2 = $("libSep2"), all2 = $("libAll");
    sep2.hidden = all2.hidden = !toks.length;
    if (toks.length) { $("libCount").textContent = list.length; $("libTotal").textContent = found.length; all2.textContent = totalCombos(); rate.textContent = ""; }
    else if (libFilter === "bm") { $("libCount").textContent = list.length; $("libTotal").textContent = found.length; rate.textContent = ""; }
    else { $("libCount").textContent = found.length; $("libTotal").textContent = totalCombos(); rate.innerHTML = "（閲覧度 <span>" + (found.length / totalCombos() * 100).toFixed(1).replace(/\.0$/, "") + "%</span>）"; }
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const e of list) {
        const t = document.createElement("button"); t.type = "button"; t.className = "lt"; t.dataset.l = e.l; t.dataset.r = e.r; t.dataset.w = e.w ? "1" : "0"; t.dataset.bm = e.bm ? "1" : "0";
        t.setAttribute("aria-label", rawName(e.l) + rawName(e.r));
        t.style.setProperty("--tl", colorOf(e.l)); t.style.setProperty("--tr", colorOf(e.r));
        t.innerHTML = '<div class="tv"></div><div class="ln"><i>' + rawName(e.l) + '</i><i>' + rawName(e.r) + '</i></div>' + '<b class="bmo"><i class="bmk' + (e.bm ? '' : ' off') + '"></i></b>' + (libNewSnap.has(comboKey(e.l, e.r)) ? '<span class="nw">NEW!</span>' : "");
        frag.appendChild(t);
    }
    grid.appendChild(frag);
    perspCy0 = null; perspBackSoon();
    const em = $("libEmpty");
    em.hidden = list.length > 0; em.textContent = "NOT FOUND"; perspEmpty();
    libTiles = [...grid.querySelectorAll(".lt")]; libFilled.clear(); libVirt(); libSigDone = libSigNow();
}


/* ---- 地球の本棚：操作設定 ---- */
/* タイルをタップした場合 */
function libInit() {
    $("libTotal").textContent = totalCombos();
    $("libSearch").addEventListener("input", libBuild);
    $("libGrid").addEventListener("click", async e => {
        const t = e.target.closest(".lt"); if (!t) return;
        const l = t.dataset.l, r = t.dataset.r, bm = t.dataset.bm === "1", w = t.dataset.w === "1";
        if (e.target.closest(".bmo")) {
            const fresh = libSigDone === libSigNow(), on = toggleBm(l, r, w);
            t.dataset.bm = on ? "1" : "0"; const g = t.querySelector(".bmk"); if (g) g.classList.toggle("off", !on);
            if (fresh) libSigDone = libSigNow();
            return;
        }
        if (animOn && !henshinPlaying && !(l === currentLeft && r === currentRight)) { await playIntroTo(l, r, bm, w); return; }
        closeMenu();
        await new Promise(res => setTimeout(res, PERSP.dv + 20));
        if (henshinPlaying) return;
        if (bm && w !== weaponsVisible) { setWeapons(w); updateHalf(); sync(); }
        if (l === currentLeft && r === currentRight) return;
        await changeForm(() => { currentLeft = l; currentRight = r; histPush(); });
    });


/* 並べ替えボタンをタップした場合 */
    const ctlUI = () => document.querySelectorAll("#libCtl button").forEach(b => { const on = b.dataset.sort ? b.dataset.sort === libSort : b.dataset.flt === libFilter; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    ctlUI();
    $("libCtl").addEventListener("click", e => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.sort) { libSort = b.dataset.sort; saveSettings(); } else { libFilter = b.dataset.flt; saveSettings(); }
        ctlUI(); libBuild();
    });
    $("library").style.setProperty("--lib-h", Math.max(screen.width || 0, screen.height || 0, window.innerWidth, window.innerHeight) + "px");
    xferInit();
    const onHash = () => {
        if (window.xferClose) xferClose();
        if (location.hash !== "#library") return;
        libNewSnap = new Set(newSet);
        newSet.clear(); saveNew(); updateNewBadge();
        ctlUI(); $("libSearch").value = ""; libEnsure(); libWrap().scrollTop = 0; perspStatic();
    };
    updateNewBadge();
    window.addEventListener("hashchange", onHash); onHash(); libWarmSoon(2500);
    if (window.__xferPending) { const c = window.__xferPending; window.__xferPending = null; setTimeout(() => xferOpenWith(c), 400); }
}


/* ---- 引き継ぎコード ---- */
const b64u = u8 => { let t = ""; for (let i = 0; i < u8.length; i += 0x8000) t += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const unb64u = t => { const p = atob(t.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((t.length + 3) % 4)); const u = new Uint8Array(p.length); for (let i = 0; i < p.length; i++) u[i] = p.charCodeAt(i); return u; };
const sum32 = u8 => { let h = 0x811c9dc5; for (const b of u8) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
async function pipeBytes(u8, stream) { return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(stream)).arrayBuffer()); }


async function makeCode() {
    const N = XFER_ORDER.length, tot = N * N, idx = new Map(XFER_ORDER.map((v, i) => [v, i]));
    if (N > 255 || tot > 0x7fff) throw new Error("too many");
    const bits = new Uint8Array((tot + 7) >> 3);
    for (const k of found) { const [l, r] = k.split("/"), a = idx.get(l), b = idx.get(r); if (a === undefined || b === undefined) continue; const i = a * N + b; bits[i >> 3] |= 1 << (i & 7); }
    const bm = []; for (const x of bms) { const a = idx.get(x.l), b = idx.get(x.r); if (a === undefined || b === undefined) continue; bm.push((a * N + b) | (x.w ? 0x8000 : 0)); }
    const body = new Uint8Array(4 + bits.length + bm.length * 2);
    body.set([2, N, bm.length >> 8, bm.length & 255], 0); body.set(bits, 4);
    bm.forEach((v, i) => { body[4 + bits.length + i * 2] = v >> 8; body[5 + bits.length + i * 2] = v & 255; });
    let out = body, tag = "0";
    if (window.CompressionStream) { const z = await pipeBytes(body, new CompressionStream("deflate-raw")); if (z.length < body.length) { out = z; tag = "1"; } }
    return "GM" + tag + "-" + b64u(out) + "-" + sum32(out);
}
async function readCode(text) {
    const t = (text || "").replace(/\s+/g, ""), m = t.match(/^G([LM])([01])-([A-Za-z0-9_-]+)-([0-9a-z]+)$/);
    if (!m) throw new Error("コードの形式が違います");
    let body = unb64u(m[3]);
    if (sum32(body) !== m[4]) throw new Error("コードが欠けているか、打ち間違いがあります");
    if (m[2] === "1") { if (!window.DecompressionStream) throw new Error("このブラウザでは読み込めません"); body = await pipeBytes(body, new DecompressionStream("deflate-raw")); }
    if (m[1] === "L") {     
        const d = JSON.parse(new TextDecoder().decode(body));
        if (!d || d.v !== 1 || !Array.isArray(d.f) || !Array.isArray(d.b)) throw new Error("コードの内容が正しくありません");
        return d;
    }
    const N = body[1];
    if (body[0] !== 2 || !N) throw new Error("コードの内容が正しくありません");
    if (N > XFER_ORDER.length) throw new Error("新しいバージョンのサイトで作られたコードです。ページを再読み込みしてから、もう一度お試しください");
    const nbm = (body[2] << 8) | body[3], p = 4;
    const nb = ((N * N) + 7) >> 3;
    if (body.length !== p + nb + nbm * 2) throw new Error("コードの内容が正しくありません");
    const f = [], b = [];
    for (let i = 0; i < N * N; i++) if (body[p + (i >> 3)] & (1 << (i & 7))) f.push(XFER_ORDER[(i / N) | 0] + "/" + XFER_ORDER[i % N]);
    for (let i = 0; i < nbm; i++) { const v = (body[p + nb + i * 2] << 8) | body[p + nb + i * 2 + 1], w = v & 0x8000, k = v & 0x7fff; if (k >= N * N) continue; b.push([XFER_ORDER[(k / N) | 0], XFER_ORDER[k % N], w ? 1 : 0]); }
    return { v: 1, f, b };
}

function mergeCode(d) {
    let addF = 0, addB = 0;
    for (const k of d.f) if (validKey(k) && !foundSet.has(k)) { found.push(k); foundSet.add(k); addF++; }
    for (const b of d.b) { if (!Array.isArray(b) || !validForm(b[0]) || !validForm(b[1]) || isBookmarked(b[0], b[1])) continue; bms.push({ l: b[0], r: b[1], w: b[2] !== 0 }); addB++; }
    lsSet(FOUND_KEY, found); lsSet(BM_KEY, bms);
    return { addF, addB };
}
function xferInit() {
    const msg = (t) => { const e = $("xferMsg"); e.hidden = !t; e.textContent = t || ""; };
    const modal = $("xfModal");
    const setTab = t => { $("xferMake").setAttribute("aria-pressed", t === "make" ? "true" : "false"); $("xferOpen").setAttribute("aria-pressed", t === "in" ? "true" : "false"); };
    const open = () => { setTab(null); $("xferOutBox").hidden = true; $("xferInBox").hidden = true; msg(""); modal.hidden = false; };
    const close = () => { modal.hidden = true; };


    /* QRコード */
    const ensureQr = () => window.qrcode ? Promise.resolve() : new Promise((res, rej) => { const t = document.createElement("script"); t.src = "qrcode.js"; t.onload = res; t.onerror = rej; document.head.appendChild(t); });
    const showQr = async code => {
        const box = $("xferQr"), row = $("xferRow");
        try {
            await ensureQr();
            const qr = qrcode(0, "L"); qr.addData(location.origin + location.pathname + "#xfer=" + code); qr.make();
            const n = qr.getModuleCount(), avail = $("xferOutBox").clientWidth || 280, w = Math.max(120, Math.round(n * 2.4)), stack = avail - w - 8 < 110;
            row.classList.toggle("stack", stack);
            const qw = Math.min(avail, 280, w);
            box.style.width = qw + "px";
            box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
            $("xferOutWrap").style.height = stack ? "" : qw + "px";
            box.dataset.modules = n;
        } catch (e2) { box.innerHTML = ""; row.classList.remove("stack"); }
    };
    window.xferShowQr = showQr;
    window.xferClose = close;
    window.xferOpenWith = code => { open(); setTab("in"); $("xferInBox").hidden = false; $("xferIn").value = code; msg("このコードを読み込みますか？ 「読み込む」を押すと今の閲覧記録に足されます。"); };
    $("xferBtn").addEventListener("click", open);
    $("xferClose").addEventListener("click", close);
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) { close(); e.stopPropagation(); } }, true);
    $("xferMake").addEventListener("click", async () => {
        $("xferInBox").hidden = true; msg("");
        setTab("make");
        try {
            const code = await makeCode(); $("xferOut").value = code; $("xferOutBox").hidden = false; $("xferCopy").textContent = "コピー";
            showQr(code);
        } catch (e) { msg("コードを作れませんでした"); }
    });
    $("xferCopy").addEventListener("click", async () => {
        const o = $("xferOut"); o.focus(); o.select();
        try { await navigator.clipboard.writeText(o.value); $("xferCopy").textContent = "コピーしました"; } catch (e) { document.execCommand && document.execCommand("copy"); $("xferCopy").textContent = "コピーしました"; }
    });
    $("xferOpen").addEventListener("click", () => { setTab("in"); $("xferOutBox").hidden = true; msg(""); $("xferInBox").hidden = false; $("xferIn").focus(); });
    $("xferLoad").addEventListener("click", async () => {
        try {
            const d = await readCode($("xferIn").value), r = mergeCode(d);
            refreshBm(); libBuild();
            msg("読み込みました（フォーム " + r.addF + " 件・ブックマーク " + r.addB + " 件を追加）"); $("xferIn").value = "";
        } catch (e) { msg(e.message || "読み込めませんでした"); }
    });
}


/* =============================
   12. 画面の更新・ページ開始
============================= */
function sync() {
    const st = $("stage");
    syncBg();
    st.style.setProperty("--cl", colorOf(currentLeft));
    st.style.setProperty("--cr", colorOf(currentRight));
    $("nameL").textContent = rawName(currentLeft);
    $("nameR").textContent = rawName(currentRight);
    $("tgt").innerHTML = targetsHTML(!isPC());
    $("mtgt").innerHTML = targetsHTML(false);
    $("grid").innerHTML = gridHTML();
    if (isPC() || btnReady) fillBtns();
    $("shareBtn").title = "これで決まりだ！";
    refreshBm();
    updateEndFade();
    fitCaption(true);
}
const applyForm = () => { updateHalf(); sync(); };


// フォームを変える
async function changeForm(mutate) {
    if (!animOn) { animCancelFrozen(); mutate(); applyForm(); }
    else await playHenshinTransition(() => { mutate(); applyForm(); });
    sync();
}


document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const left  = params.get("left");
    const right = params.get("right");
    loadSettings();
    weaponsVisible = params.has("w") ? params.get("w") !== "0" : savedSettings.w !== false;
    if (validForm(left) && validForm(right)) {
        currentLeft  = left;
        currentRight = right;
    }
    histLoad(); histPush();
    const intro = !params.has("nointro") && !MENU_HASHES.includes(location.hash);
    if (intro) { document.documentElement.classList.add("intro-on", "intro-ui"); window.__introStarted = true; }
    else document.documentElement.classList.remove("intro-on", "intro-ui");
    layout();
    bindTools();
    bindViewer();
    bindEdges();
    bindTargets();
    bindMemoryList();
    libInit();
    setupMenu();
    updateHalf();
    initMotionPause();
    startBlink();
    sync();
    fitStageHeight();
    if (window.ResizeObserver) new ResizeObserver(fitStageHeight).observe($("sheet"));
    let lastW = viewSize().W;
    window.addEventListener("resize", () => {
        if (isZoomed()) return;
        const { W: w, H: h } = viewSize();
        if (w === lastW && !isPC() && w < h) return;
        lastW = w; layout();
    });
    window.addEventListener("orientationchange", () => { lastW = viewSize().W; layout(); });
    if (document.fonts) {
        const refit = () => { fitOk = false; fitCaption(true); };
        document.fonts.ready.then(refit);
        document.fonts.addEventListener("loadingdone", refit);
    }
    if (intro) {
        henshinPlaying = true;
        playIntro().finally(() => { henshinPlaying = false; fitCaption(true); });
    }
    warmButtons();
    perspInit();
});