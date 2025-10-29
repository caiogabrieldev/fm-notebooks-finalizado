const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");



dotenv.config()
const app = express()
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 5090



const { Sequelize, DataTypes, where, STRING } = require('sequelize')
const { takeCoverage } = require('v8')
const { moveMessagePortToContext } = require('worker_threads')

app.use(express.static(path.join(__dirname, "../public")));

const openai = new OpenAI({

    apiKey: process.env.API_KEY

})

const conexaoComDB = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
})

const TabelaProdutos = conexaoComDB.define('Produtos', {
    idProd: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    nomeProd: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: false
    },
    descricaoProd: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    precoProd: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    urlImgProd1: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    urlImgProd2: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    urlImgProd3: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    urlImgProd4: {
        type: DataTypes.STRING(50),
        allowNull: true
    }, catProd: {
        type: DataTypes.STRING(50),
        allowNull: false
    }, marcaProd: {
        type: DataTypes.STRING(50),
        allowNull: false
    }, chaveAcessProd: {
        type: DataTypes.STRING(50),
        allowNull: false
    }, idPromoVinc: {
        type: DataTypes.INTEGER,
        allowNull: true
    }, statusVincSecaoFlex: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }, especicficacoesTecnicas: {
        type: DataTypes.STRING(300),
        allowNull: true
    }
})

const TabelaPromocoes = conexaoComDB.define('Promocoes', {
    idPromo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    nomePromocao: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: false
    },
    urlImgPromo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: false
    },
    linkPromo: {
        type: DataTypes.STRING(50),
        allowNull: true
    }, chaveAcessPromo: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
})

const TabelaAdms = conexaoComDB.define('Administradores', {
    idAdm: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    nomeAdm: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: false
    },
    emailAdm: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    senhaAdm: {
        type: DataTypes.STRING(50),
        allowNull: false,

    },
    telefoneAdm: {
        type: DataTypes.STRING(50),
        allowNull: true

    }
})

const TabelaSecaoFlexivel = conexaoComDB.define('SecaoFlex', {
    idSecaoFlex: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    nomeSecaoFlex: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    codProdsSecaoFlex: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    }
}, {
    freezeTableName: true
})

async function criarTabela() {
    await TabelaSecaoFlexivel.create({
        idSecaoFlex: 1,
        nomeSecaoFlex: "Mais vendidos",
        codProdsSecaoFlex: "[]"
    })

}
 async function criarAdm(){
     await TabelaAdms.create({
         idAdm:1,
         nomeAdm:"FM Notebooks",
        emailAdm:process.env.EMAIL,
       senhaAdm:process.env.SENHA
     })

 }



async function checarExistenciaFlex() {

    const div = await TabelaSecaoFlexivel.findByPk(1)
    if (!div) {
        criarTabela()
    }
}
async function checarExistenciaAdmInicial() {

    const div = await TabelaAdms.findByPk(1)
    if (!div) {
         criarAdm()
    }
}



async function sincronizarDB() {
    try {
        await conexaoComDB.sync()
        checarExistenciaFlex()
        checarExistenciaAdmInicial()

    } catch (error) {
        console.log("Erro ao sincronizar")
    }
}
sincronizarDB()




const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + file.originalname;
        cb(null, unique);
    },
});
const upload = multer({ storage });

function verificarJWT(req, res, next) {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];


    if (!token) {
        return res.redirect("/login");
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) {
            return res.redirect("/login");
        }

        req.user = decoded;
        next();
    });
}


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/loja", (req, res) => {

    res.sendFile(path.join(__dirname, "../public/produtos.html"));
});
app.get("/contatos", (req, res) => {

    res.sendFile(path.join(__dirname, "../public/contatos.html"));
});
app.get("/servicos", (req, res) => {

    res.sendFile(path.join(__dirname, "../public/servicos.html"));
});
app.get("/administracao-fm-notebooks", verificarJWT, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/adm.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});
app.get("/detalhes", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/detalhes.html"));
});


