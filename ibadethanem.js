/**
 * NeoForest 2025 - İbadethanem JavaScript Dosyası
 * Bu dosya, İbadethanem sayfasındaki namaz takip fonksiyonlarını içerir
 */

// DOM elementlerini seçelim
const counterMinusButtons = document.querySelectorAll('.counter-minus');
const counterPlusButtons = document.querySelectorAll('.counter-plus');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Namaz türleri ve hedefleri
const prayers = {
    sabah: { count: 0, target: 80, element: document.getElementById('sabah-count') },
    ogle: { count: 0, target: 80, element: document.getElementById('ogle-count') },
    ikindi: { count: 0, target: 80, element: document.getElementById('ikindi-count') },
    aksam: { count: 0, target: 80, element: document.getElementById('aksam-count') },
    yatsi: { count: 0, target: 80, element: document.getElementById('yatsi-count') },
    vitir: { count: 0, target: 80, element: document.getElementById('vitir-count') }
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // AOS Animasyon kütüphanesini başlat
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
    
    // Namazları yükle
    loadPrayers();
    
    // Sayfa geçiş efektini kaldır
    setTimeout(() => {
        document.body.classList.remove('page-transitioning');
    }, 300);
    
    // Kart parıltı efektlerini ekle
    addCardGlowEffects();
});

/**
 * LocalStorage'dan namaz verilerini yükle
 */
function loadPrayers() {
    for (const prayer in prayers) {
        const savedCount = localStorage.getItem(`prayer_${prayer}`);
        
        if (savedCount !== null) {
            prayers[prayer].count = parseInt(savedCount);
            prayers[prayer].element.textContent = prayers[prayer].count;
            
            // İlerleme çubuğunu güncelle
            updateProgress(prayer);
            
            // Tamamlanma durumunu kontrol et
            checkCompletion(prayer);
        }
    }
}

/**
 * Namaz sayısını artır
 * @param {string} prayer - Namaz türü
 */
function incrementPrayer(prayer) {
    if (prayers[prayer].count < prayers[prayer].target) {
        prayers[prayer].count++;
        prayers[prayer].element.textContent = prayers[prayer].count;
        
        // LocalStorage'a kaydet
        localStorage.setItem(`prayer_${prayer}`, prayers[prayer].count);
        
        // İlerleme çubuğunu güncelle
        updateProgress(prayer);
        
        // Tamamlanma durumunu kontrol et
        checkCompletion(prayer);
    }
}

/**
 * Namaz sayısını azalt
 * @param {string} prayer - Namaz türü
 */
function decrementPrayer(prayer) {
    if (prayers[prayer].count > 0) {
        prayers[prayer].count--;
        prayers[prayer].element.textContent = prayers[prayer].count;
        
        // LocalStorage'a kaydet
        localStorage.setItem(`prayer_${prayer}`, prayers[prayer].count);
        
        // İlerleme çubuğunu güncelle
        updateProgress(prayer);
        
        // Tamamlanma durumunu kontrol et
        checkCompletion(prayer, false);
    }
}

/**
 * İlerleme çubuğunu güncelle
 * @param {string} prayer - Namaz türü
 */
function updateProgress(prayer) {
    const progressBar = document.getElementById(`${prayer}-progress`);
    const completedText = document.getElementById(`${prayer}-completed`);
    const percentage = (prayers[prayer].count / prayers[prayer].target) * 100;
    
    progressBar.style.width = `${percentage}%`;
    completedText.textContent = `${prayers[prayer].count} / ${prayers[prayer].target} tamamlandı`;
    
    // Renk değişimi
    if (percentage >= 100) {
        progressBar.classList.remove('bg-success');
        progressBar.classList.add('bg-primary');
    } else {
        progressBar.classList.remove('bg-primary');
        progressBar.classList.add('bg-success');
    }
}

/**
 * Tamamlanma durumunu kontrol et
 * @param {string} prayer - Namaz türü
 * @param {boolean} increment - Artırma işlemi mi?
 */
function checkCompletion(prayer, increment = true) {
    const card = document.querySelector(`.prayer-card[data-prayer="${prayer}"]`);
    
    if (prayers[prayer].count >= prayers[prayer].target && increment) {
        card.classList.add('completed');
        showNotification(`Tebrikler! ${capitalizeFirstLetter(prayer)} namazı kaza borcunu tamamladınız.`, 'success');
        
        // Animasyonu kaldır
        setTimeout(() => {
            card.classList.remove('completed');
        }, 2000);
    }
}

/**
 * İlk harfi büyük yap
 * @param {string} string - Metin
 * @returns {string} İlk harfi büyük metin
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    const cards = document.querySelectorAll('.neo-card, .prayer-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (card.querySelector('.card-glow')) {
                const glow = card.querySelector('.card-glow');
                glow.style.top = `${y}px`;
                glow.style.left = `${x}px`;
                glow.style.opacity = '0.2';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.querySelector('.card-glow')) {
                const glow = card.querySelector('.card-glow');
                glow.style.opacity = '0.1';
            }
        });
    });
}

/**
 * Ripple efekti ekle
 * @param {HTMLElement} element - Efekt eklenecek element
 */
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

// Artırma butonları için olay dinleyicileri
counterPlusButtons.forEach(button => {
    button.addEventListener('click', () => {
        const prayer = button.getAttribute('data-prayer');
        incrementPrayer(prayer);
        addRippleEffect(button);
    });
});

// Azaltma butonları için olay dinleyicileri
counterMinusButtons.forEach(button => {
    button.addEventListener('click', () => {
        const prayer = button.getAttribute('data-prayer');
        decrementPrayer(prayer);
        addRippleEffect(button);
    });
});

// Sayfa bağlantıları için olay dinleyicileri
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.classList.contains('active')) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });
});