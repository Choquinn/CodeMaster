const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let token = localStorage.getItem('token');

// DOM Elements
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const coursesContainer = document.getElementById('coursesContainer');
const adminCourseForm = document.getElementById('adminCourseForm');
const addCourseForm = document.getElementById('addCourseForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Sample courses data (fallback if API fails)
const sampleCourses = [
  {
    _id: '1',
    title: 'JavaScript Moderno',
    description: 'Aprenda JavaScript do zero até frameworks modernos como React e Vue.js',
    category: 'frontend',
    price: 297.90,
    instructor: { name: 'Carlos Silva' },
    image: 'https://source.unsplash.com/random/400x300/?javascript'
  },
  {
    _id: '2',
    title: 'Node.js e Express',
    description: 'Desenvolva APIs robustas com Node.js, Express e MongoDB',
    category: 'backend',
    price: 347.50,
    instructor: { name: 'Ana Souza' },
    image: 'https://source.unsplash.com/random/400x300/?nodejs'
  },
  {
    _id: '3',
    title: 'React Avançado',
    description: 'Domine React com Hooks, Context API e Redux',
    category: 'frontend',
    price: 397.00,
    instructor: { name: 'Pedro Oliveira' },
    image: 'https://source.unsplash.com/random/400x300/?react'
  },
  {
    _id: '4',
    title: 'Python e Django',
    description: 'Desenvolvimento web completo com Python e Django',
    category: 'backend',
    price: 327.90,
    instructor: { name: 'Mariana Costa' },
    image: 'https://source.unsplash.com/random/400x300/?python'
  },
  {
    _id: '5',
    title: 'Fullstack com MERN',
    description: 'Aprenda a construir aplicações completas com MongoDB, Express, React e Node.js',
    category: 'fullstack',
    price: 497.00,
    instructor: { name: 'Lucas Fernandes' },
    image: 'https://source.unsplash.com/random/400x300/?webdevelopment'
  },
  {
    _id: '6',
    title: 'TypeScript Profissional',
    description: 'Leve seu JavaScript ao próximo nível com TypeScript',
    category: 'frontend',
    price: 267.50,
    instructor: { name: 'Juliana Santos' },
    image: 'https://source.unsplash.com/random/400x300/?typescript'
  }
];

// Event Listeners
registerBtn.addEventListener('click', () => openAuthModal('register'));
loginBtn.addEventListener('click', () => openAuthModal('login'));
logoutBtn.addEventListener('click', logout);
closeModal.addEventListener('click', closeAuthModal);
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
addCourseForm.addEventListener('submit', handleAddCourse);

tabButtons.forEach(button => {
  button.addEventListener('click', () => switchTab(button.dataset.tab));
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => filterCourses(button.dataset.filter));
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    fetchCurrentUser();
  }
  loadCourses();
});

// Functions
function openAuthModal(tab = 'login') {
  authModal.style.display = 'flex';
  switchTab(tab);
}

function closeAuthModal() {
  authModal.style.display = 'none';
}

