# アイコン仕様

## ライブラリ

Lucide を使用する。

```html
<!-- headの最後に追加 -->
<script src="https://unpkg.com/lucide@latest"></script>
```

```html
<!-- bodyの最後に追加（lucide.createIcons()は必ず呼ぶ） -->
<script>lucide.createIcons();</script>
```

## 使い方

```html
<i data-lucide="book-open"></i>
```

サイズ・色はCSSで指定する。

```css
i[data-lucide] {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.5;
}
```

## 注意

- アイコンだけのボタンには必ず `aria-label` を付ける
- ナビゲーションのアイコンはテキストラベルと併用する
