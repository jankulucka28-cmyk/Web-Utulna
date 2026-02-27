/**
 * Utulna Rychleby - Main Script
 * Handles navigation, animations, and interactive elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Toggle body scroll
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // Accordion Functionality (FAQ)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');

            // Close other open items (optional, but good UX for mobile)
            // Uncomment if you want only one open at a time
            /*
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = 0;
                }
            });
            */

            // Toggle current
            accordionItem.classList.toggle('active');

            if (accordionItem.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            } else {
                accordionContent.style.maxHeight = 0;
            }
        });
    });

    // Sticky Header Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Update Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Lightbox Functionality ---
    const lightbox = document.querySelector('.lightbox-modal');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const openLightbox = (index) => {
            currentIndex = index;
            const imgSrc = galleryItems[currentIndex].getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            lightboxImg.setAttribute('src', galleryItems[currentIndex].getAttribute('src'));
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            lightboxImg.setAttribute('src', galleryItems[currentIndex].getAttribute('src'));
        };

        // Event Listeners for images
        galleryItems.forEach((img, index) => {
            img.parentElement.addEventListener('click', () => openLightbox(index));
        });

        // Controls
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }
});
