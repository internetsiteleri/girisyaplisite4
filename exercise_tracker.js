/* exercise_tracker.js - Alıştırma Takip Sistemi */

const ExerciseTracker = {
  // Kategori tespiti
  detectCategory(name) {
    const n = name.toLowerCase();
    if (n.includes('okuma') || n.includes('oku')) return 'okuma';
    if (n.includes('dinleme') || n.includes('dinle') || n.includes('kroki')) return 'dinleme';
    if (n.includes('yazma') || n.includes('yaz')) return 'yazma';
    if (n.includes('konusma') || n.includes('konuşma')) return 'konusma';
    if (n.includes('kelime') || n.includes('deyim') || n.includes('bulmaca') || n.includes('ifade')) return 'kelime';
    if (n.includes('gramer') || n.includes('eki') || n.includes('zaman') || n.includes('baglac')) return 'gramer';
    if (n.includes('sinav') || n.includes('test') || n.includes('tys')) return 'sinav';
    if (n.includes('oyun') || n.includes('carki') || n.includes('çarkı')) return 'oyun';
    return 'diger';
  },

  // Alıştırmayı kaydet
  complete(name, score, total, category) {
    const username = sessionStorage.getItem('hamzaUser');
    if (!username) return false;

    let profile = JSON.parse(localStorage.getItem(`hamzaProfile_${username}`)) || {
      username, joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(), exercises: [],
      totalSolved: 0, totalCorrect: 0, totalQuestions: 0
    };

    if (!category) category = this.detectCategory(name);

    const exercise = {
      name, score, totalQuestions: total, category,
      date: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('tr-TR')
    };

    const existing = profile.exercises.findIndex(e => e.name === name);
    if (existing >= 0) {
      if (score > profile.exercises[existing].score) profile.exercises[existing] = exercise;
    } else {
      profile.exercises.push(exercise);
    }

    profile.totalSolved = profile.exercises.length;
    profile.totalCorrect = profile.exercises.reduce((s, e) => s + e.score, 0);
    profile.totalQuestions = profile.exercises.reduce((s, e) => s + e.totalQuestions, 0);
    profile.lastLogin = new Date().toISOString();

    localStorage.setItem(`hamzaProfile_${username}`, JSON.stringify(profile));
    console.log(`✅ Kaydedildi: ${name} - ${score}/${total}`);
    return true;
  },

  // Otomatik tespit ve kaydet (test sayfaları için)
  autoDetectAndSave() {
    // Sayfa başlığından alıştırma adını al
    const title = document.title.replace(' – Hamza Hoca', '').replace(' - Hamza Hoca', '').trim();
    
    // Mevcut puan değişkenlerini tara
    let correct = 0, total = 0;

    // Yöntem 1: Global değişkenler (okuma1.html)
    if (typeof window.correct !== 'undefined' && typeof window.totalQ !== 'undefined') {
      correct = window.correct;
      total = window.totalQ;
    }
    // Yöntem 2: Dinleme testi - scoreTable kullananlar
    else if (typeof window.scoreTable !== 'undefined') {
      // Dinleme testinde correct değişkeni checkAll() içinde tanımlı
      // Bu durumda manuel çağrı gerekir
      return 'manual';
    }

    if (total > 0 && correct >= 0) {
      this.complete(title, correct, total);
      return 'auto';
    }
    return 'manual';
  }
};