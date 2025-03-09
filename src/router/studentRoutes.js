import express from "express";
import db from "../db.js";
const router = express.Router();
router.get("/", (req, res) => {
    const result = `SELECT 
        student_id, 
        name, 
        student_class, 
        parent_contact, 
        school,
        CASE 
            WHEN enrolled = 0 THEN 'false' 
            WHEN enrolled = 1 THEN 'true' 
        END AS enrolled 
         FROM student`
  
    try{
        const students = []
        db.all(result, [], (err, rows) => {
            if(err){
                return res.status(501).json({error: err.message})
            }
            rows.forEach((row) => {
                row.enrolled = row.enrolled === 'true'
                students.push(row)
            })
            return res.status(200).json(students)
        })
}
    catch(err){
        return res.status(502).json({error: err.message})
    }
});
router.get("/:id", (req, res) => {
    const student_id = req.params.id;
    try{
        const sql = `SELECT * FROM student WHERE student_id = ?`;
          db.get(sql, [student_id], (err, row) => {
              if (err) {
              return res.status(500).json({ error: err.message });
              }
              if (!row) {
              return res.status(404).json({ message: "Student not found" });
              }
              row.enrolled = row.enrolled === 1;
              row.enrolled_subjects = JSON.parse(row.enrolled_subjects);
              return res.status(200).json(row);
          });
      }
    catch(err){
        return res.status(501).json({error: err.message})
    }
}),
router.post("/", (req, res) => {
    const { name, student_class, parent_contact, school } = req.body;
    console.log(name, student_class, parent_contact, school);
    try {
        // Insert student into the database
        const sql = `INSERT INTO student (name, student_class, parent_contact, school) VALUES (?, ?, ?, ?)`;
        db.run(sql, [name, student_class, parent_contact, school], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            let student_id = this.lastID;
            const sql_select = `SELECT student_id, 
        name, 
        student_class, 
        parent_contact, 
        school,
        CASE 
            WHEN enrolled = 0 THEN 'false' 
            WHEN enrolled = 1 THEN 'true' 
        END AS enrolled 
         FROM student WHERE student_id = ?`;
            db.get(sql_select, [student_id], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                row.enrolled = row.enrolled === 'true';
                return res.status(201).json(row);
            });
        });
} catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body.student;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    const validFields = ["amount_quoted", "enrolled", "amount_recieved", "recieved_by", "enrolled_subjects"];
    const updateKeys = Object.keys(updates).filter((key) => validFields.includes(key));

    if (updateKeys.length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
    }

    let query = "UPDATE student SET ";
    const queryParams = [];

    updateKeys.forEach((key, index) => {
        let value = updates[key];

        // Convert boolean values to 0 or 1 for SQLite
        if (key === "enrolled" && typeof value === "boolean") {
            value = value ? 1 : 0;
        }

        query += `${key} = ?`;
        queryParams.push(value);

        if (index < updateKeys.length - 1) {
            query += ", ";
        }
    });

    query += " WHERE student_id = ?";
    queryParams.push(id);

    db.run(query, queryParams, function (err) {
        if (err) {
            console.error("Error updating student:", err.message);
            return res.status(500).json({ success: false, message: "Failed to update student" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: "Student not found or no changes made" });
        }

        // Fetch and return updated student data
        db.get(
            `SELECT student_id, 
                    name, 
                    student_class, 
                    parent_contact, 
                    enrolled 
             FROM student 
             WHERE student_id = ?`,
            [id],
            (err, updatedStudent) => {
                if (err) {
                    console.error("Error retrieving updated student:", err.message);
                    return res.status(500).json({ success: false, message: "Failed to retrieve updated student data" });
                }

                if (!updatedStudent) {
                    return res.status(404).json({ success: false, message: "Student not found" });
                }

                // Convert enrolled field to boolean before sending response
                updatedStudent.enrolled = updatedStudent.enrolled === 1;

                return res.json(updatedStudent);
            }
        );
    });
});
    
    
    export default router;