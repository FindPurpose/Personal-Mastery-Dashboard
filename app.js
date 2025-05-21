// Backend login removed; initializing dashboard only
document.getElementById('dashboard-screen').classList.remove('hidden');
document.getElementById('auth-screen')?.classList.add('hidden');

// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme handling
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Set initial theme
    if (localStorage.getItem('color-theme') === 'dark' || 
        (!localStorage.getItem('color-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
    }

    // Toggle theme
    themeToggleBtn.addEventListener('click', function() {
        // Toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');
        
        // Toggle theme
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });

    // Authentication handling
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const authError = document.getElementById('auth-error');
    const usernameDisplay = document.getElementById('username');

    // Tab switching
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('border-blue-500', 'text-blue-500');
        loginTab.classList.remove('border-gray-200', 'text-gray-500', 'dark:border-gray-700', 'dark:text-gray-400');
        registerTab.classList.remove('border-blue-500', 'text-blue-500');
        registerTab.classList.add('border-gray-200', 'text-gray-500', 'dark:border-gray-700', 'dark:text-gray-400');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('border-blue-500', 'text-blue-500');
        registerTab.classList.remove('border-gray-200', 'text-gray-500', 'dark:border-gray-700', 'dark:text-gray-400');
        loginTab.classList.remove('border-blue-500', 'text-blue-500');
        loginTab.classList.add('border-gray-200', 'text-gray-500', 'dark:border-gray-700', 'dark:text-gray-400');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // API call to login
        fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Login successful') {
                // Store user info
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('username', data.username);
                
                // Update UI
                usernameDisplay.textContent = data.username;
                
                // Switch to dashboard
                authScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                
                // Load dashboard data
                loadDashboardData();
            } else {
                authError.textContent = data.message;
                authError.classList.remove('hidden');
            }
        })
        .catch(error => {
            authError.textContent = 'An error occurred. Please try again.';
            authError.classList.remove('hidden');
            console.error('Error:', error);
        });
    });

    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            authError.textContent = 'Passwords do not match';
            authError.classList.remove('hidden');
            return;
        }
        
        // API call to register
        fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User registered successfully') {
                // Switch to login tab
                loginTab.click();
                authError.classList.add('hidden');
                // Clear register form
                registerForm.reset();
                // Show success message
                authError.textContent = 'Registration successful! Please log in.';
                authError.classList.remove('hidden');
                authError.classList.remove('text-red-500');
                authError.classList.add('text-green-500');
            } else {
                authError.textContent = data.message;
                authError.classList.remove('hidden');
                authError.classList.add('text-red-500');
                authError.classList.remove('text-green-500');
            }
        })
        .catch(error => {
            authError.textContent = 'An error occurred. Please try again.';
            authError.classList.remove('hidden');
            console.error('Error:', error);
        });
    });

    // Check if user is already logged in
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username');
    
    if (storedUserId && storedUsername) {
        // Update UI
        usernameDisplay.textContent = storedUsername;
        
        // Switch to dashboard
        authScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        
        // Load dashboard data
        loadDashboardData();
    }

    // Logout handling
    const logoutLink = document.getElementById('logout-link');
    
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // API call to logout
        fetch('/api/user/logout', {
            method: 'POST',
        })
        .then(() => {
            // Clear local storage
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            
            // Switch to auth screen
            dashboardScreen.classList.add('hidden');
            authScreen.classList.remove('hidden');
            
            // Clear forms
            loginForm.reset();
            registerForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // User dropdown toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    userMenuButton.addEventListener('click', function() {
        userDropdown.classList.toggle('hidden');
    });

    // Mode dropdown toggle
    const modeSelectorBtn = document.getElementById('mode-selector-btn');
    const modeDropdown = document.getElementById('mode-dropdown');
    
    modeSelectorBtn.addEventListener('click', function() {
        modeDropdown.classList.toggle('hidden');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.add('hidden');
        }
        
        if (!modeSelectorBtn.contains(e.target) && !modeDropdown.contains(e.target)) {
            modeDropdown.classList.add('hidden');
        }
    });

    // Mode selection
    const modeOptions = document.querySelectorAll('.mode-option');
    const currentMode = document.getElementById('current-mode');
    
    modeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = this.getAttribute('data-mode');
            currentMode.textContent = this.textContent;
            modeDropdown.classList.add('hidden');
            
            // API call to activate mode
            activateMode(mode);
        });
    });

    // Module navigation
    const studyNav = document.getElementById('study-nav');
    const mindsetNav = document.getElementById('mindset-nav');
    const fitnessNav = document.getElementById('fitness-nav');
    const creativeNav = document.getElementById('creative-nav');
    
    const studyModule = document.getElementById('study-module');
    const mindsetModule = document.getElementById('mindset-module');
    const fitnessModule = document.getElementById('fitness-module');
    const creativeModule = document.getElementById('creative-module');
    
    const moduleScreens = document.querySelectorAll('.module-screen');
    
    studyNav.addEventListener('click', function() {
        hideAllModules();
        studyModule.classList.remove('hidden');
        loadStudyData();
    });
    
    mindsetNav.addEventListener('click', function() {
        hideAllModules();
        mindsetModule.classList.remove('hidden');
        loadMindsetData();
    });
    
    fitnessNav.addEventListener('click', function() {
        hideAllModules();
        fitnessModule.classList.remove('hidden');
        loadFitnessData();
    });
    
    creativeNav.addEventListener('click', function() {
        hideAllModules();
        creativeModule.classList.remove('hidden');
        loadCreativeData();
    });
    
    function hideAllModules() {
        moduleScreens.forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    // Modal handling
    const modalBackdrop = document.getElementById('modal-backdrop');
    const addStudyModal = document.getElementById('add-study-modal');
    const addHabitModal = document.getElementById('add-habit-modal');
    const addJournalModal = document.getElementById('add-journal-modal');
    const addWorkoutModal = document.getElementById('add-workout-modal');
    const addProjectModal = document.getElementById('add-project-modal');
    
    const addStudyBtn = document.getElementById('add-study-btn');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const addJournalBtn = document.getElementById('add-journal-btn');
    const addWorkoutBtn = document.getElementById('add-workout-btn');
    const addProjectBtn = document.getElementById('add-project-btn');
    
    const modalCancelBtns = document.querySelectorAll('.modal-cancel');
    
    // Show modals
    addStudyBtn.addEventListener('click', function() {
        showModal(addStudyModal);
    });
    
    addHabitBtn.addEventListener('click', function() {
        showModal(addHabitModal);
    });
    
    addJournalBtn.addEventListener('click', function() {
        showModal(addJournalModal);
    });
    
    addWorkoutBtn.addEventListener('click', function() {
        showModal(addWorkoutModal);
    });
    
    addProjectBtn.addEventListener('click', function() {
        showModal(addProjectModal);
    });
    
    // Hide modals
    modalCancelBtns.forEach(btn => {
        btn.addEventListener('click', hideAllModals);
    });
    
    modalBackdrop.addEventListener('click', hideAllModals);
    
    function showModal(modal) {
        modalBackdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
    }
    
    function hideAllModals() {
        modalBackdrop.classList.add('hidden');
        addStudyModal.classList.add('hidden');
        addHabitModal.classList.add('hidden');
        addJournalModal.classList.add('hidden');
        addWorkoutModal.classList.add('hidden');
        addProjectModal.classList.add('hidden');
    }

    // Form submissions
    const studyForm = document.getElementById('study-form');
    const habitForm = document.getElementById('habit-form');
    const journalForm = document.getElementById('journal-form');
    const workoutForm = document.getElementById('workout-form');
    const projectForm = document.getElementById('project-form');
    
    studyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('study-title').value;
        const description = document.getElementById('study-description').value;
        const scheduledDate = document.getElementById('study-date').value;
        const recallStatus = document.getElementById('study-recall').value;
        const tags = document.getElementById('study-tags').value;
        
        // API call to create study entry
        fetch('/api/study/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                scheduled_date: scheduledDate,
                recall_status: recallStatus,
                tags
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Study entry created successfully') {
                // Hide modal and reset form
                hideAllModals();
                studyForm.reset();
                
                // Reload study data
                loadStudyData();
                
                // Reload dashboard data
                loadDashboardData();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    habitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('habit-title').value;
        const description = document.getElementById('habit-description').value;
        
        // API call to create habit
        fetch('/api/mindset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entry_type: 'habit',
                title,
                content: description,
                completed: false
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Mindset entry created successfully') {
                // Hide modal and reset form
                hideAllModals();
                habitForm.reset();
                
                // Reload mindset data
                loadMindsetData();
                
                // Reload dashboard data
                loadDashboardData();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    journalForm.addEventListener('submit', function(e) {
        e.preventD
(Content truncated due to size limit. Use line ranges to read in chunks)