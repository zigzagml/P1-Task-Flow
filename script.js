/**
 * TaskFlow — Interactive Landing Page Script
 * Fully Vanilla ES6+, zero external runtime dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme Switcher
  initTheme();

  // 2. Initialize Navigation & Mobile Drawer
  initNavigation();

  // 3. Initialize Interactive Mock Kanban Board
  initMockBoard();

  // 4. Initialize Role Showcase Tabs
  initRoleTabs();

  // 5. Initialize FAQ Accordion
  initFaqAccordion();

  // 6. Initialize Contact / Early Access Form
  initContactForm();

  // 7. Scroll Spy for Active Navigation Link
  initScrollSpy();
});

/* ===================================================================
   1. THEME SWITCHER (Dark / Light Mode)
   =================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('taskflow_theme');

  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  } else {
    // Check system preference
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    document.body.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('taskflow_theme', nextTheme);
      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`, 'info');
    });
  }
}

/* ===================================================================
   2. NAVIGATION & MOBILE DRAWER
   =================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Header scroll shadow enhancement
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
}

/* ===================================================================
   3. INTERACTIVE MOCK KANBAN BOARD
   =================================================================== */
function initMockBoard() {
  const colTodoList = document.getElementById('colTodoList');
  const colProgressList = document.getElementById('colProgressList');
  const colDoneList = document.getElementById('colDoneList');

  const countTodo = document.getElementById('countTodo');
  const countProgress = document.getElementById('countProgress');
  const countDone = document.getElementById('countDone');

  const searchInput = document.getElementById('mockSearchInput');
  const viewButtons = document.querySelectorAll('.mock-view-btn');

  // Quick Task Modal Elements
  const addQuickTaskBtn = document.getElementById('addQuickTaskBtn');
  const taskModal = document.getElementById('taskModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const quickTaskForm = document.getElementById('quickTaskForm');

  // Function to recalculate column card counts
  function updateCounts() {
    if (countTodo && colTodoList) countTodo.textContent = colTodoList.querySelectorAll('.mock-task-card').length;
    if (countProgress && colProgressList) countProgress.textContent = colProgressList.querySelectorAll('.mock-task-card').length;
    if (countDone && colDoneList) countDone.textContent = colDoneList.querySelectorAll('.mock-task-card').length;
  }

  // Bind checkmark button events
  function bindTaskCardEvents(card) {
    const checkBtn = card.querySelector('.task-check-btn');
    if (!checkBtn) return;

    checkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCompleted = card.classList.contains('completed');

      if (!isCompleted) {
        // Complete the task: Move to Done column
        card.classList.add('completed');
        checkBtn.classList.add('checked');
        const dueText = card.querySelector('.task-due');
        if (dueText) {
          dueText.className = 'task-due done-text';
          dueText.textContent = 'Completed';
        }
        colDoneList.prepend(card);
        showToast('🎉 Task marked completed! Keep up the momentum.', 'success');
      } else {
        // Uncomplete task: Move back to In Progress
        card.classList.remove('completed');
        checkBtn.classList.remove('checked');
        const dueText = card.querySelector('.task-due');
        if (dueText) {
          dueText.className = 'task-due today';
          dueText.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Active';
        }
        colProgressList.prepend(card);
        showToast('Task moved back to In Progress', 'info');
      }
      updateCounts();
    });
  }

  // Bind initial task cards
  document.querySelectorAll('.mock-task-card').forEach(bindTaskCardEvents);

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.mock-task-card').forEach(card => {
        const title = card.querySelector('.task-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.task-desc')?.textContent.toLowerCase() || '';
        const tag = card.querySelector('.task-tag')?.textContent.toLowerCase() || '';

        if (title.includes(query) || desc.includes(query) || tag.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Mock View Switcher Buttons
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const viewMode = btn.getAttribute('data-view');
      showToast(`Switched preview to ${btn.textContent.trim()} view`, 'info');

      const mockBoard = document.getElementById('mockBoard');
      if (viewMode === 'list') {
        mockBoard.style.gridTemplateColumns = '1fr';
      } else {
        mockBoard.style.gridTemplateColumns = '';
      }
    });
  });

  // Modal controls
  function openModal() {
    if (taskModal) {
      taskModal.classList.remove('hidden');
      taskModal.setAttribute('aria-hidden', 'false');
      const titleInput = document.getElementById('modalTaskTitle');
      if (titleInput) titleInput.focus();
    }
  }

  function closeModal() {
    if (taskModal) {
      taskModal.classList.add('hidden');
      taskModal.setAttribute('aria-hidden', 'true');
      if (quickTaskForm) quickTaskForm.reset();
    }
  }

  if (addQuickTaskBtn) addQuickTaskBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (taskModal) {
    taskModal.addEventListener('click', (e) => {
      if (e.target === taskModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && taskModal && !taskModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Handle Quick Task Submission
  if (quickTaskForm) {
    quickTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('modalTaskTitle').value.trim();
      const desc = document.getElementById('modalTaskDesc').value.trim() || 'Custom user created task';
      const priority = document.getElementById('modalTaskPriority').value;
      const tag = document.getElementById('modalTaskTag').value.trim() || '#Task';

      if (!title) return;

      const priorityClass = priority === 'urgent' ? 'urgent' : priority === 'high' ? 'high' : 'normal';
      const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);

      // Create new Card element
      const newCard = document.createElement('div');
      newCard.className = 'mock-task-card';
      newCard.innerHTML = `
        <div class="task-top">
          <span class="priority-pill ${priorityClass}">${priorityLabel}</span>
          <button class="task-check-btn" title="Mark Done" aria-label="Mark task done">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
        <h4 class="task-title">${escapeHTML(title)}</h4>
        <p class="task-desc">${escapeHTML(desc)}</p>
        <div class="task-footer">
          <span class="task-tag">${escapeHTML(tag)}</span>
          <span class="task-due today"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Just added</span>
        </div>
      `;

      colTodoList.prepend(newCard);
      bindTaskCardEvents(newCard);
      updateCounts();
      closeModal();
      showToast(`Task "${title}" added to To Do!`, 'success');
    });
  }
}

