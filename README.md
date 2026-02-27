# 五十音打字練習

練習平假名與片假名羅馬拼音輸入的打字練習工具。

## 本地開發

**環境需求**：[Bun](https://bun.sh)

```bash
# 安裝依賴
bun install

# 啟動開發伺服器（http://localhost:5173）
bun run dev
```

## 建置

```bash
bun run build
# 產出在 dist/

# 預覽建置結果
bun run preview
```

## Docker

### 建置 image

```bash
docker build -t gojuon-typing-practice .
```

### 啟動容器

```bash
docker run -p 8080:80 gojuon-typing-practice
```

開啟 http://localhost:8080 即可使用。

### 自訂 port

```bash
docker run -p <your-port>:80 gojuon-typing-practice
```
