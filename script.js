/* =============================
   メモリ名
============================= */
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
  { value: "zone", label: "ゾーン" }
];

/* =============================
   メモリ解説文
============================= */
const memoryDescriptions = {
    accel: "｢加速の記憶｣を持つガイアメモリ。加速能力を与え、高速移動を可能にする｡",
    bird: "｢始祖鳥の記憶｣を持つガイアメモリ。使用者に飛翔能力を与える｡",
    cyclone: "｢疾風の記憶｣を持つガイアメモリ。疾風を引き起こし、風を自由自在に操る能力を与える｡",
    dummy: "｢偽物(複製)の記憶｣を持つガイアメモリ。他人や物体に擬態する能力を与える｡",
    eternal: "｢永遠の記憶｣を持つガイアメモリ。T2以前のガイアメモリの能力を無力化させる｡",
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
    skull: "｢骸骨の記憶｣を持つガイアメモリ。身体能力を極限まで高め、その状態に耐えうる肉体に作り変える｡",
    trigger: "｢銃撃手の記憶｣を持つガイアメモリ。銃撃能力を与え、射撃力を強化する｡",
    unicorn: "｢一角獣の記憶｣を持つガイアメモリ。パンチなどの打突攻撃の破壊力を高める｡",
    violence: "｢暴力の記憶｣を持つガイアメモリ。全身の筋力を強化し、特に腕力を最も強化させる｡",
    weather: "｢気象の記憶｣を持つガイアメモリ。雨、竜巻、雷、雪といった全ての気象現象を自由自在に操る｡",
    xtreme: "記憶を持たない特殊なガイアメモリ。他のメモリの能力を取り込み、その力を極限まで引き出す｡",
    yesterday: "｢昨日の記憶｣を持つガイアメモリ。発動された対象の記憶を操作し、昨日と同じ行動を繰り返させる｡",
    zone: "｢地帯の記憶｣を持つガイアメモリ。任意の対象物を自由に他の場所へ転送する｡"
};

function updateMemoryDescriptions() {
    const left = document.getElementById("leftSelect").value;
    const right = document.getElementById("rightSelect").value;

    const leftBox = document.getElementById("leftMemoryDescription");
    const rightBox = document.getElementById("rightMemoryDescription");

    if(leftBox)  leftBox.textContent  = memoryDescriptions[left]  || "";
    if(rightBox) rightBox.textContent = memoryDescriptions[right] || "";
}

/* =============================
   左右のパネルにボタンを生成（非表示だが不可欠）
============================= */
function createButtons() {
  const leftPanel = document.getElementById("leftPanel");
  const rightPanel = document.getElementById("rightPanel");
  const leftSelect = document.getElementById("leftSelect");
  const rightSelect = document.getElementById("rightSelect");

  forms.forEach(f => {
    // select に option 追加
    const leftOpt = document.createElement("option");
    leftOpt.value = f.value;
    leftOpt.text = f.label;
    leftSelect.appendChild(leftOpt);

    const rightOpt = document.createElement("option");
    rightOpt.value = f.value;
    rightOpt.text = f.label;
    rightSelect.appendChild(rightOpt);

    // 左ボタンラッパー
    const leftWrapper = document.createElement("div");
    leftWrapper.className = "button-wrapper";

    const leftBtn = document.createElement("img");
    leftBtn.src = `images/btn-${f.value}.png`;
    leftBtn.className = "form-thumbnail";
    leftBtn.dataset.value = f.value;

    const leftLabel = document.createElement("span");
    leftLabel.className = "button-label";
    leftLabel.textContent = f.label;

    leftWrapper.appendChild(leftBtn);
    leftWrapper.appendChild(leftLabel);

    leftWrapper.addEventListener("click", () => {
        // 既存の選択を解除
        leftPanel.querySelectorAll(".button-wrapper").forEach(w => w.classList.remove("selected"));
        // 選択中を設定
        leftWrapper.classList.add("selected");

        leftSelect.value = f.value;
        updateHalf();
    });

    leftPanel.appendChild(leftWrapper);


    // 右ボタンラッパー
    const rightWrapper = document.createElement("div");
    rightWrapper.className = "button-wrapper";

    const rightBtn = document.createElement("img");
    rightBtn.src = `images/btn-${f.value}.png`;
    rightBtn.className = "form-thumbnail";
    rightBtn.dataset.value = f.value;

    const rightLabel = document.createElement("span");
    rightLabel.className = "button-label";
    rightLabel.textContent = f.label;

    rightWrapper.appendChild(rightBtn);
    rightWrapper.appendChild(rightLabel);

    rightWrapper.addEventListener("click", () => {
        // 既存の選択を解除
        rightPanel.querySelectorAll(".button-wrapper").forEach(w => w.classList.remove("selected"));
        // 選択中を設定
        rightWrapper.classList.add("selected");

        rightSelect.value = f.value;
        updateHalf();
    });

    rightPanel.appendChild(rightWrapper);
  });

  // 初期状態設定
  leftPanel.querySelectorAll(".button-wrapper").forEach(w => {
      if (w.querySelector("img").dataset.value === "cyclone") w.classList.add("selected");
  });
  rightPanel.querySelectorAll(".button-wrapper").forEach(w => {
      if (w.querySelector("img").dataset.value === "joker") w.classList.add("selected");
  });

  leftSelect.value = "cyclone";
  rightSelect.value = "joker";
  updateHalf();
}

