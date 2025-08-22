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

                // Zaman göstergesini güncelle
                const currentMinutes = Math.floor(currentAudio.currentTime / 60);
                const currentSeconds = Math.floor(currentAudio.currentTime % 60);
                audioTime.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
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

        // İkinci ses oynatıcı için timeupdate olay dinleyicisi - DÜZELTİLDİ
        currentAudio2.addEventListener('timeupdate', function () {
            if (currentAudio2.duration) {
                const percent = (currentAudio2.currentTime / currentAudio2.duration) * 100;
                progressBar2.style.width = `${percent}%`;

                const currentMinutes = Math.floor(currentAudio2.currentTime / 60);
                const currentSeconds = Math.floor(currentAudio2.currentTime % 60);
                audioTime2.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
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

// SHA-256 hash fonksiyonu
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Admin şifresinin hash değeri (32232652003)
const ADMIN_PASSWORD_HASH = "fd6ed2d9d5e9b7a0f38b3c5a8a84c0b2b2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2c2e2";

// Tıklama takip fonksiyonları
function initClickTracking() {
    // Tüm linkleri seç
    const allLinks = document.querySelectorAll('a[href], .link-item, .social-icon, .platform-option');

    allLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Admin paneli linkleri hariç tut
            if (this.id === 'admin-logout' || this.closest('#admin-panel')) return;

            let url = this.href;
            let linkText = '';

            // Özel beat linkleri için
            if (this.classList.contains('link-item') && this.getAttribute('data-beat')) {
                linkText = this.querySelector('.link-text').textContent;
            } else if (this.classList.contains('social-icon')) {
                linkText = this.classList[1]; // youtube, instagram, vs.
            } else if (this.classList.contains('platform-option')) {
                linkText = this.querySelector('span').textContent;
                url = this.href;
            } else {
                linkText = this.textContent.trim() || url;
            }

            // Tıklama verisini kaydet
            saveClickData(url, linkText);
        });
    });
}

function saveClickData(url, linkText) {
    // Mevcut verileri al
    let clickData = JSON.parse(localStorage.getItem('clickData')) || [];

    // Aynı URL için kayıt var mı kontrol et
    const existingIndex = clickData.findIndex(item => item.url === url);

    if (existingIndex !== -1) {
        // Kayıt varsa sayacı artır
        clickData[existingIndex].count++;
    } else {
        // Yeni kayıt oluştur
        clickData.push({
            url: url,
            text: linkText,
            count: 1
        });
    }

    // Veriyi localStorage'a kaydet
    localStorage.setItem('clickData', JSON.stringify(clickData));
}

function loadClickData() {
    const clickData = JSON.parse(localStorage.getItem('clickData')) || [];
    const tableBody = document.getElementById('stats-table-body');

    // Tabloyu temizle
    tableBody.innerHTML = '';

    // Verileri tabloya ekle
    clickData.forEach(item => {
        const row = document.createElement('tr');

        const textCell = document.createElement('td');
        textCell.textContent = item.text;

        const urlCell = document.createElement('td');
        urlCell.textContent = item.url;

        const countCell = document.createElement('td');
        countCell.textContent = item.count;

        row.appendChild(textCell);
        row.appendChild(urlCell);
        row.appendChild(countCell);

        tableBody.appendChild(row);
    });
}

// Admin paneli yönetim fonksiyonları
function checkAdminPath() {
    if (window.location.pathname === '/administrator') {
        // Ana içeriği gizle
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.footer').style.display = 'none';

        // Admin giriş ekranını göster
        document.getElementById('admin-login-container').style.display = 'block';

        // Eğer zaten giriş yapılmışsa admin panelini göster
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            showAdminPanel();
        }
    }
}

function showAdminPanel() {
    document.getElementById('admin-login-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';

    // Tıklama verilerini yükle
    loadClickData();
}

function hideAdminPanel() {
    document.getElementById('admin-panel').style.display = 'none';
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('.footer').style.display = 'block';
    window.history.replaceState({}, document.title, window.location.pathname.replace('/administrator', ''));
}

// DOM yüklendikten sonra çalışacak kod
document.addEventListener('DOMContentLoaded', function () {
    // Tıklama takibini başlat
    initClickTracking();

    // Admin yolunu kontrol et
    checkAdminPath();

    // Admin giriş formu
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('admin-login-error');

            // Kullanıcı adı kontrolü
            if (username !== 'administrator') {
                errorDiv.textContent = 'Geçersiz kullanıcı adı!';
                errorDiv.style.display = 'block';
                return;
            }

            // Şifreyi hashle ve karşılaştır
            const hashedPassword = await sha256(password);

            if (hashedPassword === ADMIN_PASSWORD_HASH) {
                // Giriş başarılı
                errorDiv.style.display = 'none';
                sessionStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            } else {
                // Giriş başarısız
                errorDiv.textContent = 'Geçersiz şifre!';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Admin çıkış butonu
    const adminLogoutBtn = document.getElementById('admin-logout');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('adminLoggedIn');
            hideAdminPanel();
        });
    }
});

// script.js dosyasına ekleyin
let adminClickCount = 0;
document.querySelector('.profile-image').addEventListener('click', function () {
    adminClickCount++;

    if (adminClickCount >= 5) {
        window.location.href = '/administrator';
        adminClickCount = 0;
    }

    // 3 saniye içinde tekrar tıklanmazsa sayacı sıfırla
    clearTimeout(adminClickTimeout);
    adminClickTimeout = setTimeout(() => {
        adminClickCount = 0;
    }, 3000);
});
