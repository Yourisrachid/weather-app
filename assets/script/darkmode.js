export function darkMode(){

    let darkMode = localStorage.getItem('darkMode');

    const darkModeToggle = document.body.querySelector('#dark-mode-toggle');

    const activateDarkMode = () => {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkMode', 'active');
    }

    const deactivateDarkMode = () => {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkMode', null);
    }

    const toggleDarkMode = () => {
        if (darkModeToggle.checked) {
            activateDarkMode();
        } else {
            deactivateDarkMode();
        }
    }

    if (darkMode === 'active') {
        darkModeToggle.checked = true;
        activateDarkMode();
    } else {
        darkModeToggle.checked = false;
        deactivateDarkMode();
    }

    darkModeToggle.addEventListener('change', () => {
        toggleDarkMode();
    });

}