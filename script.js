/* =============================
   メモリ名
============================= */
const forms = [
  { value: "terror", label: "テラー" },
  { value: "taboo", label: "タブー" },
  { value: "nasca3", label: "ナスカ" },
  { value: "claydoll", label: "クレイドール" },
  { value: "smilodon", label: "スミロドン" },
  { value: "utopia", label: "ユートピア" },
  { value: "bomb", label: "ボム" },
  { value: "engine", label: "エンジン" },
  { value: "trial", label: "トライアル" },
  { value: "prism", label: "プリズム" },
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
  { value: "zone", label: "ゾーン" }
];


const excludedFromMainModal = [
  "prism", "trial", "engine", "bomb", "terror", "taboo", "nasca3", "claydoll", "smilodon", "utopia"
];
const mainModalForms = forms.filter(
  f => !excludedFromMainModal.includes(f.value)
); 


const extraModalSlots = [
  { value: "prism", label: "プリズム", enabled: true },
  { value: "trial", label: "トライアル", enabled: true },
  { value: "engine", label: "エンジン", enabled: true },

  { value: "bomb", label: "ボム", enabled: true },
  { value: "terror", label: "テラー", enabled: true },
  { value: "taboo", label: "タブー", enabled: true },

  { value: "nasca3", label: "ナスカ (Lv3)", enabled: true },
  { value: "claydoll", label: "クレイドール", enabled: true },
  { value: "smilodon", label: "スミロドン", enabled: true },

  { value: "utopia", label: "ユートピア", enabled: true }
];



/* =============================
   メモリ解説文
============================= */
const memoryDescriptions = {
    utopia: "｢理想郷の記憶｣を持つガイアメモリ。重力操作能力に加えて、触れた人間の感情を吸い取って自らのエネルギーに転換する能力を与える｡",
    terror: "｢恐怖の記憶｣を持つガイアメモリ。恐怖領域｢テラーフィールド｣を展開し、敵に激しい恐怖心を与える｡",
    taboo: "｢禁忌の記憶｣を持つガイアメモリ。強烈な破壊光球を発射する能力を与える｡",
    nasca3: "｢ナスカ文明の記憶｣を持つガイアメモリ。使用者をナスカ文明の剣士に変化させ､飛翔能力と超高速移動能力を与える。レベル3に到達することで更なる進化を果たす｡",
    claydoll: "｢土偶の記憶｣を持つガイアメモリ。重力エネルギー弾を発射する能力と再生能力を与える｡",
    smilodon: "｢スミロドンの記憶｣を持つガイアメモリ。鋭い爪と超高速移動能力を与える｡",
    bomb: "｢爆弾の記憶｣を持つガイアメモリ。分裂・爆発する強力な光弾を放つ｡",
    engine: "｢ジェット｣｢スチーム｣｢エレクトリック｣、3種のエンジンパワーを引き出せる多機能型メモリ｡",
    trial: "｢挑戦の記憶｣を持つガイアメモリ。既存のメモリのプログラムに超加速のパッチを当てることで、音速に到達する加速力を与える｡",
    prism: "｢プリズムの記憶｣を持つガイアメモリ。複数のメモリをリンクさせ、一つのエネルギーへと収束変換する｡",
    accel: "｢加速の記憶｣を持つガイアメモリ。加速能力を与え、高速移動を可能にする｡",
    bird: "｢始祖鳥の記憶｣を持つガイアメモリ。使用者に飛翔能力を与える｡",
    cyclone: "｢疾風の記憶｣を持つガイアメモリ。疾風を引き起こし、風を自由自在に操る能力を与える｡",
    dummy: "｢偽物(複製)の記憶｣を持つガイアメモリ。他人や物体に擬態する能力を与える｡",
    eternal: "｢永遠の記憶｣を持つガイアメモリ。T2以前のガイアメモリの能力を無力化する｡",
    fang: "｢牙の記憶｣を持つガイアメモリ。闘争本能を増幅させ、全身に鋭利な刃を発生させる｡",
    gene: "｢遺伝子の記憶｣を持つガイアメモリ。遺伝子を操作する能力を与える｡",
    heat: "｢熱き記憶｣を持つガイアメモリ。感情を昂らせ、高熱や炎を自在に操る能力を与える｡",
    iceage: "｢氷河期の記憶｣を持つガイアメモリ。あらゆる物体を氷結させる能力を与える｡",
    joker: "｢切札の記憶｣を持つガイアメモリ。運動能力を高め、格闘戦の技術を強化する｡",
    key: "｢鍵の記憶｣を持つガイアメモリ。解除能力と目標の対象物を探し当てる索敵能力を与える｡",
    luna: "｢幻想の記憶｣を持つガイアメモリ。分身や人体の伸縮といった幻想的な能力を与える｡",
    metal: "｢闘士の記憶｣を持つガイアメモリ。使用者を鋼鉄の肉体と怪力を持つ闘士に変化させる｡",
    nasca: "｢ナスカ文明の記憶｣を持つガイアメモリ。使用者をナスカ文明の剣士に変化させ､飛翔能力と超高速移動能力を与える｡",
    ocean: "｢大洋の記憶｣を持つガイアメモリ。水弾の発砲や体を液体化させる能力を与える｡",
    puppeteer: "｢人形使いの記憶｣を持つガイアメモリ。対象物を人形のように意のままに操る能力を与える｡",
    queen: "｢女王の記憶｣を持つガイアメモリ。鉄壁のバリアーを発生させ、敵の攻撃を防ぐ｡",
    rocket: "｢ロケットの記憶｣を持つガイアメモリ。攻撃対象に向かってミサイルを発射する能力を与える｡",
    skull: "｢骸骨の記憶｣を持つガイアメモリ。身体能力を極限まで高め、その状態に耐えうる肉体へと作り変える｡",
    trigger: "｢銃撃手の記憶｣を持つガイアメモリ。銃撃能力を与え、射撃力を強化する｡",
    unicorn: "｢一角獣の記憶｣を持つガイアメモリ。パンチなどの打突攻撃の破壊力を高める｡",
    violence: "｢暴力の記憶｣を持つガイアメモリ。全身の筋力を強化し、特に腕力を最も強化させる｡",
    weather: "｢気象の記憶｣を持つガイアメモリ。雨、竜巻、雷、雪といった全ての気象現象を自由自在に操る｡",
    xtreme: "記憶を持たない特殊なガイアメモリ。他のメモリの能力を取り込み、その力を極限まで引き出す｡",
    yesterday: "｢昨日の記憶｣を持つガイアメモリ。発動された対象の記憶を操作し、昨日と同じ行動を繰り返させる｡",
    zone: "｢地帯の記憶｣を持つガイアメモリ。任意の対象物を自由に他の場所へ転送する｡"
};

