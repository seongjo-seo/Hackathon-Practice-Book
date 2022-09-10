const express = require("express");
const app = express();
const cors = require("cors");


const corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

const models = require("./models/index");

models.sequelize
  .sync()
  .then(() => {
    console.log("danim Database 생성에 성공했습니다.");
  })
  .catch((err) => {
    console.error("danim Database 생성이 실패했습니다.");
    console.error(err);
  });

require("./routes/index")(app);

app.get("/", (req, res) => {
  res.json({ message: "Successful Server Connections" });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`서버가 정상적으로 작동됐습니다. ${PORT}`);
});
