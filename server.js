const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.post("/upload", (req, res) => {
    upload.single("docImage")(req, res, function (err) {
        if (err) {
            console.error("❌ Error uploading file:", err);
            return res.status(500).send("Error uploading file");
        }
        if (!req.file) {
            console.error("❌ No file uploaded!");
            return res.send("No file uploaded!");
        }
        console.log("✅ File uploaded successfully!");
        console.log("File info:", req.file);
        console.log("Form data:", req.body);
        res.redirect("/");
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
