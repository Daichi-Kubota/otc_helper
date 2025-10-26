// db.js
// MySQLデータベースに接続するための関数を定義するファイル

import mysql from "mysql2/promise"; // MySQLのPromise版モジュールをインポート
import dotenv from "dotenv"; // 環境変数を読み込むモジュール
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config(); // .env ファイルから環境変数を読み込む

// connectDB 関数を定義し、外部から使えるように export
export async function connectDB() {
  // MySQLに接続する
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,     // DBホスト名（localhostなど）
    user: process.env.DB_USER,     // DBユーザー名
    password: process.env.DB_PASSWORD, // DBパスワード
    database: process.env.DB_NAME, // DB名
  });

  console.log("✅ DB接続成功"); // 接続成功時にコンソールに表示
  return connection; // 接続情報を呼び出し元に返す
}dotenv.config(); // .env ファイルから環境変数を読み込む
const app = express(); // Expressアプリを作成
app.use(cors()); // CORS許可
app.use(express.json()); // JSON形式のリクエストを受け取れるようにする
// 即時実行関数 (async IIFE) を使って非同期処理をまとめる
(async () => {
  // MySQLデータベースに接続
  const db = await connectDB();

  // ---------------------------
  // サーバー稼働確認用ルート
  // ---------------------------
  app.get("/", (req, res) => {
    res.json({ message: "OTC-HELPER サーバー稼働中 🚀" });
  });

  // ---------------------------
  // 禁忌判定API（AIなし）
  // ---------------------------
  // リクエストのbodyに symptom, history を受け取る
  app.post("/check", async (req, res) => {
    const { symptom, history } = req.body;

    try {
      // DBから成分リストを取得
      const [rows] = await db.execute("SELECT * FROM contraindications");

      // AI処理は省略して、DBの warning を返す
      const results = rows.map(row => ({
        ingredient: row.ingredient, // 成分名
        advice: row.warning // DBに登録した注意点をそのまま返す
      }));

      // JSONでレスポンス
      res.json({ results });

    } catch (err) {
      console.error(err); // エラーをコンソールに表示
      res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
  });

  // ---------------------------
  // サーバー起動
  // ---------------------------
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ サーバー起動: http://localhost:${PORT}`);
  });
})();

