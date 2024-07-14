document.addEventListener('DOMContentLoaded', function() {
   
    fetch('http://localhost:3000/students')
        .then(response => response.json())
        .then(data => {
            const studentTableBody = document.getElementById('student-table-body');
            data.forEach(student => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.grade}</td>
                `;

                studentTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching student data:', error));
});
     