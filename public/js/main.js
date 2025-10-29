class MobileNavbar {
  constructor(mobileMenu, navList, navLinks, activeClass) {
    this.mobileMenu = document.querySelector(mobileMenu)
    this.navList = document.querySelector(navList)
    this.navLinks = document.querySelectorAll(navLinks)
    this.activeClass = activeClass
    this.overlay = document.querySelector(".overlay")
    this.isOpen = false

    this.handleClick = this.handleClick.bind(this)
    this.handleOverlayClick = this.handleOverlayClick.bind(this)
    this.handleEscape = this.handleEscape.bind(this)
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation = ""
      setTimeout(() => {
        link.style.animation = `navLinkFade 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards ${index * 0.1 + 0.2}s`
      }, 50)
    })
  }

  openMenu() {
    this.navList.classList.add(this.activeClass)
    this.mobileMenu.classList.add(this.activeClass)
    this.mobileMenu.setAttribute("aria-expanded", "true")
    if (this.overlay) {
      this.overlay.classList.add(this.activeClass)
    }
    document.body.style.overflow = "hidden"
    this.isOpen = true
    this.animateLinks()
  }

  closeMenu() {
    this.navList.classList.remove(this.activeClass)
    this.mobileMenu.classList.remove(this.activeClass)
    this.mobileMenu.setAttribute("aria-expanded", "false")
    if (this.overlay) {
      this.overlay.classList.remove(this.activeClass)
    }
    document.body.style.overflow = ""
    this.isOpen = false
  }

  handleClick() {
    if (this.isOpen) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  handleOverlayClick() {
    this.closeMenu()
  }

  handleEscape(e) {
    if (e.key === "Escape" && this.isOpen) {
      this.closeMenu()
    }
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick)

    // Fechar menu ao clicar nos links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu()
      })
    })

    // Fechar menu ao clicar no overlay
    if (this.overlay) {
      this.overlay.addEventListener("click", this.handleOverlayClick)
    }

    // Fechar menu com ESC
    document.addEventListener("keydown", this.handleEscape)
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent()
    }
    return this
  }
}

const mobileNavbar = new MobileNavbar(".mobile-menu", ".nav-list", ".nav-list li", "active")

mobileNavbar.init()

$("#carousel").owlCarousel({
  loop: true,
  margin: -1,
  items: 1,
  nav: true,
  navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: true,
})

$(".intro-carousel").on("translate.owl.carousel", () => {
  $(".intro-content .intro-title").removeClass("zoomIn animated").hide()
  $(".intro-content .intro-price").removeClass("fadeInUp animated").hide()
})

$(".intro-carousel").on("translated.owl.carousel", () => {
  $(".intro-content .intro-title").addClass("zoomIn animated").show()
  $(".intro-content .intro-price").addClass("fadeInUp animated").show()
})

