/**
 * NeoForest 2025 - Nothanem JavaScript Dosyası
 * Bu dosya, Nothanem sayfasındaki not yönetimi fonksiyonlarını içerir
 */

// DOM elementlerini seçelim
const noteForm = document.getElementById('note-form');
const noteTitle = document.getElementById('note-title');
const noteCategory = document.getElementById('note-category');
const noteContent = document.getElementById('note-content');
const notesContainer = document.getElementById('notes-container');
const searchNotes = document.getElementById('search-notes');
const filterCategory = document.getElementById('filter-category');
const addSampleNotesBtn = document.getElementById('add-sample-notes');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Modal elementleri
const viewNoteModal = new bootstrap.Modal(document.getElementById('viewNoteModal'));
const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
const viewNoteTitle = document.getElementById('view-note-title');
const viewNoteCategory = document.getElementById('view-note-category');
const viewNoteDate = document.getElementById('view-note-date');
const viewNoteContent = document.getElementById('view-note-content');
const deleteNoteBtn = document.getElementById('delete-note');
const editNoteBtn = document.getElementById('edit-note');
const editNoteForm = document.getElementById('edit-note-form');
const editNoteId = document.getElementById('edit-note-id');
const editNoteTitle = document.getElementById('edit-note-title');
const editNoteCategory = document.getElementById('edit-note-category');
const editNoteContent = document.getElementById('edit-note-content');
const saveEditedNoteBtn = document.getElementById('save-edited-note');

// Notlar dizisi
let notes = [];
let currentNoteId = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // AOS Animasyon kütüphanesini başlat
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    // Notları yükle
    loadNotes();

    // Sayfa geçiş efektini kaldır
    setTimeout(() => {
        document.body.classList.remove('page-transitioning');
    }, 300);

    // Kart parıltı efektlerini ekle
    addCardGlowEffects();
});

/**
 * LocalStorage'dan notları yükle
 */
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    } else {
        showEmptyNotesMessage();
    }
}

/**
 * Notları LocalStorage'a kaydet
 */
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

/**
 * Notları render et
 * @param {Array} filteredNotes - Filtrelenmiş notlar (opsiyonel)
 */
