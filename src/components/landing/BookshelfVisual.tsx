import styles from "./styles/BookshelfVisual.module.css";

type SpineColor =
  | "deep"
  | "navy"
  | "main"
  | "light"
  | "cool"
  | "red"
  | "green"
  | "yellow"
  | "violet";

type Spine = {
  title: string;
  color: SpineColor;
};

const rows: Spine[][] = [
  [
    { title: "人を動かす", color: "deep" },
    { title: "ノルウェイの森", color: "red" },
    { title: "夜と霧", color: "main" },
    { title: "1984", color: "yellow" },
    { title: "老人と海", color: "navy" },
    { title: "沈黙", color: "green" },
    { title: "白夜行", color: "light" },
    { title: "海辺のカフカ", color: "main" },
    { title: "銀河鉄道の夜", color: "violet" },
    { title: "風の歌を聴け", color: "cool" },
  ],
  [
    { title: "罪と罰", color: "yellow" },
    { title: "カラマーゾフ", color: "navy" },
    { title: "キッチン", color: "red" },
    { title: "嫌われる勇気", color: "deep" },
    { title: "FACTFULNESS", color: "main" },
    { title: "悲しみよこんにちは", color: "violet" },
    { title: "蜜蜂と遠雷", color: "light" },
    { title: "コンビニ人間", color: "green" },
    { title: "告白", color: "navy" },
    { title: "ボトルネック", color: "cool" },
  ],
];

export function BookshelfVisual() {
  return (
    <div className={styles.shelf} aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map((spine, j) => (
            <div
              key={`${i}-${j}`}
              className={`${styles.book} ${styles[spine.color]}`}
            >
              <span className={styles.title}>{spine.title}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