function switchTab(tabName) {
  tabButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });
  
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}Tab`);
  });
}

function toggleMobileMenu() {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

async function fetchCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (response.ok) {
      currentUser = await response.json();
      updateUI();
    } else {
      localStorage.removeItem('token');
      token = null;
    }
  } catch (err) {
    console.error('Error fetching user:', err);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role: 'admin' }) // Force admin for demo
    });

    const data = await response.json();
    
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      await fetchCurrentUser();
      closeAuthModal();
      showToast('Registro realizado com sucesso!', 'success');
    } else {
      showToast(data.msg || 'Erro ao registrar', 'error');
    }
  } catch (err) {
    console.error('Registration error:', err);
    showToast('Erro na conexão', 'error');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      await fetchCurrentUser();
      closeAuthModal();
      showToast('Login realizado com sucesso!', 'success');
    } else {
      showToast(data.msg || 'Credenciais inválidas', 'error');
    }
  } catch (err) {
    console.error('Login error:', err);
    showToast('Erro na conexão', 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  token = null;
  currentUser = null;
  updateUI();
  showToast('Você saiu da sua conta', 'info');
}

function updateUI() {
  if (token) {
    registerBtn.style.display = 'none';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    adminCourseForm.style.display = currentUser?.role === 'admin' ? 'block' : 'none';
  } else {
    registerBtn.style.display = 'block';
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    adminCourseForm.style.display = 'none';
  }
}

async function loadCourses() {
  try {
    const response = await fetch(`${API_URL}/cursos`);
    let courses = await response.json();
    
    // If API fails, use sample data
    if (!response.ok || courses.length === 0) {
      courses = sampleCourses;
    }
    
    renderCourses(courses);
  } catch (err) {
    console.error('Error loading courses:', err);
    renderCourses(sampleCourses); // Fallback to sample data
  }
}

function filterCourses(category) {
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
  
  const courses = Array.from(document.querySelectorAll('.course-card'));
  courses.forEach(course => {
    const shouldShow = category === 'all' || course.dataset.category === category;
    course.style.display = shouldShow ? 'block' : 'none';
  });
}

function renderCourses(courses) {
  coursesContainer.innerHTML = '';
  
  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.dataset.category = course.category || 'backend';
    
    const imageUrl = course.image || `https://source.unsplash.com/random/400x300/?${course.title.split(' ')[0]}`;
    
    courseCard.innerHTML = `
      <div class="course-img" style="background-image: url('${imageUrl}')"></div>
      <div class="course-content">
        <span class="course-category ${course.category || 'backend'}">${course.category || 'Backend'}</span>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-description">${course.description}</p>
        <div class="course-meta">
          <span class="course-price">R$ ${course.price.toFixed(2)}</span>
          <span class="course-instructor">
            <i class="fas fa-user"></i> ${course.instructor?.name || 'Instrutor'}
          </span>
        </div>
        ${currentUser?.role === 'admin' ? `
          <div class="course-actions">
            <button class="btn btn-outline edit-course" data-id="${course._id}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger delete-course" data-id="${course._id}">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        ` : ''}
      </div>
    `;
    
    coursesContainer.appendChild(courseCard);
  });

  // Add event listeners for admin buttons
  document.querySelectorAll('.edit-course').forEach(btn => {
    btn.addEventListener('click', () => handleEditCourse(btn.dataset.id));
  });

  document.querySelectorAll('.delete-course').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteCourse(btn.dataset.id));
  });
}

async function handleAddCourse(e) {
  e.preventDefault();
  
  const course = {
    title: document.getElementById('courseTitle').value,
    description: document.getElementById('courseDescription').value,
    category: document.getElementById('courseCategory').value,
    price: parseFloat(document.getElementById('coursePrice').value),
    image: document.getElementById('courseImage').value
  };

  try {
    const response = await fetch(`${API_URL}/cursos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(course)
    });

    if (response.ok) {
      const newCourse = await response.json();
      addCourseForm.reset();
      loadCourses();
      showToast('Curso adicionado com sucesso!', 'success');
    } else {
      const error = await response.json();
      showToast(error.msg || 'Erro ao adicionar curso', 'error');
    }
  } catch (err) {
    console.error('Error adding course:', err);
    showToast('Erro na conexão', 'error');
  }
}

async function handleEditCourse(id) {
  const courseTitle = prompt('Novo título:');
  const courseDescription = prompt('Nova descrição:');
  const coursePrice = parseFloat(prompt('Novo preço:'));

  if (courseTitle && courseDescription && !isNaN(coursePrice)) {
    try {
      const response = await fetch(`${API_URL}/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          title: courseTitle, 
          description: courseDescription, 
          price: coursePrice 
        })
      });

      if (response.ok) {
        loadCourses();
        showToast('Curso atualizado com sucesso!', 'success');
      } else {
        const error = await response.json();
        showToast(error.msg || 'Erro ao atualizar curso', 'error');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      showToast('Erro na conexão', 'error');
    }
  }
}

async function handleDeleteCourse(id) {
  if (confirm('Tem certeza que deseja excluir este curso?')) {
    try {
      const response = await fetch(`${API_URL}/cursos/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        loadCourses();
        showToast('Curso excluído com sucesso!', 'success');
      } else {
        const error = await response.json();
        showToast(error.msg || 'Erro ao excluir curso', 'error');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      showToast('Erro na conexão', 'error');
    }
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  background-color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10000;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast-success {
  background-color: #28a745;
}

.toast-error {
  background-color: #dc3545;
}

.toast-info {
  background-color: #17a2b8;
}
`;
document.head.appendChild(toastStyles);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    closeAuthModal();
  }
});