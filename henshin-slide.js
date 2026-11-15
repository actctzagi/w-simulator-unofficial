/* =====================================================================
   変身アニメ
   ---------------------------------------------------------------------
     1. 調整値                
     2. 共通パーツ           
     3. レイヤーの読み取り
     4. 演出中の見た目 
     5. 羽            
     6. マント・マフラー・腰
     7. 羽・マフラー・腰の照合 
     8. 光の帯   
     9. 首元
    10. 武器          
    11. 複眼の発光
    12. 効果ごとの描画（1コマ分）
    13. アニメの進行      
    14. 演出本体            
    15. 外から使う窓口・空打ち
===================================================================== */

(() => {
"use strict";

/* =====================================================================
   1. 調整値
===================================================================== */

const params = {
    fxOn: true,            // 出現演出（布・羽）を使うか
    frayDelay: 0.15,       // 布：行ごとの遅れの最大（0 = 真っすぐ。大きいほど、ほつれが大きい）
    frayRowPx: 6,          // 布：糸1本の太さ（CSS px）
    slideMs: 1500,         // 中心線から左右の端まで広がるのにかかる時間
    easeIn: 1.5,           // 先端の動きの前半の曲がり具合。1 = 等速、大きいほどゆっくり出る
    easeOut: 1.5,          // 同・後半。1 = 等速、大きいほど、着地がゆっくり
    slideFlash: true,      // 完了の瞬間に、目のフラッシュを出す
    slideGlowPx: 40,       // 光の帯の長さ。先端から、新しいパーツの内側へ向かって尾を引く
    slideGlow: 1.0,        // 光の強さ（0 = 光なし。広がるだけ）
    slideColor: "hsl(27 100% 50%)",   // 光の帯の色（オレンジ）
    slideStreaks: 18,      // 光の帯の中を走る、横の光の筋の本数
    slideFadeBottom: 0.3,  // 光の帯を、viewer の下から何割の高さから弱めるか
    slideGlowSameMemory: false,   // メモリが変わっていない側に光を出さない

    /* 複眼の発光 */
    flash: 1.0,            // 発光の強さ
    flashMs: 750,          // 発光している時間
    flashRiseMs: 40,       // 光り始めてから最大になるまで
    flashDecay: 1.5,       // 発光の減り方
    flashGlowPx: 34,       // 白い目のまわりの、外側のにじみ
    flashGlowInnerPx: 7,   // 同・内側の、きつめのにじみ。外側と重ねて、目の近くを強く光らせる
    flashImg: "images_webp/bright-eyes.webp",
    flashImgFang: "images_webp/bright-eyesF.webp",

    /* 操作の受付 */
    interrupt: true,       // 演出の途中で次の操作が来たら、いまの演出をそこで切り上げて、次の演出を始める
    unlockAt: "start",     // 次の操作を受け付け始めるタイミング
    pixelRatio: 2,         // 描画解像度の上限
};

/* 個別演出 */
const TRIAL_MS = 300;
const FAN = { swing: 40, ms: 350, msClose: 350, steps: 10, move: 1, over: 2.5, overshootDeg: 4, overshootMs: 600 };       // bird-wings：振れる大きさ（度）／開く時間（ms。終わりは slideMs の終わりと同時）／閉じる時間（ms）／開く段数／1段のうち動く部分の割合／各段の行き過ぎ
const SKULL = { overlap: 500, span: 1, share: 0.5, seq: 0.5, lead: 250, late: 300 };            // skull-neck と skull-muffler：マフラーの重なり（ms）／全体にかける時間の割合／首の割合／seq と lead：black-neck系→skull-neck のときの、出現にかける時間を決める（マントと black-neck は、通常の速さで消える）／late：出現を始める位置。通常の尺の終わりの何ms手前か（出現は通常の尺をはみ出す）
const GLOW = { px: 40, strength: 1.0, streaks: 12, scale: 0.35, fps: 20 };    // マント・マフラー・首・羽の、出現・消失境界の光の帯：長さ（CSS px）／強さ／筋の本数／作るキャンバスの縮尺／作り直す頻度（回/秒）
const WING_ROW_PX = 2.5;                                                      // nasca-wings：糸1本の太さ
const SMALL_ANGLE = -60;                                                      // nasca-wings：境界線の角度

/* 武器の発光&境界線 */
const WEAPON_GLOW = { strength: 0.5, top: 0.5, mix: 0.25, halo: 8 };
const WEAPON_FRAY = { delay: 0.3, rowPx: 6 };
const WEAPON_FRAY_P = { frayDelay: WEAPON_FRAY.delay, frayRowPx: WEAPON_FRAY.rowPx };   




/* =====================================================================
   2. 共通設定
===================================================================== */

const $ = id => document.getElementById(id);

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };

const HAS_P3 = (() => { try { const a = document.createElement("canvas").getContext("2d", { colorSpace: "display-p3" }); return !!(a && a.getContextAttributes && a.getContextAttributes().colorSpace === "display-p3"); } catch (e) { return false; } })();
const get2d = (c, o) => c.getContext("2d", HAS_P3 ? Object.assign({ colorSpace: "display-p3" }, o) : o);
const mkCanvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));

function mulberry32(a) {
    return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

const toBitmap = async c => { try { return await createImageBitmap(c); } catch (e) { return c; } };
const baseOf = u => String(u || "").split("?")[0].split("/").pop();

/* スライドの先端の動き */
const slideEase = x => x < 0.5 ? 0.5 * Math.pow(2 * x, params.easeIn) : 1 - 0.5 * Math.pow(2 - 2 * x, params.easeOut);
const frontX = (x, W, cx) => [Math.round(cx * (1 - x)), Math.round(cx + (W - cx) * x)];
const clipDraw = (g, bmp, x0, x1, W, H) => { if (x1 <= x0) return; g.save(); g.beginPath(); g.rect(x0, 0, x1 - x0, H); g.clip(); g.drawImage(bmp, 0, 0, W, H); g.restore(); };
const slotChanged = (o, n) => (o ? o.src : null) !== (n ? n.src : null) || !!(o && n && (o.clip !== n.clip || o.flip !== n.flip));
const mkWhite = (W, H) => { const c = mkCanvas(W, H), g = get2d(c); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); return c; };

/* ほつれの設定 */
const FRAY_TIP = [0.72, 0.5, 0.3, 0.14];
function makeFray(H, k, P, seed, rowPx = P.frayRowPx) {
    const rowH = Math.max(1, Math.round(rowPx * k)), rows = Math.ceil(H / rowH), rnd = mulberry32(seed), s = new Float32Array(rows), tip = new Float32Array(rows);
    for (let j = 0; j < rows;) {
        const g = 1 + Math.floor(rnd() * 4), r = rnd(), d = P.frayDelay * (0.1 + 0.9 * Math.pow(r, 0.4)), tp = (0.4 + rnd() * 1.2);     
        for (let q = 0; q < g && j < rows; q++, j++) { s[j] = d; tip[j] = tp; }
    }
    return { rowH, rows, s, tip };
}




/* =====================================================================
   3. レイヤーの読み取り
===================================================================== */

/* viewer 内のレイヤーと重なり順 */
const BODY_LAYERS = {
    wings2Layer: 3, wings1Layer: 4, muffler1Layer: 5, muffler2Layer: 5, capeLayer: 7,
    leftHalf: 10, rightHalf: 10, waist1Layer: 11, waist2Layer: 11, partitionLayer: 12, antennaLayer: 13,
    eyes2Layer: 14, eyes1Layer: 15, neckLayer: 18, driverLayer: 20,
};

/* 武器レイヤーの一覧 */
const WEAPON_LAYERS = { backgroundLayer: 1, weapon2Layer: 24, weapon1Layer: 25, foregroundLayer: 30 };
const BACK_WEAPON = "backgroundLayer";

/* レイヤーの一覧 */
const ALL_LAYERS = { [BACK_WEAPON]: WEAPON_LAYERS[BACK_WEAPON], ...BODY_LAYERS, ...WEAPON_LAYERS };   

/* 絵の切り方ごとに広がる方向を決める */
const slideDir = (o, n) => {
    const clip = o && n ? (o.clip === n.clip ? o.clip : null) : (o || n || {}).clip;
    return clip === "left" ? "L" : clip === "right" ? "R" : "B";   // L = 中心から左、R = 右、B = 両方
};

function snapshotLayers(table) {
    const out = [];
    for (const [id, z] of Object.entries(table)) {
        const layer = $(id);
        if (!layer || getComputedStyle(layer).display === "none") continue;
        const img = layer.querySelector("img");
        if (!img || !img.getAttribute("src") || getComputedStyle(img).display === "none") continue;
        const c = layer.dataset.clip;
        out.push({ id, z, img, clip: c === "l" ? "left" : c === "r" ? "right" : null, flip: layer.dataset.flip === "1" });
    }
    return out;  
}

async function decodeAll(imgs) {
    await Promise.all(imgs.map(img => (img.decode ? img.decode() : Promise.resolve()).catch(() => {})));
}

function drawLayer(l, W, H) {
    const c = mkCanvas(W, H), g = get2d(c);
    if (l.clip) {                              
        g.beginPath();
        g.rect(l.clip === "left" ? 0 : W / 2, 0, W / 2, H);
        g.clip();
    }
    if (l.flip) { g.translate(W, 0); g.scale(-1, 1); }
    g.drawImage(l.img, 0, 0, W, H);
    return c;
}

/* 一部の武器の左右の端をぼかす */
const FEATHER_RE = /(terror|cyclone|taboo)-weapon|claydoll-weaponX/;
function featherEdges(cv, src) {
    if (!FEATHER_RE.test(String(src))) return cv;
    const g = get2d(cv), w = cv.width, h = cv.height;
    g.save();
    g.globalCompositeOperation = "destination-in";
    const gr = g.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.1, "rgba(0,0,0,1)"); gr.addColorStop(0.9, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.restore();
    return cv;
}

/* 各レイヤーの絵を記憶 */
const BMP_CACHE_MAX = 22;
const bmpCache = new Map();
async function layerBitmap(l, W, H) {
    const src = l.img.currentSrc || l.img.src, key = src + "|" + l.clip + "|" + l.flip + "|" + W + "x" + H;
    const hit = bmpCache.get(key);
    if (hit) { bmpCache.delete(key); bmpCache.set(key, hit); return hit; }
    const bmp = await toBitmap(featherEdges(drawLayer(l, W, H), src));
    bmpCache.set(key, bmp);
    while (bmpCache.size > BMP_CACHE_MAX) bmpCache.delete(bmpCache.keys().next().value);
    return bmp;
}




/* =====================================================================
   4. 演出中の見た目の制御
===================================================================== */
const style = document.createElement("style");
style.textContent = `
.hs-hide-all .layer:not(#watermarkLayer) { visibility: hidden !important; }
`;
document.head.appendChild(style);




/* =====================================================================
   5. 羽（-wings）
===================================================================== */

/* 出現演出（布・羽） */
const FX_DIAG = {   
    big:   { ox: 408, oy: 383, dx: -0.36, dy: 0.933, len: 958, lat: 140 },   
};

