/**
 * FX-GX GAME – Sade & Akıcı Apple Tarzı Etkileşim Motoru
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar & Navbar Scroll State
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

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open-mobile');
      });
    });
  }

  // 3. Scroll Reveal ile Yumuşak Görünme
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
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  // 4. Toast Bildirim Sistemi
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

  // 5. İnteraktif İndirme Butonu
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
        progress += 14;
        btnProgress.style.width = progress + '%';
        if (progress >= 40 && progress < 80) {
          btnLabel.textContent = 'İNDİRİLİYOR...';
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
          }, 4000);
        }
      }, 80);
    });
  }

  // 6. Paylaş Butonu
  const copyShareBtn = document.getElementById('copyShareBtn');
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('✓ Sayfa bağlantısı kopyalandı!');
        }).catch(() => {
          showToast('✓ Bağlantı hazır: ' + url);
        });
      } else {
        showToast('✓ Bağlantı: ' + url);
      }
    });
  }

  // 7. SSS Akordeon
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 8. 3D Logo Tilt Efekti
  const logoWrapper = document.querySelector('.game-logo-wrapper');
  if (logoWrapper) {
    logoWrapper.addEventListener('mousemove', (e) => {
      const rect = logoWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = logoWrapper.querySelector('.game-logo-img');
      if (img) {
        img.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
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