/* =============================
   選択中のガイアメモリ（状態管理）
============================= */
let currentLeft = "cyclone";
let currentRight = "joker";

function updateMemoryDescriptions() {
    const left = currentLeft;
    const right = currentRight;

    const leftBox = document.getElementById("leftMemoryDescription");
    const rightBox = document.getElementById("rightMemoryDescription");

    if(leftBox)  leftBox.textContent  = memoryDescriptions[left]  || "";
    if(rightBox) rightBox.textContent = memoryDescriptions[right] || "";
}

let weaponsVisible = true; 

/* =============================
   updateHalf：viewer内の画像を変化
============================= */

function updateHalf() {
    const left = currentLeft;
    const right = currentRight;
    const leftLayer = document.getElementById("leftHalf");
    const rightLayer = document.getElementById("rightHalf");
    const eyesLayer = document.getElementById("eyesLayer");
    const mufflerLayer = document.getElementById("mufflerLayer");
    const wingsLayer = document.getElementById("wingsLayer");
    const capeLayer = document.getElementById("capeLayer");
    const weapon1Layer = document.getElementById("weapon1Layer");
    const weapon2Layer = document.getElementById("weapon2Layer");
    const singleImg = document.getElementById("singleImg");

    // 古い画像を削除
    [leftLayer, rightLayer, eyesLayer, mufflerLayer, wingsLayer, capeLayer, weapon1Layer, weapon2Layer].forEach(l => l.innerHTML = "");
    singleImg.style.display = "none";

    // 左右半身・目・マフラー・ウイングス・ケープ作成
    const leftImg = document.createElement("img");
    const rightImg = document.createElement("img");
    const eyesImg = document.createElement("img");
    const mufflerImg = document.createElement("img");
    const wingsImg = document.createElement("img");
    const capeImg = document.createElement("img");

    // 武器作成
    const weapon1Img = document.createElement("img");
    const weapon2Img = document.createElement("img");

    // デフォルト画像
    let leftSrc = `images_webp/${left}.webp`;
    let rightSrc = `images_webp/${right}.webp`;
    let eyesSrc = "images_webp/normal-eyes.webp";
    let mufflerSrc = null;
    let wingsSrc = null;
    let capeSrc = null;
    let weapon1Src = null;
    let weapon2Src = null;


    // 単体画像パターン
    const singleImages = {
        "accel-trial": "AccelTrial.webp",
        "trial-accel": "TrialAccel.webp",
        "fang-trial": "FangTrial.webp",
        "trial-fang": "TrialFang.webp",
        "trial-skull": "TrialSkull.webp",

        "claydoll-xtreme": "ClaydollXtreme.webp",
        "xtreme-claydoll": "XtremeClaydoll.webp",

        "nasca3-skull": "Nasca3Skull.webp",
        "nasca3-nasca": "Nasca3Nasca.webp",
        "nasca-nasca3": "NascaNasca3.webp",
        "nasca3-taboo": "Nasca3Taboo.webp",
        "taboo-nasca3": "TabooNasca3.webp",
        "nasca3-weather": "Nasca3Weather.webp",
        "weather-nasca3": "WeatherNasca3.webp",
        "taboo-weather": "TabooWeather.webp",
        "weather-taboo": "WeatherTaboo.webp",

        "nasca-skull": "NascaSkull.webp",
        "nasca-taboo": "NascaTaboo.webp",
        "taboo-nasca": "TabooNasca.webp",
        "nasca-joker": "NascaJoker.webp",
        "nasca-cyclone": "NascaCyclone.webp",
        "cyclone-nasca": "CycloneNasca.webp",
        "nasca-yesterday": "NascaYesterday.webp",
        "yesterday-nasca": "YesterdayNasca.webp",

        "fang-eternal": "FangEternal.webp",
        "eternal-fang": "EternalFang.webp",
        "fang-accel": "FangAccel.webp",
        "accel-fang": "AccelFang.webp",

        "eternal-skull": "EternalSkull.webp",
        "fang-skull": "FangSkull.webp",
        "accel-skull": "AccelSkull.webp",
        "cyclone-skull": "CycloneSkull.webp",
        "skull-joker": "SkullJoker.webp",

        "xtreme-xtreme": "XtremeXtreme.webp"
    };

    const key = left + "-" + right;
    const weaponUsers = [
        "prism", "trial", "engine", "bomb", "terror", "taboo", "nasca3", "claydoll", "smilodon", "utopia",
        "accel", "cyclone", "eternal", "gene", 
        "heat", "iceage", "key", "luna", "metal", "nasca", 
        "ocean", "puppeteer", "queen", "rocket", "skull", "trigger", "unicorn", 
        "violence", "weather", "xtreme", "yesterday", "zone"
        ];

    /* ============================================
       単体画像処理
    ============================================ */
    let isSingle = false;
    if (singleImages[key]) {
        isSingle = true;
        singleImg.src = "images_webp/" + singleImages[key];
        singleImg.style.display = "block";

        leftLayer.style.display = "none";
        rightLayer.style.display = "none";
        eyesLayer.style.display = "none";
        mufflerLayer.style.display = "none";
        wingsLayer.style.display = "none";
        capeLayer.style.display = "none";
    } else {
        leftLayer.style.display = "block";
        rightLayer.style.display = "block";
        eyesLayer.style.display = "block";
        mufflerLayer.style.display = "block";
        wingsLayer.style.display = "block";
        capeLayer.style.display = "block";
    }


    /* ============================================
       武器処理
    ============================================ */

    /* ============================
       ファング武器分岐
    ============================ */
    if(left === "fang" && right === "metal") {
        weapon1Src = "images_webp/fang-weapon1.webp";
        weapon2Src = null;
    }
    else if(left === "fang" && right === "trigger") {
        weapon1Src = null; 
        weapon2Src = "images_webp/fang-weapon3.webp";
    }
    else if(left === "trigger" && right === "fang") {
        weapon1Src = "images_webp/fang-weapon4.webp";
        weapon2Src = null; 
    }
    else if(left === "luna" && right === "fang") {
        weapon1Src = "images_webp/luna-weapon3.webp";
        weapon2Src = null;
    }
    else if(left === "fang" && right === "luna") {
        weapon1Src = null;
        weapon2Src = "images_webp/luna-weapon4.webp";
    } 
    else if(left === "violence" && right === "fang") {
        weapon1Src = "images_webp/violence-weapon3.webp";
        weapon2Src = null;
    }
    else if(left === "fang" && right === "violence") {
        weapon1Src = null;
        weapon2Src = "images_webp/violence-weapon4.webp";
    } 

    /* ============================
       メタル武器分岐
    ============================ */
    else if(left === "metal" && right === "eternal") {
        weapon1Src = "images_webp/metal-weapon3.webp";
        weapon2Src = "images_webp/eternal-weapon2.webp";
    } 
    else if(left === "eternal" && right === "metal") {
        weapon1Src = "images_webp/eternal-weapon1.webp";
        weapon2Src = "images_webp/metal-weapon4.webp";
    }

    else if(left === "metal" && right === "terror") {
        weapon1Src = "images_webp/metal-weapon3.webp";
        weapon2Src = "images_webp/terror-weapon.webp";
    } 
    else if(left === "terror" && right === "metal") {
        weapon1Src = "images_webp/metal-weapon4.webp";
        weapon2Src = "images_webp/terror-weapon.webp";
    }

    else if(left === "metal" && right === "utopia") {
        weapon1Src = "images_webp/metal-weapon3.webp";
        weapon2Src = "images_webp/utopia-weapon2.webp";
    } 
    else if(left === "utopia" && right === "metal") {
        weapon1Src = "images_webp/utopia-weapon1.webp";
        weapon2Src = "images_webp/metal-weapon4.webp";
    }

    else if(left === "metal" && right === "skull") {
        weapon1Src = "images_webp/skull-weapon2.webp";
        weapon2Src = "images_webp/metal-weapon5.webp";
    }

    /* ============================
       エンジン武器分岐
    ============================ */
    // アクセル × エンジン
    else if (left === "accel" && right === "engine") {
        weapon1Src = "images_webp/engine-weaponAE.webp";
        weapon2Src = "images_webp/accel-weapon1.webp";
    }
    else if (left === "engine" && right === "accel") {
        weapon1Src = "images_webp/engine-weaponEA.webp";
        weapon2Src = "images_webp/accel-weapon2.webp";
    }

    // エンジン × エクストリーム
    else if (left === "engine" && right === "xtreme") {
        weapon1Src = "images_webp/engine-weaponEX.webp";
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }
    else if (left === "xtreme" && right === "engine") {
        weapon1Src = "images_webp/engine-weaponXE.webp";
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }

    // エンジン × スカル
    else if (left === "engine" && right === "skull") {
        weapon1Src = "images_webp/skull-weapon2.webp";
        weapon2Src = "images_webp/engine-weaponES.webp";
    }

    /* ============================
       サイクロン武器分岐
    ============================ */
    // サイクロン × ジョーカー
    else if (left === "cyclone" && right === "joker") {
        weapon1Src = null;
        weapon2Src = "images_webp/cyclone-weaponCJ.webp";
    }
    else if (left === "joker" && right === "cyclone") {
        weapon1Src = null;
        weapon2Src = "images_webp/cyclone-weaponJC.webp";
    }

    // サイクロン × アクセル
    else if (left === "accel" && right === "cyclone") {
        weapon1Src = "images_webp/accel-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }
    else if (left === "cyclone" && right === "accel") {
        weapon1Src = "images_webp/accel-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }

    // サイクロン × ヒート
    else if (left === "heat" && right === "cyclone") {
        weapon1Src = "images_webp/heat-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }
    else if (left === "cyclone" && right === "heat") {
        weapon1Src = "images_webp/heat-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }

    // サイクロン × エンジン
    else if (left === "engine" && right === "cyclone") {
        weapon1Src = "images_webp/engine-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }
    else if (left === "cyclone" && right === "engine") {
        weapon1Src = "images_webp/engine-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }

    // サイクロン × ボム
    else if (left === "bomb" && right === "cyclone") {
        weapon1Src = "images_webp/bomb-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }
    else if (left === "cyclone" && right === "bomb") {
        weapon1Src = "images_webp/bomb-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }

    // サイクロン × クレイドール
    else if (left === "claydoll" && right === "cyclone") {
        weapon1Src = "images_webp/claydoll-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }
    else if (left === "cyclone" && right === "claydoll") {
        weapon1Src = "images_webp/claydoll-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponH.webp";
    }

    // サイクロン × アイスエイジ
    else if (left === "iceage" && right === "cyclone") {
        weapon1Src = "images_webp/iceage-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponI.webp";
    }
    else if (left === "cyclone" && right === "iceage") {
        weapon1Src = "images_webp/iceage-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponI.webp";
    }

    // サイクロン × オーシャン
    else if (left === "ocean" && right === "cyclone") {
        weapon1Src = "images_webp/ocean-weapon1.webp";
        weapon2Src = "images_webp/cyclone-weaponI.webp";
    }
    else if (left === "cyclone" && right === "ocean") {
        weapon1Src = "images_webp/ocean-weapon2.webp";
        weapon2Src = "images_webp/cyclone-weaponI.webp";
    }

    // サイクロン × テラー
    else if (
        (left === "terror" && right === "cyclone") ||
        (left === "cyclone" && right === "terror")
    ) {
        weapon1Src = "images_webp/cyclone-weaponT.webp";
        weapon2Src = "images_webp/terror-weapon.webp";
    }

    // サイクロン × スミロドン
    else if (left === "cyclone" && right === "smilodon") {
        weapon1Src = "images_webp/cyclone-weapon.webp";
        weapon2Src = "images_webp/smilodon-weapon2.webp";
    }
    else if (left === "smilodon" && right === "cyclone") {
        weapon1Src = "images_webp/cyclone-weapon.webp";
        weapon2Src = "images_webp/smilodon-weapon1.webp";
    }

    // サイクロン × エクストリーム
    else if (
        (left === "xtreme" && right === "cyclone") ||
        (left === "cyclone" && right === "xtreme")
    ) {
        weapon1Src = "images_webp/xtreme-weapon.webp";
        weapon2Src = "images_webp/cyclone-weapon.webp";
    }

    // 右がサイクロン
    else if (right === "cyclone") {
        const L_hasWeapon = weaponUsers.includes(left);
        weapon1Src = L_hasWeapon ? `images_webp/${left}-weapon1.webp` : null;
        weapon2Src = "images_webp/cyclone-weapon.webp";
    }
    // 左がサイクロン
    else if (left === "cyclone") {
        const R_hasWeapon = weaponUsers.includes(right);
        weapon1Src = R_hasWeapon ? `images_webp/${right}-weapon2.webp` : null;
        weapon2Src = "images_webp/cyclone-weapon.webp";
    }

    /* ============================
       テラー武器分岐
    ============================ */
    // テラー × ファング
    else if (
        (left === "terror" && right === "fang") ||
        (left === "fang" && right === "terror")
    ) {
        weapon1Src = null;
        weapon2Src = "images_webp/terror-weaponF.webp";
    }
    // テラー × エクストリーム
    else if (
        (left === "xtreme" && right === "terror") ||
        (left === "terror" && right === "xtreme")
    ) {
        weapon1Src = "images_webp/xtreme-weaponE.webp";
        weapon2Src = "images_webp/terror-weapon.webp";
    }
    // 右がテラー
    else if (right === "terror") {
        const L_hasWeapon = weaponUsers.includes(left);
        weapon1Src = L_hasWeapon ? `images_webp/${left}-weapon1.webp` : null;
        weapon2Src = "images_webp/terror-weapon.webp";
    }
    // 左がテラー
    else if (left === "terror") {
        const R_hasWeapon = weaponUsers.includes(right);
        weapon1Src = R_hasWeapon ? `images_webp/${right}-weapon2.webp` : null;
        weapon2Src = "images_webp/terror-weapon.webp";
    }

    /* ============================
       クレイドール武器分岐
    ============================ */
    // クレイドール × ジーン
    else if (left === "claydoll" && right === "gene") {
        weapon1Src = null;
        weapon2Src = "images_webp/claydoll-weaponCG.webp";
    }
    else if (left === "gene" && right === "claydoll") {
        weapon1Src = null;
        weapon2Src = "images_webp/claydoll-weaponGC.webp";
    }
    // クレイドール × エクストリーム
    else if (left === "claydoll" && right === "xtreme") {
        weapon1Src = "images_webp/claydoll-weaponCX.webp";
        weapon2Src = "images_webp/claydoll-weaponX.webp";
    }
    else if (left === "xtreme" && right === "claydoll") {
        weapon1Src = "images_webp/claydoll-weaponXC.webp";
        weapon2Src = "images_webp/claydoll-weaponX.webp";
    }

    /* ============================
       ユートピア武器分岐
    ============================ */

    // ユートピア × エクストリーム
    else if (
        (left === "utopia" && right === "xtreme") ||
        (left === "xtreme" && right === "utopia")
    ) {
        weapon1Src = "images_webp/xtreme-weaponE.webp";
        weapon2Src =
        left === "utopia"
            ? "images_webp/utopia-weapon1.webp"
            : "images_webp/utopia-weapon2.webp";
    }

    // 左/右がユートピア
    else if (left === "utopia" || right === "utopia") {
        if (left === "utopia") {
        weapon1Src = "images_webp/utopia-weapon1.webp";
        weapon2Src = weaponUsers.includes(right)
           ? `images_webp/${right}-weapon2.webp`
            : null;
        } else {
        weapon1Src = "images_webp/utopia-weapon2.webp";
        weapon2Src = weaponUsers.includes(left)
           ? `images_webp/${left}-weapon1.webp`
            : null;
        }
    }

    /* ============================
       エクストリーム武器分岐
    ============================ */
    // エクストリーム × プリズム
    else if (left === "xtreme" && right === "prism") {
        weapon1Src = "images_webp/prism-weaponXP.webp";
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }
    else if (left === "prism" && right === "xtreme") {
        weapon1Src = "images_webp/prism-weaponPX.webp";
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }

    // エクストリーム × ファング
    else if (
        (left === "xtreme" && right === "fang") ||
        (left === "fang" && right === "xtreme")
    ) {
        weapon1Src = null;
        weapon2Src = "images_webp/xtreme-weaponF.webp";
    }

    // エクストリーム × スカル
    else if (left === "xtreme" && right === "skull") {
        weapon1Src = "images_webp/skull-weapon2.webp";
        weapon2Src = "images_webp/xtreme-weaponXS.webp";
    }
    else if (left === "skull" && right === "xtreme") {
        weapon1Src = "images_webp/skull-weapon1.webp";
        weapon2Src = "images_webp/xtreme-weaponSX.webp";
    }

    // エクストリーム × エターナル
    else if (left === "xtreme" && right === "eternal") {
        weapon1Src = "images_webp/eternal-weapon2.webp";
        weapon2Src = "images_webp/xtreme-weaponE.webp";
    }
    else if (left === "eternal" && right === "xtreme") {
        weapon1Src = "images_webp/eternal-weapon1.webp";
        weapon2Src = "images_webp/xtreme-weaponE.webp";
    }

    // エクストリーム × ユートピア
    else if (left === "xtreme" && right === "utopia") {
        weapon1Src = "images_webp/utopia-weapon2.webp";
        weapon2Src = "images_webp/xtreme-weaponE.webp";
    }
    else if (left === "utopia" && right === "xtreme") {
        weapon1Src = "images_webp/utopia-weapon1.webp";
        weapon2Src = "images_webp/xtreme-weaponE.webp";
    }

    // エクストリーム × バイオレンス
    else if (left === "xtreme" && right === "violence") {
        weapon1Src = "images_webp/violence-weapon6.webp";
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }
    else if (left === "violence" && right === "xtreme") {
        weapon1Src = "images_webp/violence-weapon5.webp";
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }

    // エクストリーム × スミロドン
    else if (left === "xtreme" && right === "smilodon") {
        weapon1Src = "images_webp/smilodon-weapon2.webp";
        weapon2Src = "images_webp/xtreme-weaponXSm.webp";
    }
    else if (left === "smilodon" && right === "xtreme") {
        weapon1Src = "images_webp/smilodon-weapon1.webp";
        weapon2Src = "images_webp/xtreme-weaponSmX.webp";
    }

    // エクストリーム × エクストリーム
    else if (left === "xtreme" && right === "xtreme") {
        weapon1Src = null; 
        weapon2Src = null; 
    }

    // 左がエクストリーム
    else if (left === "xtreme") {
        weapon1Src = weaponUsers.includes(right)
           ? `images_webp/${right}-weapon2.webp`
            : null;
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }

    // 右がエクストリーム
    else if (right === "xtreme") {
        weapon1Src = weaponUsers.includes(left)
            ? `images_webp/${left}-weapon1.webp`
            : null;
        weapon2Src = "images_webp/xtreme-weapon.webp";
    }

    else if (left === "metal") {
    if (right === "dummy") {
        weapon1Src = "images_webp/metal-weapon1.webp"; 
        weapon2Src = "images_webp/metal-weapon2.webp"; 
    }else if (right === "fang") {
        weapon1Src = null;
        weapon2Src = "images_webp/fang-weapon2.webp";
    }else {
        const R_hasWeapon = weaponUsers.includes(right);
        if (R_hasWeapon) {
            weapon1Src = `images_webp/${right}-weapon2.webp`;
        } else {
            weapon1Src = null;
        }
        weapon2Src = "images_webp/metal-weapon1.webp";
        }
    }


    else {
        const L_hasWeapon = weaponUsers.includes(left);
        const R_hasWeapon = weaponUsers.includes(right);

        if (L_hasWeapon && R_hasWeapon) {
            weapon1Src = `images_webp/${left}-weapon1.webp`;
            weapon2Src = `images_webp/${right}-weapon2.webp`;
        } else if (L_hasWeapon) {
            weapon1Src = `images_webp/${left}-weapon1.webp`;
        } else if (R_hasWeapon) {
            weapon2Src = `images_webp/${right}-weapon2.webp`;
        }
    }

    /* ============================
       ダミー武器分岐
    ============================ */
    const leftIsDummy  = (left === "dummy");
    const rightIsDummy = (right === "dummy");

    const rightHasWeapon = (weapon2Src && weapon2Src !== null);
    const leftHasWeapon  = (weapon1Src && weapon1Src !== null);

    // エクストリーム × ダミー
    if (leftIsDummy && right !== "xtreme") {
        if (rightHasWeapon) {
            weapon1Src = `images_webp/${right}-weapon1.webp`;
            weapon2Src = `images_webp/${right}-weapon2.webp`;
        } else {
            weapon1Src = null;
            weapon2Src = null;
        }
    }
    else if (rightIsDummy && left !== "xtreme") {
        if (leftHasWeapon) {
            weapon1Src = `images_webp/${left}-weapon1.webp`;
            weapon2Src = `images_webp/${left}-weapon2.webp`;
        } else {
            weapon1Src = null;
            weapon2Src = null;
        }
    }

   // サイクロン × ダミー 
    if (
        (left === "cyclone" && right === "cyclone") ||
        (left === "dummy" && right === "cyclone") ||
        (left === "cyclone" && right === "dummy")
    ) {
        weapon1Src = null;
        weapon2Src = "images_webp/cyclone-weapon.webp";
    }

   // テラー × ダミー 
    if (
        (left === "terror" && right === "terror") ||
        (left === "dummy" && right === "terror") ||
        (left === "terror" && right === "dummy")
    ) {
        weapon1Src = null;
        weapon2Src = "images_webp/terror-weapon.webp";
    }

    // ユートピア × ダミー
    else if (
        (left === "utopia" && right === "utopia") ||
        (left === "utopia" && right === "dummy") ||
        (left === "dummy" && right === "utopia")
    ) {
        weapon1Src = "images_webp/utopia-weapon1.webp";
        weapon2Src = "images_webp/utopia-weapon3.webp";
    }

    // 左/右がダミー
    if (weapon1Src) {
        weapon1Img.src = weapon1Src;
        weapon1Layer.appendChild(weapon1Img);
        weapon1Layer.style.display = "block";
        weapon1Layer.dataset.hasWeapon = "true";
    } else {
        weapon1Layer.style.display = "none";
        weapon1Layer.dataset.hasWeapon = "false";
    }

    if (weapon2Src) {
        weapon2Img.src = weapon2Src;
        weapon2Layer.appendChild(weapon2Img);
        weapon2Layer.style.display = "block";
        weapon2Layer.dataset.hasWeapon = "true";
    } else {
        weapon2Layer.style.display = "none";
        weapon2Layer.dataset.hasWeapon = "false";
    }

    // ファング分岐
    if(left === "fang" && right === "fang"){
        eyesSrc = "images_webp/fang-eyes1.webp";
        leftSrc = "images_webp/fang.webp";
        rightSrc = "images_webp/fang.webp";
        mufflerSrc = null;
    } else if(left === "fang"){
        eyesSrc = "images_webp/fang-eyes1.webp";
        leftSrc = "images_webp/fang.webp";
        rightSrc = `images_webp/fang-${right}.webp`;
        mufflerSrc = null;
    } else if(right === "fang"){
        eyesSrc = "images_webp/fang-eyes2.webp";
        leftSrc = `images_webp/fang-${left}.webp`;
        rightSrc = "images_webp/fang.webp";
        mufflerSrc = null;
    }

    // スカル分岐
    if (
        (left === "terror"  && right === "skull") ||
        (left === "utopia"  && right === "skull") 
    ) {
        eyesSrc = "images_webp/normal-eyes.webp";
        mufflerSrc = null;
        leftSrc = `images_webp/skull-${left}.webp`;
        rightSrc = "images_webp/skull-skull.webp";
    }
    else if (
        (left === "skull"   && right === "terror") ||
        (left === "skull"   && right === "utopia")
    ) {
        eyesSrc = "images_webp/normal-eyes.webp";
        mufflerSrc = null;
    }
    else if(right === "skull"){
        eyesSrc = "images_webp/skull-eyes.webp";
        mufflerSrc = "images_webp/skull-muffler.webp";
        leftSrc = `images_webp/skull-${left}.webp`;
        rightSrc = "images_webp/skull-skull.webp";
    }


    // ============================
    // eyes 分岐
    // ============================
    if (
        (left === "fang" && right === "terror") ||
        (left === "terror" && right === "fang") ||
        (left === "fang" && right === "utopia") ||
        (left === "utopia" && right === "fang")
    ) {
        if (left === "fang") {
            eyesSrc = "images_webp/fang-eyes1-caped.webp";
        }
        else {
            eyesSrc = "images_webp/fang-eyes2-caped.webp";
        }
    }

    else if (
        (left === "eternal" && right === "terror") ||
        (left === "terror" && right === "eternal") ||
        (left === "eternal" && right === "utopia") ||
        (left === "utopia" && right === "eternal")
    ) {
        eyesSrc = "images_webp/eternal-eyes.webp";
    }

    else if (
        (left === "accel" && right === "terror") ||
        (left === "terror" && right === "accel") ||
        (left === "accel" && right === "utopia") ||
        (left === "utopia" && right === "accel")
    ) {
        eyesSrc = "images_webp/accel-eyes-caped.webp";
    }

    else if (
        (left === "trial" && right === "terror") ||
        (left === "terror" && right === "trial") ||
        (left === "trial" && right === "utopia") ||
        (left === "utopia" && right === "trial")
    ) {
        eyesSrc = "images_webp/trial-eyes-caped.webp";
    }

    else if (
        left === "terror" || right === "terror" ||
        left === "utopia" || right === "utopia"
    ) {
        eyesSrc = "images_webp/normal-eyes-caped.webp";
    }

    else if (
        (left === "accel" && right === "eternal") ||
        (left === "eternal" && right === "accel")
    ) {
        eyesSrc = "images_webp/eternal-accel-eyes.webp";
    }
    else if (
        (left === "trial" && right === "eternal") ||
        (left === "eternal" && right === "trial")
    ) {
        eyesSrc = "images_webp/eternal-trial-eyes.webp";
    }
    else if (left === "accel" || right === "accel") {
        eyesSrc = "images_webp/accel-eyes.webp";
    }
    else if (left === "trial" || right === "trial") {
        eyesSrc = "images_webp/trial-eyes.webp";
    }
    else if (left === "eternal" || right === "eternal") {
        eyesSrc = "images_webp/eternal-eyes.webp";
    }


    // ============================
    // cape 分岐
    // ============================
    if (
        (left === "eternal" && right === "terror") ||
        (left === "terror" && right === "eternal")
    ) {
        capeSrc = "images_webp/terror-cape.webp";
    }
    else if (
        (left === "eternal" && right === "utopia") ||
        (left === "utopia" && right === "eternal")
    ) {
        capeSrc = "images_webp/terror-utopia-cape.webp";
    }
    else if (
        (left === "terror" && right === "utopia") ||
        (left === "utopia" && right === "terror")
    ) {
        capeSrc = "images_webp/terror-utopia-cape.webp";
    }
    else if (left === "eternal" || right === "eternal") {
        capeSrc = "images_webp/eternal-cape.webp";
    }
    else if (left === "terror" || right === "terror") {
        capeSrc = "images_webp/terror-cape.webp";
    }
    else if (left === "utopia" || right === "utopia") {
        capeSrc = "images_webp/utopia-cape.webp";
    }
    else {
        capeSrc = null;
    }


    // ============================
    // muffler 分岐
    // ============================
    if(!capeSrc){
        if(left === "cyclone" && right === "cyclone") mufflerSrc="images_webp/cyclone-muffler3.webp";
        else if(left === "cyclone") mufflerSrc="images_webp/cyclone-muffler1.webp";
        else if(right === "cyclone") mufflerSrc="images_webp/cyclone-muffler2.webp";
    }
    if(!capeSrc){
        if(left === "nasca3" && right === "nasca3") mufflerSrc="images_webp/cyclone-muffler3.webp";
        else if(left === "nasca3" && right === "cyclone") mufflerSrc="images_webp/cyclone-muffler3.webp";
        else if(left === "cyclone" && right === "nasca3") mufflerSrc="images_webp/cyclone-muffler3.webp";
        else if(left === "nasca3") mufflerSrc="images_webp/cyclone-muffler1.webp";
        else if(right === "nasca3") mufflerSrc="images_webp/cyclone-muffler2.webp";
    }
    if(!capeSrc){
        if(left === "nasca" && right === "nasca") mufflerSrc="images_webp/nasca-muffler3.webp";
        else if(left === "nasca") mufflerSrc="images_webp/nasca-muffler1.webp";
        else if(right === "nasca") mufflerSrc="images_webp/nasca-muffler2.webp";
    }


    // ウイングス分岐
    if((left === "bird" && right === "nasca") ||(left === "nasca" && right === "bird")){
        wingsSrc = "images_webp/bird-nasca-wings.webp";
    }else if((left === "bird" && right === "nasca3") ||(left === "nasca3" && right === "bird")){
        wingsSrc = "images_webp/bird-nasca3-wings.webp";
    }else if(left === "bird" || right === "bird"){
        wingsSrc = "images_webp/bird-wings.webp";
    }else if(left === "nasca" || right === "nasca"){
        wingsSrc = "images_webp/nasca-wings.webp";
    }else if(left === "nasca3" || right === "nasca3"){
        wingsSrc = "images_webp/nasca3-wings.webp";
    }else {
        wingsSrc = null;
    }

    // 左右半身描画
    leftImg.src = leftSrc;
    rightImg.src = rightSrc;
    leftLayer.appendChild(leftImg);
    rightLayer.appendChild(rightImg);

    // 目描画
    eyesImg.src = eyesSrc;
    eyesLayer.appendChild(eyesImg);

    // マフラー描画
    if(mufflerSrc){
        mufflerImg.src = mufflerSrc;
        mufflerLayer.appendChild(mufflerImg);
    }

    // ウイングス描画
    if(wingsSrc){
        wingsImg.src = wingsSrc;
        wingsLayer.appendChild(wingsImg);
    }

    // ケープ描画
    if(capeSrc){
        capeImg.src = capeSrc;
        capeLayer.appendChild(capeImg);
    }

    updateWeaponsDisplay();
    updateWeaponsButtonVisibility();
    updateFormName();
    updateSelectors();
    updateMemoryDescriptions();

    const row = document.querySelector(".button-row");
    const weaponBtn = document.getElementById("toggleWeaponsBtn");

    if (weaponBtn.style.display === "none") {
        row.classList.add("center-share-only");
    } else {
        row.classList.remove("center-share-only");
    }
}

/* ============================================
   武器表示切り替えボタン
============================================ */
const toggleWeaponsBtn = document.getElementById("toggleWeaponsBtn");

toggleWeaponsBtn.addEventListener("click", () => {
    weaponsVisible = !weaponsVisible; 
    updateWeaponsDisplay();           
});

function updateWeaponsDisplay() {
    if (weapon1Layer.dataset.hasWeapon === "true") {
        weapon1Layer.style.display = weaponsVisible ? "block" : "none";
    }
    if (weapon2Layer.dataset.hasWeapon === "true") {
        weapon2Layer.style.display = weaponsVisible ? "block" : "none";
    }

    toggleWeaponsBtn.querySelector(".btn-text").textContent = 
        weaponsVisible ? "武器を非表示にする" : "武器を表示する";

    const img = toggleWeaponsBtn.querySelector("img");
    img.src = weaponsVisible
        ? "images_webp/weaponbtnbackground1.webp"
        : "images_webp/weaponbtnbackground2.webp";
}

function updateWeaponsButtonVisibility() {
    const wrapper = document.getElementById("toggleWeaponsWrapper");
    
    const anyWeapon =
        weapon1Layer.dataset.hasWeapon === "true" ||
        weapon2Layer.dataset.hasWeapon === "true";

    wrapper.style.display = anyWeapon ? "block" : "none";

    const row = document.querySelector(".button-row");
    if (!anyWeapon) {
        row.classList.add("center-share-only");
    } else {
        row.classList.remove("center-share-only");
    }
}

/* ============================================
   Xボタン
============================================ */
document.getElementById("shareBtn").addEventListener("click", () => {

  const left  = currentLeft;
  const right = currentRight;

  const baseUrl = "https://actctzagi.github.io/w-simulator-unofficial/";
  const shareUrl = `${baseUrl}?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}&v=2`;

  const comboName = document.getElementById("formNameDynamic").textContent;

  const text =
`仮面ライダーW
今回のメモリは……

【${comboName}】

これで決まりだ！

#AtoZ運命のシミュレーター
でこのフォームを見る▼【非公式】
${shareUrl}`;

  const xUrl =
    `https://twitter.com/intent/tweet` +
    `?text=${encodeURIComponent(text)}`;

  window.open(xUrl, "_blank");
});

/* ============================================
   変身アニメーション
============================================ */
function animateViewer() {
  const viewer = document.getElementById("viewer-area");

  viewer.classList.add("viewer-zoom-enter");

  requestAnimationFrame(() => {
    viewer.classList.add("viewer-zoom-enter-active");
  });

  setTimeout(() => {
    viewer.classList.remove("viewer-zoom-enter", "viewer-zoom-enter-active");
  }, 500);
}

/* ============================================
   フォーム名更新
============================================ */
function updateFormName() {
    const left = currentLeft;
    const right = currentRight;
    const leftLabel = forms.find(f => f.value === left)?.label || "";
    const rightLabel = forms.find(f => f.value === right)?.label || "";
    document.getElementById("formNameDynamic").textContent = leftLabel + rightLabel;
}

/* ============================================
   左右入れ替えボタン
============================================ */
document.getElementById("swapButton").addEventListener("click", () => {
    const temp = currentLeft;
    currentLeft = currentRight;
    currentRight = temp;

    updateHalf();
    updateSelectors();
    updateFormName();
    updateMemoryDescriptions(); 
});

/* =============================
   モーダルを開ける
============================= */
let activeSide = "left";

const leftSelector = document.getElementById("leftSelector");
const rightSelector = document.getElementById("rightSelector");
const swapButton = document.getElementById("swapButton");

leftSelector.addEventListener("click", () => { activeSide = "left"; openModal(); });
rightSelector.addEventListener("click", () => { activeSide = "right"; openModal(); });

document.getElementById("closeModal").addEventListener("click", closeModal);



function openModal() {
    const leftValue   = currentLeft;
    const rightValue  = currentRight;
    const primaryValue = activeSide === "left" ? leftValue : rightValue;
    const otherValue   = activeSide === "left" ? rightValue : leftValue;

    const modal = document.getElementById("memoryModal");
    modal.classList.add("show");
    modal.style.display = "block";

    const root = document.getElementById("modalGrid");
    root.innerHTML = "";



    /* ============================
       上段：タイトル
    ============================ */
    const titleMain = document.createElement("div");
    titleMain.className = "modal-section-title";
    titleMain.textContent = "【 AtoZ MEMORIES 】";
    root.appendChild(titleMain);



    /* ============================
       上段：既存枠
    ============================ */
    const mainGrid = document.createElement("div");
    mainGrid.className = "modal-main-grid";

    mainModalForms.forEach(f => {
        const wrapper = document.createElement("div");
        wrapper.className = "button-wrapper";

        const btn = document.createElement("img");
        btn.src = `images_webp/btn-${f.value}.webp`;
        btn.className = "form-thumbnail";

        const label = document.createElement("span");
        label.className = "button-label";
        label.textContent = f.label;

        const selectedFrame = document.createElement("img");
        selectedFrame.className = "selected-frame";
        selectedFrame.src = "images_webp/frame-selected.webp";

        const selectedFrame2 = document.createElement("img");
        selectedFrame2.className = "selected-frame2";
        selectedFrame2.src = "images_webp/frame-selected2.webp";

        if (f.value === primaryValue) {
            wrapper.classList.add("selected");
        } else if (f.value === otherValue && otherValue !== primaryValue) {
            wrapper.classList.add("selected-secondary");
        }

        wrapper.addEventListener("click", async () => {
            if (activeSide === "left") {
                currentLeft = f.value;
            } else {
                currentRight = f.value;
            }

            await playHenshinEffect(1000);
            closeModalImmediate();
            updateHalf();
            updateSelectors();
            updateFormName?.();
            updateMemoryDescriptions();
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(label);
        wrapper.appendChild(selectedFrame);
        wrapper.appendChild(selectedFrame2);
        mainGrid.appendChild(wrapper);
    });
    root.appendChild(mainGrid);


    /* ============================
       区切り線
    ============================ */
    const divider = document.createElement("div");
    divider.className = "modal-divider";
    root.appendChild(divider);


    /* ============================
       下段：タイトル
    ============================ */
    const titleExtra = document.createElement("div");
    titleExtra.className = "modal-section-title";
    titleExtra.textContent = "【 EXTRA MEMORIES 】";
    root.appendChild(titleExtra);


    /* ============================
       下段：追加枠
    ============================ */
    const extraGrid = document.createElement("div");
    extraGrid.className = "modal-extra-grid";

    extraModalSlots.forEach(slot => {
        const wrapper = document.createElement("div");
        wrapper.className = "button-wrapper";

        const btn = document.createElement("img");
        btn.className = "form-thumbnail";

        const label = document.createElement("span");
        label.className = "button-label";

        const selectedFrame = document.createElement("img");
        selectedFrame.className = "selected-frame";
        selectedFrame.src = "images_webp/frame-selected.webp";

        const selectedFrame2 = document.createElement("img");
        selectedFrame2.className = "selected-frame2";
        selectedFrame2.src = "images_webp/frame-selected2.webp";

        if (slot.enabled && slot.value) {
            btn.src = `images_webp/btn-${slot.value}.webp`;
            label.textContent = slot.label;

            if (slot.value === primaryValue) {
                wrapper.classList.add("selected");
            } else if (slot.value === otherValue && otherValue !== primaryValue) {
                wrapper.classList.add("selected-secondary");
            }

            wrapper.addEventListener("click", async () => {
                if (activeSide === "left") {
                    currentLeft = slot.value;
                } else {
                    currentRight = slot.value;
                }

                await playHenshinEffect(1000);
                closeModalImmediate();
                updateHalf();
                updateSelectors();
                updateFormName?.();
                updateMemoryDescriptions();
            });
        } else {
            btn.src = "images_webp/btn-blank.webp";
            label.textContent = "???";
            wrapper.classList.add("locked");
        }

        wrapper.appendChild(btn);
        wrapper.appendChild(label);
        wrapper.appendChild(selectedFrame);
        wrapper.appendChild(selectedFrame2);
        extraGrid.appendChild(wrapper);
    });
    root.appendChild(extraGrid);
}

function updateSelectors() {
    const left = currentLeft;
    const right = currentRight;
    const leftBtn = document.querySelector("#leftSelector .selector-btn-img");
    const leftLabel = document.querySelector("#leftSelector .selector-btn-label");
    const rightBtn = document.querySelector("#rightSelector .selector-btn-img");
    const rightLabel = document.querySelector("#rightSelector .selector-btn-label");
    const leftForm = forms.find(f => f.value === left);
    const rightForm = forms.find(f => f.value === right);
    if (leftForm) {
        leftBtn.src = `images_webp/btn-${leftForm.value}.webp`;
        leftBtn.alt = leftForm.label;

        leftLabel.textContent =
        leftForm.value === "nasca3"
            ? "ナスカ (Lv3)"
            : leftForm.label;
    }
    if (rightForm) {
        rightBtn.src = `images_webp/btn-${rightForm.value}.webp`;
        rightBtn.alt = rightForm.label;


        rightLabel.textContent =
        rightForm.value === "nasca3"
            ? "ナスカ (Lv3)"
            : rightForm.label;

    }
}

/* ============================
   モーダルを閉じる
============================ */
function closeModal() {
  const modal = document.getElementById("memoryModal");
  modal.classList.add("closing");
  setTimeout(() => {
    modal.classList.remove("show", "closing");
    modal.style.display = "none";
  }, 300);
}

function closeModalImmediate() {
  const modal = document.getElementById("memoryModal");
  if (!modal) return;
    modal.classList.remove("show", "closing");
    modal.style.display = "none";
}

/* =============================
   変身エフェクト
============================= */
function playHenshinEffect(duration = 900) {
  return new Promise(resolve => {
    const henshin = document.getElementById("henshinEffect");
    if (!henshin) return resolve();

    henshin.classList.add("show");

    setTimeout(() => {
      henshin.classList.remove("show");
      const transitionTime = 300; // ms
      setTimeout(resolve, transitionTime);
    }, duration);
  });
}

/* =============================
   DOMContentLoaded
============================= */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const left  = params.get("left");
        const right = params.get("right");
        if (left && right) {
            currentLeft  = left;
            currentRight = right;
        } else {
            currentLeft  = "cyclone";
            currentRight = "joker";
        }
        updateSelectors();
        updateHalf();
        updateFormName();
        updateMemoryDescriptions();
    }, 0);
});