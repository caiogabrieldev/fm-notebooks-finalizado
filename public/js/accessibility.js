/**
 * =================== SISTEMA DE ACESSIBILIDADE ===================
 * Melhorias de acessibilidade para todas as páginas
 */

class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSkipLinks();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLiveRegions();
    this.setupReducedMotion();
    this.setupHighContrast();
    this.setupTouchTargets();
    this.setupImageLazyLoading();
    this.setupFormValidation();
  }

  /**
   * Configura skip links para navegação por teclado
   */
  setupSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Configura navegação por teclado
   */
  setupKeyboardNavigation() {
    // Navegação por teclado no menu
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    let currentIndex = -1;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllMenus();
        return;
      }

      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivation(e);
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.handleArrowNavigation(e, menuItems, currentIndex);
        return;
      }
    });
  }

  /**
   * Gerencia navegação com Tab
   */
  handleTabNavigation(e) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (e.shiftKey) {
      // Shift + Tab - navegar para trás
      if (currentIndex <= 0) {
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    } else {
      // Tab - navegar para frente
      if (currentIndex >= focusableElements.length - 1) {
        e.preventDefault();
        focusableElements[0].focus();
      }
    }
  }

  /**
   * Gerencia ativação com Enter/Space
   */
  handleActivation(e) {
    const target = e.target;
    
    if (target.matches('button, [role="button"], [role="menuitem"]')) {
      e.preventDefault();
      target.click();
    }
  }

  /**
   * Gerencia navegação com setas
   */
  handleArrowNavigation(e, menuItems, currentIndex) {
    if (menuItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      currentIndex = (currentIndex + 1) % menuItems.length;
    } else if (e.key === 'ArrowUp') {
      currentIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
    }

    menuItems[currentIndex].focus();
  }

  /**
   * Fecha todos os menus abertos
   */
  closeAllMenus() {
    const mobileMenus = document.querySelectorAll('.mobile-menu.active');
    const filterPanels = document.querySelectorAll('.filtro-fi.active');
    
    mobileMenus.forEach(menu => menu.classList.remove('active'));
    filterPanels.forEach(panel => panel.classList.remove('active'));
    
    // Remove overlay
    const overlays = document.querySelectorAll('.overlay.active');
    overlays.forEach(overlay => overlay.classList.remove('active'));
    
    // Restaura scroll do body
    document.body.style.overflow = '';
  }

  /**
   * Obtém elementos focáveis
   */
  getFocusableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="menuitem"]'
    ].join(', ');
    
    return Array.from(document.querySelectorAll(selector));
  }

  /**
   * Configura gerenciamento de foco
   */
  setupFocusManagement() {
    // Adiciona indicador visual de foco
    const style = document.createElement('style');
    style.textContent = `
      *:focus-visible {
        outline: 2px solid var(--cor-focus, #0052cc) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(0, 82, 204, 0.25) !important;
      }
      
      .focus-ring {
        outline: 2px solid var(--cor-focus, #0052cc) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);

    // Gerencia foco em modais e overlays
    document.addEventListener('focusin', (e) => {
      const target = e.target;
      const modal = target.closest('[role="dialog"], .modal, .overlay');
      
      if (modal) {
        this.trapFocus(modal);
      }
    });
  }

  /**
   * Prende o foco dentro de um modal
   */
  trapFocus(modal) {
    const focusableElements = this.getFocusableElements().filter(el => modal.contains(el));

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  /**
   * Configura regiões ARIA Live
   */
  setupAriaLiveRegions() {
    // Cria região para anúncios dinâmicos
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(liveRegion);

    // Função para anunciar mudanças
    window.announceToScreenReader = (message) => {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    };
  }

  /**
   * Configura suporte a movimento reduzido
   */
  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-normal', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
      } else {
        document.documentElement.style.setProperty('--transition-fast', '0.15s ease');
        document.documentElement.style.setProperty('--transition-normal', '0.3s ease');
        document.documentElement.style.setProperty('--transition-slow', '0.5s ease');
      }
    };

    prefersReducedMotion.addEventListener('change', handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);
  }

  /**
   * Configura suporte a alto contraste
   */
  setupHighContrast() {
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const handleHighContrast = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    prefersHighContrast.addEventListener('change', handleHighContrast);
    handleHighContrast(prefersHighContrast);
  }

  /**
   * Configura alvos de toque adequados
   */
  setupTouchTargets() {
    const touchElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    
    touchElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // Tamanho mínimo recomendado
      
      if (rect.width < minSize || rect.height < minSize) {
        element.style.minWidth = `${minSize}px`;
        element.style.minHeight = `${minSize}px`;
        element.style.padding = '8px';
      }
    });
  }

  /**
   * Configura carregamento lazy de imagens
   */
  setupImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback para navegadores sem suporte
      images.forEach(img => {
        img.classList.add('loaded');
      });
    }
  }

  /**
   * Configura validação de formulários
   */
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
      
      form.addEventListener('submit', (e) => {
        let isValid = true;
        
        inputs.forEach(input => {
          if (!this.validateField(input)) {
            isValid = false;
          }
        });
        
        if (!isValid) {
          e.preventDefault();
          this.announceToScreenReader('Formulário contém erros. Verifique os campos destacados.');
        }
      });
    });
  }

  /**
   * Valida um campo individual
   */
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Validação de campo obrigatório
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório.';
    }

    // Validação de email
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um email válido.';
      }
    }

    // Validação de telefone
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\(\)\-\+]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um telefone válido.';
      }
    }

    // Aplica validação visual
    if (isValid) {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      this.removeErrorMessage(field);
    } else {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      this.showErrorMessage(field, errorMessage);
    }

    return isValid;
  }

  /**
   * Mostra mensagem de erro
   */
  showErrorMessage(field, message) {
    this.removeErrorMessage(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    field.parentNode.appendChild(errorElement);
    field.setAttribute('aria-describedby', errorElement.id || 'error-' + Date.now());
  }

  /**
   * Remove mensagem de erro
   */
  removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }

  /**
   * Anuncia para leitores de tela
   */
  announceToScreenReader(message) {
    if (window.announceToScreenReader) {
      window.announceToScreenReader(message);
    }
  }
}

// Inicializa o sistema de acessibilidade quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new AccessibilityManager();
});

// Exporta para uso global
window.AccessibilityManager = AccessibilityManager;
