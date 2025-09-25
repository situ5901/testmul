const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(express.urlencoded({ extended: false })); // fixed typo

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {

        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage });
app.get("/", (req, res) => {
    res.render("home");
});

app.post("/upload", upload.single("docImage"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
