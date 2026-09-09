/**
 * AMBIÇÃO EM NEGÓCIOS - FRONTEND & CRM INTEGRATION CONTROLLER
 * High performance, zero external libraries, accessible vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initFormHandler();
  initPhoneMask();
  initStickyMobileCTA();
  initSmoothScroll();
  initCountdownTimer();
  initFaqAccordion();
  initModals();
});

/**
 * Form Handling & CRM Webhook Integration
 */
function initFormHandler() {
  const form = document.getElementById('qualificationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Enviar Aplicação';

    // Formatação de Telefone para o UNNICA CRM (WhatsApp precisa de DDI 55 + DDD + Número)
    const rawPhone = form.whatsapp.value.trim();
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const ddiPhone = cleanPhone.startsWith('55') ? cleanPhone : ('55' + cleanPhone);

    // Payload compatível com UNNICA CRM, Webhooks e automações de WhatsApp
    const formData = {
      // Padrão UNNICA / Webhook
      nome: form.nome.value.trim(),
      name: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: ddiPhone,
      phone: ddiPhone,
      whatsapp: ddiPhone,
      whatsapp_formatado: rawPhone,
      faturamento: form.faturamento.value,
      faturamento_mensal: form.faturamento.value,
      funcionarios: form.funcionarios.value,
      numero_colaboradores: form.funcionarios.value,
      origem: 'Landing Page Ambição em Negócios - Sorocaba',
      data_envio: new Date().toISOString()
    };

    // Validation
    if (!formData.nome || !formData.email || !rawPhone || !formData.faturamento || !formData.funcionarios) {
      alert('Por favor, preencha todos os campos para receber a condição especial.');
      return;
    }

    // Set Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block; animation: spin 1s infinite linear; margin-right: 8px;">⟳</span>
        Enviando para o consultor...
      `;
    }

    // Local Storage Backup
    try {
      const existingLeads = JSON.parse(localStorage.getItem('ambicao_leads') || '[]');
      existingLeads.push(formData);
      localStorage.setItem('ambicao_leads', JSON.stringify(existingLeads));
    } catch (err) {
      console.warn('Backup local indisponível:', err);
    }

    // UNNICA CRM Webhook Dispatch
    let webhookSetting = (typeof AMBICAO_CONFIG !== 'undefined' && AMBICAO_CONFIG.crm?.webhookUrl) ? AMBICAO_CONFIG.crm.webhookUrl.trim() : '';

    if (webhookSetting && webhookSetting !== '') {
      // Remove delimitadores < > caso tenham sido inseridos
      webhookSetting = webhookSetting.replace(/[<>]/g, '').trim();
      let targetUrl = webhookSetting;
      // Se for apenas o token (whk_...), monta a URL oficial do UNNICA
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://webhook.unnica.com.br/functions/v1/flow-webhook-receive?token=${webhookSetting}`;
      }

      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (err) {
        // Fallback em caso de restrição estrita de CORS no navegador
        try {
          await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(formData),
            mode: 'no-cors'
          });
        } catch (err2) {
          console.error('Erro ao despachar lead para o UNNICA CRM:', err2);
        }
      }
    }

    // Reset Button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    // Check for Redirect
    const redirectUrl = AMBICAO_CONFIG?.crm?.redirectUrl;
    if (redirectUrl && redirectUrl !== '') {
      window.location.href = redirectUrl;
      return;
    }

    // Open Success Modal
    openSuccessModal(formData);
    form.reset();
  });
}

/**
 * Brazilian Phone/WhatsApp Input Mask (XX) XXXXX-XXXX
 */
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"], #whatsapp');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d*)$/, '($1');
      }
      e.target.value = v;
    });
  });
}

/**
 * Success Modal with Custom WhatsApp Direct Action
 */
function openSuccessModal(leadData) {
  const modal = document.getElementById('modal-sucesso');
  const userGreeting = document.getElementById('sucesso-user-name');
  const userPhoneSpan = document.getElementById('sucesso-user-phone');
  const whatsappBtn = document.getElementById('sucesso-whatsapp-btn');

  if (userGreeting) userGreeting.textContent = leadData.nome ? `Olá, ${leadData.nome.split(' ')[0]}!` : 'Olá!';
  if (userPhoneSpan) userPhoneSpan.textContent = leadData.whatsapp || 'WhatsApp cadastrado';

  if (whatsappBtn && typeof AMBICAO_CONFIG !== 'undefined') {
    const phone = AMBICAO_CONFIG.crm?.whatsappNumero || '5515999999999';
    const msg = encodeURIComponent(`Olá! Meu nome é ${leadData.nome} e acabei de aplicar no site do Ambição em Negócios. Gostaria de falar sobre a condição especial.`);
    whatsappBtn.href = `https://wa.me/${phone}?text=${msg}`;
  }

  if (modal) {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Header background blur on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-links .nav-link, .mobile-nav-drawer .btn');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  backdrop.addEventListener('click', closeDrawer);
  navLinks.forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * Mobile Sticky CTA Bar with IntersectionObserver
 */
function initStickyMobileCTA() {
  const stickyBar = document.querySelector('.mobile-sticky-cta-bar');
  const heroSection = document.querySelector('.hero-section');
  const footerSection = document.querySelector('.footer');

  if (!stickyBar || !heroSection) return;

  let heroExited = false;
  let footerVisible = false;

  const updateVisibility = () => {
    if (heroExited && !footerVisible) {
      stickyBar.classList.add('is-visible');
    } else {
      stickyBar.classList.remove('is-visible');
    }
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      heroExited = !entry.isIntersecting;
      updateVisibility();
    });
  }, { threshold: 0.1 });

  heroObserver.observe(heroSection);

  if (footerSection) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        footerVisible = entry.isIntersecting;
        updateVisibility();
      });
    }, { threshold: 0.05 });
    footerObserver.observe(footerSection);
  }
}

/**
 * Smooth Anchor Scrolling with Header Offset & Focus on Form
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // If scrolling to form, focus the first input
        if (targetId === '#formulario' || targetId === '#aplicacao') {
          setTimeout(() => {
            const firstInput = document.getElementById('nome') || targetEl.querySelector('input');
            if (firstInput) firstInput.focus();
          }, 600);
        }
      }
    });
  });
}

/**
 * Urgency Countdown Timer (Matching Reference Image 3)
 */
function initCountdownTimer() {
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-minutes');
  const secsEl = document.getElementById('timer-seconds');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Set timer to end today at 23:59:59 or 12 hours rolling cycle
  const updateTimer = () => {
    const now = new Date();
    const target = new Date();
    target.setHours(23, 59, 59, 999);

    const diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = h.toString().padStart(2, '0');
    minsEl.textContent = m.toString().padStart(2, '0');
    secsEl.textContent = s.toString().padStart(2, '0');
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * Accessible FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        item.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Modals Management (Success, Terms, Privacy)
 */
function initModals() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(modal => {
        if (modal.classList.contains('is-active')) closeModal(modal);
      });
    }
  });
}
