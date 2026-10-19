const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test route: confirms that the API server is running.
app.get("/", (req, res) => {
    res.json({
        message: "Student Portfolio API is running"
    });
});

// GET: retrieve all portfolio profiles.
app.get("/api/portfolio", (req, res) => {
    db.all("SELECT * FROM portfolio ORDER BY id", (error, rows) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(rows);
    });
});

// GET: retrieve one profile by ID.
app.get("/api/portfolio/:id", (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM portfolio WHERE id = ?", [id], (error, row) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!row) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json(row);
    });
});

// POST: create a portfolio profile.
app.post("/api/portfolio", (req, res) => {
    const {
        owner_name,
        headline,
        course_code,
        course_name,
        institution,
        bio,
        skills
    } = req.body;

    if (!owner_name || !owner_name.trim()) {
        return res.status(400).json({
            error: "owner_name is required"
        });
    }

    const sql = `
        INSERT INTO portfolio
        (owner_name, headline, course_code, course_name,
         institution, bio, skills, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const values = [
        owner_name.trim(),
        headline || "",
        course_code || "",
        course_name || "",
        institution || "",
        bio || "",
        skills || ""
    ];

    db.run(sql, values, function (error) {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        db.get(
            "SELECT * FROM portfolio WHERE id = ?",
            [this.lastID],
            (selectError, row) => {
                if (selectError) {
                    return res.status(500).json({
                        error: selectError.message
                    });
                }

                res.status(201).json(row);
            }
        );
    });
});

// PUT: update a portfolio profile.
app.put("/api/portfolio/:id", (req, res) => {
    const {
        owner_name,
        headline,
        course_code,
        course_name,
        institution,
        bio,
        skills
    } = req.body;

    if (!owner_name || !owner_name.trim()) {
        return res.status(400).json({
            error: "owner_name is required"
        });
    }

    const sql = `
        UPDATE portfolio
        SET owner_name = ?,
            headline = ?,
            course_code = ?,
            course_name = ?,
            institution = ?,
            bio = ?,
            skills = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    const values = [
        owner_name.trim(),
        headline || "",
        course_code || "",
        course_name || "",
        institution || "",
        bio || "",
        skills || "",
        req.params.id
    ];

    db.run(sql, values, function (error) {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        db.get(
            "SELECT * FROM portfolio WHERE id = ?",
            [req.params.id],
            (selectError, row) => {
                if (selectError) {
                    return res.status(500).json({
                        error: selectError.message
                    });
                }

                res.json(row);
            }
        );
    });
});

// DELETE: delete a portfolio profile.
app.delete("/api/portfolio/:id", (req, res) => {
    db.run(
        "DELETE FROM portfolio WHERE id = ?",
        [req.params.id],
        function (error) {
            if (error) {
                return res.status(500).json({
                    error: error.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Profile not found"
                });
            }

            res.json({
                message: "Profile deleted successfully",
                id: Number(req.params.id)
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Portfolio API running at http://localhost:${PORT}`);
});