app.post("/login", async(req, res) => {
   
    const { email, senha } = req.body;
    const adms=await TabelaAdms.findAll()

    for(adm of adms){
        if (adm.emailAdm === email && senha === adm.senhaAdm) {
            const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: "1h" });
    
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax"
                // secure: true   // só em produção com HTTPS
            });
    
    
            return res.json({ success: true, redirect: "/administracao-fm-notebooks" });
        }
    }

    

   
    return res.status(401).json({ success: false, message: "Credenciais inválidas" });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.post('/add-prod', upload.fields([
    { name: 'imagem1', maxCount: 1 },
    { name: 'imagem2', maxCount: 1 },
    { name: 'imagem3', maxCount: 1 },
    { name: 'imagem4', maxCount: 1 }
]), async (req, res) => {
    try {
        const produto = req.body;
        produto.statusVincSecaoFlex = false
        if (!produto) {
            return res.status(400).json({ message: 'Dados do produto não enviados' });
        }

        if (req.files) {

            Object.entries(req.files).forEach(([campo, arquivos]) => {
                if (arquivos && arquivos.length > 0) {

                    produto[`urlImgProd${campo.replace('imagem', '')}`] = `http://localhost:5090/uploads/${arquivos[0].filename}`;

                }
            });
        }

        await TabelaProdutos.create(produto);
        res.status(200).json({ message: 'Produto adicionado com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar produto');
    }
});

app.post('/add-promo', upload.single('imagem'), async (req, res) => {

    try {
        const promocao = req.body
        const imagemPromo = req.file.path

        promocao.urlImgPromo = 'http://localhost:5090/' + imagemPromo
        await TabelaPromocoes.create(promocao)
        res.status(200).json({ message: 'Promocao adicionada com sucesso' })
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar promocao')
    }
})

app.put('/editar-prod/:name', async (req, res) => {
    try {
        const nomeProdASerEditado = req.params.name

        if (!nomeProdASerEditado) return res.status(400).json('Identificador não recebido')

        const novasInfos = req.body

        await TabelaProdutos.update(novasInfos, { where: { nomeProd: nomeProdASerEditado } })

        res.status(200).json('Sucesso ao editar')

    } catch (error) {
        console.log(error);
        return res.status(200).json('Erro ao editar: ', error)
    }

})
app.put('/editar-promo/:id', async (req, res) => {
    try {
        const idPromoASerEditado = req.params.id

        if (!idPromoASerEditado) return res.status(400).json('Identificador não recebido')

        const novasInfos = req.body
        await TabelaPromocoes.update(novasInfos, { where: { idPromo: idPromoASerEditado } })

        res.status(200).json('Sucesso ao editar')

    } catch (error) {
        console.log(error);
        return res.status(200).json('Erro ao editar: ', error)
    }

})

app.delete('/excluir-prod/:id', async (req, res) => {
    try {
        const idProdASerExcluido = req.params.id

        if (!idProdASerExcluido) return res.status(400).json('Identificador não recebido')

        await TabelaProdutos.destroy({ where: { idProd: idProdASerExcluido } })

        res.status(200).json('Sucesso ao excluir')

    } catch (error) {
        console.log(error);
        return res.status(200).json('Erro ao excluir: ', error)
    }
})
app.delete('/excluir-promo/:id', async (req, res) => {
    try {
        const idPromoASerExcluido = req.params.id

        if (!idPromoASerExcluido) return res.status(400).json('Identificador não recebido')

        await TabelaPromocoes.destroy({ where: { idPromo: idPromoASerExcluido } })

        res.status(200).json('Sucesso ao excluir')

    } catch (error) {
        console.log(error);
        return res.status(200).json('Erro ao excluir: ', error)
    }
})

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await TabelaProdutos.findAll()

        return res.status(200).json(produtos)
    } catch (error) {
        console.log(error);
        return res.status(200).json('Erro ao obter a listagem de produtos: ', error)
    }
})
app.get('/promocoes', async (req, res) => {
    try {
        const promocoes = await TabelaPromocoes.findAll()

        return res.status(200).json(promocoes)
    } catch (error) {
        console.log(error);
        return res.status(200).json('Erro ao obter a listagem de promocoes: ', error)
    }
})

