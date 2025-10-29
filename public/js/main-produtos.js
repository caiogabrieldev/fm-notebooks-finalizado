class ProfessionalNavigation {
  constructor() {
    this.mobileMenu = document.querySelector(".mobile-menu")
    this.mobileNavOverlay = document.querySelector(".mobile-nav-overlay")
    this.mobileNav = document.querySelector(".mobile-nav")
    this.navLinks = document.querySelectorAll(".nav-list a")
    this.overlay = document.querySelector(".overlay")
    this.filterToggle = document.querySelector("#toggle-filtro")
    this.filterPanel = document.querySelector(".filtro-fi")
    this.filterClose = document.querySelector(".close-filtro")
    this.searchInputs = document.querySelectorAll("#input-busca, #input-busca-mobile")
    this.searchButtons = document.querySelectorAll(".search-btn, .search-btn-mobile")
    this.cartLinks = document.querySelectorAll(".cart-link")
    this.mobileSearchOverlay = document.querySelector(".mobile-search-overlay")
    this.mobileSearchTrigger = document.querySelector(".mobile-search-trigger")
    this.closeMobileSearch = document.querySelector(".close-mobile-search")
    this.contadorProdutos = document.getElementById("contador-produtos")

    this.isMenuOpen = false
    this.isFilterOpen = false
    this.isMobileSearchOpen = false

    this.init()
  }

  init() {
    this.setupMobileMenu()
    this.setupSearch()
    this.setupCart()
    this.setupMobileFilter()
    this.setupKeyboardNavigation()
    this.setupResponsiveAdjustments()
    this.updateCartDisplay()
    this.setupMobileSearch()
  }

  setupMobileMenu() {
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", (e) => {
        e.preventDefault()
        this.toggleMobileMenu()
      })
    }

    const navList = document.querySelector(".nav-list")
    if (navList) {
      // Close menu when clicking overlay
      if (this.overlay) {
        this.overlay.addEventListener("click", () => {
          this.closeMobileMenu()
        })
      }

      // Close menu when clicking nav links
      this.navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          this.closeMobileMenu()
        })
      })
    }
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true
    const navList = document.querySelector(".nav-list")

    if (this.mobileMenu) {
      this.mobileMenu.classList.add("active")
      this.mobileMenu.setAttribute("aria-expanded", "true")
    }

    if (this.overlay) {
      this.overlay.classList.add("active")
    }

    if (navList) {
      navList.classList.add("active")
    }

    document.body.style.overflow = "hidden"
    this.animateNavLinks()
  }

  closeMobileMenu() {
    this.isMenuOpen = false
    const navList = document.querySelector(".nav-list")

    if (this.mobileMenu) {
      this.mobileMenu.classList.remove("active")
      this.mobileMenu.setAttribute("aria-expanded", "false")
    }

    if (this.overlay) {
      this.overlay.classList.remove("active")
    }

    if (navList) {
      navList.classList.remove("active")
    }

    document.body.style.overflow = ""
  }

  animateNavLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation = "none"
      link.offsetHeight // Trigger reflow
      link.style.animation = `slideInRight 0.4s ease forwards`
      link.style.animationDelay = `${(index + 1) * 0.1}s`
    })
  }

  setupSearch() {
    this.searchInputs.forEach((input) => {
      if (input) {
        // Real-time search
        input.addEventListener("input", (e) => {
          this.performSearch(e.target.value)
        })

        // Search on Enter
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            this.performSearch(e.target.value)
          }
        })

        // Sync search inputs
        input.addEventListener("input", (e) => {
          this.syncSearchInputs(e.target.value, e.target)
        })
      }
    })

    // Search button clicks
    this.searchButtons.forEach((button) => {
      if (button) {
        button.addEventListener("click", (e) => {
          e.preventDefault()
          const input = button.parentElement.querySelector("input")
          if (input) {
            this.performSearch(input.value)
          }
        })
      }
    })
  }

  syncSearchInputs(value, currentInput) {
    this.searchInputs.forEach((input) => {
      if (input !== currentInput) {
        input.value = value
      }
    })
  }

  performSearch(query) {
  
   
    if (query.trim()) {
      
      this.searchButtons.forEach((button) => {
        button.style.transform = "translateY(-50%) scale(0.95)"
        setTimeout(() => {
          button.style.transform = "translateY(-50%) scale(1)"
        }, 150)
      })
    }
  }

  setupCart() {
    this.cartLinks.forEach((link) => {
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault()
          this.handleCartClick()
        })
      }
    })
  }

  handleCartClick() {
    this.cartLinks.forEach((link) => {
      link.style.transform = "scale(0.95)"
      setTimeout(() => {
        link.style.transform = "scale(1)"
      }, 150)
    })


    
    // Add cart functionality here
  }

  updateCartDisplay() {
    // Cart functionality disabled - just keep the icon visible
    const cartCounts = document.querySelectorAll(".cart-count")
    cartCounts.forEach((count) => {
      count.textContent = "0"
      count.style.display = "none"
    })
  }

  setupMobileFilter() {
    if (this.filterToggle && this.filterPanel) {
      this.filterToggle.addEventListener("click", () => {
        this.toggleFilter()
      })

      if (this.filterClose) {
        this.filterClose.addEventListener("click", () => {
          this.closeFilter()
        })
      }
    }
  }

  toggleFilter() {
    if (this.isFilterOpen) {
      this.closeFilter()
    } else {
      this.openFilter()
    }
  }

  openFilter() {
    this.isFilterOpen = true
    this.filterPanel.classList.add("active")
    if (this.overlay) {
      this.overlay.classList.add("active")
    }
    document.body.style.overflow = "hidden"

    if (this.filterToggle) {
      this.filterToggle.innerHTML = '<i class="fas fa-filter"></i> Ocultar Filtros'
    }
  }

  closeFilter() {
    this.isFilterOpen = false
    this.filterPanel.classList.remove("active")
    if (this.overlay) {
      this.overlay.classList.remove("active")
    }
    document.body.style.overflow = ""

    if (this.filterToggle) {
      this.filterToggle.innerHTML = '<i class="fas fa-filter"></i> Mostrar Filtros'
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Escape":
          this.closeMobileMenu()
          this.closeFilter()
          this.closeMobileSearchModal()
          break
        case "/":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            const firstSearchInput =
              document.querySelector("#input-busca") || document.querySelector("#input-busca-mobile")
            if (firstSearchInput) {
              firstSearchInput.focus()
            }
          }
          break
      }
    })
  }

  setupResponsiveAdjustments() {
    this.updateBodyPadding()

    const resizeHandler = () => {
      this.updateBodyPadding()
      this.handleResize()
    }

    window.addEventListener("resize", resizeHandler)

    // Listen for cart updates
    window.addEventListener("storage", () => {
      this.updateCartDisplay()
    })

    // Custom event for cart updates
    window.addEventListener("cartUpdated", () => {
      this.updateCartDisplay()
    })
  }

  updateBodyPadding() {
    const isMobile = window.innerWidth <= 992
    if (isMobile) {
      document.body.style.paddingTop = "80px" // header mobile
    } else {
      document.body.style.paddingTop = "100px" // header desktop
    }
  }

  handleResize() {
    if (window.innerWidth > 992) {
      this.closeMobileMenu()
      this.closeFilter()
      this.closeMobileSearchModal()
    }
  }

  updateCart() {
    this.updateCartDisplay()
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }

  getCartItems() {
    return JSON.parse(localStorage.getItem("carrinho") || "[]")
  }

  clearCart() {
    localStorage.removeItem("carrinho")
    this.updateCartDisplay()
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }

  // Atualizar contador de produtos
  updateProductsCounter(count) {
    if (this.contadorProdutos) {
      const text = count === 1 ? "produto encontrado" : "produtos encontrados"
      this.contadorProdutos.textContent = `${count} ${text}`
    }
  }

  // Mostrar/ocultar loading
  toggleLoading(show = true) {
    const loadingContainer = document.getElementById("loading-produtos")
    const produtosGrid = document.getElementById("lista-produtos")
    
    if (loadingContainer && produtosGrid) {
      if (show) {
        loadingContainer.style.display = "flex"
        produtosGrid.style.display = "none"
      } else {
        loadingContainer.style.display = "none"
        produtosGrid.style.display = "grid"
      }
    }
  }

  // Mostrar mensagem de nenhum produto
  showNoProducts(show = true) {
    const noProductsMessage = document.getElementById("no-products")
    const produtosGrid = document.getElementById("lista-produtos")
    
    if (noProductsMessage && produtosGrid) {
      if (show) {
        noProductsMessage.style.display = "flex"
        produtosGrid.style.display = "none"
      } else {
        noProductsMessage.style.display = "none"
        produtosGrid.style.display = "grid"
      }
    }
  }

  setupMobileSearch() {
    // Botão de pesquisa no header mobile (ícone de lupa)
    if (this.mobileSearchTrigger) {
      this.mobileSearchTrigger.addEventListener("click", (e) => {
        e.preventDefault()
        this.openMobileSearch()
      })
    }

    // Fechar pesquisa mobile
    if (this.closeMobileSearch && this.mobileSearchOverlay) {
      this.closeMobileSearch.addEventListener("click", () => {
        this.closeMobileSearchModal()
      })

      // Fechar ao clicar no overlay
      this.mobileSearchOverlay.addEventListener("click", (e) => {
        if (e.target === this.mobileSearchOverlay) {
          this.closeMobileSearchModal()
        }
      })
    }
  }

  openMobileSearch() {
    this.isMobileSearchOpen = true
    if (this.mobileSearchOverlay) {
      this.mobileSearchOverlay.classList.add("active")
      document.body.style.overflow = "hidden"

      // Focar no input de pesquisa
      const mobileSearchInput = document.querySelector("#input-busca-mobile")
      if (mobileSearchInput) {
        setTimeout(() => mobileSearchInput.focus(), 100)
      }
    }
  }

  closeMobileSearchModal() {
    this.isMobileSearchOpen = false
    if (this.mobileSearchOverlay) {
      this.mobileSearchOverlay.classList.remove("active")
      document.body.style.overflow = ""
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {

    const navigation = new ProfessionalNavigation()


    window.fmNavigation = navigation


    
  } catch (error) {
    console.error("❌ Erro ao inicializar navegação:", error)
  }
})

if (typeof window.mobileNavbar === "undefined") {
  window.mobileNavbar = {
    init: () => {
      console.log("Sistema de navegação já inicializado")
    },
  }
}


