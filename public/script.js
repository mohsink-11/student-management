function deleteStudent() {
    const studentIdentifier = prompt("Enter the ID or name of the student to delete:");

    if (studentIdentifier) {
        const isId = !isNaN(studentIdentifier);
        const url = isId ? `/students?id=${studentIdentifier}` : `/students?name=${studentIdentifier}`;

        fetch(url, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.text();
        })
        .then(data => {
            alert(`Student ${studentIdentifier} deleted successfully.`);
            loadStudents();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to delete student: ${error.message}`);
        });
    } else {
        alert('Student ID or name is required to delete.');
    }
}

function loadStudents() {
    fetch('/students')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('student-table-body');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.grade}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function viewStudentById() {
    const studentId = document.getElementById('student-id').value;

    if (studentId) {
        fetch(`/students/${studentId}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            const studentDetails = document.getElementById('student-details');
            studentDetails.innerHTML = `
                <p>ID: ${data[0].id}</p>
                <p>Name: ${data[0].name}</p>
                <p>Age: ${data[0].age}</p>
                <p>Grade: ${data[0].grade}</p>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to retrieve student: ${error.message}`);
        });
    } else {
        alert('Student ID is required to view details.');
    }
}

function updateStudent() {
    const studentId = document.getElementById('update-student-id').value;
    const studentName = document.getElementById('update-student-name').value;
    const studentAge = document.getElementById('update-student-age').value;
    const studentGrade = document.getElementById('update-student-grade').value;

    if (studentId && studentName && studentAge && studentGrade) {
        const studentData = {
            name: studentName,
            age: studentAge,
            grade: studentGrade
        };

        fetch(`/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.text();
        })
        .then(data => {
            alert(`Student ${studentId} updated successfully.`);
            loadStudents();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to update student: ${error.message}`);
        });
    } else {
        alert('All fields are required to update a student.');
    }
}

function addStudent() {
    const studentName = document.getElementById('new-student-name').value;
    const studentAge = document.getElementById('new-student-age').value;
    const studentGrade = document.getElementById('new-student-grade').value;

    if (studentName && studentAge && studentGrade) {
        const studentData = {
            name: studentName,
            age: studentAge,
            grade: studentGrade
        };

        fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.text();
        })
        .then(data => {
            alert('Student added successfully.');
            loadStudents();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to add student: ${error.message}`);
        });
    } else {
        alert('All fields are required to add a new student.');
    }
}
function addStudentForm(){
    const studentAdd=document.getElementById("student-add")
    if (studentAdd.style.display === 'none') {
        studentAdd.style.display = 'block';
    } else {
        studentAdd.style.display = 'none';
    }

}

function updateStudentForm(){
    const studentUpdate=document.getElementById("student-update")
    if (studentUpdate.style.display === 'none') {
        studentUpdate.style.display = 'block';
    } else {
        studentUpdate   .style.display = 'none';
    }
}
// Load students initially when the page loads
document.addEventListener('DOMContentLoaded', loadStudents);
