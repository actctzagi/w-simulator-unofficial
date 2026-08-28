#!/usr/bin/env python3
"""
images/ の PNG を WebP に変換して images_webp/ に出力する。
元の images/ は一切変更しない。macOS 標準の python3 + Pillow で動く（インストール不要）。

使い方:
    cd "/Users/t.arita/Pictures/仮面ライダーW シミュレーター"

    python3 convert_webp.py            # 差分だけ変換（新規・更新されたPNGのみ）※ふだんはこれ
    python3 convert_webp.py --all      # 全部を変換し直す（設定を変えたとき等）
    python3 convert_webp.py a.png b/c.png   # 指定したPNGだけ変換

新しい画像を足すとき:
    1) いつもどおり images/ に PNG を置く
    2) python3 convert_webp.py            ← 追加分だけ images_webp/ に .webp ができる
    3) images_webp/ ごと（か新しい .webp だけ）を GitHub にコミット
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow が見つかりません。 python3 -m pip install --user Pillow")

SRC = Path("images")
DST = Path("images_webp")

# 画質（0-100）。80 で十分。落としたければ 75 くらいまで。
QUALITY = 80

# 圧縮の頑張り具合（0-6）。6 は数十倍遅いのにサイズは数%しか変わらないので 4 で十分。
METHOD = 4

# 長辺の最大ピクセル数。表示は実質 417〜900px 幅なので 1280 で retina 対応も十分。
# btn-*.png（モーダルの一覧サムネ）は小さく表示されるので別枠で強く縮小。
MAXW_DEFAULT = 1280
MAXW_THUMB = 320          # btn-*.png / frame-selected*.png など
THUMB_PREFIXES = ("btn-", "frame-selected")


def convert_one(png: Path, force: bool) -> tuple[int, int, str] | None:
    """1枚を変換。スキップしたら None を返す。"""
    rel = png.relative_to(SRC)
    out = DST / rel.with_suffix(".webp")
    out.parent.mkdir(parents=True, exist_ok=True)

    # 差分モード: 既に .webp があって PNG より新しければスキップ
    if not force and out.exists() and out.stat().st_mtime >= png.stat().st_mtime:
        return None

    im = Image.open(png)
    im = im.convert("RGBA") if ("A" in im.getbands() or im.mode == "P") else im.convert("RGB")

    cap = MAXW_THUMB if rel.name.startswith(THUMB_PREFIXES) else MAXW_DEFAULT
    if max(im.size) > cap:
        im.thumbnail((cap, cap), Image.LANCZOS)

    im.save(out, "WEBP", quality=QUALITY, method=METHOD)
    return png.stat().st_size, out.stat().st_size, f"{im.size[0]}x{im.size[1]}"


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    force = "--all" in sys.argv or "-a" in sys.argv

    if args:
        targets = [Path(a) for a in args]
        force = True                      # 明示指定は常に変換
    else:
        targets = sorted(SRC.rglob("*.png"))

    DST.mkdir(exist_ok=True)

    total_in = total_out = done = skipped = 0
    for png in targets:
        if not png.exists():
            print(f"!! 見つからない: {png}")
            continue
        try:
            png.relative_to(SRC)
        except ValueError:
            print(f"!! images/ の外なのでスキップ: {png}")
            continue

        r = convert_one(png, force)
        if r is None:
            skipped += 1
            continue
        a, b, size = r
        total_in += a
        total_out += b
        done += 1
        print(f"{png.relative_to(SRC)}  {a//1024:>6} KB -> {b//1024:>5} KB  ({size})")

    print("-" * 60)
    if done:
        print(f"変換 {done} 枚  合計 {total_in/1_048_576:.1f} MB -> {total_out/1_048_576:.1f} MB "
              f"({100*total_out/total_in:.0f}%)")
    if skipped:
        print(f"スキップ {skipped} 枚（変更なし。全部やり直すなら --all）")
    print(f"出力先: {DST.resolve()}")


if __name__ == "__main__":
    main()
