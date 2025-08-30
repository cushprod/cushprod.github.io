document.addEventListener('DOMContentLoaded', function () {
    const preloadImages = [
        "icons/youtube.webp",
        "icons/youtube2.webp",
        "icons/soundcloud.webp",
        "icons/soundcloud2.webp",
        "icons/instagram.webp",
        "icons/instagram2.webp",
        "icons/tiktok.webp",
        "icons/tiktok2.webp",
        "icons/mail.webp",
        "icons/mail2.webp"
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
        document.querySelector('.email img').src = "icons/mail2.webp";
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
            document.querySelector('.email img').src = "icons/mail2.webp";
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');

            document.querySelector('.youtube img').src = "icons/youtube.webp";
            document.querySelector('.soundcloud img').src = "icons/soundcloud.webp";
            document.querySelector('.instagram img').src = "icons/instagram.webp";
            document.querySelector('.tiktok img').src = "icons/tiktok.webp";
            document.querySelector('.email img').src = "icons/mail.webp";
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

    // Platform Modal İşlevselliği - Güncellenmiş versiyon
    const platformModal = document.getElementById('platform-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.querySelector('.modal-close');
    const platformOptions = document.querySelectorAll('.platform-option');

    // Ses oynatıcı elementleri - İlk oynatıcı
    const audioPlayer = document.querySelector('.audio-player');
    const playPauseBtn = document.querySelector('.play-pause');
    const muteBtn = document.querySelector('.mute');
    const progressBar = document.querySelector('.audio-progress-bar');
    const progressContainer = document.querySelector('.audio-progress');
    const audioTime = document.querySelector('.audio-time');

    // İkinci oynatıcı elementleri
    const secondAudioContainer = document.querySelector('.second-audio');
    const playPauseBtn2 = document.querySelector('.play-pause2');
    const muteBtn2 = document.querySelector('.mute2');
    const progressBar2 = document.querySelector('.audio-progress-bar2');
    const progressContainer2 = document.querySelectorAll('.audio-progress')[1];
    const audioTime2 = document.querySelector('.audio-time2');

    let currentAudio = new Audio();
    let currentAudio2 = new Audio(); // İkinci ses için
    let isPlaying = false;
    let isPlaying2 = false;
    let currentBeatName = '';

    // Tüm link-item'ları seç ve modalı aç
    document.querySelectorAll('.link-item[data-beat]').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const beatName = this.getAttribute('data-beat');
            currentBeatName = beatName;
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

            // Ses dosyasını yükle
            loadAudioPreview(beatName);

            // Eğer beat "YOU" ise ikinci ses oynatıcıyı göster, değilse gizle
            if (beatName === 'YOU') {
                secondAudioContainer.style.display = 'block';
                loadSecondAudioPreview(beatName);
            } else {
                secondAudioContainer.style.display = 'none';
                // İkinci sesi durdur ve sıfırla
                currentAudio2.pause();
                resetAudioUI2();
            }

            // Modalı göster
            platformModal.classList.add('active');
        });
    });

    // İlk ses önizlemesini yükle
    function loadAudioPreview(beatName) {
        // Önceki sesi durdur ve sıfırla
        currentAudio.pause();
        currentAudio = new Audio(`sounds/${beatName}.mp3`);

        // Ses yüklendiğinde
        currentAudio.addEventListener('loadedmetadata', function () {
            resetAudioUI();
        });

        // Ses oynatma ilerlemesi
        currentAudio.addEventListener('timeupdate', function () {
            if (currentAudio.duration) {
                const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
                progressBar.style.width = `${percent}%`;

                // Kalan süreyi hesapla
                const remainingTime = currentAudio.duration - currentAudio.currentTime;
                const minutes = Math.floor(remainingTime / 60);
                const seconds = Math.floor(remainingTime % 60);

                audioTime.textContent = `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        });


        // Ses bitince
        currentAudio.addEventListener('ended', function () {
            isPlaying = false;
            updatePlayPauseIcon(playPauseBtn, isPlaying);
            progressBar.style.width = '0%';
            audioTime.textContent = '0:00';
        });
    }

    // İkinci ses önizlemesini yükle (sadece YOU için)
    function loadSecondAudioPreview(beatName) {
        currentAudio2.pause();
        currentAudio2 = new Audio(`sounds/${beatName}_part2.mp3`);

        currentAudio2.addEventListener('loadedmetadata', function () {
            resetAudioUI2();
        });

        // Ses oynatma ilerlemesi
        currentAudio2.addEventListener('timeupdate', function () {
            if (currentAudio2.duration) {
                const percent = (currentAudio2.currentTime / currentAudio2.duration) * 100;
                progressBar2.style.width = `${percent}%`;

                // Kalan süreyi hesapla
                const remainingTime = currentAudio2.duration - currentAudio2.currentTime;
                const minutes = Math.floor(remainingTime / 60);
                const seconds = Math.floor(remainingTime % 60);

                audioTime2.textContent = `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        });

        // İkinci ses oynatıcı için ended olay dinleyicisi - DÜZELTİLDİ
        currentAudio2.addEventListener('ended', function () {
            isPlaying2 = false;
            updatePlayPauseIcon(playPauseBtn2, isPlaying2);
            progressBar2.style.width = '0%';
            audioTime2.textContent = '0:00';
        });
    }

    // İlk ses oynatma arayüzünü sıfırla
    function resetAudioUI() {
        isPlaying = false;
        updatePlayPauseIcon(playPauseBtn, isPlaying);
        progressBar.style.width = '0%';
        audioTime.textContent = '0:00';
    }

    // İkinci ses oynatma arayüzünü sıfırla
    function resetAudioUI2() {
        isPlaying2 = false;
        updatePlayPauseIcon(playPauseBtn2, isPlaying2);
        progressBar2.style.width = '0%';
        audioTime2.textContent = '0:00';
    }

    // Oynat/Duraklat butonunu güncelle (genel fonksiyon)
    function updatePlayPauseIcon(button, isPlaying) {
        const icon = button.querySelector('i');
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }

    // Ses düzeyi butonunu güncelle (genel fonksiyon)
    function updateMuteIcon(button, isMuted) {
        const icon = button.querySelector('i');
        if (isMuted) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
        }
    }

    // İlk oynatıcı için olay dinleyicileri
    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            currentAudio.pause();
        } else {
            currentAudio.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon(playPauseBtn, isPlaying);
    });

    muteBtn.addEventListener('click', function () {
        currentAudio.muted = !currentAudio.muted;
        updateMuteIcon(muteBtn, currentAudio.muted);
    });

    progressContainer.addEventListener('click', function (e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = currentAudio.duration;
        currentAudio.currentTime = (clickX / width) * duration;
    });

    // İkinci oynatıcı için olay dinleyicileri
    playPauseBtn2.addEventListener('click', function () {
        if (isPlaying2) {
            currentAudio2.pause();
        } else {
            currentAudio2.play();
        }
        isPlaying2 = !isPlaying2;
        updatePlayPauseIcon(playPauseBtn2, isPlaying2);
    });

    muteBtn2.addEventListener('click', function () {
        currentAudio2.muted = !currentAudio2.muted;
        updateMuteIcon(muteBtn2, currentAudio2.muted);
    });

    progressContainer2.addEventListener('click', function (e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = currentAudio2.duration;
        currentAudio2.currentTime = (clickX / width) * duration;
    });

    // Modalı kapat
    modalClose.addEventListener('click', function () {
        platformModal.classList.remove('active');
        currentAudio.pause();
        currentAudio2.pause();
        resetAudioUI();
        resetAudioUI2();
    });

    // Modal dışına tıklanırsa kapat
    platformModal.addEventListener('click', function (e) {
        if (e.target === platformModal) {
            platformModal.classList.remove('active');
            currentAudio.pause();
            currentAudio2.pause();
            resetAudioUI();
            resetAudioUI2();
        }
    });

    // Platform seçeneklerine tıklandığında yeni sekmede aç
    platformOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            // Yönlendirme işlemi href üzerinden yapılacak
            // Ses oynatmayı durdur
            currentAudio.pause();
            currentAudio2.pause();
            resetAudioUI();
            resetAudioUI2();
        });
    });

    // Modalı kapat
    modalClose.addEventListener('click', function () {
        platformModal.classList.remove('active');
    });

    // Modal dışına tıklanırsa kapat
    platformModal.addEventListener('click', function (e) {
        if (e.target === platformModal) {
            platformModal.classList.remove('active');
        }
    });

    // Platform seçeneklerine tıklandığında yeni sekmede aç
    platformOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            // Yönlendirme işlemi href üzerinden yapılacak
            // Burada ekstra bir şey yapmaya gerek yok
        });
    });
});

