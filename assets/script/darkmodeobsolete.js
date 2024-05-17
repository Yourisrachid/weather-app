export function darkMode() {
    const darkModeToggle = document.body.querySelector('#dark-mode-toggle');

    const activateDarkMode = () => {
        document.body.classList.add('darkmode');
        darkModeToggle.textContent = "Disable Dark Mode";
        localStorage.setItem('darkMode', 'active');
    }

    const deactivateDarkMode = () => {
        document.body.classList.remove('darkmode');
        darkModeToggle.textContent = "Enable Dark Mode";
        localStorage.setItem('darkMode', null);
    }

    const toggleDarkMode = () => {
        if (document.body.classList.contains('darkmode')) {
            deactivateDarkMode();
        } else {
            activateDarkMode();
        }
    }

    let darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'active') {
        activateDarkMode();
    } else {
        deactivateDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        toggleDarkMode();
    });
}
