// Rastgele profil fotoğrafı fonksiyonu
function setRandomProfilePicture() {
    // Toplam profil fotoğrafı sayısını buradan ayarlayın
    const totalProfilePictures = 3;

    // Önceden yüklenmiş fotoğrafları saklama
    if (!window.preloadedProfilePictures) {
        window.preloadedProfilePictures = [];

        // Tüm fotoğrafları önceden yükle
        for (let i = 1; i <= totalProfilePictures; i++) {
            const img = new Image();
            const imgSrc = i === 1 ? 'img/profile-picture.webp' : `img/profile-picture${i}.webp`;
            img.src = imgSrc;
            window.preloadedProfilePictures.push(img);
        }
    }

    // Rastgele bir indeks seç (1'den başlayarak)
    const randomIndex = Math.floor(Math.random() * totalProfilePictures) + 1;

    // Fotoğraf yolunu oluştur
    const imgPath = randomIndex === 1 ?
        'img/profile-picture.webp' :
        `img/profile-picture${randomIndex}.webp`;

    // Fotoğrafı fade efekti ile değiştir
    fadeChangeProfilePicture(imgPath);

    // Bir sonraki fotoğrafı önceden yükle
    preloadNextProfilePicture(totalProfilePictures, randomIndex);

    // Mevcut indeksi sakla
    window.currentProfileIndex = randomIndex;
}

// Bir sonraki fotoğrafı önceden yükle
function preloadNextProfilePicture(totalPictures, currentIndex) {
    let nextIndex = currentIndex % totalPictures + 1;
    const nextImgPath = nextIndex === 1 ?
        'img/profile-picture.webp' :
        `img/profile-picture${nextIndex}.webp`;

    const img = new Image();
    img.src = nextImgPath;
}

// Sıradaki profil fotoğrafına geç (fade efekti ile)
function nextProfilePicture() {
    // Toplam profil fotoğrafı sayısını buradan ayarlayın
    const totalProfilePictures = 5;

    // Mevcut indeksi al veya 1'den başla
    let currentIndex = window.currentProfileIndex || 1;

    // Sıradaki indeksi hesapla
    let nextIndex = currentIndex % totalProfilePictures + 1;

    // Fotoğraf yolunu oluştur
    const imgPath = nextIndex === 1 ?
        'img/profile-picture.webp' :
        `img/profile-picture${nextIndex}.webp`;

    // Fotoğrafı fade efekti ile değiştir
    fadeChangeProfilePicture(imgPath);

    // Bir sonraki fotoğrafı önceden yükle
    let nextNextIndex = nextIndex % totalProfilePictures + 1;
    const nextImgPath = nextNextIndex === 1 ?
        'img/profile-picture.webp' :
        `img/profile-picture${nextNextIndex}.webp`;

    const img = new Image();
    img.src = nextImgPath;

    // Mevcut indeksi güncelle
    window.currentProfileIndex = nextIndex;
}

// Fade efekti ile profil fotoğrafı değiştirme
function fadeChangeProfilePicture(newImagePath) {
    const profileImg = document.getElementById('profile-picture');
    const profileContainer = document.querySelector('.profile-image');

    if (!profileImg) return;

    // Yeni bir resim elementi oluştur
    const newImg = document.createElement('img');
    newImg.src = newImagePath;
    newImg.alt = "@cushprod Profil Fotoğrafı";
    newImg.id = "profile-picture";
    newImg.style.position = "absolute";
    newImg.style.top = "0";
    newImg.style.left = "0";
    newImg.style.width = "100%";
    newImg.style.height = "100%";
    newImg.style.opacity = "0";
    newImg.style.transition = "opacity 0.8s ease";
    newImg.style.objectFit = "cover";

    // Mevcut resmi container'a ekle
    profileContainer.style.position = "relative";
    profileContainer.appendChild(newImg);

    // Yeni resmi fade-in yap
    setTimeout(() => {
        newImg.style.opacity = "1";
    }, 50);

    // Eski resmi fade-out yap ve kaldır
    profileImg.style.transition = "opacity 0.8s ease";
    profileImg.style.opacity = "0";

    // Eski resmi temizle
    setTimeout(() => {
        if (profileImg.parentNode === profileContainer) {
            profileContainer.removeChild(profileImg);
        }

        // Yeni resmin pozisyonunu düzelt
        newImg.style.position = "";
    }, 800);
}