// Sayfa yüklendikten sonra çalışacak kod
window.addEventListener('load', function () {
    setTimeout(function () {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainContent = document.getElementById('main-content');

        // Welcome ekranını fade out yap
        welcomeScreen.style.opacity = '0';

        // Ana içeriği fade in yap
        mainContent.classList.add('show');

        // Welcome ekranını tamamen kaldır
        setTimeout(function () {
            welcomeScreen.style.display = 'none';
        }, 1000); // Geçiş süresi kadar bekle (1.5 saniye)
    }, 100); // Logo gösterim süresi (2 saniye)

});

// optimized-tracker.js
class CountryTracker {
    constructor() {
        this.config = {
            userCountry: null,
            trackedClicks: [],
            lastUpdated: null
        };
        this.workingAPIs = [
            'https://api.ip.sb/geoip',
            'https://api.country.is/',
            'https://ipapi.co/json/'
        ];
        this.init();
    }

    async init() {
        this.loadConfig();

        if (!this.config.userCountry) {
            this.config.userCountry = await this.fetchCountry();
            this.saveConfig();
        }

        this.setupTracking();
        console.log('CountryTracker başlatıldı. Ülke:', this.config.userCountry);
    }

    async fetchCountry() {
        // Çalışan API'leri sırayla dene
        for (const api of this.workingAPIs) {
            try {
                console.log('Trying API:', api);
                const response = await fetch(api, {
                    signal: AbortSignal.timeout(3000)
                });

                if (response.ok) {
                    const data = await response.json();
                    const country = data.countryCode || data.country_code || data.country;

                    if (country && country !== 'undefined') {
                        console.log('✓ Ülke bulundu:', country, 'API:', api);
                        return country.toUpperCase();
                    }
                }
            } catch (error) {
                console.log('✗ API hatası:', api, error.message);
                continue;
            }
        }

        console.log('⚠ Tüm API denemeleri başarısız, UNKNOWN olarak ayarlandı');
        return 'UNKNOWN';
    }

