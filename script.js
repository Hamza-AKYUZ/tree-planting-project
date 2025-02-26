/**
 * NeoForest 2025 - Ana JavaScript Dosyası
 * Bu dosya, Dershanem sayfasındaki zamanlayıcı ve orman fonksiyonlarını içerir
 */

// DOM elementlerini seçelim
const timeOptions = document.querySelectorAll('.time-option');
const timerDisplay = document.querySelector('.timer-display');
const timerStatus = document.querySelector('.timer-status');
const timerCircle = document.querySelector('.timer-circle');
const timerProgressFill = document.querySelector('.timer-progress-fill');
const forestGrid = document.querySelector('.forest-grid');
const treeCountElement = document.getElementById('treeCount');
const totalTimeElement = document.getElementById('totalTime');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const confettiContainer = document.getElementById('confetti-container');

// Zamanlayıcı değişkenleri
let timer;
let timeLeft = 25 * 60; // 25 dakika (saniye cinsinden)
let totalTime = 0;
let isRunning = false;
let selectedTime = 25; // Varsayılan: 25 dakika
let treeCount = 0;
let treeTypes = ['tree-normal', 'tree-autumn', 'tree-spring', 'tree-winter'];

// Sayfa yüklendiğinde verileri yükle
document.addEventListener('DOMContentLoaded', () => {
    // AOS Animasyon kütüphanesini başlat
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    // LocalStorage'dan verileri yükle
    loadData();

    // Sayfa geçiş efektini kaldır
    setTimeout(() => {
        document.body.classList.remove('page-transitioning');
    }, 300);

    // Zamanlayıcı görünümünü güncelle
    updateTimerDisplay();
    updateTimerProgress();

    // Ağaçları yükle
    renderTrees();

    // Kart parıltı efektlerini ekle
    addCardGlowEffects();
});

/**
 * LocalStorage'dan verileri yükle
 */
function loadData() {
    const savedTreeCount = localStorage.getItem('treeCount');
    const savedTotalTime = localStorage.getItem('totalTime');

    if (savedTreeCount) {
        treeCount = parseInt(savedTreeCount);
        treeCountElement.textContent = treeCount;
    }

    if (savedTotalTime) {
        totalTime = parseInt(savedTotalTime);
        totalTimeElement.textContent = totalTime;
    }
}

/**
 * Verileri LocalStorage'a kaydet
 */
function saveData() {
    localStorage.setItem('treeCount', treeCount);
    localStorage.setItem('totalTime', totalTime);
}

/**
 * Zamanlayıcıyı başlat/durdur
 */
function toggleTimer() {
    if (isRunning) {
        // Zamanlayıcıyı durdur
        clearInterval(timer);
        isRunning = false;
        timerStatus.textContent = 'Devam etmek için tıklayın';
        timerCircle.classList.remove('running');
    } else {
        // Zamanlayıcıyı başlat
        isRunning = true;
        timerStatus.textContent = 'Çalışıyor...';
        timerCircle.classList.add('running');

        timer = setInterval(() => {
            timeLeft--;

            if (timeLeft <= 0) {
                // Süre doldu
                clearInterval(timer);
                isRunning = false;

                // Pomodoro tamamlandıysa ağaç dik
                if (selectedTime === 25 || selectedTime === 45) {
                    plantTree();
                    totalTime += selectedTime;
                    totalTimeElement.textContent = totalTime;
                    saveData();
                    createConfetti();
                    showNotification('Tebrikler! Çalışma süresi tamamlandı ve bir ağaç dikildi.', 'success');
                } else {
                    showNotification('Mola süresi tamamlandı!', 'success');
                }

                // Zamanlayıcıyı sıfırla
                timeLeft = selectedTime * 60;
                timerStatus.textContent = 'Başlamak için tıklayın';
                timerCircle.classList.remove('running');

                // Zamanlayıcı görünümünü güncelle
                updateTimerDisplay();
                updateTimerProgress();
            } else {
                // Zamanlayıcı görünümünü güncelle
                updateTimerDisplay();
                updateTimerProgress();
            }
        }, 1000);
    }
}

/**
 * Zamanlayıcı ekranını güncelle
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Zamanlayıcı ilerleme çemberini güncelle
 */
function updateTimerProgress() {
    const totalSeconds = selectedTime * 60;
    const progress = (timeLeft / totalSeconds) * 100;
    const circumference = 2 * Math.PI * 45; // r=45 olan çemberin çevresi

    const offset = circumference - (progress / 100) * circumference;
    timerProgressFill.style.strokeDasharray = `${circumference} ${circumference}`;
    timerProgressFill.style.strokeDashoffset = offset;
}

/**
 * Yeni bir ağaç dik
 */
function plantTree() {
    treeCount++;
    treeCountElement.textContent = treeCount;

    // Yeni ağacı ekle
    const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
    const tree = document.createElement('div');
    tree.className = `tree ${treeType}`;
    forestGrid.appendChild(tree);

    // Animasyon için timeout
    setTimeout(() => {
        tree.classList.add('grow');
    }, 100);
}

/**
 * Ağaçları render et
 */
function renderTrees() {
    forestGrid.innerHTML = '';

    for (let i = 0; i < treeCount; i++) {
        const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        const tree = document.createElement('div');
        tree.className = `tree ${treeType} grow`;
        forestGrid.appendChild(tree);
    }
}

/**
 * Konfeti efekti oluştur
 */
function createConfetti() {
    confettiContainer.innerHTML = '';

    const colors = ['#8b5cf6', '#10b981', '#f97316', '#38bdf8', '#ec4899'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 10}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;

        confettiContainer.appendChild(confetti);
    }

    // 5 saniye sonra konfetileri temizle
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}

/**
 * Bildirim göster
 * @param {string} message - Bildirim mesajı
 * @param {string} type - Bildirim türü (success, warning, error)
 */
function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    // 3 saniye sonra bildirimi gizle
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Kart parıltı efektlerini ekle
 */
function addCardGlowEffects() {
    const cards = document.querySelectorAll('.neo-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const glow = card.querySelector('.card-glow');
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            glow.style.top = `${y}px`;
            glow.style.left = `${x}px`;
            glow.style.opacity = '0.2';
        });

        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            glow.style.opacity = '0.1';
        });
    });
}

/**
 * Sayfa geçişi
 * @param {string} url - Hedef sayfa URL'si
 */
function navigateTo(url) {
    document.body.classList.add('page-transitioning');

    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Zamanlayıcı seçenekleri için olay dinleyicileri
timeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Önceki seçili seçeneği kaldır
        timeOptions.forEach(opt => opt.classList.remove('active'));

        // Yeni seçeneği seç
        option.classList.add('active');

        // Seçilen süreyi ayarla
        selectedTime = parseInt(option.getAttribute('data-time'));

        // Zamanlayıcıyı sıfırla
        clearInterval(timer);
        isRunning = false;
        timeLeft = selectedTime * 60;
        timerStatus.textContent = 'Başlamak için tıklayın';
        timerCircle.classList.remove('running');

        // Zamanlayıcıyı güncelle
        updateTimerDisplay();
        updateTimerProgress();

        // Ripple efekti ekle
        addRippleEffect(option);
    });
});

// Zamanlayıcı tıklama olayı
timerCircle.addEventListener('click', () => {
    toggleTimer();
    addRippleEffect(timerCircle);
});

// Ripple efekti ekle
function addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    element.appendChild(ripple);

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Sayfa bağlantıları için olay dinleyicileri
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.classList.contains('active')) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });
});