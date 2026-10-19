const db = require("./db");
const fs = require("fs");
const path = require("path");

const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
);

db.exec(schema, (error) => {
    if (error) {
        console.error("Error creating table:", error.message);
        db.close();
        return;
    }

    console.log("Portfolio table created successfully.");

    const insert = `
        INSERT INTO portfolio
        (owner_name, headline, course_code, course_name,
         institution, bio, skills)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const students = [
        ["Gomezani Kapila Paul", "Aspiring Web Developer", "ICT251", "Web Technologies", "Mulungushi University", "Computer Science student interested in web development.", "HTML, CSS, JavaScript"],
        ["Student Two", "Software Development Student", "ICT251", "Web Technologies", "Mulungushi University", "Learning to build web applications.", "HTML, JavaScript"],
        ["Student Three", "Aspiring UI Designer", "ICT251", "Web Technologies", "Mulungushi University", "Interested in designing user-friendly websites.", "HTML, CSS"],
        ["Student Four", "Junior Programmer", "ICT251", "Web Technologies", "Mulungushi University", "Practising programming and problem solving.", "JavaScript, Python"],
        ["Student Five", "Computer Science Student", "ICT251", "Web Technologies", "Mulungushi University", "Exploring frontend and backend development.", "HTML, CSS, Node.js"],
        ["Student Six", "Future Software Engineer", "ICT251", "Web Technologies", "Mulungushi University", "Interested in software engineering.", "JavaScript, SQL"],
        ["Student Seven", "Web Development Learner", "ICT251", "Web Technologies", "Mulungushi University", "Building skills through practical projects.", "HTML, CSS"],
        ["Student Eight", "Aspiring Backend Developer", "ICT251", "Web Technologies", "Mulungushi University", "Learning server-side programming.", "Node.js, SQLite"],
        ["Student Nine", "IT Student", "ICT251", "Web Technologies", "Mulungushi University", "Interested in technology and innovation.", "Python, HTML"],
        ["Student Ten", "Student Portfolio Creator", "ICT251", "Web Technologies", "Mulungushi University", "Developing a personal portfolio.", "HTML, CSS, JavaScript"]
    ];

    db.serialize(() => {
        const stmt = db.prepare(insert);

        students.forEach((student) => {
            stmt.run(student);
        });

        stmt.finalize((insertError) => {
            if (insertError) {
                console.error("Error inserting records:", insertError.message);
            } else {
                console.log("Sample student profiles inserted.");
            }

            db.all("SELECT * FROM portfolio", (selectError, rows) => {
                if (selectError) {
                    console.error(selectError.message);
                } else {
                    console.log("Profiles in database:", rows.length);
                    console.table(rows);
                }

                db.close();
            });
        });
    });
});