    setupTracking() {
        document.addEventListener('click', (e) => {
            this.handleClick(e);
        }, true);
    }

    handleClick(event) {
        const link = event.target.closest('a');
        if (!link || !link.href || link.href.startsWith('javascript:')) return;

        const clickData = {
            url: link.href,
            timestamp: new Date().toISOString(),
            country: this.config.userCountry,
            linkText: link.textContent.trim().substring(0, 30),
            domain: this.extractDomain(link.href),
            isExternal: this.isExternalLink(link.href)
        };

        this.config.trackedClicks.push(clickData);
        this.config.lastUpdated = new Date().toISOString();
        this.saveConfig();

        console.log('📊 Link tıklandı:', clickData);
    }

    isExternalLink(url) {
        try {
            return new URL(url).hostname !== window.location.hostname;
        } catch {
            return false;
        }
    }

    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    saveConfig() {
        try {
            localStorage.setItem('countryTracker', JSON.stringify(this.config));
        } catch (error) {
            console.log('💾 LocalStorage hatası:', error);
        }
    }

    loadConfig() {
        try {
            const saved = localStorage.getItem('countryTracker');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.config = {
                    ...this.config,
                    ...parsed,
                    trackedClicks: parsed.trackedClicks || []
                };
            }
        } catch (error) {
            console.log('📂 Config yükleme hatası:', error);
        }
    }

    // Verileri görüntüleme
    showData() {
        console.log('📋 Toplam tıklama:', this.config.trackedClicks.length);
        console.table(this.config.trackedClicks);
        return this.config.trackedClicks;
    }

    // Verileri indirme
    exportData() {
        const data = {
            generated: new Date().toISOString(),
            totalClicks: this.config.trackedClicks.length,
            userCountry: this.config.userCountry,
            clicks: this.config.trackedClicks
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `click-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
        return data;
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    window.countryTracker = new CountryTracker();
});
