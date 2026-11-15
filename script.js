/**
 * FX-GX GAME – Modern Apple-Inspired Interactive Engine
 * Micro-interactions, filter tabs, interactive download bar, and smooth reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar & Navbar blur effect
  const progressBar = document.getElementById('progressBar');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const docElem = document.documentElement;
    const scrollTop = docElem.scrollTop || document.body.scrollTop;
    const scrollHeight = docElem.scrollHeight - docElem.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }

    if (navbar) {
      if (scrollTop > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('open-mobile');
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open-mobile');
      });
    });
  }

  // 3. Scroll Reveal with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  // 4. Toast Notification System
  const toast = document.getElementById('toastNotice');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 5. Internal Sub-Tabs in Flagship Card (Genel Bakış / Sistem / Sürüm)
  const subTabButtons = document.querySelectorAll('.sub-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      subTabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 6. Category Filter Tabs (Seçenekler: Tümü / Rol Yapma / Yarış / Aksiyon)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gameCards = document.querySelectorAll('.game-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      gameCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 7. Interactive Master Download Button
  const dlBtn = document.getElementById('mainDownloadBtn');
  const btnProgress = document.getElementById('btnProgress');
  const btnLabel = document.getElementById('btnLabel');

  if (dlBtn && btnProgress && btnLabel) {
    dlBtn.addEventListener('click', (e) => {
      if (dlBtn.classList.contains('loading')) {
        e.preventDefault();
        return;
      }

      dlBtn.classList.add('loading');
      btnProgress.style.width = '0%';
      btnLabel.textContent = 'BAĞLANTI KURULUYOR...';

      let progress = 0;
      const interval = setInterval(() => {
        progress += 12;
        btnProgress.style.width = progress + '%';
        if (progress >= 40 && progress < 80) {
          btnLabel.textContent = 'İNDİRME BAŞLATILIYOR...';
        } else if (progress >= 100) {
          clearInterval(interval);
          btnProgress.style.width = '100%';
          btnLabel.textContent = 'İNDİRME BAŞLATILDI ✓';
          dlBtn.classList.remove('loading');
          dlBtn.classList.add('done');
          showToast('✓ Fxoffice.exe indirmesi başlatıldı!');

          setTimeout(() => {
            dlBtn.classList.remove('done');
            btnProgress.style.width = '0%';
            btnLabel.textContent = 'HEMEN İNDİR (.EXE)';
          }, 4500);
        }
      }, 90);
    });
  }

  // 8. Wishlist / Early Access Buttons
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const game = btn.getAttribute('data-game') || 'Oyun';
      btn.textContent = 'Eklendi ✓';
      btn.style.borderColor = 'var(--red-primary)';
      btn.style.color = '#ffffff';
      showToast(`✓ ${game} listenize eklendi! Çıkışta bildirim alacaksınız.`);
    });
  });

  // 9. Share Link Button
  const copyShareBtn = document.getElementById('copyShareBtn');
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('✓ Sayfa bağlantısı panoya kopyalandı!');
        }).catch(() => {
          showToast('✓ Bağlantı hazır: ' + url);
        });
      } else {
        showToast('✓ Bağlantı: ' + url);
      }
    });
  }

  // 10. Apple Accordion FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Optional: close other items for strict accordion
        faqItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 11. Subtle 3D Card Tilt for Flagship Logo
  const logoWrapper = document.querySelector('.game-logo-wrapper');
  if (logoWrapper) {
    logoWrapper.addEventListener('mousemove', (e) => {
      const rect = logoWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = logoWrapper.querySelector('.game-logo-img');
      if (img) {
        img.style.transform = `perspective(600px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.04)`;
      }
    });

    logoWrapper.addEventListener('mouseleave', () => {
      const img = logoWrapper.querySelector('.game-logo-img');
      if (img) {
        img.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
      }
    });
  }
});
