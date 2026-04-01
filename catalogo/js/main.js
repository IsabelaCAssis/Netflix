import { categories } from './data.js';
import { createCarousel } from '../components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');

    if (nomePerfil && imagemPerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');
        
        if (kidsLink) kidsLink.textContent = nomePerfil;
        if (profileIcon) profileIcon.src = imagemPerfil;
    }

    const container = document.getElementById('main-content');
    
    if (container) {
        categories.forEach(category => {
            const carousel = createCarousel(category);
            container.appendChild(carousel);
        });
    }

    // Notification Dropdown Toggle
    const navNotification = document.getElementById('nav-notification');
    const notificationDropdown = document.getElementById('notification-dropdown');

    if (navNotification && notificationDropdown) {
        navNotification.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (notificationDropdown.classList.contains('active') && !navNotification.contains(e.target)) {
                notificationDropdown.classList.remove('active');
            }
        });
    }
});