app.post('/login', async (req, res) => {

    const { email, senha } = req.body

    const user = await TabelaAdms.findAll({ where: { email: email } })

    if (user.length == 0) {
        console.log("Email não cadastrado");
        return res.status(404).json({ message: "Email não cadastrado" })
    }

    const compararSenha = await bcrypt.compare(senha, user[0].senha)

    if (!compararSenha) {
        console.log("Senha inválida");
        return res.status(400).json({ message: "Senha inválida" })
    }

    return res.status(200).json({ message: "Login realizado", nome: user[0].nome, email: user[0].email, id: user[0].id })

})

app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body
    const existe = await TabelaAdms.findAll({ where: { email: email } })

    if (existe.length != 0) {
        return res.status(400).json({ message: 'O usuário já existe' })
    }

    const hashed = await bcrypt.hash(senha, 8)
    const user = {
        nome: nome,
        email: email,
        senha: hashed
    }
    await TabelaAdms.create(user)
    await res.status(200).json({ message: "Usuário criado com sucesso" })
})

app.get('/get-infos/:codAcesso', async (req, res) => {
    try {
        const codAcesso = req.params.codAcesso
        const prod = await TabelaProdutos.findOne({ where: { chaveAcessProd: codAcesso } })
        if (!prod) res.status(404).json({ message: "Produto não encontrado" })
        return res.status(200).json(prod)
    } catch (error) {
        console.log(error)
        return error
    }
})
app.get('/get-infos-promo/:codAcesso', async (req, res) => {
    try {
        const codAcesso = req.params.codAcesso
        const promo = await TabelaPromocoes.findOne({ where: { chaveAcessPromo: codAcesso } })
        if (!promo) res.status(404).json({ message: "Promoção não encontrada" })
        return res.status(200).json(promo)
    } catch (error) {
        console.log(error)
        return error
    }
})

