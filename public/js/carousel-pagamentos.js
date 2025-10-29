// Carousel de Pagamentos - Mobile
const carouselTrack = document.getElementById('carousel-track');
const indicators = document.querySelectorAll('.carousel-indicator');
const totalSlides = 5;

let currentSlide = 0;
const autoSlideInterval = 4000; // 4 segundos
let autoSlideTimer;

// Função para atualizar o carousel
function updateCarousel() {
  if (carouselTrack) {
    const translateX = -currentSlide * 20; // 20% por slide (100% / 5 slides)
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Atualizar indicadores
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }
}

// Função para avançar automaticamente
function autoSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

// Função para ir para um slide específico
function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
  
  // Reiniciar o timer automático
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// Função para iniciar o slide automático
function startAutoSlide() {
  autoSlideTimer = setInterval(autoSlide, autoSlideInterval);
}

// Função para parar o slide automático
function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}

// Inicializar o carousel quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se estamos em dispositivo móvel (carousel visível)
  function checkMobileCarousel() {
    const carousel = document.querySelector('.pagamento-carousel');
    if (carousel && window.getComputedStyle(carousel).display !== 'none') {
      startAutoSlide();
      
      // Adicionar event listeners aos indicadores
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
      });
      
      // Pausar carousel ao passar o mouse
      const carouselContainer = document.querySelector('.carousel-container');
      if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Para touch devices
        carouselContainer.addEventListener('touchstart', stopAutoSlide);
        carouselContainer.addEventListener('touchend', () => {
          setTimeout(startAutoSlide, 2000); // Retomar após 2 segundos
        });
      }
    }
  }
  
  // Verificar inicialmente
  checkMobileCarousel();
  
  // Verificar ao redimensionar a janela
  window.addEventListener('resize', () => {
    stopAutoSlide();
    setTimeout(checkMobileCarousel, 100);
  });
});

// Limpar timer ao sair da página
window.addEventListener('beforeunload', stopAutoSlide);