const FX_HULL_SMALL = [[5,3],[172,41],[354,147],[384,169],[401,182],[436,212],[437,213],[451,228],[459,243],[462,249],[454,269],[448,274],[366,309],[349,314],[269,295],[252,290],[242,287],[221,278],[142,206],[141,205],[56,108],[27,59],[16,35]];    
{   
    const a = SMALL_ANGLE * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a);
    let dx = -uy, dy = ux; if (dx > 0) { dx = -dx; dy = -dy; }               
    const nx = -dy, ny = dx; let a0 = 1e9, a1 = -1e9, p0 = 1e9, p1 = -1e9;
    for (const [x, y] of FX_HULL_SMALL) { const al = x * dx + y * dy, pe = x * nx + y * ny; a0 = Math.min(a0, al); a1 = Math.max(a1, al); p0 = Math.min(p0, pe); p1 = Math.max(p1, pe); }
    FX_DIAG.small = { ox: dx * a0 + nx * (p0 + p1) / 2, oy: dy * a0 + ny * (p0 + p1) / 2, dx, dy, len: a1 - a0, lat: (p1 - p0) / 2 };
}

const FX_FAN = { px: 452, py: 381, phiMin: -47, phiMax: 52 };      

const WING_MORPH = {
    rs: [453, 261], rb: [356, 372], jrot: -98.5, js: 1.815,
    jx: 400, jy: 290,  
    a0: 0.6, a1: 0.4,
    root: [462, 249], axis: [-0.88, -0.474], len: 519,        
    ms: 1000,         
    swirl: 15,        
    from: 0.3, to: 0.75,      
    blur: 0.04,      
    sharpFrom: 0.9, sharpTo: 0.95,   
    feather: 0.05,    
};

const WING_COLOR = { "nasca-wings.webp": "N", "nasca-big-wings.webp": "N", "nasca3-wings.webp": "N3", "nasca3-big-wings.webp": "N3", "nasca-big-wingsWhite.webp": "W", "nasca-big-wingsPink.webp": "P" };
const WING_SIL = {
    "nasca-wings.webp": "A", "nasca3-wings.webp": "A",
    "nasca-big-wings.webp": "B", "nasca-big-wingsPink.webp": "B", "nasca-big-wingsWhite.webp": "B", "nasca3-big-wings.webp": "B",
};

