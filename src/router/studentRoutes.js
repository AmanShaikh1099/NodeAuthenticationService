import express from "express";
import db from "../db.js";
const router = express.Router();
router.get("/", (req, res) => {
    const result = db.prepare(`SELECT 
        student_id, 
        name, 
        student_class, 
        parent_contact, 
        school,
        CASE 
            WHEN enrolled = 0 THEN 'false' 
            WHEN enrolled = 1 THEN 'true' 
        END AS enrolled 
         FROM student`)
  
    try{
        const student = result.all()
        const updatedStudents = student.map((item) => ({
            ...item,
            enrolled: item.enrolled === 'true'
        }));
        if(!student || updatedStudents.length === 0){
            return res.status(404).json({message: "Something went wrong"})
        }
        
        
        return res.status(200).json(updatedStudents)
 }
    catch(err){
        return res.status(501).json({error: err.message})
    }
});
router.post("/", (req, res) => {
    const { name, student_class, parent_contact, school } = req.body
    try{
        const student = db.prepare(`INSERT INTO STUDENT (name, student_class, parent_contact, school) VALUES (?, ?, ?, ?)`)
        const insertStudent = student.run(name, student_class , parent_contact, school)
        const lastUpdatedId = insertStudent.lastInsertRowid; 

        const updateResults = db.prepare(`SELECT student_id, 
        name, 
        student_class, 
        parent_contact,
        school FROM student WHERE student_id = ?`).get(lastUpdatedId);

        console.log(updateResults);
        if(!insertStudent || !updateResults){
            return res.status(501).json({message: "Student registration failed"})
        }
        updateResults.enrolled = false;
        return res.status(201).json(updateResults)
    }
    catch(err){
        return res.status(501).json({error: err.message})
    }});
    router.patch("/:id", (req, res) => {
        const { id } = req.params;
        const updates = req.body.student;
    
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }
    
        const validFields = ["amount_quoted" ,"enrolled", "amount_recieved","recieved_by","enrolled_subjects"];
        const updateKeys = Object.keys(updates).filter((key) => validFields.includes(key));
    
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
    
        const stmt = db.prepare(query);
        const resultUpdate = stmt.run(...queryParams);
    
        const updatedStudentId = queryParams[queryParams.length - 1]; 


const updateResults = db.prepare(`
    SELECT student_id, 
        name, 
        student_class, 
        parent_contact, 
        CASE 
            WHEN enrolled = 0 THEN 'false' 
            WHEN enrolled = 1 THEN 'true' 
        END AS enrolled 
    FROM student 
    WHERE student_id = ?
`).get(updatedStudentId);

console.log(updateResults);
        if (resultUpdate.changes > 0) {
            return res.json({enrolled: true});
        } else {
            return res.status(500).json({ success: false, message: "Failed to update student" });
        }
    });
    
    
    export default router;