app.delete('/delete-prod/:codAcesso', async (req, res) => {
    try {
        const chave = req.params.codAcesso
 if (!chave) return res.status(404).json({ message: "chave não enviada" })
        const produto = await TabelaProdutos.findOne({ where: { chaveAcessProd: chave } })

        const nomeArquivo = path.basename(produto.urlImgProd1);

        const imgPath = path.join(__dirname, "./uploads", nomeArquivo);

        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
            console.log("Imagem removida:", imgPath);
          } else {
            console.warn("Imagem não encontrada:", imgPath);
          }


       
        await TabelaProdutos.destroy({ where: { chaveAcessProd: chave } })


        res.status(200).json({ message: "Produto excluido com sucesso" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
})
app.delete('/delete-promo/:codAcesso', async (req, res) => {
    try {
        const chave = req.params.codAcesso
        if (!chave) return res.status(404).json({ message: "chave não enviada" })
        await TabelaPromocoes.destroy({ where: { chaveAcessPromo: chave } })
        res.status(200).json({ message: "Promoção excluido com sucesso" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
})
app.put('/atualizar-prod/:chaveAcesso', async (req, res) => {
    try {

        const chave = req.params.chaveAcesso
        if (!chave) return res.status(404).json({ message: "chave não enviada" })

        const novasInfos = req.body
        const [linhasAfetadas] = await TabelaProdutos.update(
            novasInfos,
            { where: { chaveAcessProd: chave } }
        )
        if (linhasAfetadas === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }
        res.status(200).json({ message: "Produto editado com sucesso" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
})
app.put('/atualizar-promo/:chaveAcesso', upload.single('imagem'), async (req, res) => {
    try {

        const chave = req.params.chaveAcesso
        if (!chave) return res.status(404).json({ message: "chave não enviada" })

        const imagemPromo = req.file.path
        if (!imagemPromo) return res.status(404).json({ message: "imagem não enviada" })
        const novaImg = 'http://localhost:5090/' + imagemPromo
        const objimg = {
            urlImgPromo: novaImg
        }

        const [linhasAfetadas] = await TabelaPromocoes.update(
            objimg,
            { where: { chaveAcessPromo: chave } }
        )

        if (linhasAfetadas === 0) {
            return res.status(404).json({ message: 'Promoção não encontrada' })
        }
        res.status(200).json({ message: "Promoção editada com sucesso" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
})
app.put('/vinc-promo/', async (req, res) => {
    try {
        const { idPromo, array } = req.body;
    

        for (const prod of array) {
            if (prod.status == false) {
                console.log("FALSE");
                await TabelaProdutos.update(
                    { idPromoVinc: null },
                    { where: { idProd: prod.id } }
                );
            } else {
                await TabelaProdutos.update(
                    { idPromoVinc: idPromo },
                    { where: { idProd: prod.id } }
                );
            }

        }


        return res.status(200).json({ message: 'Produtos vinculados com sucesso!' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao vincular os produtos!' });
    }
});

app.post('/set-div', async (req, res) => {
    try {
        const { nomeSecaoFlex, codProdsSecaoFlex } = req.body
        const div = {
            nomeSecaoFlex: nomeSecaoFlex,
            codProdsSecaoFlex: JSON.stringify(codProdsSecaoFlex)
        }
        await TabelaSecaoFlexivel.create(div)
        return res.status(200).json({ message: 'Div criada com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao criar div!' })
    }
})

app.get('/get-divflex', async (req, res) => {
    try {
        const div = await TabelaSecaoFlexivel.findByPk(1)
        return res.status(200).json({ div })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao obter informações da div!' })
    }
})
app.get('/get-prods-divflex', async (req, res) => {

    try {


        const secao = await TabelaSecaoFlexivel.findByPk(1)


        let listaIds
        if (!secao.codProdsSecaoFlex) {
            listaIds = []
        } else {
            listaIds = JSON.parse(secao.codProdsSecaoFlex)
            if (!Array.isArray(listaIds)) listaIds = []
        }
    
        const produtos = await Promise.all(
            listaIds.map(id => TabelaProdutos.findByPk(id))
        )


        return res.status(200).json({ produtos })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao obter informações dos produtos da seção!' })
    }
})

app.put('/vincular-divflex/:id', async (req, res) => {
    try {
        const id = req.params.id
        await TabelaProdutos.update({ statusVincSecaoFlex: true }, { where: { idProd: id } })
        const secao = await TabelaSecaoFlexivel.findByPk(1)
  

        let listaIds
        if (!secao.codProdsSecaoFlex) {
            listaIds = []
        } else {
            listaIds = JSON.parse(secao.codProdsSecaoFlex)
            if (!Array.isArray(listaIds)) listaIds = []
        }

        listaIds.push(id);
       
        await TabelaSecaoFlexivel.update(
            { codProdsSecaoFlex: JSON.stringify(listaIds) },
            { where: { idSecaoFlex: 1 } }
        );

        return res.status(200).json({ message: 'Sucesso ao vincular produto à seção!' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao vincular produto à seção!' });
    }
});
app.put('/desvincular-divflex/:id', async (req, res) => {
    try {
        const id = req.params.id
        await TabelaProdutos.update({ statusVincSecaoFlex: false }, { where: { idProd: id } })
        const secao = await TabelaSecaoFlexivel.findByPk(1)
  

        let listaIds
        if (!secao.codProdsSecaoFlex) {
            listaIds = []
        } else {
            listaIds = JSON.parse(secao.codProdsSecaoFlex)
            if (!Array.isArray(listaIds)) listaIds = []
        }

        for (let i = 0; i < listaIds.length; i++) {
            if (listaIds[i] == id) {
                listaIds.splice(i, 1)
            }
        }
    
        await TabelaSecaoFlexivel.update(
            { codProdsSecaoFlex: JSON.stringify(listaIds) },
            { where: { idSecaoFlex: 1 } }
        );

        return res.status(200).json({ message: 'Sucesso ao desvincular produto à seção!' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao desvincular produto à seção!' });
    }
});

app.put('/atualizar-divflex/:novoNome', async (req, res) => {

    try {
        const novoNome = req.params.novoNome
        await TabelaSecaoFlexivel.update({ nomeSecaoFlex: novoNome }, { where: { idSecaoFlex: 1 } })
        return res.status(200).json({ message: 'Sucesso ao editar nome da seção!' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao editar nome da seção!' })
    }
})

app.post('/perguntar-assistente', async (req, res) => {

    const userMessage = req.body.message

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: "Você é um assistente prestativo que representa a FM Notebooks, agora autorizada Avell notebooks de alto desempenho. É especialista em tecnologia, com profundo conhecimento das marcas Dell, Samsung, Lenovo, Positivo, Acer e Avell.\n\n🕒 Horário de funcionamento:\n- Segunda a sexta: 09:00–18:00\n- Sábado: 09:00–13:00\n- Domingo: Fechado\n\n🛠️ Serviços e valores oferecidos:\n- Limpeza e Higienização: Notebook Simples R$100, Linha Gamer R$250, Avell R$300\n- Troca de Tela: Notebook Simples R$100, Linha Gamer R$130\n- Recuperação de Carcaças: Resina Bottom/Top Cover R$150, Notebook Simples R$100\n- Instalação de Sistemas Operacionais: Formatação Simples R$100, Com Backup R$130\n- Upgrade de Memória RAM: 8GB R$80, 16GB R$100, 32GB R$120\n- Upgrade para SSD: SSD 240GB R$100, SSD 480GB R$120, Clonagem de Dados R$50\n- Instalação do Pacote Office: R$50\n- Instalação e Reparo de Teclado: R$180\n- Limpeza especializada (Dell G5, Nitro Series, Avell Acer): R$250–R$280 dependendo do modelo\n- Instalação e Resolda de Teclado Vostro Samsung LEM: R$200\n- Resinamento Bottom/Top Cover Notebook: R$100–R$150 dependendo do modelo\n\n📌 Instruções importantes:\n- Sempre responda no mesmo idioma usado pelo cliente (se o usuário perguntar em português, responda em português; se perguntar em inglês, responda em inglês).\n- Responda dúvidas sobre produtos, serviços, valores, tecnologia e disponibilidade da loja.\n- Incentive o agendamento de atendimentos e solicitação de orçamentos, respeitando os horários de funcionamento.\n- Use um tom profissional, claro e focado no cliente.\n\n🎯 Objetivo: ajudar os clientes a descobrir soluções tecnológicas de excelência, otimizar seus dispositivos e melhorar sua eficiência e desempenho com a FM Notebooks. Por fim, você deve responder em um bloco de texto, jamais em tópicos."
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        }
        )

        return res.status(200).json({ msg: completion.choices[0].message.content })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

app.get('/get-prod', async (req, res) => {
    const chave = req.query.chave;

    try {
        const produto = await TabelaProdutos.findOne({ where: { chaveAcessProd: chave } });
        if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

        res.json(produto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no servidor" })
    }
});

app.post('/add-adm', async (req, res) => {

    try {
        const adm = req.body
        await TabelaAdms.create(adm)
        res.status(200).json({ message: 'Sucesso ao criar ADM' })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao criar adm', erro: error })

    }
})
app.get('/adms', async (req, res) => {
    try {
        const adms = await TabelaAdms.findAll()
        res.status(200).json({ adms })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao obter produtos' })
    }
})

app.delete('/delete-adm/:id', async (req, res) => {
    try {
        const idAdm = req.params.id
        await TabelaAdms.destroy({ where: { idAdm: idAdm } })
        res.status(200).json({ message: 'Sucesso ao excluir adm' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Erro ao excluir adm' })
    }
})
app.get("/logout", (req, res) => {
    res.clearCookie("token"); 
    res.redirect("/login");
  });

app.listen(PORT, () => {
    console.log(`Servidor em execução em http://localhost:${5090}`);
})

