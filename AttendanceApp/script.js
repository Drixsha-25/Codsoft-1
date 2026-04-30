// 5. DATABASE MANAGEMENT - Using LocalStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || [];
let currentUser = null;

// Default users for testing
if (users.length === 0) {
    users = [
        {username: 'student1', password: '123', role: 'student'},
        {username: 'teacher1', password: '123', role: 'instructor'}
    ];
    saveData();
}

// 6. DATA SECURITY - Basic validation
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

// 1. USER AUTHENTICATION
function showRegister() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
}

function register() {
    const username = document.getElementById('regUser').value.trim();
    const password = document.getElementById('regPass').value.trim();
    const role = document.getElementById('regRole').value;

    // 7. ERROR HANDLING
    if (!username || !password || !role) {
        alert('All fields are required!');
        return;
    }

    if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }

    users.push({username, password, role});
    saveData();
    alert('Registration Successful! Please login.');
    showLogin();
}

function login() {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();

    // 7. ERROR HANDLING
    if (!username || !password) {
        alert('Enter username and password!');
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        document.getElementById('loginPage').classList.add('hidden');
        
        if (user.role === 'student') {
            document.getElementById('studentDashboard').classList.remove('hidden');
            document.getElementById('studentName').textContent = user.username;
            loadCourses();
        } else {
            document.getElementById('instructorDashboard').classList.remove('hidden');
            document.getElementById('instructorName').textContent = user.username;
        }
    } else {
        alert('Invalid credentials!');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('studentDashboard').classList.add('hidden');
    document.getElementById('instructorDashboard').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
}

// 2. STUDENT FEATURES
function loadCourses() {
    const select = document.getElementById('courseSelect');
    select.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(course => {
        select.innerHTML += `<option value="${course.name}">${course.name}</option>`;
    });
}

function markAttendance() {
    const course = document.getElementById('courseSelect').value;
    
    if (!course) {
        alert('Please select a course!');
        return;
    }

    const today = new Date().toLocaleDateString();
    const alreadyMarked = attendance.find(a => 
        a.student === currentUser.username && 
        a.course === course && 
        a.date === today
    );

    if (alreadyMarked) {
        alert('Attendance already marked for today!');
        return;
    }

    attendance.push({
        student: currentUser.username,
        course: course,
        date: today,
        status: 'Present'
    });
    
    saveData();
    alert('Attendance Marked Successfully!');
}

function viewMyAttendance() {
    const records = attendance.filter(a => a.student === currentUser.username);
    let html = '<h4>My Attendance Records</h4>';
    
    if (records.length === 0) {
        html += '<p>No records found</p>';
    } else {
        html += '<table><tr><th>Date</th><th>Course</th><th>Status</th></tr>';
        records.forEach(r => {
            html += `<tr><td>${r.date}</td><td>${r.course}</td><td>${r.status}</td></tr>`;
        });
        html += '</table>';
    }
    
    document.getElementById('studentRecords').innerHTML = html;
}

// 3. INSTRUCTOR FEATURES
function addCourse() {
    const courseName = document.getElementById('newCourse').value.trim();
    
    if (!courseName) {
        alert('Enter course name!');
        return;
    }

    if (courses.find(c => c.name === courseName)) {
        alert('Course already exists!');
        return;
    }

    courses.push({name: courseName, instructor: currentUser.username});
    saveData();
    document.getElementById('newCourse').value = '';
    alert('Course Added Successfully!');
}

function viewAllAttendance() {
    let html = '<h4>All Attendance Records</h4>';
    
    if (attendance.length === 0) {
        html += '<p>No records found</p>';
    } else {
        html += '<table><tr><th>Date</th><th>Student</th><th>Course</th><th>Status</th></tr>';
        attendance.forEach(r => {
            html += `<tr><td>${r.date}</td><td>${r.student}</td><td>${r.course}</td><td>${r.status}</td></tr>`;
        });
        html += '</table>';
    }
    
    document.getElementById('instructorRecords').innerHTML = html;
}

function viewStudents() {
    const students = users.filter(u => u.role === 'student');
    let html = '<h4>Registered Students</h4>';
    
    if (students.length === 0) {
        html += '<p>No students registered</p>';
    } else {
        html += '<table><tr><th>Username</th></tr>';
        students.forEach(s => {
            html += `<tr><td>${s.username}</td></tr>`;
        });
        html += '</table>';
    }
    
    document.getElementById('instructorRecords').innerHTML = html;
}