document.addEventListener('DOMContentLoaded', function () {
    setRandomProfilePicture();
    setInterval(nextProfilePicture, 5000);
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

    // ... existing code until the end of DOMContentLoaded event listener ...

    // Add this function to create beat elements
    function createBeatElement(beat) {
        const element = document.createElement('a');
        element.target = '_blank';
        element.className = 'link-item';
        element.setAttribute('data-beat', beat.title);
        element.setAttribute('data-youtube', beat.platforms.youtube || '');
        element.setAttribute('data-beatstars', beat.platforms.beatstars || '');
        element.setAttribute('data-airbit', beat.platforms.airbit || '');
        element.setAttribute('data-traktrain', beat.platforms.traktrain || '');

        element.innerHTML = `
            <div class="link-icon">
                <img src="${beat.image}" alt="${beat.title}">
            </div>
            <div class="link-text">${beat.title}</div>
            <div class="link-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        `;

        return element;
    }

    // Add this function to load and process beats
    async function loadBeats() {
        try {
            const response = await fetch('beats.json');
            const data = await response.json();
            
            if (!data.beats) {
                console.error('No beats found in JSON data');
                return;
            }

            // Find and process new beat
            const newBeat = data.beats.find(beat => beat.isNew);
            if (newBeat) {
                const newDropSection = document.querySelector('.link-group');
                const existingBeat = newDropSection.querySelector('.link-item');
                if (existingBeat) {
                    newDropSection.removeChild(existingBeat);
                }
                newDropSection.appendChild(createBeatElement(newBeat));
            }

            // Process other beats
            const otherBeats = data.beats.filter(beat => !beat.isNew);
            const beatList = document.getElementById('beat-list');
            
            // Clear existing beats but preserve the group title
            const groupTitle = beatList.querySelector('.group-title');
            beatList.innerHTML = '';
            if (groupTitle) {
                beatList.appendChild(groupTitle);
            }
            
            otherBeats.forEach(beat => {
                beatList.appendChild(createBeatElement(beat));
            });

            // Reattach event listeners to the new beat elements
            reattachBeatEventListeners();

        } catch (error) {
            console.error('Error loading beats:', error);
        }
    }

    // Function to reattach event listeners to beat elements
    function reattachBeatEventListeners() {
        const beatItems = document.querySelectorAll('.link-item[data-beat]');
        beatItems.forEach(item => {
            // Remove any existing listeners to prevent duplicates
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add the click event listener
            newItem.addEventListener('click', function(e) {
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

            // Add hover effects
            newItem.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.03)';
            });
            newItem.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Call the function to load beats
    loadBeats();

// ... rest of the existing code ...
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

// Apple Music Modal İşlevselliği
const appleMusicModal = document.getElementById('apple-music-modal');
const appleMusicLink = document.querySelector('.apple-music-link');
const appleMusicModalClose = appleMusicModal.querySelector('.modal-close');

// Apple Music linkine tıklama
appleMusicLink.addEventListener('click', function (e) {
    e.preventDefault();
    const musicUrl = this.getAttribute('data-apple-music-url');

    // Iframe src'sini güncelle
    const iframe = appleMusicModal.querySelector('iframe');
    iframe.src = `https://embed.music.apple.com/tr/playlist/bi-bira-bi-soju/pl.u-qxylEYDT3ByJYdV?l=tr`;

    // Link'i güncelle
    const directLink = appleMusicModal.querySelector('.link-to-apple-music');
    directLink.href = musicUrl;

    // Modalı göster
    appleMusicModal.classList.add('active');
});

// Apple Music modalını kapat
appleMusicModalClose.addEventListener('click', function () {
    appleMusicModal.classList.remove('active');
});

// Apple Music modal dışına tıklanırsa kapat
appleMusicModal.addEventListener('click', function (e) {
    if (e.target === appleMusicModal) {
        appleMusicModal.classList.remove('active');
    }
});

