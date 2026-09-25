import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server töötab pordil http://localhost:${PORT}`);
});