function renderNotes(filteredNotes = null) {
    const notesToRender = filteredNotes || notes;

    if (notesToRender.length === 0) {
        showEmptyNotesMessage();
        return;
    }

    notesContainer.innerHTML = '';

    notesToRender.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.setAttribute('data-id', note.id);

        const formattedDate = new Date(note.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        noteCard.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${note.title}</h3>
                <span class="note-category category-${note.category}">${note.category}</span>
            </div>
            <span class="note-date">${formattedDate}</span>
            <p class="note-content">${note.content}</p>
        `;

        noteCard.addEventListener('click', () => {
            openNoteModal(note.id);
        });

        notesContainer.appendChild(noteCard);
    });
}

/**
 * Boş notlar mesajını göster
 */
function showEmptyNotesMessage() {
    notesContainer.innerHTML = `
        <div class="empty-notes text-center">
            <i class="bi bi-journal-x display-1"></i>
            <h3>Henüz not eklenmemiş.</h3>
            <p class="mt-3">Henüz not eklenmemiş.</p>
            <button class="btn btn-outline-primary mt-3" id="add-sample-notes">
                <i class="bi bi-plus-circle me-2"></i> Örnek Notlar Ekle
            </button>
        </div>
    `;

    document.getElementById('add-sample-notes').addEventListener('click', addSampleNotes);
}

/**
 * Yeni not ekle
 * @param {Object} note - Not nesnesi
 */
function addNote(note) {
    notes.unshift(note);
    saveNotes();
    renderNotes();
    showNotification('Not başarıyla eklendi!', 'success');
}

/**
 * Not sil
 * @param {string} id - Not ID'si
 */
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
    showNotification('Not silindi!', 'warning');
}

/**
 * Not düzenle
 * @param {string} id - Not ID'si
 * @param {Object} updatedNote - Güncellenmiş not nesnesi
 */
function editNote(id, updatedNote) {
    const index = notes.findIndex(note => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            ...updatedNote,
            lastEdited: new Date().toISOString()
        };

        saveNotes();
        renderNotes();
        showNotification('Not güncellendi!', 'success');
    }
}

/**
 * Not modalını aç
 * @param {string} id - Not ID'si
 */
function openNoteModal(id) {
    const note = notes.find(note => note.id === id);

    if (note) {
        currentNoteId = id;

        viewNoteTitle.textContent = note.title;
        viewNoteCategory.textContent = note.category;
        viewNoteCategory.className = `badge category-${note.category}`;

        const formattedDate = new Date(note.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        viewNoteDate.textContent = formattedDate;
        viewNoteContent.textContent = note.content;

        viewNoteModal.show();
    }
}

/**
 * Not düzenleme modalını aç
 * @param {string} id - Not ID'si
 */
function openEditNoteModal(id) {
    const note = notes.find(note => note.id === id);

    if (note) {
        editNoteId.value = id;
        editNoteTitle.value = note.title;
        editNoteCategory.value = note.category;
        editNoteContent.value = note.content;

        editNoteModal.show();
    }
}

/**
 * Notları ara ve filtrele
 */
function searchAndFilterNotes() {
    const searchTerm = searchNotes.value.toLowerCase();
    const categoryFilter = filterCategory.value;

    let filteredNotes = notes;

    // Kategori filtresi
    if (categoryFilter !== 'tümü') {
        filteredNotes = filteredNotes.filter(note => note.category === categoryFilter);
    }

    // Arama filtresi
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
    }

    renderNotes(filteredNotes);
}

/**
 * Örnek notlar ekle
 */
function addSampleNotes() {
    const sampleNotes = [
        {
            id: generateId(),
            title: 'Hoş Geldiniz',
            category: 'genel',
            content: 'NeoForest 2025 Not Sistemi\'ne hoş geldiniz! Bu not sistemi ile notlarınızı kategorilere ayırabilir, arayabilir ve düzenleyebilirsiniz.',
            date: new Date().toISOString(),
            lastEdited: null
        },
        {
            id: generateId(),
            title: 'Pomodoro Tekniği',
            category: 'ders',
            content: 'Pomodoro tekniği, 25 dakikalık çalışma süreleri ve 5 dakikalık molalar şeklinde ilerleyen bir zaman yönetimi metodudur. Her 4 pomodoro sonrasında 15-30 dakikalık uzun bir mola verilir.',
            date: new Date().toISOString(),
            lastEdited: null
        },
        {
            id: generateId(),
            title: 'Proje Fikirleri',
            category: 'proje',
            content: '1. Mobil uygulama geliştirme\n2. Web sitesi tasarımı\n3. Yapay zeka projesi\n4. Veri analizi çalışması',
            date: new Date().toISOString(),
            lastEdited: null
        }
    ];

    notes = [...sampleNotes, ...notes];
    saveNotes();
    renderNotes();
    showNotification('Örnek notlar eklendi!', 'success');
}

/**
 * Benzersiz ID oluştur
 * @returns {string} Benzersiz ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
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

// Not formu gönderme olayı
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newNote = {
        id: generateId(),
        title: noteTitle.value,
        category: noteCategory.value,
        content: noteContent.value,
        date: new Date().toISOString(),
        lastEdited: null
    };

    addNote(newNote);

    // Formu temizle
    noteForm.reset();
});

// Düzenlenen notu kaydetme olayı
saveEditedNoteBtn.addEventListener('click', () => {
    const id = editNoteId.value;

    const updatedNote = {
        title: editNoteTitle.value,
        category: editNoteCategory.value,
        content: editNoteContent.value
    };

    editNote(id, updatedNote);
    editNoteModal.hide();
});

// Not silme butonuna tıklama olayı (modal içinde)
deleteNoteBtn.addEventListener('click', () => {
    if (currentNoteId) {
        deleteNote(currentNoteId);
        viewNoteModal.hide();
    }
});

// Not düzenleme butonuna tıklama olayı (modal içinde)
editNoteBtn.addEventListener('click', () => {
    if (currentNoteId) {
        viewNoteModal.hide();
        openEditNoteModal(currentNoteId);
    }
});

// Arama ve filtreleme olayları
searchNotes.addEventListener('input', searchAndFilterNotes);
filterCategory.addEventListener('change', searchAndFilterNotes);

// Örnek not ekleme butonu olayı
addSampleNotesBtn.addEventListener('click', addSampleNotes);

// Sayfa bağlantıları için olay dinleyicileri
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.classList.contains('active')) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });
});