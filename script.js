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

    // Platform Modal İşlevselliği
    const platformModal = document.getElementById('platform-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.querySelector('.modal-close');
    const platformOptions = document.querySelectorAll('.platform-option');
    
    // Tüm link-item'ları seç ve modalı aç
    document.querySelectorAll('.link-item[data-beat]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const beatName = this.getAttribute('data-beat');
            modalTitle.textContent = `${beatName}`;
            
            // Platform linklerini al
            const youtubeLink = this.getAttribute('data-youtube');
            const beatstarsLink = this.getAttribute('data-beatstars');
            const airbitLink = this.getAttribute('data-airbit');
            const traktrainLink = this.getAttribute('data-traktrain');
            
            // Platform seçeneklerine linkleri ata
            document.querySelector('.platform-option[data-platform="youtube"]').href = youtubeLink;
            document.querySelector('.platform-option[data-platform="beatstars"]').href = beatstarsLink;
            document.querySelector('.platform-option[data-platform="airbit"]').href = airbitLink;
            document.querySelector('.platform-option[data-platform="traktrain"]').href = traktrainLink;
            
            // Modalı göster
            platformModal.classList.add('active');
        });
    });
    
    // Modalı kapat
    modalClose.addEventListener('click', function() {
        platformModal.classList.remove('active');
    });
    
    // Modal dışına tıklanırsa kapat
    platformModal.addEventListener('click', function(e) {
        if (e.target === platformModal) {
            platformModal.classList.remove('active');
        }
    });
    
    // Platform seçeneklerine tıklandığında yeni sekmede aç
    platformOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            // Yönlendirme işlemi href üzerinden yapılacak
            // Burada ekstra bir şey yapmaya gerek yok
        });
    });
});
