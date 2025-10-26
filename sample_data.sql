CREATE DATABASE IF NOT EXISTS otc_helper;
USE otc_helper;

CREATE TABLE IF NOT EXISTS contraindications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ingredient VARCHAR(255) NOT NULL
);

-- サンプルデータ
INSERT INTO contraindications (ingredient) VALUES
('アセトアミノフェン'),
('イブプロフェン'),
('ロキソプロフェン');