/* ===================================================================
   4. ROLE SHOWCASE TABS
   =================================================================== */
function initRoleTabs() {
  const tabButtons = document.querySelectorAll('.role-tab-btn');
  const tabContents = document.querySelectorAll('.role-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      const activeContent = document.getElementById(`role${role.charAt(0).toUpperCase() + role.slice(1)}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items for clean accordion behavior
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ===================================================================
   6. CONTACT & EARLY ACCESS FORM
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccessMessage');
  const resetBtn = document.getElementById('resetFormBtn');
  const submitBtn = document.getElementById('submitFormBtn');
  const spinner = document.getElementById('btnSpinner');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const roleInput = document.getElementById('role');
    const teamSizeInput = document.getElementById('teamSize');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const roleError = document.getElementById('roleError');
    const teamSizeError = document.getElementById('teamSizeError');

    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    roleError.textContent = '';
    teamSizeError.textContent = '';

    let isValid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your full name';
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email address is required';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }

    if (!roleInput.value) {
      roleError.textContent = 'Please select your primary role';
      isValid = false;
    }

    if (!teamSizeInput.value) {
      teamSizeError.textContent = 'Please select your team size';
      isValid = false;
    }

    if (!isValid) {
      showToast('Please correct the highlighted errors in the form.', 'info');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');

    // Simulate async network request
    setTimeout(() => {
      submitBtn.disabled = false;
      if (spinner) spinner.classList.add('hidden');

      // Save submission data to localStorage
      const entry = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        role: roleInput.value,
        teamSize: teamSizeInput.value,
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('taskflow_waitlist') || '[]');
        stored.push(entry);
        localStorage.setItem('taskflow_waitlist', JSON.stringify(stored));
      } catch (err) {
        console.error('LocalStorage write error', err);
      }

      // Show success view
      form.style.display = 'none';
      if (successBox) successBox.classList.remove('hidden');

      showToast('🎉 Early access request submitted successfully!', 'success');
    }, 850);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      if (successBox) successBox.classList.add('hidden');
    });
  }
}

/* ===================================================================
   7. SCROLL SPY NAVIGATION
   =================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ===================================================================
   HELPER UTILITIES: TOAST & SANITIZATION
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
