document.addEventListener('DOMContentLoaded', function () {
    const preloadImages = [
        "icons/youtube.webp",
        "icons/youtube2.webp",
        "icons/soundcloud.webp",
        "icons/soundcloud2.webp",
        "icons/instagram.webp",
        "icons/instagram2.webp",
        "icons/tiktok.webp",
        "icons/tiktok2.webp"
    ];
    
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');

        document.querySelector('.youtube img').src = "icons/youtube2.webp";
        document.querySelector('.soundcloud img').src = "icons/soundcloud2.webp";
        document.querySelector('.instagram img').src = "icons/instagram2.webp";
        document.querySelector('.tiktok img').src = "icons/tiktok2.webp";
    }

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('light-theme');

        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');

            document.querySelector('.youtube img').src = "icons/youtube2.webp";
            document.querySelector('.soundcloud img').src = "icons/soundcloud2.webp";
            document.querySelector('.instagram img').src = "icons/instagram2.webp";
            document.querySelector('.tiktok img').src = "icons/tiktok2.webp";
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');

            document.querySelector('.youtube img').src = "icons/youtube.webp";
            document.querySelector('.soundcloud img').src = "icons/soundcloud.webp";
            document.querySelector('.instagram img').src = "icons/instagram.webp";
            document.querySelector('.tiktok img').src = "icons/tiktok.webp";
        }
    });

    const linkItems = document.querySelectorAll('.link-item');
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.03)';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
