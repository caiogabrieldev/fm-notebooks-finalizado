let totalEl = document.querySelector(".cart-total .total-info span");
const carrinhoButtons = document.querySelectorAll('.abrir-carrinho');
const carrinhoIcons = document.querySelectorAll('.nav-cart a');
const carrinho = document.getElementById('carrinho-overlay');

const fecharCarrinho = document.getElementById('fechar-carrinho');
const navElement = document.querySelector('nav');

// Remove só a chave "carrinho"


if (carrinhoButtons && carrinho) {
  carrinhoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      carrinho.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
}


if (carrinhoIcons && carrinho) {
  carrinhoIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      carrinho.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
}


if (navElement && carrinho) {
  navElement.addEventListener('click', (e) => {

    const navRect = navElement.getBoundingClientRect();
    const clickX = e.clientX - navRect.left;


    if (clickX > navRect.width - 60) {
      e.preventDefault();
      carrinho.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
}

if (fecharCarrinho && carrinho) {
  fecharCarrinho.addEventListener('click', () => {
    carrinho.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
}

function renderCarrinho() {
  let total=0
  const carrinho = getCarrinho();
 
  const container = document.querySelector(".items-add");
  const vazio = document.querySelector(".cart-vazio");
  const totalEl = document.querySelector(".cart-total .total-info span");

  if (!container) return;
  container.innerHTML = "";

  if (carrinho.length === 0) {
    if (vazio) vazio.style.display = "block";
    if (totalEl) totalEl.textContent = "Total: R$ 0,00";
    return;
  } else {
    if (vazio) vazio.style.display = "none";
  }




  
  carrinho.forEach(produto => {
  
    total += produto.preco * produto.quantidade;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
          <div class="item-cont">
            <div class="item-img">
              <img src="${produto.img}" alt="${produto.nome}">
            </div>
            <div class="item-desc">
              <p>${produto.nome}</p>
              <span>R$ ${produto.preco.toFixed(2)}</span>
            </div>
          </div>
          <div class="item-add-or-delete">
            <div class="quantidade-container">
              <button class="quantidade-btn diminuir">-</button>
              <input type="text" class="item-quantidade" value="${produto.quantidade}" min="1">
              <button class="quantidade-btn aumentar">+</button>
            </div>
            <button class="remover-item"><i class="fa fa-trash"></i> Remover</button>
          </div>
        `;


    div.querySelector(".diminuir").addEventListener("click", () => alterarQuantidade(produto.id, -1));
    div.querySelector(".aumentar").addEventListener("click", () => alterarQuantidade(produto.id, 1));
    div.querySelector(".remover-item").addEventListener("click", () => removerDoCarrinho(produto.id));

    container.appendChild(div);
  });

  if (totalEl) totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}



if (carrinho) {
  carrinho.addEventListener('click', (e) => {
    if (e.target === carrinho) {
      carrinho.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}


function getCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function setCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


function adicionarAoCarrinho(produto) {

  let carrinho = getCarrinho();

  const existente = carrinho.find(p => p.id === produto.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  setCarrinho(carrinho);
  renderCarrinho();
}


function removerDoCarrinho(id) {
  let carrinho = getCarrinho().filter(p => p.id !== id);
  const prod = getCarrinho().filter(p => p.id == id);
  totalEl -= prod.precoProd
  setCarrinho(carrinho);
  renderCarrinho();
}


function alterarQuantidade(id, delta) {
  let carrinho = getCarrinho();
  carrinho = carrinho.map(p => {
    if (p.id === id) {
      p.quantidade = Math.max(1, p.quantidade + delta);
    }
    return p;
  });
  setCarrinho(carrinho);
  renderCarrinho();
}


function finalizarCompra() {
  let total=0;
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

 

  let mensagem = `🛒 *Novo pedido - FM Notebooks*\n\n`;


  mensagem += "📦 *Itens do carrinho:*\n";
  carrinho.forEach(item => {
    total+=parseFloat(item.preco)*item.quantidade
    mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${item.preco}\n`;
  });



  mensagem += `\n💰 *Total do pedido: R$ ${total}*\n\n`;


  mensagem += "👤 *Dados do cliente:*\n";
  mensagem += `- Nome: [Insira seu nome]\n`;
  mensagem += `- Telefone: [Insira seu telefone]\n`;
  mensagem += `- Endereço: [Insira seu endereço]\n`;
  mensagem += ` Forma de pagamento: [Insira como deseja pagar]\n\n`;

  mensagem += "✅ Por favor, confirme o recebimento deste pedido.";

 
  navigator.clipboard.writeText(mensagem).then(() => {
    alert("O carrinho foi copiado. Cole no WhatsApp!");

 
  let numero = "5534992088233"; 
  let link = `https://wa.me/${numero}`;
  window.open(link, "_blank");
});




}



// ===========================
// LISTA DE PRODUTOS COMPLETA
// ===========================

window.addEventListener("DOMContentLoaded", () => {

  renderCarrinho();
  fetch("http://localhost:5090/produtos", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao obter informações")
      return response.json()
    })
    .then((data) => {
  
      produtos = data

      exibirProdutos()
    })
    .catch((error) => {
      console.error("Erro ao obter produtos da API, usando dados locais:", error)
      produtos = produtosLocais
      exibirProdutos()
    })

  fetch("http://localhost:5090/promocoes", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao obter promoções")
      return response.json()
    })
    .then((data) => {
      const divLista = document.getElementById("listaPromos")
      if (divLista) {
        data.forEach((promo) => {
          const label = document.createElement("label")
          label.className = "label-filtro"

          const input = document.createElement("input")
          input.type = "checkbox"
          input.className = "input-checkbox-promocao"
          input.name = promo.idPromo

          const span = document.createElement("span")
          span.className = "custom-checkbox"

          const span2 = document.createElement("span")
          span2.className = "texto-label"
          span2.innerText = promo.nomePromocao

          label.appendChild(input)
          label.appendChild(span)
          label.appendChild(span2)
          divLista.appendChild(label)

          input.addEventListener("change", (e) => {
            const promocao = String(e.target.getAttribute("name"))

            if (e.target.checked) {
              if (!promocoesAtivas.includes(promocao)) {
                promocoesAtivas.push(promocao)
              }
            } else {
              promocoesAtivas = promocoesAtivas.filter((m) => m !== promocao)
            }
            exibirProdutos()
          })
        })
      }
    })
    .catch((error) => console.error("Erro ao obter promoções:", error))

  function abrirDetalhes(chaveAcesso) {
    window.location.href = "detalhes.html?id=" + chaveAcesso;
  }

  let produtos = []
  let filtroTexto = ""
  let categoriasAtivas = ["todas"]
  let marcasAtivas = []
  let promocoesAtivas = []

  // Elementos
  const busca = document.getElementById("input-busca")
  const buscaMobile = document.getElementById("input-busca-mobile")
  const resultado = document.getElementById("lista-produtos")
  const checkboxesCategoria = document.querySelectorAll(".input-checkbox-categoria")
  const checkboxesMarca = document.querySelectorAll(".input-checkbox-marca")

  // ===========================
  // FUNÇÃO DE EXIBIÇÃO
  // ===========================
  function exibirProdutos() {
    if (!resultado) return


    if (window.fmNavigation) {
      window.fmNavigation.toggleLoading(true)
    }


    setTimeout(() => {
      resultado.innerHTML = ""
      const filtrados = produtos.filter((p) => {
       

        const textoCombina = p.nomeProd.toLowerCase().includes(filtroTexto.toLowerCase())
        const todasSelecionadas = categoriasAtivas.includes("todas")

        //CATEGORIA
        const categoriaCombina = todasSelecionadas || categoriasAtivas.includes(p.catProd.toLowerCase())

        // MARCA
        const marcaCombina = marcasAtivas.length === 0 || marcasAtivas.includes(p.marcaProd.toLowerCase())

        //PROMOCAO
        const promocaoCombina =
          promocoesAtivas.length === 0 || (p.idPromoVinc && promocoesAtivas.includes(String(p.idPromoVinc)))


        return textoCombina && categoriaCombina && marcaCombina && promocaoCombina
      })


      if (window.fmNavigation) {
        window.fmNavigation.toggleLoading(false)
        window.fmNavigation.updateProductsCounter(filtrados.length)
      }

      if (filtrados.length === 0) {
        if (window.fmNavigation) {
          window.fmNavigation.showNoProducts(true)
        }
        return
      }

      // Ocultar mensagem de nenhum produto
      if (window.fmNavigation) {
        window.fmNavigation.showNoProducts(false)
      }

      filtrados.forEach((produto, index) => {
        const div = document.createElement("div")
        div.className = "produto"
        div.innerHTML = `
                <div class="produto-imagem">
                    <img src="${produto.urlImgProd1}" alt="${produto.nomeProd}">
                </div>
                <div class="produto-info">
                    <h3>${produto.nomeProd}</h3>
                    <div class="preco"><span>R$ ${produto.precoProd}</span></div>
                    <div class="produto-actions">
                        <a href="/detalhes?id=${produto.chaveAcessProd}" class="comprar-btn" aria-label="Comprar ${produto.nomeProd}" onclick=abrirDetalhes(${produto.chaveAcessProd})>Comprar</a>
                        <button class="add-carrinho-btn" aria-label="Adicionar ${produto.nomeProd} ao carrinho" disabled>
                        </button>
                    </div>
                </div>
            `

        const btn = div.querySelector(".add-carrinho-btn");
        btn.disabled = false;


        btn.addEventListener("click", () => {
         
          adicionarAoCarrinho({
            id: produto.idProd,
            nome: produto.nomeProd,
            preco: parseFloat(produto.precoProd),
            img: produto.urlImgProd1
          });
        });


        resultado.appendChild(div)

        // Animação de entrada
        setTimeout(() => {
          div.style.opacity = "0"
          div.style.transform = "translateY(20px)"
          div.style.transition = "all 0.3s ease"

          setTimeout(() => {
            div.style.opacity = "1"
            div.style.transform = "translateY(0)"
          }, index * 50)
        }, 50)
      })
    }, 300)
  }

  // ===========================
  // BUSCA
  // ===========================
  function setupSearch(input) {
    if (!input) return


    input.addEventListener("input", (e) => {
      filtroTexto = e.target.value.trim()
      exibirProdutos()

      const otherInput = input.id === "input-busca" ? buscaMobile : busca
      if (otherInput && otherInput.value !== e.target.value) {
        otherInput.value = e.target.value
      }
    })


    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        exibirProdutos()
      }
    })
  }


  setupSearch(busca)
  setupSearch(buscaMobile)

  const searchButtons = document.querySelectorAll(".search-btn")
  searchButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const input = button.closest(".search-wrap, .mobile-search-content").querySelector("input")
      if (input) {
        filtroTexto = input.value.trim()
        exibirProdutos()
      }
    })
  })

  // ===========================
  // CHECKBOXES DE CATEGORIA
  // ===========================
  checkboxesCategoria.forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const cat = e.target.getAttribute("data-categoria")

      if (cat === "todas" && e.target.checked) {
        categoriasAtivas = ["todas"]
        checkboxesCategoria.forEach((box) => {
          if (box.getAttribute("data-categoria") !== "todas") {
            box.checked = false
          }
        })
      } else if (cat === "todas" && !e.target.checked) {
        categoriasAtivas = []
      } else {
        if (e.target.checked) {
          categoriasAtivas.push(cat)
        } else {
          categoriasAtivas = categoriasAtivas.filter((c) => c !== cat)
        }

        if (categoriasAtivas.length > 0) {
          const todasCheckbox = document.querySelector('.input-checkbox-categoria[data-categoria="todas"]')
          if (todasCheckbox) todasCheckbox.checked = false
          categoriasAtivas = categoriasAtivas.filter((c) => c !== "todas")
        }
        if (categoriasAtivas.length === 0) {
          categoriasAtivas = ["todas"]
          const todasCheckbox = document.querySelector('.input-checkbox-categoria[data-categoria="todas"]')
          if (todasCheckbox) todasCheckbox.checked = true
        }
      }

      exibirProdutos()
    })
  })

  // ===========================
  // CHECKBOXES DE MARCA
  // ===========================
  checkboxesMarca.forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const marca = e.target.getAttribute("data-marca")

      if (e.target.checked) {
        if (!marcasAtivas.includes(marca)) {
          marcasAtivas.push(marca)
        }
      } else {
        marcasAtivas = marcasAtivas.filter((m) => m !== marca)
      }
      exibirProdutos()
    })
  })

  // ===========================
  // LER CATEGORIA DA URL
  // ===========================
  const urlParams = new URLSearchParams(window.location.search)
  const categoriaInicial = urlParams.get("categoria")

  if (categoriaInicial) {
    categoriasAtivas = [categoriaInicial]
    checkboxesCategoria.forEach((box) => {
      box.checked = box.getAttribute("data-categoria") === categoriaInicial
    })
  }

  // ===========================
  // INICIALIZAR
  // ===========================

  setTimeout(() => {
    if (produtos.length === 0) {
      produtos = produtosLocais
    }
    exibirProdutos()


    if (window.fmNavigation) {
      window.fmNavigation.updateProductsCounter(produtos.length)
    }
  }, 1000)
})