function drawFray(g, bmp, side, W, H, cx, e, fr, j0 = 0, j1 = Infinity) {         
    const A = FRAY_TIP, a0 = g.globalAlpha; let wmax = 0;                
    for (let j = j0, jn = Math.min(fr.rows, j1); j < jn; j++) {
        const sj = fr.s[j], p = clamp((e - sj) / (1 - sj)), y = j * fr.rowH, h = Math.min(fr.rowH, H - y);
        if (p <= 0 || h <= 0) continue;
        const full = side === "R" ? (W - cx) : cx, w = Math.round(full * p), tl = Math.min(w, Math.round(full * 0.1 * fr.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = w - seg * 4;
        if (w > wmax) wmax = w;
        if (p >= 1) { if (side === "R") g.drawImage(bmp, cx, y, w, h, cx, y, w, h); else g.drawImage(bmp, cx - w, y, w, h, cx - w, y, w, h); continue; }   
        if (body > 0) { if (side === "R") g.drawImage(bmp, cx, y, body, h, cx, y, body, h); else g.drawImage(bmp, cx - body, y, body, h, cx - body, y, body, h); }
        for (let q = 0; q < 4; q++) {
            const x0 = Math.max(0, body) + q * seg, ww = Math.min(seg, w - x0); if (ww <= 0) break;
            g.globalAlpha = a0 * A[q];
            if (side === "R") g.drawImage(bmp, cx + x0, y, ww, h, cx + x0, y, ww, h); else g.drawImage(bmp, cx - x0 - ww, y, ww, h, cx - x0 - ww, y, ww, h);
        }
        g.globalAlpha = a0;
    }
    return wmax;
}

function drawFrayStrip(g, bmp, W, H, cx, e, e0, fr, j0 = 0, j1 = Infinity) {
    const A = FRAY_TIP, a0 = g.globalAlpha; let wmax = 0;
    for (let j = j0, jn = Math.min(fr.rows, j1); j < jn; j++) {
        const sj = fr.s[j], p = clamp((e - sj) / (1 - sj)), p0 = clamp((e0 - sj) / (1 - sj)), y = j * fr.rowH, h = Math.min(fr.rowH, H - y);
        if (p <= 0 || h <= 0) continue;
        const full = W - cx, w = Math.round(full * p), w0 = Math.round(full * p0), tl = Math.min(w, Math.round(full * 0.1 * fr.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = w - seg * 4;
        if (w > wmax) wmax = w;
        if (p >= 1) { if (w > w0) g.drawImage(bmp, cx + w0, y, w - w0, h, cx + w0, y, w - w0, h); continue; }
        if (body > w0) g.drawImage(bmp, cx + w0, y, body - w0, h, cx + w0, y, body - w0, h);
        for (let q = 0; q < 4; q++) {
            const xa = Math.max(0, body) + q * seg, xb = Math.min(xa + seg, w), x0 = Math.max(xa, w0); if (xb <= x0) continue;
            g.globalAlpha = a0 * A[q]; g.drawImage(bmp, cx + x0, y, xb - x0, h, cx + x0, y, xb - x0, h);
        }
        g.globalAlpha = a0;
    }
    return wmax;
}

function drawFrayDiag(g, f, bmp, side, W, H, e, P, k, e0) {     
    const B = FX_DIAG[f.kind], sc = W / 960, L = side === "L";
    const ox = (L ? B.ox : 960 - B.ox) * sc, oy = B.oy * sc, dx = B.dx * (L ? 1 : -1), dy = B.dy, th = Math.atan2(dy, dx);
    if (!f.R) {
        const Rs = Math.ceil((B.len + 1.2 * B.lat) * sc * 1.15), Rox = Math.round(Rs * 0.08), Roy = Math.round(Rs / 2);
        f.Rs = Rs; f.Rox = Rox; f.Roy = Roy; f.R = mkCanvas(Rs, Rs); f.R2 = mkCanvas(Rs, Rs);
        const rg = get2d(f.R); rg.translate(Rox, Roy); rg.rotate(-th); rg.translate(-ox, -oy); rg.drawImage(bmp, 0, 0, W, H);
        f.fr = makeFray(Rs, k, P, L ? 11 : 29, WING_ROW_PX);
    }
    const latPx = Math.ceil(B.lat * sc * 1.3) + 2, ya = Math.max(0, f.Roy - latPx), yh = Math.min(f.Rs, f.Roy + latPx) - ya, rh = f.fr.rowH, j0 = Math.floor(ya / rh), j1 = Math.ceil((ya + yh) / rh);
    const r2 = get2d(f.R2); r2.clearRect(0, ya, Math.min(f.Rs, (f.dirtyW || f.Rs) + 2), yh);
    const wm = e0 === undefined ? drawFray(r2, f.R, "R", f.Rs, f.Rs, f.Rox, e, f.fr, j0, j1) : drawFrayStrip(r2, f.R, f.Rs, f.Rs, f.Rox, e, e0, f.fr, j0, j1);
    const sw = Math.min(f.Rs, f.Rox + wm + 2); f.dirtyW = sw;
    g.save(); g.translate(ox, oy); g.rotate(th); g.translate(-f.Rox, -f.Roy); g.drawImage(f.R2, 0, ya, sw, yh, 0, ya, sw, yh); g.restore();
}

function fanFrame(pf) {
    if (pf > 1) {                                                                                
        const a = (pf - 1) * FAN.ms / Math.max(1, FAN.overshootMs);
        return { e: 1, sw: a >= 1 ? 0 : FAN.overshootDeg / FAN.swing * Math.sin(Math.PI * a) };
    }          
    const x = clamp(pf), N = FAN.steps, k = x * N, i = Math.min(N - 1, Math.floor(k)), t = clamp((k - i) / FAN.move), c1 = FAN.over, c3 = c1 + 1;
    const s1 = x >= 1 ? 1 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);           
    return { e: clamp((i + s1) / N), sw: 0.5 * Math.sin(Math.PI * t) * (1 - 0.6 * x) * (x >= 1 ? 0 : 1) };  
}

function drawFanWedge(g, bmp, side, W, H, fs, fr) {
    const sc = W / 960, sg = side === "L" ? 1 : -1, F = FX_FAN, rad = Math.PI / 180;
    const px = (side === "L" ? F.px : 960 - F.px) * sc, py = F.py * sc, aMin = F.phiMin - 4, aMax = F.phiMax + 4;
    g.save();
    g.translate(px, py); g.rotate(-sg * FAN.swing * rad * fs.sw); g.translate(-px, -py);
    g.beginPath();
    for (let j = 0; j < fr.rows; j++) {
        const sj = fr.s[j], p = clamp((fs.e - sj) / (1 - sj)); if (p <= 0) continue;
        const aj = aMin + (aMax - aMin) * p, r0 = j * fr.rowH, r1 = r0 + fr.rowH + 1, n = Math.max(1, Math.ceil((aj - aMin) / 6));
        for (let q = 0; q <= n; q++) { const a = (aMin + (aj - aMin) * q / n) * rad, x = px - sg * r1 * Math.cos(a), y = py - r1 * Math.sin(a); q ? g.lineTo(x, y) : g.moveTo(x, y); }
        for (let q = n; q >= 0; q--) { const a = (aMin + (aj - aMin) * q / n) * rad; g.lineTo(px - sg * r0 * Math.cos(a), py - r0 * Math.sin(a)); }
        g.closePath();
    }
    g.clip(); g.drawImage(bmp, 0, 0, W, H); g.restore();
}

function drawMorph(S, g, s, fx) {
    const { W, H, fanOver, fanOverCtx, fMx, fMy, t } = S, P = params;
    const m = fx.morph, sc = W / 960, L = s.dir === "L", sg = L ? 1 : -1, M = WING_MORPH, ox = fanOverCtx ? fMx : 0, oy = fanOverCtx ? fMy : 0, EW = W + 2 * ox, EH = H + oy;      
    const p = slideEase(clamp(t / Math.max(1, Math.min(M.ms, P.slideMs)))), a = m.from === "small" ? p : 1 - p;
    const rs = [(L ? M.rs[0] : 960 - M.rs[0]) * sc, M.rs[1] * sc], rb = [(L ? M.rb[0] : 960 - M.rb[0]) * sc, M.rb[1] * sc], jm = [(L ? M.jx : 960 - M.jx) * sc, M.jy * sc];
    const pose = aa => {                                                  
        const th = sg * M.jrot * aa + (-sg) * M.swirl * Math.sin(Math.PI * aa), sA = 1 + (M.js - 1) * aa, m1 = smooth(aa / Math.max(0.01, M.a0)), m2 = smooth((aa - M.a1) / Math.max(0.01, 1 - M.a1));
        const jx = rs[0] + (jm[0] - rs[0]) * m1 + (rb[0] - jm[0]) * m2, jy = rs[1] + (jm[1] - rs[1]) * m1 + (rb[1] - jm[1]) * m2;
        return new DOMMatrix().translate(jx, jy).rotate(th).scale(sA).translate(-rs[0], -rs[1]);
    };
    const base = new DOMMatrix().translate(ox, oy), T1inv = pose(1).inverse(), Pm = base.multiply(pose(a));        
    if (!fx.tO) { fx.tO = mkCanvas(EW, EH); fx.tN = mkCanvas(EW, EH); fx.tS = mkCanvas(EW, EH); fx.mk = mkCanvas(EW, EH); }
    const gO = get2d(fx.tO), gN = get2d(fx.tN), gS = get2d(fx.tS), gM = get2d(fx.mk);
    const sh = smooth((p - M.sharpFrom) / Math.max(0.01, M.sharpTo - M.sharpFrom));       
    const blurAmt = M.blur * (1 - sh);
    for (const gg of [gO, gN, gS]) { gg.setTransform(1, 0, 0, 1, 0, 0); gg.globalCompositeOperation = "source-over"; gg.globalAlpha = 1; gg.clearRect(0, 0, EW, EH); }
    const NS = blurAmt > 0.002 ? 8 : 1;                                 
    for (let i = 0; i < NS; i++) {
        const pp = clamp(p + (NS > 1 ? blurAmt * (i / (NS - 1) - 0.5) : 0)), aa = m.from === "small" ? pp : 1 - pp, G = pose(aa), Pi = base.multiply(G), Qi = base.multiply(G).multiply(T1inv);
        const oldMat = m.from === "small" ? Pi : Qi, newMat = m.from === "small" ? Qi : Pi;
        for (const [gg, mat, im] of [[gO, oldMat, s.o.bmp], [gN, newMat, s.n.bmp]]) { gg.globalAlpha = 1 / (i + 1); gg.setTransform(mat); gg.drawImage(im, 0, 0, W, H); }
    }
    if (sh > 0.001) {                                                   
        const aa = m.from === "small" ? p : 1 - p, Pi = base.multiply(pose(aa)), Qi = Pi.multiply(T1inv);
        gS.setTransform(m.from === "small" ? Qi : Pi); gS.drawImage(s.n.bmp, 0, 0, W, H);
    }
    for (const gg of [gO, gN, gS]) { gg.setTransform(1, 0, 0, 1, 0, 0); gg.globalAlpha = 1; }
    const w = smooth((p - M.from) / Math.max(0.01, M.to - M.from));
    if (!m.sameColor) {
        gM.setTransform(1, 0, 0, 1, 0, 0); gM.globalCompositeOperation = "source-over"; gM.clearRect(0, 0, EW, EH);
        const rt = [(L ? M.root[0] : 960 - M.root[0]) * sc, M.root[1] * sc], ax = [sg * M.axis[0], M.axis[1]], len = M.len * sc, ang = Math.atan2(ax[1], ax[0]);
        gM.setTransform(Pm); gM.translate(rt[0], rt[1]); gM.rotate(ang);                
        const lat = 330 * sc;
        const fe = M.feather * len, front = -fe + (len * 1.05 + fe) * w;               
        const gr = gM.createLinearGradient(front - fe, 0, front, 0); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        gM.fillStyle = gr; gM.fillRect(-len * 0.3, -lat, len * 1.6, lat * 2);
        gM.setTransform(1, 0, 0, 1, 0, 0);
        for (const gg of [gN, gS]) { gg.globalCompositeOperation = "destination-in"; gg.drawImage(fx.mk, 0, 0); gg.globalCompositeOperation = "source-over"; }
        gO.globalCompositeOperation = "destination-out"; gO.drawImage(fx.mk, 0, 0); gO.globalCompositeOperation = "source-over";
    }
    const compose = (t, dx, dy) => {
        const aO = m.sameColor ? 1 - w : 1, aN = m.sameColor ? w : 1;
        t.globalAlpha = aO; t.drawImage(fx.tO, dx, dy);
        t.globalAlpha = aN * (1 - sh); t.drawImage(fx.tN, dx, dy);
        if (sh > 0.001) { t.globalAlpha = aN * sh; t.drawImage(fx.tS, dx, dy); }
        t.globalAlpha = 1;
    };
    compose(g, -ox, -oy);
    if (fanOverCtx) {                                                   
        fanOverCtx.save(); fanOverCtx.beginPath(); fanOverCtx.rect(0, 0, fanOver.width, fanOver.height); fanOverCtx.rect(fMx, fMy, W, H); fanOverCtx.clip("evenodd");
        compose(fanOverCtx, 0, 0); fanOverCtx.restore();
    }
}




/* =====================================================================
   6. マント・マフラー・腰
===================================================================== */
const CLOTH_Y = {
    "black-cape.webp": [0.196, 0.890], "gold-cape.webp": [0.196, 0.890], "red-cape.webp": [0.196, 0.890],
    "damaged-cape.webp": [0.191, 0.982], "slanted-cape.webp": [0.191, 0.940],
    "silver-muffler.webp": [0.295, 0.584], "skull-muffler.webp": [0.247, 0.593], "nasca-muffler.webp": [0.295, 0.584],
    "brown-waist.webp": [0.418, 0.971], "black-waist.webp": [0.418, 0.971],
};

const CLOTH_SIL = {
    "black-cape.webp": "capeA", "gold-cape.webp": "capeA", "red-cape.webp": "capeA", "damaged-cape.webp": "capeA",
    "silver-muffler.webp": "mufA", "nasca-muffler.webp": "mufA",
    "brown-waist.webp": "waistA", "black-waist.webp": "waistA",
};

function drawFrayDown(g, bmp, W, H, e, fr, y0, y1) {
    const A = FRAY_TIP, a0 = g.globalAlpha, full = y1 - y0;
    for (let j = 0; j < fr.rows; j++) {
        const sj = fr.s[j], p = clamp((e - sj) / (1 - sj)), x = j * fr.rowH, w = Math.min(fr.rowH, W - x);
        if (p <= 0 || w <= 0) continue;
        const h = Math.round(full * p), tl = Math.min(h, Math.round(full * 0.1 * fr.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = h - seg * 4;
        if (p >= 1) { g.drawImage(bmp, x, y0, w, h, x, y0, w, h); continue; }
        if (body > 0) g.drawImage(bmp, x, y0, w, body, x, y0, w, body);
        for (let q = 0; q < 4; q++) {
            const y = y0 + Math.max(0, body) + q * seg, hh = Math.min(seg, y0 + h - y); if (hh <= 0) break;
            g.globalAlpha = a0 * A[q]; g.drawImage(bmp, x, y, w, hh, x, y, w, hh);
        }
        g.globalAlpha = a0;
    }
}

function makeUnder(o, n, W, H, k, P, y, morph) {
    const st = { o, n, y: [Math.round(H * y[0]), Math.round(H * y[1])], fr: makeFray(W, k, P, 11), tmp: mkCanvas(W, H), white: mkWhite(W, H), morph: false };
    if (!morph) return st;
    try {
        const frX = makeFray(W, k, P, 41), rh = frX.rowH, nc = frX.rows, edge = bmp => {             
            const c = mkCanvas(W, H), g = get2d(c); g.drawImage(bmp, 0, 0, W, H);
            const d = g.getImageData(0, 0, W, H).data, top = new Int32Array(nc).fill(-1), bot = new Int32Array(nc).fill(-1);
            for (let j = 0; j < nc; j++) for (let x = j * rh; x < Math.min(W, (j + 1) * rh); x++) for (let yy = 0; yy < H; yy++) if (d[(yy * W + x) * 4 + 3] > 8) { if (top[j] < 0 || yy < top[j]) top[j] = yy; break; }
            for (let j = 0; j < nc; j++) for (let x = j * rh; x < Math.min(W, (j + 1) * rh); x++) for (let yy = H - 1; yy >= 0; yy--) if (d[(yy * W + x) * 4 + 3] > 8) { if (yy > bot[j]) bot[j] = yy; break; }
            return { top, bot };
        };
        const eo = edge(o), en = edge(n);
        st.bO = eo.bot; st.bT = new Int32Array(nc); st.frX = frX; st.morph = true;
        for (let j = 0; j < nc; j++) st.bT[j] = en.bot[j] >= 0 ? en.bot[j] : eo.top[j];     
    } catch (e) { console.warn("下端の変形の準備に失敗：同じ境界線で消えます", e); }
    return st;
}
function drawUnder(g, st, W, H, e) {         
    const tg = get2d(st.tmp), A = FRAY_TIP;
    tg.globalCompositeOperation = "source-over"; tg.clearRect(0, 0, W, H);
    if (!st.morph) tg.drawImage(st.o, 0, 0, W, H);
    else {
        const fr = st.frX, a0 = tg.globalAlpha;
        for (let j = 0; j < fr.rows; j++) {
            const bo = st.bO[j]; if (bo < 0) continue;
            const x = j * fr.rowH, w = Math.min(fr.rowH, W - x), sj = fr.s[j], p = clamp((e - sj) / (1 - sj)), b = Math.round(bo + (st.bT[j] - bo) * p) + 1;     
            if (b >= bo + 1) { tg.drawImage(st.o, x, 0, w, bo + 1, x, 0, w, bo + 1); continue; }
            if (b <= 0) continue;
            const tl = Math.min(b, Math.round(H * 0.03 * fr.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = b - seg * 4;
            if (body > 0) tg.drawImage(st.o, x, 0, w, body, x, 0, w, body);
            for (let q = 0; q < 4; q++) {
                const yy = Math.max(0, body) + q * seg, hh = Math.min(seg, b - yy); if (hh <= 0) break;
                tg.globalAlpha = a0 * A[q]; tg.drawImage(st.o, x, yy, w, hh, x, yy, w, hh);
            }
            tg.globalAlpha = a0;
        }
    }
    tg.globalCompositeOperation = "destination-out"; drawFrayDown(tg, st.white, W, H, e, st.fr, st.y[0], st.y[1]);
    tg.globalCompositeOperation = "source-over"; drawFrayDown(tg, st.n, W, H, e, st.fr, st.y[0], st.y[1]);
    g.drawImage(st.tmp, 0, 0, W, H);
}

function fxFor(id, src) {
    if (id === "capeLayer" || id.startsWith("muffler#") || id.startsWith("waist#")) return { type: "fray", mode: "down", y: CLOTH_Y[src] || [0.19, 0.99] };   
    if (id.startsWith("wings#")) {
        if (/^bird-wings/.test(src)) return { type: "fan" };                                  
        if (/^nasca3?-big-wings/.test(src)) return { type: "fray", mode: "diag", kind: "big" };
        if (/^nasca3?-wings/.test(src)) return { type: "fray", mode: "diag", kind: "small" };
    }
    return null;
}




/* =====================================================================
   7. 羽・マフラー・腰の照合
===================================================================== */

function virtualizeSlots(slots, W, H, cx) {
    let out = slots;
    const virtualize = (ids, prefix, sil) => {
        const layers = ids.map(id => out.find(s => s.id === id));
        if (!layers.some(Boolean)) return;
        const halfBmp = (bmp, h) => { const cv = mkCanvas(W, H); clipDraw(get2d(cv), bmp, h === "L" ? 0 : cx, h === "L" ? cx : W, W, H); return cv; };
        const parts = state => layers.flatMap((s, z) => {
            const x = s && s[state]; if (!x || !x.bmp) return [];
            const hs = x.clip === "left" ? ["L"] : x.clip === "right" ? ["R"] : ["L", "R"];
            return hs.map(h => ({ h, src: baseOf(x.src), z, bmp: halfBmp(x.bmp, h) }));
        });
        const op = parts("o"), np = parts("n"), used = new Set(), pairs = [];
        // ① 同じ画像は、スロットや表示範囲が変わっていても続投
        for (const n of np) {
            const k = op.findIndex((o, i) => !used.has(i) && o.h === n.h && o.src === n.src);
            if (k >= 0) { used.add(k); pairs.push({ o: op[k], n }); } else pairs.push({ o: null, n });
        }
        // ②a シルエットが同じ別の画像は、旧を消さずに、新が同じ境界線で入れ替わる
        for (const p of pairs) {
            if (p.o) continue;
            const g = sil[p.n.src]; if (!g) continue;
            const k = op.findIndex((o, i) => !used.has(i) && o.h === p.n.h && sil[o.src] === g);
            if (k >= 0) { used.add(k); p.o = op[k]; }
        }
        // ②b 小と大の入れ替え（同じ側どうし）：旧が回って・拡大／縮小して動き、新に入れ替わる
        for (const p of pairs) {
            if (p.o || sil !== WING_SIL) continue;
            const g = sil[p.n.src]; if (!g) continue;
            const k = op.findIndex((o, i) => !used.has(i) && o.h === p.n.h && sil[o.src] && sil[o.src] !== g);
            if (k >= 0) { used.add(k); p.o = op[k]; p.morph = { from: sil[op[k].src] === "A" ? "small" : "big", sameColor: WING_COLOR[op[k].src] === WING_COLOR[p.n.src] }; }
        }
        // ③ 残った旧は、次の構成に出ないので、外から中へ消える。残った新は、中から外へ現れる
        op.forEach((o, i) => { if (!used.has(i)) pairs.push({ o, n: null }); });
        const virt = pairs.map((p, idx) => {
            const a = p.o, b = p.n, ref = b || a, h = ref.h, clip = h === "L" ? "left" : "right";
            const oo = a && { src: a.src, bmp: a.bmp, clip }, nn = b && { src: b.src, bmp: b.bmp, clip };
            const same = !!(a && b && a.src === b.src);
            return { z: ref.z, id: prefix + "#" + idx, o: oo, n: nn, dir: h, weapon: false, back: false, changed: !same, vanish: !!(a && !b), morph: p.morph || null };       
        }).sort((x, y) => x.z - y.z);
        const at = out.findIndex(s => layers.includes(s));
        out = out.filter(s => !layers.includes(s));
        out.splice(Math.max(0, at), 0, ...virt);
    };
    virtualize(["wings2Layer", "wings1Layer"], "wings", WING_SIL);
    virtualize(["muffler1Layer", "muffler2Layer"], "muffler", CLOTH_SIL);
    virtualize(["waist1Layer", "waist2Layer"], "waist", CLOTH_SIL);
    return out;
}




/* =====================================================================
   8. 光の帯
===================================================================== */

/* 光の帯 */
function createSweepFx(W, H, k, P) {
    const bwTotal = Math.max(8, Math.round(P.slideGlowPx * k));
    const bwMax = Math.ceil(bwTotal * 1.3) + 4;
    const mk = () => { const c = mkCanvas(bwMax, H); return { c, g: get2d(c) }; };
    const C = mk(), Wt = mk(), S = mk();
    const pre = Math.round(bwTotal * 0.15);                       

    return function sweep(ctx, maskCv, frontX, dir, t, intensity) {
        const x0 = dir < 0 ? frontX - pre : frontX - bwTotal;
        const bx = clamp(Math.round(x0), 0, W - 1), w = Math.min(bwTotal + pre, W - bx, bwMax);
        if (w < 6 || intensity <= 0 || P.slideGlow <= 0) return;
        const G = P.slideGlow * intensity;
        const fx = frontX - bx;                                    
        const nd = -dir;                                             

        C.g.globalCompositeOperation = "source-over";
        C.g.clearRect(0, 0, bwMax, H);
        C.g.drawImage(maskCv, bx, 0, w, H, 0, 0, w, H);
        const grad = C.g.createLinearGradient(fx + dir * pre, 0, fx + nd * bwTotal, 0);
        const f0 = pre / (pre + bwTotal);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(f0, "rgba(0,0,0,1)");
        grad.addColorStop(f0 + (1 - f0) * 0.12, "rgba(0,0,0,0.75)");
        grad.addColorStop(f0 + (1 - f0) * 0.4, "rgba(0,0,0,0.3)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        C.g.globalCompositeOperation = "destination-in";
        C.g.fillStyle = grad;
        C.g.fillRect(0, 0, w, H);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";                     
        ctx.globalAlpha = clamp(0.95 * G);
        ctx.drawImage(C.c, 0, 0, w, H, bx, 0, w, H);                
        ctx.drawImage(C.c, 0, 0, w, H, bx, 0, w, H);
        ctx.drawImage(C.c, 0, 0, w, H, bx, 0, w, H);

        Wt.g.globalCompositeOperation = "source-over";
        Wt.g.clearRect(0, 0, bwMax, H);
        Wt.g.drawImage(C.c, 0, 0);
        Wt.g.globalCompositeOperation = "source-in";
        Wt.g.fillStyle = P.slideColor || "#fff";
        Wt.g.fillRect(0, 0, w, H);
        ctx.globalAlpha = clamp(0.9 * G);
        ctx.drawImage(Wt.c, 0, 0, w, H, bx, 0, w, H);

        S.g.globalCompositeOperation = "source-over";
        S.g.globalAlpha = 1;
        S.g.clearRect(0, 0, bwMax, H);
        const rng = mulberry32(Math.floor(t / 40) * 131 + (dir < 0 ? 1 : 2));
        S.g.fillStyle = P.slideColor || "#fff";
        for (let i = 0; i < P.slideStreaks; i++) {
            const y = Math.round(rng() * H);
            const len = Math.round((0.3 + rng() * 0.7) * bwTotal);
            const th = Math.max(1, Math.round((1 + rng() * 2.5) * k));
            S.g.globalAlpha = 0.35 + rng() * 0.5;
            S.g.fillRect(nd > 0 ? fx : fx - len, y, len, th);
        }
        S.g.globalAlpha = 1;
        S.g.globalCompositeOperation = "destination-in";
        S.g.drawImage(maskCv, bx, 0, w, H, 0, 0, w, H);
        ctx.globalAlpha = clamp(0.8 * G);
        ctx.drawImage(S.c, 0, 0, w, H, bx, 0, w, H);
        ctx.restore();
    };
}




/* =====================================================================
   9. 首元
===================================================================== */

/* 首元の消失 */
const NECK_FX = { "black-neck.webp": { hw: 0.5375, y: [0.10, 0.378] }, "black-neckF.webp": { hw: 0.4417, y: [0.10, 0.233] }, "skull-neck.webp": { type: "wipeL", x: [0.39, 0.595] } };

const NECK_SAME = new Set(["black-neck.webp", "black-neckF.webp"]);

/* 首元の演出（消える／現れる／入れ替わる） */
function assignNeckFx(s) {
    const nf = s.o && NECK_FX[baseOf(s.o.src)], va = nf ? { type: "neck", ...nf } : { type: "sweep" };      
    if (s.o && !s.n) s.fx = { va };
    else if (!s.o && s.n && /^black-neck/.test(baseOf(s.n.src))) s.fx = { ap: { type: "sweep" } };      
    else if (s.o && s.n && NECK_SAME.has(baseOf(s.o.src)) && NECK_SAME.has(baseOf(s.n.src))) s.noGlow = true;      
    else if (s.o && s.n) s.fx = { va, ap: { type: "sweep" }, seq: baseOf(s.n.src) === "skull-neck.webp" && /^black-neck/.test(baseOf(s.o.src)) };      
}

/* skull-neck と skull-muffler */
function linkSkullSlots(slots) {
    const P = params;
    const T = P.slideMs, sp = SKULL.seq, sh = SKULL.share, isS = (c, k) => c[k] && baseOf(c[k].src) === "skull-neck.webp", isM = (c, k) => c[k] && baseOf(c[k].src) === "skull-muffler.webp";
    const nkA = slots.find(c => c.id === "neckLayer" && c.changed && isS(c, "n")), nkV = slots.find(c => c.id === "neckLayer" && c.changed && c.o && isS(c, "o")), span = SKULL.span;
    if (nkA) {
        const seq = !!(nkA.fx && nkA.fx.seq), a = seq ? Math.max(0, T - SKULL.late) : 0, S = seq ? (T - Math.max(0, sp * T - SKULL.lead)) * span : T * span, L = S * sh, ov = clamp(SKULL.overlap, 0, L);        
        nkA.fx = Object.assign(nkA.fx || {}, { ap: { type: "wipeL", x: NECK_FX["skull-neck.webp"].x }, apWin: [a, a + L] });
        for (const m of slots) if (m.id.startsWith("muffler#") && m.changed && m.n && !m.o && m.fx && m.fx.ap && isM(m, "n")) m.fx.apWin = [a + L - ov, a + S];      
    }
    if (nkV) {
        const S = T * span, Lv = S * sh, ov = clamp(SKULL.overlap, 0, S - Lv);                               
        nkV.fx = Object.assign(nkV.fx || {}, { va: { type: "wipeL", x: NECK_FX["skull-neck.webp"].x }, vaWin: [S - Lv, S] });
        for (const m of slots) if (m.id.startsWith("muffler#") && m.changed && m.o && !m.n && m.fx && m.fx.va && isM(m, "o")) m.fx.vaWin = [0, S - Lv + ov];       
    }
}




/* =====================================================================
   10. 武器
===================================================================== */

/* 武器の出現・消失の向き */
const WEAPON_DIS_TOP = ["cyclone", "iceage", "xtreme", "terror", "utopia"];      
const WEAPON_DIS_FULL = ["heat", "ocean", "taboo"];                                          
const WEAPON_OUTIN = ["accel", "eternal", "nasca", "nasca3", "prism"];                                                       
const WEAPON_ININ = ["fang", "metal", "skull", "trigger", "bomb", "smilodon", "rocket"];                  
const WRIST_X = 0.797, WRIST_Y = 0.43;      

/* 武器の出方を決める */
const weaponOrg = base => {
    const m = /^([a-z0-9]+)-weapon(.*)\.webp$/.exec(base), o = m ? m[1] : "";
    const v = m ? m[2] : "";
    if (o === "claydoll") return { dis: true, top: !!v };                         
    if (WEAPON_DIS_TOP.includes(o)) return { dis: true, top: true };
    if (WEAPON_DIS_FULL.includes(o)) return { dis: true, top: false };
    if (o === "queen") return { ap: "c", va: "e", sweep: true };                     
    if (o === "engine") return { dis: true, plain: true };                            
    if (o === "trigger" && v === "F") return { ap: "c", va: "c", vert: true, wx: WRIST_X, wy: WRIST_Y };     
    if (o === "trial") return { ap: "c", va: "c", disVa: true };                            
    if (o === "luna") return { ap: "c", va: "e", disVa: true };                     
    if (WEAPON_OUTIN.includes(o)) return { ap: "e", va: "e" };
    if (WEAPON_ININ.includes(o)) return { ap: "c", va: "c" };
    return { ap: "c", va: "e" };
};

const plainDissolve = () => ({ glow: false, type: "dissolve" });

const colorOf = bmp => {
    const c = mkCanvas(64, 86), g = get2d(c, { willReadFrequently: true }); g.drawImage(bmp, 0, 0, 64, 86);
    const d = g.getImageData(0, 0, 64, 86).data; let r = 0, gg = 0, b = 0, w = 0;
    for (let i = 0; i < d.length; i += 4) { const al = d[i + 3]; if (al < 128) continue; const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]), wt = al * (0.15 + (mx ? (mx - mn) / mx : 0)) * (0.3 + mx / 255); r += d[i] * wt; gg += d[i + 1] * wt; b += d[i + 2] * wt; w += wt; }
    if (!w) return "#fff";
    r /= w; gg /= w; b /= w; const sc = 255 / Math.max(1, r, gg, b), mixW = WEAPON_GLOW.mix;
    const f = v => Math.round(Math.min(255, v * sc) * (1 - mixW) + 255 * mixW);
    return "rgb(" + f(r) + "," + f(gg) + "," + f(b) + ")";
};

const WEAPON_FAMILY_OWNERS = ["cyclone", "luna", "violence", "xtreme", "engine", "terror", "utopia"];
const weaponFamily = base => {
    const m = /^([a-z0-9]+)-weapon(.*)\.webp$/.exec(base); if (!m) return "";
    return WEAPON_FAMILY_OWNERS.includes(m[1]) ? m[1] : "";
};

const brightOf = (bmp, W, H, top) => {
    const sw = Math.max(1, W >> 2), sh = Math.max(1, H >> 2), sc = mkCanvas(sw, sh), sg = get2d(sc, { willReadFrequently: true });
    sg.drawImage(bmp, 0, 0, sw, sh);
    const im = sg.getImageData(0, 0, sw, sh), d = im.data, hist = new Uint32Array(256); let n = 0;
    const lum = i => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) { hist[Math.round(lum(i))]++; n++; }
    let acc = 0, thr = 255; for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc >= n * top) { thr = v; break; } }
    const soft = 24;
    for (let i = 0; i < d.length; i += 4) { d[i] = d[i + 1] = d[i + 2] = 0; d[i + 3] = d[i + 3] > 128 ? Math.round(255 * clamp((lum(i) - (thr - soft)) / soft)) : 0; }
    sg.putImageData(im, 0, 0);
    const c = mkCanvas(W, H), g = get2d(c); g.drawImage(bmp, 0, 0, W, H);
    g.globalCompositeOperation = "destination-in"; g.drawImage(sc, 0, 0, W, H);        
    return c;
};

const isMetal = src => /^metal-weapon/.test(baseOf(src));
const WEAPON_SAME_SIL = [["trigger", "skull", "bomb"]];
const ownerOf = src => { const m = /^([a-z0-9]+)-weapon/.exec(baseOf(src)); return m ? m[1] : ""; };
const sameSil = (a, b) => { const x = ownerOf(a), y = ownerOf(b); return !!x && baseOf(a) !== baseOf(b) && (x === y || WEAPON_SAME_SIL.some(g => g.includes(x) && g.includes(y))); };
const swordOf = it => {
    if (!it) return null;
    const b = baseOf(it.src);
    if (b === "prism-weapon.webp") return it.clip ? (/^l/i.test(it.clip) ? "L" : "R") : null;
    return b === "prism-weaponX.webp" || b === "claydoll-weaponX.webp" ? "L" : null;
};
const detailOf = it => { const b = it ? baseOf(it.src) : ""; return b === "claydoll-weapon.webp" || b === "gene-weapon.webp" ? "A" : b === "claydoll-weaponCG.webp" || b === "claydoll-weaponGC.webp" ? "B" : null; };
const linked = (a, b) => { const x = swordOf(a), y = swordOf(b), p = detailOf(a), q = detailOf(b); return !!((x && x === y) || (p && q && p !== q)); };      
const isTrial = src => /^trial-weapon/.test(baseOf(src));
const weaponFx0 = s => {
    const wo = s.o && weaponOrg(baseOf(s.o.src)), wn = s.n && weaponOrg(baseOf(s.n.src));
    if (s.o && s.n) { const fo = weaponFamily(baseOf(s.o.src)); if (fo && fo === weaponFamily(baseOf(s.n.src))) return { va: plainDissolve(), ap: plainDissolve() }; }      
    if (s.o && s.n && linked(s.o, s.n)) return { va: plainDissolve(), ap: plainDissolve() };     
    let ap = wn && (wn.dis ? { type: "dissolve", glow: !wn.plain, color: colorOf(s.n.bmp), top: !!wn.top } : { type: "fray", mode: wn.vert ? "y" : "x", org: wn.ap, ...(wn.vert && { wx: wn.wx, wy: wn.wy }), ...(wn.sweep && { from: s.n.flip ? "L" : "R" }) });
    if (ap && s.fadeAp) ap = plainDissolve();
    let va = wo && (wo.dis || (wo.disVa && !s.swapTrial) ? plainDissolve() : { type: "fray", mode: wo.vert ? "y" : "x", org: wo.va, ...(wo.vert && { wx: wo.wx, wy: wo.wy }), ...(wo.sweep && { from: s.o.flip ? "R" : "L" }) });
    if (va && s.fadeVa) va = plainDissolve();
    if (ap && !va) return { ap };
    if (va && !ap) return { va };
    if (s.o && s.n && (s.fadeVa || s.fadeAp)) return { va, ap };                    
    if (s.o && s.n && isTrial(s.o.src) !== isTrial(s.n.src)) return { va, ap, newBehind: true };    
    if (s.o && s.n && isMetal(s.o.src) && isMetal(s.n.src)) return { va, ap };           
    if (s.o && s.n && isTrial(s.o.src) && isTrial(s.n.src) && baseOf(s.o.src) !== baseOf(s.n.src) && s.o.clip === s.n.clip) return { va: plainDissolve(), ap: plainDissolve() };      
    if (wo.vert || wn.vert) return { va, ap };                                                  
    if (wo.dis || wo.disVa || wn.dis) return { va, ap };                                        
    if (!sameSil(s.o.src, s.n.src)) return { va, ap };                                 
    return { under: true, ap };                                                        
};

const weaponFx = s => {
    const r = weaponFx0(s), nT = !!(s.n && isTrial(s.n.src)), oT = !!(s.o && isTrial(s.o.src));
    if (!nT && !oT) return r;
    const T = params.slideMs, d = Math.min(T, TRIAL_MS), end = [T - d, T], start = [0, d];    
    if (r.ap && r.ap.type === "fray" && nT) r.apWin = s.swapTrialAp ? start : end;
    if (r.va && oT && r.va.type === "fray") r.vaWin = s.swapTrial ? start : end;
    return r;
};

function buildDissolveGlow(f, bmp, W, H, k) {
    const P = params;
    f.src = f.top ? brightOf(bmp, W, H, WEAPON_GLOW.top) : bmp;     
    const tint = mkCanvas(W, H), tg = get2d(tint); tg.drawImage(f.src, 0, 0, W, H); tg.globalCompositeOperation = "source-in"; tg.fillStyle = f.color || P.slideColor || "#fff"; tg.fillRect(0, 0, W, H);
    const hp = WEAPON_GLOW.halo, hs = 0.25, halo = mkCanvas(Math.max(1, Math.round(W * hs)), Math.max(1, Math.round(H * hs))), hg = get2d(halo); if (hp > 0) hg.filter = "blur(" + (hp * k * hs) + "px)"; hg.drawImage(tint, 0, 0, halo.width, halo.height);     
    f.glowCv = mkCanvas(W, H); const cg = get2d(f.glowCv); cg.globalCompositeOperation = "lighter";
    cg.globalAlpha = 0.7; cg.drawImage(tint, 0, 0); cg.globalAlpha = 0.9; cg.drawImage(halo, 0, 0, W, H);      
}


function drawFrayX(g, bmp, side, W, H, cx, e, fr, org) {
    const A = FRAY_TIP, a0 = g.globalAlpha, full = side === "R" ? (W - cx) : cx;
    const xr = (t0, t1) => side === "L" ? (org === "e" ? [t0, t1 - t0] : [cx - t1, t1 - t0]) : (org === "e" ? [W - t1, t1 - t0] : [cx + t0, t1 - t0]);     
    for (let j = 0; j < fr.rows; j++) {
        const sj = fr.s[j], p = clamp((e - sj) / (1 - sj)), y = j * fr.rowH, h = Math.min(fr.rowH, H - y);
        if (p <= 0 || h <= 0) continue;
        const w = Math.round(full * p), tl = Math.min(w, Math.round(full * 0.1 * fr.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = w - seg * 4;
        if (p >= 1) { const [x, ww] = xr(0, w); g.drawImage(bmp, x, y, ww, h, x, y, ww, h); continue; }
        if (body > 0) { const [x, ww] = xr(0, body); g.drawImage(bmp, x, y, ww, h, x, y, ww, h); }
        for (let q = 0; q < 4; q++) {
            const t0 = Math.max(0, body) + q * seg, t1 = Math.min(w, t0 + seg); if (t1 <= t0) break;
            const [x, ww] = xr(t0, t1); g.globalAlpha = a0 * A[q]; g.drawImage(bmp, x, y, ww, h, x, y, ww, h);
        }
        g.globalAlpha = a0;
    }
}

function drawFrayY(g, bmp, W, H, cy, e, fr) {
    const A = FRAY_TIP, a0 = g.globalAlpha;
    for (const up of [true, false]) {
        const f = up ? fr.up : fr.dn, full = up ? cy : H - cy;
        const yr = (t0, t1) => up ? [cy - t1, t1 - t0] : [cy + t0, t1 - t0];    
        for (let j = 0; j < f.rows; j++) {
            const sj = f.s[j], p = clamp((e - sj) / (1 - sj)), x = j * f.rowH, w = Math.min(f.rowH, W - x);
            if (p <= 0 || w <= 0) continue;
            const h = Math.round(full * p), tl = Math.min(h, Math.round(full * 0.1 * f.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = h - seg * 4;
            if (p >= 1) { const [y, hh] = yr(0, h); g.drawImage(bmp, x, y, w, hh, x, y, w, hh); continue; }
            if (body > 0) { const [y, hh] = yr(0, body); g.drawImage(bmp, x, y, w, hh, x, y, w, hh); }
            for (let q = 0; q < 4; q++) {
                const t0 = Math.max(0, body) + q * seg, t1 = Math.min(h, t0 + seg); if (t1 <= t0) break;
                const [y, hh] = yr(t0, t1); g.globalAlpha = a0 * A[q]; g.drawImage(bmp, x, y, w, hh, x, y, w, hh);
            }
            g.globalAlpha = a0;
        }
    }
}

function drawFraySweep(g, bmp, W, H, e, fr, fromR) {
    const A = FRAY_TIP, a0 = g.globalAlpha;
    const xr = (t0, t1) => fromR ? [W - t1, t1 - t0] : [t0, t1 - t0];     
    for (let j = 0; j < fr.rows; j++) {
        const sj = fr.s[j], p = clamp((e - sj) / (1 - sj)), y = j * fr.rowH, h = Math.min(fr.rowH, H - y);
        if (p <= 0 || h <= 0) continue;
        const w = Math.round(W * p), tl = Math.min(w, Math.round(W * 0.1 * fr.tip[j])), seg = Math.max(1, Math.round(tl / 4)), body = w - seg * 4;
        if (p >= 1) { const [x, ww] = xr(0, w); g.drawImage(bmp, x, y, ww, h, x, y, ww, h); continue; }
        if (body > 0) { const [x, ww] = xr(0, body); g.drawImage(bmp, x, y, ww, h, x, y, ww, h); }
        for (let q = 0; q < 4; q++) {
            const t0 = Math.max(0, body) + q * seg, t1 = Math.min(w, t0 + seg); if (t1 <= t0) break;
            const [x, ww] = xr(t0, t1); g.globalAlpha = a0 * A[q]; g.drawImage(bmp, x, y, ww, h, x, y, ww, h);
        }
        g.globalAlpha = a0;
    }
}

function swapSameWeapons(slots) {
    const ws = slots.filter(x => x.weapon), same = (a, b) => !!(a && b && a.src === b.src && a.clip === b.clip && a.flip === b.flip);
    for (const x of ws) {
        if (!x.n || same(x.o, x.n)) continue;
        const t = ws.find(y => y !== x && y.o && same(y.o, x.n) && !same(y.o, y.n));
        if (!t) continue;
        [x.o, t.o] = [t.o, x.o];
        for (const z of [x, t]) { z.changed = slotChanged(z.o, z.n); z.dir = slideDir(z.o, z.n); }
    }
}

function assignWeaponFx(slots, s) {
    if (!s.changed || (!s.n && !s.o)) return;
    s.swapTrial = !!(s.o && isTrial(s.o.src) && slots.some(t => t !== s && t.weapon && t.changed && t.n && isTrial(t.n.src)));   
    s.swapTrialAp = !!(s.n && isTrial(s.n.src) && slots.some(t => t !== s && t.weapon && t.changed && t.o && isTrial(t.o.src))); 
    s.fadeVa = !!(s.o && slots.some(t => t !== s && t.weapon && t.changed && t.n && linked(s.o, t.n)));   
    s.fadeAp = !!(s.n && slots.some(t => t !== s && t.weapon && t.changed && t.o && linked(t.o, s.n)));   
    s.fx = weaponFx(s);
}

function fitWristWindows(slots, W, cx) {
    const P = params;
    let wristEnd = 0;
    for (const s of slots) if (s.fx && s.fx.ap && s.fx.ap.mode === "y") {
        const wx = (s.dir === "L" ? 1 - s.fx.ap.wx : s.fx.ap.wx) * W, ef = clamp(s.dir === "L" ? (cx - wx) / cx : (wx - cx) / (W - cx));
        let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (slideEase(m) < ef) lo = m; else hi = m; }
        s.fx.apWin = [P.slideMs * hi, P.slideMs * hi + P.slideMs]; wristEnd = Math.max(wristEnd, s.fx.apWin[1]);
    }
    for (const s of slots) if (s.fx) for (const w of [s.fx.apWin, s.fx.vaWin]) if (w) wristEnd = Math.max(wristEnd, w[1]);      
    return wristEnd;
}




/* =====================================================================
   11. 複眼の発光
===================================================================== */
function createFlashImg() {
    if (findSpecial(currentLeft, currentRight).noGlow) return null;   
    const fang = currentLeft === "fang" || currentRight === "fang";
    const img = new Image();
    img.src = fang ? params.flashImgFang : params.flashImg;
    Object.assign(img.style, {
        position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "contain",
        zIndex: "27", opacity: "0", pointerEvents: "none",         
        mixBlendMode: "screen",                                    
        filter: [params.flashGlowInnerPx, params.flashGlowPx].filter(px => px > 0).map(px => `drop-shadow(0 0 ${px}px #fff)`).join(" ") || "none",
    });
    return img;
}




/* =====================================================================
   12. 効果ごとの描画（1コマ分）
===================================================================== */

function fxPart(S, g, s, f, bmp, e, isVanish, fs) {
    const { W, H, k, cx, ctx, fanOverCtx, fMx, fMy } = S, P = params;
    const sd = isVanish ? 30 : 0;                 
    if (f.type === "fan") {
        if (fs.e <= 0) return;
        if (!f.rows) { const maxR = Math.round(560 * W / 960); f.rows = { L: makeFray(maxR, k, P, 11 + sd), R: makeFray(maxR, k, P, 29 + sd) }; }
        drawFanWedge(g, bmp, s.dir, W, H, fs, f.rows[s.dir]);
        if (g === ctx && fanOverCtx) {                                                
            fanOverCtx.save(); fanOverCtx.translate(fMx, fMy);
            fanOverCtx.beginPath(); fanOverCtx.rect(-fMx, -fMy, W + 2 * fMx, H + fMy); fanOverCtx.rect(0, 0, W, H); fanOverCtx.clip("evenodd");
            drawFanWedge(fanOverCtx, bmp, s.dir, W, H, fs, f.rows[s.dir]);
            fanOverCtx.restore();
        }
        return;
    }
    if (e >= 0.999) { g.drawImage(bmp, 0, 0, W, H); return; }
    if (e <= 0) return;
    if (f.type === "wipeL") {                       
        const r = f.hw ? clamp(e / f.hw) : e;
        if (r >= 0.999) { g.drawImage(bmp, 0, 0, W, H); return; }
        if (!f.tmp) f.tmp = mkCanvas(W, H);
        const x0 = f.x[0] * W, x1 = f.x[1] * W, fw = (x1 - x0) * 0.4, xb = x0 + (x1 - x0 + fw) * r, tg = get2d(f.tmp);
        tg.globalCompositeOperation = "source-over"; tg.clearRect(0, 0, W, H); tg.drawImage(bmp, 0, 0, W, H);
        tg.globalCompositeOperation = "destination-in";
        const gr = tg.createLinearGradient(xb - fw, 0, xb, 0); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)"); tg.fillStyle = gr; tg.fillRect(0, 0, W, H);
        g.drawImage(f.tmp, 0, 0, W, H);
    } else if (f.type === "neck") {                        
        const r = clamp(e / f.hw), y0 = Math.round(H * f.y[0]), y1 = Math.round(H * f.y[1]);
        if (r >= 0.999) { g.drawImage(bmp, 0, 0, W, H); return; }
        if (!f.rows) f.rows = makeFray(W, k, P, 11 + sd);
        drawFrayDown(g, bmp, W, H, r, f.rows, y0, y1);
    } else if (f.type === "dissolve") {                               
        const a0 = g.globalAlpha; g.globalAlpha = a0 * e; g.drawImage(bmp, 0, 0, W, H); g.globalAlpha = a0;
        if (f.glow && g === ctx) {
            const st = WEAPON_GLOW.strength, gl = Math.sin(Math.PI * e) * st;
            if (!f.glowCv) buildDissolveGlow(f, bmp, W, H, k);
            g.save(); g.globalCompositeOperation = "lighter";
            g.globalAlpha = clamp(1.2 * gl * e); g.drawImage(f.src, 0, 0, W, H);                                 
            g.globalAlpha = clamp(gl); g.drawImage(f.glowCv, 0, 0, W, H);
            g.restore();
        }
    } else if (f.type === "fray" && f.mode === "x" && f.from) {     
        if (!f.rows) f.rows = makeFray(H, k, WEAPON_FRAY_P, 11 + sd);
        drawFraySweep(g, bmp, W, H, e, f.rows, f.from === "R");
    } else if (f.type === "fray" && f.mode === "y") {                
        if (!f.rows) { f.rows = { L: { up: makeFray(W, k, WEAPON_FRAY_P, 11 + sd), dn: makeFray(W, k, WEAPON_FRAY_P, 53 + sd) }, R: { up: makeFray(W, k, WEAPON_FRAY_P, 29 + sd), dn: makeFray(W, k, WEAPON_FRAY_P, 71 + sd) } }; }
        drawFrayY(g, bmp, W, H, Math.round(H * f.wy), e, s.dir === "R" ? f.rows.R : f.rows.L);
    } else if (f.type === "fray" && f.mode === "x") {              
        if (!f.rows) { f.rows = { L: makeFray(H, k, WEAPON_FRAY_P, 11 + sd), R: makeFray(H, k, WEAPON_FRAY_P, 29 + sd) }; }
        if (s.dir !== "R") drawFrayX(g, bmp, "L", W, H, cx, e, f.rows.L, f.org);
        if (s.dir !== "L") drawFrayX(g, bmp, "R", W, H, cx, e, f.rows.R, f.org);
    } else if (f.type === "fray" && f.mode === "down") {
        if (!f.rows) f.rows = makeFray(W, k, P, 11 + sd);
        drawFrayDown(g, bmp, W, H, e, f.rows, Math.round(H * f.y[0]), Math.round(H * f.y[1]));
    } else if (f.type === "fray" && f.mode === "diag") drawFrayDiag(g, f, bmp, s.dir, W, H, e, P, k);
    else if (f.type === "sweep") {                  
        const [xL, xR] = frontX(e, W, cx);
        const part = (x0, x1) => clipDraw(g, bmp, x0, x1, W, H);
        if (s.dir === "L") part(xL, cx); else if (s.dir === "R") part(cx, xR); else part(xL, xR);
    }
}

function fxState(S, s) {
    const { t, u } = S, P = params;
    const fx = s.fx, tF = P.slideMs - FAN.ms;
    const fsA = fx.ap && fx.ap.type === "fan" ? fanFrame((t - tF) / FAN.ms) : null;
    const fsV = fx.va && fx.va.type === "fan" ? fanFrame(1 - t / FAN.msClose) : null;
    const uv = u, ua = fx.apWin ? clamp((t - fx.apWin[0]) / Math.max(1, fx.apWin[1] - fx.apWin[0])) : u;    
    const eOut = x => 1 - Math.pow(1 - x, 1.6);     
    const eA = fx.ap ? (fsA ? fsA.e : fx.apWin && fx.ap.type === "fray" && fx.ap.mode !== "y" ? eOut(ua) : slideEase(ua)) : 0;
    let eV = 0;
    if (fx.va) {
        eV = fsV ? fsV.e : fx.va.mode === "y" ? 1 - clamp(t / P.slideMs) : fx.vaWin ? (x => fx.va.type === "wipeL" ? slideEase(x) : eOut(x))(1 - clamp((t - fx.vaWin[0]) / Math.max(1, fx.vaWin[1] - fx.vaWin[0]))) : 1 - slideEase(uv);
    }
    return { fx, fsA, fsV, eA, eV };
}

function fxDraw(S, g, s) {
    const { W, H, k } = S, P = params;
    if (s.fx.morph) { drawMorph(S, g, s, s.fx); return; }
    const { fx, fsA, fsV, eA, eV } = fxState(S, s);
    if (fx.under && fx.cloth) {                       
        if (!fx.st) fx.st = makeUnder(s.o.bmp, s.n.bmp, W, H, k, P, fx.maskY || fx.ap.y, fx.extra);
        drawUnder(g, fx.st, W, H, eA); return;
    }
    if (fx.under) {                                  
        if (!fx.tmp) {
            fx.tmp = mkCanvas(W, H); fx.white = mkWhite(W, H);
            fx.mask = { ...fx.ap, y: fx.maskY || fx.ap.y };     
        }
        const tg = get2d(fx.tmp);
        tg.globalCompositeOperation = "source-over"; tg.clearRect(0, 0, W, H); tg.drawImage(s.o.bmp, 0, 0, W, H);
        tg.globalCompositeOperation = "destination-out"; fxPart(S, tg, s, fx.mask, fx.white, eA, false, fsA);
        tg.globalCompositeOperation = "source-over"; fxPart(S, tg, s, fx.ap, s.n.bmp, eA, false, fsA);
        g.drawImage(fx.tmp, 0, 0); return;
    }
    if (fx.newBehind) { if (fx.ap) fxPart(S, g, s, fx.ap, s.n.bmp, eA, false, fsA); if (fx.va) fxPart(S, g, s, fx.va, s.o.bmp, eV, true, fsV); return; }    
    if (fx.va) fxPart(S, g, s, fx.va, s.o.bmp, eV, true, fsV);
    if (fx.ap) fxPart(S, g, s, fx.ap, s.n.bmp, eA, false, fsA);
}

function bandE(S, f) {
    const { k, W, H, cx } = S;
    const B = GLOW.px * k;
    if (f.type === "fan") return 0.12;
    if (f.type === "neck") return B / Math.max(1, H * (f.y[1] - f.y[0])) * f.hw;
    if (f.type === "wipeL") return B / Math.max(1, (f.x[1] - f.x[0]) * W * 1.4);
    if (f.type === "sweep") return B / Math.max(1, cx);
    if (f.mode === "down") return B / Math.max(1, H * (f.y[1] - f.y[0]));
    if (f.mode === "diag") return B / Math.max(1, FX_DIAG[f.kind].len * W / 960);
    if (f.mode === "y") return B / Math.max(1, H * Math.max(f.wy, 1 - f.wy));
    if (f.mode === "x") return B / Math.max(1, f.from ? W : cx);
    return 0.1;
}

function progOf(f, e, fs) { return fs ? fs.e : f.type === "neck" ? clamp(e / f.hw) : e; }

function bPoints(S, s, f, e, fs, n, rnd) {
    const { W, H, cx } = S;
    const pts = [], sc = W / 960, L = s.dir === "L";
    for (let i = 0; i < n; i++) {
        const r = rnd(), q = rnd();
        if (f.type === "fan") {
            const F = FX_FAN, sg = L ? 1 : -1, a = ((F.phiMin - 4) + ((F.phiMax + 4) - (F.phiMin - 4)) * fs.e) * Math.PI / 180, rr = (60 + r * 500) * sc;
            pts.push([(L ? F.px : 960 - F.px) * sc - sg * rr * Math.cos(a), F.py * sc - rr * Math.sin(a), -sg * Math.sin(a), Math.cos(a)]);
        } else if (f.type === "wipeL") {
            const x0 = f.x[0] * W, x1 = f.x[1] * W, fw = (x1 - x0) * 0.4;
            pts.push([x0 + (x1 - x0 + fw) * e - fw * 0.5, H * (0.15 + 0.1 * r), -1, 0]);
        } else if (f.type === "sweep") {
            const [xL, xR] = frontX(e, W, cx); pts.push([L ? xL : xR, H * (0.14 + 0.22 * r), L ? 1 : -1, 0]);
        } else if (f.type === "neck" || f.mode === "down") {
            const rr = f.type === "neck" ? clamp(e / f.hw) : e, y0 = H * f.y[0], y1 = H * f.y[1];
            pts.push([W * (0.12 + 0.76 * r), y0 + (y1 - y0) * rr, 0, -1]);
        } else if (f.mode === "y") {                                    
            const cyw = H * f.wy, upB = q < 0.5, d = upB ? cyw : H - cyw, off = d * e, xr = s.dir === "R" ? [cx, W] : s.dir === "L" ? [0, cx] : [0, W];
            pts.push([xr[0] + (xr[1] - xr[0]) * r, upB ? cyw - off : cyw + off, 0, upB ? 1 : -1]);
        } else if (f.mode === "x" && f.from) {                        
            pts.push(f.from === "R" ? [W - W * e, H * r, 1, 0] : [W * e, H * r, -1, 0]);
        } else if (f.mode === "x") {                                    
            const SL = s.dir === "L" || (s.dir === "B" && q < 0.5), full = SL ? cx : W - cx, w = full * e;
            pts.push(SL ? (f.org === "e" ? [w, H * r, -1, 0] : [cx - w, H * r, 1, 0]) : (f.org === "e" ? [W - w, H * r, 1, 0] : [cx + w, H * r, -1, 0]));
        } else if (f.mode === "diag") {
            const B = FX_DIAG[f.kind], ox = (L ? B.ox : 960 - B.ox) * sc, oy = B.oy * sc, dx = B.dx * (L ? 1 : -1), dy = B.dy, pos = B.len * sc * e, lt = B.lat * sc * (2 * r - 1);
            pts.push([ox + dx * pos - dy * lt, oy + dy * pos + dx * lt, -dx, -dy]);
        }
    }
    return pts;
}

function glowOne(S, ctx2, s, f, bmp, e, isV, fs) {
    const { t, k, W, H, gsc, gw, gh } = S, P = params;
    const pr = progOf(f, e, fs), inten = isV ? Math.min(1, (1 - pr) * 10) * Math.min(1, pr * 5) : Math.min(1, pr * 10) * Math.min(1, (1 - pr) * 5);
    if (inten <= 0.01 || pr <= 0) return;
    const G = GLOW.strength * inten, key = Math.floor(t / (1000 / GLOW.fps)), small = g2 => { g2.setTransform(gsc, 0, 0, gsc, 0, 0); return g2; }, reset = g2 => { g2.setTransform(1, 0, 0, 1, 0, 0); return g2; };      
    if (!f.gl) f.gl = { A: mkCanvas(gw, gh), T: mkCanvas(gw, gh), S: mkCanvas(gw, gh), key: -1 };
    const C = f.gl, A = get2d(C.A), Tg = get2d(C.T), Sg = get2d(C.S);
    if (C.key !== key) {                                                        
        C.key = key;
        const bE = bandE(S, f);
        A.globalCompositeOperation = "source-over"; A.globalAlpha = 1; A.clearRect(0, 0, gw, gh);
        if (f.type === "fray" && f.mode === "diag") {                          
            if (e < 0.999) { small(A); drawFrayDiag(A, f, bmp, s.dir, W, H, e, P, k, Math.max(0, e - bE)); reset(A); }
        } else {                                                              
            small(A); fxPart(S, A, s, f, bmp, e, isV, fs);
            A.globalCompositeOperation = "destination-out";
            fxPart(S, A, s, f, bmp, Math.max(0, e - bE), isV, fs ? { e: Math.max(0, fs.e - bE), sw: fs.sw } : null);
            reset(A); A.globalCompositeOperation = "source-over";
        }
        Tg.globalCompositeOperation = "source-over"; Tg.clearRect(0, 0, gw, gh); Tg.drawImage(C.A, 0, 0);      
        Tg.globalCompositeOperation = "source-in"; Tg.fillStyle = P.slideColor || "#fff"; Tg.fillRect(0, 0, gw, gh);
        Sg.globalCompositeOperation = "source-over"; Sg.globalAlpha = 1; Sg.clearRect(0, 0, gw, gh);
        if (GLOW.streaks > 0) {                                                  
            small(Sg);
            const rnd = mulberry32(Math.floor(t / 40) * 131 + (s.dir === "L" ? 1 : 2) + (isV ? 7 : 0)), len0 = GLOW.px * k;
            Sg.fillStyle = P.slideColor || "#fff";
            for (const [x, y, vx, vy] of bPoints(S, s, f, e, fs, GLOW.streaks * 2, rnd)) {
                const l = (0.3 + rnd() * 0.7) * len0, th = Math.max(1, Math.round((1 + rnd() * 2.5) * k));
                Sg.globalAlpha = 0.35 + rnd() * 0.5; Sg.save(); Sg.translate(x, y); Sg.rotate(Math.atan2(vy, vx)); Sg.fillRect(0, -th / 2, l, th); Sg.restore();
            }
            reset(Sg); Sg.globalAlpha = 1; Sg.globalCompositeOperation = "destination-in"; Sg.drawImage(C.A, 0, 0);
        }
    }
    ctx2.save(); ctx2.globalCompositeOperation = "lighter";
    ctx2.globalAlpha = clamp(0.95 * G);                                         
    ctx2.drawImage(C.A, 0, 0, W, H); ctx2.drawImage(C.A, 0, 0, W, H); ctx2.drawImage(C.A, 0, 0, W, H);
    ctx2.globalAlpha = clamp(0.9 * G); ctx2.drawImage(C.T, 0, 0, W, H);
    ctx2.globalAlpha = clamp(0.8 * G); ctx2.drawImage(C.S, 0, 0, W, H);
    ctx2.restore();
}

function fxGlowSlot(S, ctx2, s) {
    const { fx, fsA, fsV, eA, eV } = fxState(S, s);
    if (fx.ap && fx.ap.type !== "dissolve") glowOne(S, ctx2, s, fx.under && fx.cloth ? { ...fx.ap, y: fx.maskY || fx.ap.y } : fx.ap, s.n.bmp, eA, false, fsA);
    if (fx.va && fx.va.type !== "dissolve" && fx.va.mode !== "y" && !(s.n && fx.va.type === "wipeL")) glowOne(S, ctx2, s, fx.va, s.o.bmp, eV, true, fsV);
}




/* =====================================================================
   13. アニメの進行
===================================================================== */
function startAnimation(scene) {
    let t0 = null, now = 0, paused = frozenEarly, stopped = false, raf = 0, resolve; frozenEarly = false;
    const done = new Promise(r => { resolve = r; });
    const ctl = {
        done,
        pause() { paused = true; },
        resume() { if (!paused) return; paused = false; t0 = null; if (!raf && !stopped) raf = requestAnimationFrame(frame); },      
        stop() { stopped = true; cancelAnimationFrame(raf); resolve(); },
    };
    const frame = ts => {
        raf = 0;
        if (stopped) return;
        if (!paused) {
            if (t0 === null) t0 = ts - now;
            now = ts - t0;
        }
        scene.render(now);
        if (!paused && now >= scene.tEnd) { resolve(); return; }
        if (paused) return;      
        raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return ctl;
}




/* =====================================================================
   14. 演出本体
===================================================================== */
function assignFx(slots) {
    for (const s of slots) {
        if (s.weapon) { assignWeaponFx(slots, s); continue; }
        if (!s.changed || (!s.n && !s.o)) continue;
        if (s.id === "neckLayer") { assignNeckFx(s); continue; }
        if (s.morph) { s.fx = { morph: s.morph }; continue; }                                              
        const so = s.o && baseOf(s.o.src), sn = s.n && baseOf(s.n.src);
        const fo = s.o ? fxFor(s.id, so) : null, fn = s.n ? fxFor(s.id, sn) : null;
        if (s.n && !s.o) { if (fn) s.fx = { ap: { ...fn } }; }
        else if (s.o && !s.n) { if (fo) s.fx = { va: { ...fo } }; }
        else if (fo && fn) {
            const my = fo.y && fn.y ? [Math.min(fo.y[0], fn.y[0]), Math.max(fo.y[1], fn.y[1])] : null;
            s.fx = { under: true, ap: { ...fn }, maskY: my, cloth: fn.type === "fray" && fn.mode === "down", extra: s.id === "capeLayer" && CLOTH_SIL[so] !== CLOTH_SIL[sn] };
        }
    }
}

async function playSlide(applyChange, opts = {}) {     
    const P = params;
    const viewer = $("viewer-area");
    if (!viewer) { applyChange(); return; }

    if (activeCtl && P.interrupt) { activeCtl.stop(); activeCtl = null; }   
    const mySeq = ++slideSeq; slidePrep = true;
    const vw = viewer.offsetWidth, vh = viewer.offsetHeight;
    const k = Math.min(window.devicePixelRatio || 1, P.pixelRatio);
    const W = Math.round(vw * k), H = Math.round(vh * k);
    const cx = Math.round(W / 2);                                

    const cv = mkCanvas(W, H);
    cv.id = "hsSlide";
    Object.assign(cv.style, { position: "absolute", left: "0", top: "0", width: vw + "px", height: vh + "px", zIndex: "26", pointerEvents: "none" });
    const ctx = get2d(cv);

    henshinPlaying = true;

    let ctl = null, flashEl = null, fanOver = null, fanOverCtx = null, fMx = 0, fMy = 0;
    const srcOf = l => l.img.currentSrc || l.img.src;
    try {
        const oldL = opts.from ? opts.from[0] : currentLeft, oldR = opts.from ? opts.from[1] : currentRight;
        const oldMap = {};
        for (const l of snapshotLayers(ALL_LAYERS)) {
            oldMap[l.id] = { src: srcOf(l), bmp: await layerBitmap(l, W, H), clip: l.clip, flip: l.flip };
        }
        const drawAll = map => { ctx.clearRect(0, 0, W, H); for (const id of Object.keys(ALL_LAYERS)) if (map[id]) ctx.drawImage(map[id].bmp, 0, 0, W, H); };
        drawAll(oldMap);
        viewer.appendChild(cv);
        viewer.classList.add("hs-hide-all");

        applyChange();
        const memChanged = { leftHalf: oldL !== currentLeft, rightHalf: oldR !== currentRight };  
        await nextFrame();
        const newSnap = snapshotLayers(ALL_LAYERS);
        flashEl = P.flash > 0 && P.slideFlash ? createFlashImg() : null;
        await decodeAll([...newSnap.map(l => l.img), ...(flashEl ? [flashEl] : [])]);
        if (flashEl) viewer.appendChild(flashEl);
        const newMap = {};
        for (const l of newSnap) {
            const o = oldMap[l.id];
            if (o && o.src === srcOf(l) && o.clip === l.clip && o.flip === l.flip) { newMap[l.id] = o; continue; }     
            newMap[l.id] = { src: srcOf(l), bmp: await layerBitmap(l, W, H), clip: l.clip, flip: l.flip };
        }

        let slots = Object.keys(ALL_LAYERS).map(id => {
            const o = oldMap[id] || null, n = newMap[id] || null;
            if (!o && !n) return null;
            const changed = slotChanged(o, n);
            return { id, o, n, dir: slideDir(o, n), weapon: id in WEAPON_LAYERS, back: id === BACK_WEAPON, changed, vanish: false };  
        }).filter(Boolean);

        swapSameWeapons(slots);
        slots = virtualizeSlots(slots, W, H, cx);    

        if (P.fxOn) assignFx(slots);
        linkSkullSlots(slots);

        const replay = slots.every(s => !s.changed);
        if (replay) for (const s of slots) if (!s.weapon && s.o && s.n) s.changed = true;
        const glowL = memChanged.leftHalf || P.slideGlowSameMemory || replay;
        const glowR = memChanged.rightHalf || P.slideGlowSameMemory || replay;
        const isActive = (glow, notDir, vanish) => glow && slots.some(s => s.changed && !s.fx && !s.noGlow && s.dir !== notDir && !!s.vanish === vanish);
        const leftActive = isActive(glowL, "R", false), rightActive = isActive(glowR, "L", false);          
        const leftActiveV = isActive(glowL, "R", true), rightActiveV = isActive(glowR, "L", true);        
        if (slots.some(s => s.fx && (s.fx.morph || (s.fx.ap && s.fx.ap.type === "fan") || (s.fx.va && s.fx.va.type === "fan")))) {  
            fMx = Math.round(W * 0.22); fMy = Math.round(H * 0.15);
            fanOver = mkCanvas(W + 2 * fMx, H + fMy);
            fanOver.id = "hsFanOver";
            Object.assign(fanOver.style, { position: "absolute", left: (viewer.offsetLeft - fMx / k) + "px", top: (viewer.offsetTop - fMy / k) + "px", width: ((W + 2 * fMx) / k) + "px", height: ((H + fMy) / k) + "px", pointerEvents: "none" });
            viewer.parentNode.insertBefore(fanOver, viewer);                           
            fanOverCtx = get2d(fanOver);
        }

        const S = { W, H, k, cx, ctx, fanOver, fanOverCtx, fMx, fMy, gsc: GLOW.scale, gw: Math.max(1, Math.round(W * GLOW.scale)), gh: Math.max(1, Math.round(H * GLOW.scale)), t: 0, u: 0 };     

        const needM = leftActive || rightActive, needV = leftActiveV || rightActiveV;     
        const sweep = createSweepFx(W, H, k, P);
        const maskCv = mkCanvas(W, H), maskG = get2d(maskCv);     
        const maskCvV = mkCanvas(W, H), maskGV = get2d(maskCvV);  
        const tLand = P.slideMs;
        const hasFanOpen = slots.some(c => c.fx && c.fx.ap && c.fx.ap.type === "fan");  

        const wristEnd = fitWristWindows(slots, W, cx);
        const tEnd = Math.max(tLand + (flashEl ? P.flashMs : 0) + 100, hasFanOpen ? tLand + FAN.overshootMs + 50 : 0, wristEnd + 50);

        let unlocked = false;                                             
        const unlockMs = P.interrupt && P.unlockAt !== "end" ? (P.unlockAt === "start" ? 0 : tLand) : null;

        const items = []; let run = null;
        for (const s of slots) {
            if (!s.o && !s.n) continue;
            if (!s.changed) { if (!run) { run = []; items.push({ run }); } run.push(s); }
            else { run = null; items.push({ s }); }
        }
        for (const it of items) if (it.run) { it.cv = mkCanvas(W, H); const g0 = get2d(it.cv); for (const s of it.run) g0.drawImage((s.n || s.o).bmp, 0, 0, W, H); }

        let flashWarm = false, settled = false;
        const updateFlash = t => {
            if (!flashEl) return;
            if (!flashWarm && t >= 120) { flashWarm = true; flashEl.style.opacity = "0.004"; }   
            const f = (t - tLand) / P.flashMs;
            const a = f < 0 || f >= 1 ? (f < 0 && flashWarm ? 0.004 : 0) : Math.min(1, (t - tLand) / P.flashRiseMs) * Math.pow(1 - f, P.flashDecay) * P.flash;
            flashEl.style.opacity = clamp(a);
        };
        const render = t => {
            if (settled) { updateFlash(t); return; }    
            if (!unlocked && unlockMs !== null && t >= unlockMs) { unlocked = true; if (mySeq === slideSeq) henshinPlaying = false; }
            const u = clamp(t / P.slideMs);
            S.t = t; S.u = u;
            const [xL, xR] = frontX(slideEase(u), W, cx);
            const [xLv, xRv] = frontX(slideEase(1 - u), W, cx);       
            ctx.clearRect(0, 0, W, H);
            if (fanOverCtx) fanOverCtx.clearRect(0, 0, fanOver.width, fanOver.height);
            if (needM) maskG.clearRect(0, 0, W, H);
            if (needV) maskGV.clearRect(0, 0, W, H);

            const part = (g, im, x0, x1) => { if (im) clipDraw(g, im.bmp, x0, x1, W, H); };

            const slide = (g, s) => {       
                if (s.fx) { fxDraw(S, g, s); return; }
                if (s.vanish) {           
                    if (s.dir === "L") part(g, s.o, xLv, cx);
                    else if (s.dir === "R") part(g, s.o, cx, xRv);
                    else part(g, s.o, xLv, xRv);
                }
                else if (s.dir === "L") { part(g, s.o, 0, xL); part(g, s.n, xL, cx); }
                else if (s.dir === "R") { part(g, s.o, xR, W); part(g, s.n, cx, xR); }
                else { part(g, s.o, 0, xL); part(g, s.o, xR, W); part(g, s.n, xL, xR); }
            };
       
            const masks = [needM && maskG, needV && maskGV].filter(Boolean);
            const cut = s => {
                for (const g of masks) {
                    g.save();
                    g.globalCompositeOperation = "destination-out";
                    slide(g, s);
                    g.restore();
                }
            };
            const cutCv = cv => { for (const g of masks) { g.save(); g.globalCompositeOperation = "destination-out"; g.drawImage(cv, 0, 0); g.restore(); } };
            for (const it of items) {
                if (it.cv) { cutCv(it.cv); ctx.drawImage(it.cv, 0, 0); continue; }    
                const s = it.s;
                cut(s);
                slide(ctx, s);
                if (s.fx) fxGlowSlot(S, ctx, s);
                else if (!s.noGlow) { const mg = s.vanish ? (needV && maskGV) : (needM && maskG); if (mg) slide(mg, s); }    
            }
            if (needM && !glowL) maskG.clearRect(0, 0, cx, H);
            if (needM && !glowR) maskG.clearRect(cx, 0, W - cx, H);
            if (needV && !glowL) maskGV.clearRect(0, 0, cx, H);
            if (needV && !glowR) maskGV.clearRect(cx, 0, W - cx, H);

            if (P.slideFadeBottom > 0 && (needM || needV)) {
                const y0 = H * (1 - P.slideFadeBottom);
                for (const mc of [needM && maskCv, needV && maskCvV].filter(Boolean)) {
                    const mg = get2d(mc);
                    const gr = mg.createLinearGradient(0, y0, 0, H);
                    gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.6, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,1)");
                    mg.save(); mg.globalCompositeOperation = "destination-out"; mg.fillStyle = gr; mg.fillRect(0, y0, W, H - y0); mg.restore();
                }
            }

            const intensity = Math.min(1, u * 8) * Math.min(1, (1 - u) * 4);
            if (u > 0 && u < 1) {
                if (leftActive) sweep(ctx, maskCv, xL, -1, t, intensity);
                if (rightActive) sweep(ctx, maskCv, xR, +1, t, intensity);
                const intensityV = Math.min(1, (1 - u) * 8) * Math.min(1, u * 4);    
                if (leftActiveV) sweep(ctx, maskCvV, xLv, -1, t, intensityV);
                if (rightActiveV) sweep(ctx, maskCvV, xRv, +1, t, intensityV);
            }

            updateFlash(t);
            if (t >= Math.max(tLand, wristEnd) + 34 && !hasFanOpen) settled = true;     
        };

        for (const s of slots) if (s.fx && s.fx.ap && s.fx.ap.type === "dissolve" && s.fx.ap.glow && s.n && !s.fx.ap.glowCv) buildDissolveGlow(s.fx.ap, s.n.bmp, W, H, k);      
        ctl = startAnimation({ render, tEnd });
        activeCtl = ctl; slidePrep = false;
        await ctl.done;
    } finally {
        if (ctl) ctl.stop();
        if (activeCtl === ctl) activeCtl = null;
        cv.remove();
        if (flashEl) flashEl.remove();
        if (fanOver) fanOver.remove();
        if (mySeq === slideSeq) {
            slidePrep = false; frozenEarly = false;
            viewer.classList.remove("hs-hide-all"); henshinPlaying = false;
        }      
    }
}





/* =====================================================================
   15. 外から使う窓口・空打ち
===================================================================== */
let activeCtl = null, slideSeq = 0, slidePrep = false, frozenEarly = false;

window.getSlideMs = () => params.slideMs;   

const HenshinSlide = {
    params,
    freeze() { if (activeCtl) { activeCtl.pause(); return true; } if (slidePrep) { frozenEarly = true; return true; } return false; },
    thaw() { frozenEarly = false; if (activeCtl) activeCtl.resume(); },
    cancel() { frozenEarly = false; if (activeCtl) activeCtl.stop(); },
};
window.HenshinSlide = HenshinSlide;
window.playHenshinTransition = playSlide;

const warmUp = async () => {
    try {
        const viewer = $("viewer-area");
        if (!viewer || !viewer.offsetWidth || document.hidden) return;
        const k = Math.min(window.devicePixelRatio || 1, params.pixelRatio), W = Math.round(viewer.offsetWidth * k), H = Math.round(viewer.offsetHeight * k);
        for (const l of snapshotLayers(ALL_LAYERS)) {
            if (henshinPlaying) return;
            await layerBitmap(l, W, H);
            await new Promise(r => setTimeout(r, 0));
        }
    } catch (e) {  }
};
window.addEventListener("load", () => setTimeout(() => { if (window.requestIdleCallback) requestIdleCallback(warmUp, { timeout: 4000 }); else warmUp(); }, 2000));

})();