# レイアウト仕様

## ビューポート

| デバイス | 幅 |
|---|---|
| PC | 1200px（コンテンツ最大幅） |
| モバイル | 390px |

## ページコンテナ

```css
/* PC */
.pc-view .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-10); /* 40px */
}

/* モバイル */
.mobile-view .container {
  padding: 0 var(--space-4); /* 16px */
}
```

## 出力形式

1画面につき1ファイル。PCとモバイルを左右に並べて出力する。

```
[ PC レイアウト (1200px) ] [ モバイル レイアウト (390px) ]
```

### HTML構造

```html
<div class="mock-wrapper">
  <!-- 左: PC -->
  <div class="pc-view">
    <!-- ページコンテンツ -->
  </div>

  <!-- 右: モバイル -->
  <div class="mobile-view">
    <!-- ページコンテンツ -->
  </div>
</div>
```

```css
.mock-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  padding: 40px;
  background: #f0f0f0;
}

.pc-view {
  width: 1200px;
  flex-shrink: 0;
  background: #fff;
}

.mobile-view {
  width: 390px;
  flex-shrink: 0;
  background: #fff;
}
```

### ファイル名・スクリーンショットコマンド

```
ファイル名: docs/mocks/{画面名}-mock.png

npx playwright screenshot \
  --browser chromium \
  --viewport-size "1720,900" \
  --full-page \
  /tmp/{画面名}-mock.html \
  docs/mocks/{画面名}-mock.png
```

ビューポート幅 = PC(1200) + モバイル(390) + gap(40) + 両側padding(80) + 余裕 = 1720px