function updateButtonHighlight(side, selectedValue) {
    const panel = side === "left" ? document.getElementById("leftPanel")
                                  : document.getElementById("rightPanel");

    panel.querySelectorAll(".button-wrapper").forEach(wrapper => {
        const btn = wrapper.querySelector("img");
        if (!btn) return;
        wrapper.classList.toggle("selected", btn.dataset.value === selectedValue);
    });
}


let weaponsVisible = true; 


/* =============================
   🟥updateHalf：viewer内の画像を変化
============================= */

function updateHalf() {
    const left = document.getElementById("leftSelect").value;
    const right = document.getElementById("rightSelect").value;

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
    let leftSrc = `images/${left}.png`;
    let rightSrc = `images/${right}.png`;
    let eyesSrc = "images/normal-eyes.png";
    let mufflerSrc = null;
    let wingsSrc = null;
    let capeSrc = null;
    let weapon1Src = null;
    let weapon2Src = null;


    // 単体画像パターン
    const singleImages = {
        "skull-joker": "SkullJoker.png",
        "nasca-joker": "NascaJoker.png",
        "nasca-skull": "NascaSkull.png",
        "nasca-cyclone": "NascaCyclone.png",
        "cyclone-nasca": "CycloneNasca.png",
        "nasca-yesterday": "NascaYesterday.png",
        "yesterday-nasca": "YesterdayNasca.png",
        "fang-eternal": "FangEternal.png",
        "eternal-fang": "EternalFang.png",
        "fang-accel": "FangAccel.png",
        "accel-fang": "AccelFang.png",
        "eternal-skull": "EternalSkull.png",
        "fang-skull": "FangSkull.png",
        "accel-skull": "AccelSkull.png",
        "cyclone-skull": "CycloneSkull.png",
        "xtreme-xtreme": "XtremeXtreme.png"
    };

    const key = left + "-" + right;
    const weaponUsers = [
        "accel", "eternal", "gene", 
        "heat", "iceage", "key", "luna", "metal", "nasca", 
        "ocean", "puppeteer", "queen", "rocket", "skull", "trigger", "unicorn", 
        "violence", "weather", "xtreme", "yesterday", "zone"];

    /* ============================================
       単体画像処理
    ============================================ */
    let isSingle = false;
    if (singleImages[key]) {
        isSingle = true;
        singleImg.src = "images/" + singleImages[key];
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
    const disableWeaponPairs = [];

    let disableWeapons = disableWeaponPairs.some(p => (left === p[0] && right === p[1]));


    if(left === "fang" && right === "metal") {
        weapon1Src = "images/fang-weapon1.png";
        weapon2Src = null;
    }

    else if(left === "fang" && right === "trigger") {
        weapon1Src = null; 
        weapon2Src = "images/fang-weapon3.png";
    }

    else if(left === "trigger" && right === "fang") {
        weapon1Src = "images/fang-weapon4.png";
        weapon2Src = null; 
    }


    else if(left === "metal" && right === "eternal") {
        weapon1Src = "images/metal-weapon3.png";
        weapon2Src = "images/eternal-weapon2.png";
    } 
    else if(left === "eternal" && right === "metal") {
        weapon1Src = "images/eternal-weapon1.png";
        weapon2Src = "images/metal-weapon4.png";
    }


    else if(left === "luna" && right === "fang") {
        weapon1Src = "images/luna-weapon3.png";
        weapon2Src = null;
    }
    else if(left === "fang" && right === "luna") {
        weapon1Src = null;
        weapon2Src = "images/luna-weapon4.png";
    } 


    else if(left === "violence" && right === "fang") {
        weapon1Src = "images/violence-weapon3.png";
        weapon2Src = null;
    }
    else if(left === "fang" && right === "violence") {
        weapon1Src = null;
        weapon2Src = "images/violence-weapon4.png";
    } 

    else if(left === "metal" && right === "skull") {
        weapon1Src = "images/skull-weapon2.png";
        weapon2Src = "images/metal-weapon5.png";
    }


/* ============================
   エクストリーム武器分岐
============================ */

// エクストリーム × ファング（左右共通）
else if (
    (left === "xtreme" && right === "fang") ||
    (left === "fang" && right === "xtreme")
) {
    weapon1Src = null;
    weapon2Src = "images/xtreme-weaponF.png";
}

// エクストリーム × スカル
else if (left === "xtreme" && right === "skull") {
    weapon1Src = "images/skull-weapon2.png";
    weapon2Src = "images/xtreme-weaponXS.png";
}

// スカル × エクストリーム
else if (left === "skull" && right === "xtreme") {
    weapon1Src = "images/skull-weapon1.png";
    weapon2Src = "images/xtreme-weaponSX.png";
}

// エクストリーム × エターナル
else if (left === "xtreme" && right === "eternal") {
    weapon1Src = "images/eternal-weapon2.png";
    weapon2Src = "images/xtreme-weaponE.png";
}
else if (left === "eternal" && right === "xtreme") {
    weapon1Src = "images/eternal-weapon1.png";
    weapon2Src = "images/xtreme-weaponE.png";
}

// エクストリーム × バイオレンス
else if (left === "xtreme" && right === "violence") {
    weapon1Src = "images/violence-weapon6.png";
    weapon2Src = "images/xtreme-weapon.png";
}
else if (left === "violence" && right === "xtreme") {
    weapon1Src = "images/violence-weapon5.png";
    weapon2Src = "images/xtreme-weapon.png";
}

// エクストリーム × エクストリーム
else if (left === "xtreme" && right === "xtreme") {
    weapon1Src = null; 
    weapon2Src = null; 
}

// それ以外：左がエクストリーム
else if (left === "xtreme") {
    weapon1Src = weaponUsers.includes(right)
        ? `images/${right}-weapon2.png`
        : null;
    weapon2Src = "images/xtreme-weapon.png";
}

// それ以外：右がエクストリーム
else if (right === "xtreme") {
    weapon1Src = weaponUsers.includes(left)
        ? `images/${left}-weapon1.png`
        : null;
    weapon2Src = "images/xtreme-weapon.png";
}

    else if (left === "metal") {
    if (right === "dummy") {
        weapon1Src = "images/metal-weapon1.png"; // コピー先①（メタル1）
        weapon2Src = "images/metal-weapon2.png"; // コピー先②（メタル2）
    }else if (right === "fang") {
        weapon1Src = null;
        weapon2Src = "images/fang-weapon2.png";
    }else {
        const R_hasWeapon = weaponUsers.includes(right);
        if (R_hasWeapon) {
            weapon1Src = `images/${right}-weapon2.png`;
        } else {
            weapon1Src = null;
        }
        weapon2Src = "images/metal-weapon1.png";
        }
    }


    else if (!disableWeapons) {
        const L_hasWeapon = weaponUsers.includes(left);
        const R_hasWeapon = weaponUsers.includes(right);

        // 左右同じ武器フォームなら両手に表示
        const sameWeaponForms = [
        "accel", "eternal", "gene", 
        "heat", "iceage", "key", "luna", "metal", "nasca", 
        "ocean", "puppeteer", "queen", "rocket", "skull", "trigger", "unicorn", 
        "violence", "weather", "xtreme", "yesterday", "zone"];

        if (left === right && sameWeaponForms.includes(left)) {
            weapon1Src = `images/${left}-weapon1.png`;
            weapon2Src = `images/${right}-weapon2.png`;
        } else if (L_hasWeapon && R_hasWeapon) {
            weapon1Src = `images/${left}-weapon1.png`;
            weapon2Src = `images/${right}-weapon2.png`;
        } else if (L_hasWeapon) {
            weapon1Src = `images/${left}-weapon1.png`;
        } else if (R_hasWeapon) {
            weapon2Src = `images/${right}-weapon2.png`;
        }
    }


    // 単体画像でも武器は出す（ただしNGペアは非表示）
    if (isSingle && disableWeapons) {
        weapon1Src = null;
        weapon2Src = null;
    }


    const leftIsDummy  = (left === "dummy");
    const rightIsDummy = (right === "dummy");

    const rightHasWeapon = (weapon2Src && weapon2Src !== null);
    const leftHasWeapon  = (weapon1Src && weapon1Src !== null);


// xtreme が絡む場合はダミーのコピーを実行しない
if (leftIsDummy && right !== "xtreme") {
    if (rightHasWeapon) {
        weapon1Src = `images/${right}-weapon1.png`;
        weapon2Src = `images/${right}-weapon2.png`;
    } else {
        weapon1Src = null;
        weapon2Src = null;
    }
}
else if (rightIsDummy && left !== "xtreme") {
    if (leftHasWeapon) {
        weapon1Src = `images/${left}-weapon1.png`;
        weapon2Src = `images/${left}-weapon2.png`;
    } else {
        weapon1Src = null;
        weapon2Src = null;
    }
}


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



    /* ============================================
       左右半身・目・マフラー・ウイング・ケープ描画
    ============================================ */
    if(!isSingle){
        leftImg.src = leftSrc;
        rightImg.src = rightSrc;
        leftLayer.appendChild(leftImg);
        rightLayer.appendChild(rightImg);

        eyesImg.src = eyesSrc;
        eyesLayer.appendChild(eyesImg);

        if(mufflerSrc){
            mufflerImg.src = mufflerSrc;
            mufflerLayer.appendChild(mufflerImg);
        }
        if(wingsSrc){
            wingsImg.src = wingsSrc;
            wingsLayer.appendChild(wingsImg);
        }
        if(capeSrc){
            capeImg.src = capeSrc;
            capeLayer.appendChild(capeImg);
        }
    }


    // ファング分岐
    if(left === "fang" && right === "fang"){
        eyesSrc = "images/fang-eyes1.png";
        leftSrc = "images/fang.png";
        rightSrc = "images/fang.png";
        mufflerSrc = null;
    } else if(left === "fang"){
        eyesSrc = "images/fang-eyes1.png";
        leftSrc = "images/fang.png";
        rightSrc = `images/fang-${right}.png`;
        mufflerSrc = null;
    } else if(right === "fang"){
        eyesSrc = "images/fang-eyes2.png";
        leftSrc = `images/fang-${left}.png`;
        rightSrc = "images/fang.png";
        mufflerSrc = null;
    }

    // スカル分岐
    if(right === "skull"){
        eyesSrc = "images/skull-eyes.png";
        mufflerSrc = "images/skull-muffler.png";
        leftSrc = `images/skull-${left}.png`;
        rightSrc = "images/skull-skull.png";
    }

    // アクセル・エターナル分岐
    if((left === "accel" && right === "eternal") || (left === "eternal" && right === "accel")){
        eyesSrc = "images/eternal-accel-eyes.png";
        capeSrc = "images/eternal-cape.png";
    } else if(left === "accel" || right === "accel"){
        eyesSrc = "images/accel-eyes.png";
    } else if(left === "eternal" || right === "eternal"){
        eyesSrc = "images/eternal-eyes.png";
        capeSrc = "images/eternal-cape.png";
    }

    // サイクロンマフラー分岐（ケープが無い場合のみ）
    if(!capeSrc){
        if(left === "cyclone" && right === "cyclone") mufflerSrc="images/cyclone-muffler3.png";
        else if(left === "cyclone") mufflerSrc="images/cyclone-muffler1.png";
        else if(right === "cyclone") mufflerSrc="images/cyclone-muffler2.png";
    }

    // ナスカマフラー分岐（ケープが無い場合のみ）
    if(!capeSrc){
        if(left === "nasca" && right === "nasca") mufflerSrc="images/nasca-muffler3.png";
        else if(left === "nasca") mufflerSrc="images/nasca-muffler1.png";
        else if(right === "nasca") mufflerSrc="images/nasca-muffler2.png";
    }


    // ウイングス分岐
    if((left === "bird" && right === "nasca") ||(left === "nasca" && right === "bird")){
        wingsSrc = "images/bird-nasca-wings.png";
    }else if(left === "bird" || right === "bird"){
        wingsSrc = "images/bird-wings.png";
    }else if(left === "nasca" || right === "nasca"){
        wingsSrc = "images/nasca-wings.png";
    }else {
        wingsSrc = null;
    }


    /* ============================================
       ここから既存の出力処理（変更なし）
    ============================================ */

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
    updateWeaponsButton();

}


/* ============================================
   武器表示切り替えボタン
============================================ */
const toggleWeaponsBtn = document.getElementById("toggleWeaponsBtn");

toggleWeaponsBtn.addEventListener("click", () => {
    weaponsVisible = !weaponsVisible; // 表示状態反転
    updateWeaponsDisplay();           // 武器レイヤー表示を更新
});

function updateWeaponsDisplay() {
    if (weapon1Layer.dataset.hasWeapon === "true") {
        weapon1Layer.style.display = weaponsVisible ? "block" : "none";
    }
    if (weapon2Layer.dataset.hasWeapon === "true") {
        weapon2Layer.style.display = weaponsVisible ? "block" : "none";
    }

    // ボタン文字を切り替え
    toggleWeaponsBtn.querySelector(".btn-text").textContent = 
        weaponsVisible ? "武器を非表示にする" : "武器を表示する";

    const img = toggleWeaponsBtn.querySelector("img");
    img.src = weaponsVisible
        ? "images/weaponbtnbackground1.png"
        : "images/weaponbtnbackground2.png";
}

function updateWeaponsButtonVisibility() {
    const anyWeapon = (weapon1Layer.dataset.hasWeapon === "true") || (weapon2Layer.dataset.hasWeapon === "true");
    toggleWeaponsBtn.style.display = anyWeapon ? "block" : "none";
}


/* ============================================
   ✅Xボタン
============================================ */
document.getElementById("shareBtn").addEventListener("click", () => {

  const left  = document.getElementById("leftSelect").value;
  const right = document.getElementById("rightSelect").value;

  // 正式URL
  const baseUrl = "https://actctzagi.github.io/w-simulator-unofficial/";
  const shareUrl = `${baseUrl}?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`;

  // 左上のフォーム名を反映
  const comboName = document.getElementById("formNameDynamic").textContent;

  const text =
`仮面ライダーW
今回のメモリは……

【${comboName}】

これで決まりだ！

#AtoZ_運命のシミュレーター(非公式)
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
    const left = document.getElementById("leftSelect").value;
    const right = document.getElementById("rightSelect").value;

    const leftLabel = forms.find(f => f.value === left)?.label || "";
    const rightLabel = forms.find(f => f.value === right)?.label || "";

    document.getElementById("formNameDynamic").textContent = leftLabel + rightLabel;
}


/* ============================================
   左右入れ替えボタン
============================================ */
document.getElementById("swapButton").addEventListener("click", () => {
    const leftSelect = document.getElementById("leftSelect");
    const rightSelect = document.getElementById("rightSelect");

    // 値を入れ替え
    const temp = leftSelect.value;
    leftSelect.value = rightSelect.value;
    rightSelect.value = temp;

    // wrapper の selected クラスを更新
    updateButtonHighlight("left", leftSelect.value);
    updateButtonHighlight("right", rightSelect.value);

    // viewer 画像更新
    updateHalf();

    // セレクター画像とラベル更新 
    updateSelectors();

    // フォーム名更新 
    updateFormName();

    updateMemoryDescriptions(); 
});


/* =============================
   左右パネルに hover イベント
============================= */
["leftPanel", "rightPanel"].forEach(panelId => {
    const panel = document.getElementById(panelId);

    panel.addEventListener("mouseenter", () => {
        panel.querySelectorAll(".button-wrapper").forEach(w => w.classList.add("hovered"));
    });

    panel.addEventListener("mouseleave", () => {
        panel.querySelectorAll(".button-wrapper").forEach(w => w.classList.remove("hovered"));
    });

    // タッチ開始
    panel.addEventListener("touchstart", () => {
        panel.querySelectorAll(".button-wrapper").forEach(w => w.classList.add("hovered"));
    });

    // タッチ終了
    panel.addEventListener("touchend", () => {
        panel.querySelectorAll(".button-wrapper").forEach(w => w.classList.remove("hovered"));
    });
});


/* =============================
   セレクトボックス&モーダル
============================= */

let activeSide = "left"; // どちらを編集しているか

const leftSelector = document.getElementById("leftSelector");
const rightSelector = document.getElementById("rightSelector");
const swapButton = document.getElementById("swapButton");

document.getElementById("leftSelector").addEventListener("click", () => {
    activeSide = "left";
    openModal();
});

document.getElementById("rightSelector").addEventListener("click", () => {
    activeSide = "right";
    openModal();
});


document.getElementById("closeModal").addEventListener("click", closeModal);

function openModal() {

    const leftValue = document.getElementById("leftSelect").value;
    const rightValue = document.getElementById("rightSelect").value;
    const leftSelect = document.getElementById("leftSelect");
    const rightSelect = document.getElementById("rightSelect");

    const modal = document.getElementById("memoryModal");
    modal.classList.add("show");  // show クラスを付与

    const grid = document.getElementById("modalGrid");

    grid.innerHTML = ""; // 初期化

    forms.forEach(f => {

        // ボタンラッパーを作る
        const wrapper = document.createElement("div");
        wrapper.className = "button-wrapper";

        // 画像
        const btn = document.createElement("img");
        btn.src = `images/btn-${f.value}.png`;
        btn.className = "form-thumbnail"; // CSSで薄暗・トリミング済み
        btn.dataset.value = f.value;

        // ラベル
        const label = document.createElement("span");
        label.className = "button-label";
        label.textContent = f.label;

        wrapper.appendChild(btn);
        wrapper.appendChild(label);

        // 選択中ボタンに selected を付与
        if ((activeSide === "left" && f.value === leftValue) ||
            (activeSide === "right" && f.value === rightValue)) {
            wrapper.classList.add("selected");
        }

        // ホバーで hovered
        wrapper.addEventListener("mouseenter", () => wrapper.classList.add("hovered"));
        wrapper.addEventListener("mouseleave", () => wrapper.classList.remove("hovered"));


        wrapper.addEventListener("click", async () => {

         　　playHenshinEffect().then(() => {
    　　　　　closeModal(); // 変身エフェクトと同時に消える
 　　　　　　 });

            // --- 選択セット ---
            if (activeSide === "left") {
                leftSelect.value = f.value;
                updateButtonHighlight("left", f.value);
            } else {
                rightSelect.value = f.value;
                updateButtonHighlight("right", f.value);
            }

            // --- モーダル内の選択表示更新 ---
            grid.querySelectorAll(".button-wrapper.selected").forEach(el => el.classList.remove("selected"));
            wrapper.classList.add("selected");


            // --- 変身演出 ---
            // 1000 は表示時間（ms）
            await playHenshinEffect(1000);   


            // --- モーダルを即閉じる ---
            closeModalImmediate(); 

            // --- viewer 更新 ---
            updateHalf();

            // --- セレクター表示更新 ---
            updateSelectors();

            // --- フォーム名更新 ---
            if (typeof updateFormName === "function") {
                updateFormName();
            }

            updateMemoryDescriptions(); 

});



/* =============================
   変身演出
============================= */
function playHenshinEffect(duration = 900) {
    return new Promise(resolve => {
    const henshin = document.getElementById("henshinEffect");
    if (!henshin) return resolve();

    // 表示
    henshin.classList.add("show");

    // duration 経過後に消去
    setTimeout(() => {
    henshin.classList.remove("show");

    // CSSトランジションが終わるのを待つ
    const transitionTime = 300; // opacity/transformに合わせる
    setTimeout(resolve, transitionTime);

    }, duration);
  });
}
        grid.appendChild(wrapper);
    });

    modal.style.display = "block";
}

function updateSelectors() {
    const left = document.getElementById("leftSelect").value;
    const right = document.getElementById("rightSelect").value;

    const leftBtn = document.querySelector("#leftSelector .selector-btn-img");
    const leftLabel = document.querySelector("#leftSelector .selector-btn-label");
    const rightBtn = document.querySelector("#rightSelector .selector-btn-img");
    const rightLabel = document.querySelector("#rightSelector .selector-btn-label");

    const leftForm = forms.find(f => f.value === left);
    const rightForm = forms.find(f => f.value === right);

    if (leftForm) {
        leftBtn.src = `images/btn-${leftForm.value}.png`;
        leftBtn.alt = leftForm.label;
        leftLabel.textContent = leftForm.label;
    }

    if (rightForm) {
        rightBtn.src = `images/btn-${rightForm.value}.png`;
        rightBtn.alt = rightForm.label;
        rightLabel.textContent = rightForm.label;
    }
}


/* ============================
   モーダルを閉じる処理
============================ */
function closeModal() {
  const modal = document.getElementById("memoryModal");
  modal.classList.add("closing");

  setTimeout(() => {
    modal.classList.remove("show", "closing");
    modal.style.display = "none";

  }, 300); // CSSのtransitionと同じ秒数
}

function closeModalImmediate() {
  const modal = document.getElementById("memoryModal");
  if (!modal) return;
  modal.classList.remove("show", "closing");
  modal.style.display = "none";
}


function updateSelectorButton(side, value) {
    const btn = side === "left" ? leftSelector : rightSelector;
    const img = btn.querySelector(".selector-btn-img");
    const label = btn.querySelector(".selector-btn-label");

    img.src = `images/btn-${value}.png`;
    img.alt = forms.find(f => f.value === value)?.label || "";
    label.textContent = forms.find(f => f.value === value)?.label || "";
}

// ボタン押下でモーダルを開く
leftSelector.addEventListener("click", () => { activeSide = "left"; openModal(); });
rightSelector.addEventListener("click", () => { activeSide = "right"; openModal(); });


// 選択時
leftSelect.addEventListener("change", () => {
    updateSelectorButton("left", leftSelect.value);
});
rightSelect.addEventListener("change", () => {
    updateSelectorButton("right", rightSelect.value);
});




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
   🟥DOMContentLoaded
============================= */
document.addEventListener("DOMContentLoaded", () => {

    createButtons();

    const params = new URLSearchParams(window.location.search);
    const left  = params.get("left");
    const right = params.get("right");

    // ✅ URL指定があればそれを使用
    if (left && right) {
        document.getElementById("leftSelect").value  = left;
        document.getElementById("rightSelect").value = right;

        updateButtonHighlight("left",  left);
        updateButtonHighlight("right", right);
    } 
    // ✅ 無ければ従来の初期値
    else {
        document.getElementById("leftSelect").value  = "cyclone";
        document.getElementById("rightSelect").value = "joker";

        updateButtonHighlight("left",  "cyclone");
        updateButtonHighlight("right", "joker");
    }

    updateSelectors();       
    updateHalf();
    updateFormName();
    updateMemoryDescriptions();  

});