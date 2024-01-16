// import { ferramentas } from "./this.js";
import { Pincel } from "./pincel-class.js";
import { Borracha } from "./borracha-class.js";
import { CriarTexto } from "./criarTexto-class.js";
import { FormaGeometrica } from "./formaGeometrica-class.js";
import { MoverArea } from "./moverArea-class.js";
import { SelecionaCor } from "./selecionaCor-class.js";

export class App {
    constructor() {
        this.camadas = [];
        this.camadaAtual = null;
        this.contextoAtual = null;
        this.pilhaAcoes = [];
        this.iconesFerramentas = [];

        this.ferramentaSelecionada = null;
        this.pincel = new Pincel();
        this.borracha = new Borracha();
        this.texto = new CriarTexto();
        this.formaGeometrica = new FormaGeometrica();
        this.mover = new MoverArea();
        this.selecionaCor = new SelecionaCor();

        this.MovimentoMouse = this.MovimentoMouse.bind(this);

        this.iconesFerramentas.push(this.pincel.icone);
        this.iconesFerramentas.push(this.borracha.icone);
        this.iconesFerramentas.push(this.texto.icone);
        this.iconesFerramentas.push(this.formaGeometrica.icone);
        this.iconesFerramentas.push(this.mover.icone);
        this.iconesFerramentas.push(this.selecionaCor.icone);

        for (let ferramenta of [this.pincel, this.borracha, this.texto, this.formaGeometrica, this.mover, this.selecionaCor]) {
            ferramenta.icone.addEventListener("click", () => {
                document.querySelectorAll(".ferramentas > img").forEach(icone => icone.classList.remove("nao-selecionado"));
                ferramenta.icone.classList.add("nao-selecionado");
                if (ferramenta.icone.id !== "seleciona-cor") {
                    const elementosApagar = document.querySelectorAll(".ferramentas-info > div");
    
                    for (let elemento of elementosApagar) {
                        elemento.style.display = "none";
                    }
                    document.getElementsByClassName(`ferramenta-${ferramenta.icone.id}`)[0].style.display = "flex";            
                }
                this.ferramentaSelecionada = ferramenta;
            });
        }
    }

    Init(larguraTela, alturaTela) {
        this.CriaCamada(larguraTela, alturaTela);

        this.pincel.tamanhoPincel = 2;

        document.getElementById("confirmar-mover").addEventListener("click", () => { this.mover.MoverArea(this.contextoAtual); });
    }

    DefineTamanhoTela(largura, altura) {
        this.camadaAtual.width = largura;
        this.camadaAtual.height = altura;
    }

    GerenciaEventosTela() {
        this.camadaAtual.addEventListener("mousedown", (mouse) => {
            if (this.pilhaAcoes.length > 9) {
                this.pilhaAcoes.shift();
                this.pilhaAcoes.push(this.contextoAtual.getImageData(0, 0, this.camadaAtual.width, this.camadaAtual.height));
            }
            else {
                this.pilhaAcoes.push(this.contextoAtual.getImageData(0, 0, this.camadaAtual.width, this.camadaAtual.height));
            }


            if (this.ferramentaSelecionada === this.pincel || this.ferramentaSelecionada === this.borracha) {
                this.camadaAtual.addEventListener("mousemove", this.MovimentoMouse);
            }
            else if (this.ferramentaSelecionada === this.selecionaCor) {
                this.selecionaCor.CorSelecionada(mouse.offsetX, mouse.offsetY, this.contextoAtual);
            }
            else if (this.ferramentaSelecionada === this.texto) {
                this.texto.CriaTexto(mouse.offsetX, mouse.offsetY, this.contextoAtual);
            }
            else if (this.ferramentaSelecionada === this.formaGeometrica) {
                this.formaGeometrica.ctx = this.contextoAtual;
                this.formaGeometrica.DesenhaForma();
            }
            else if (this.ferramentaSelecionada === this.BaldeTinta) {
                this.BaldeTinta.Pintar(this.contextoAtual, this.camadaAtual.width, this.camadaAtual.height, mouse.offsetX, mouse.offsetY);
            }

        });

        this.camadaAtual.addEventListener("mouseup", () => {
            if (this.borracha.apagando) {
                this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
                this.borracha.apagando = false;
            }
            else if (this.pincel.desenhando) {
                this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
                this.pincel.desenhando = false;
            }
            this.contextoAtual.beginPath();
        });

        document.addEventListener("keydown", (tecla) => {
            const atalhoSimples = {
                "p": () => {
                    this.ferramentaSelecionada = this.pincel;
                    document.getElementById("pincel").click();
                },
                "b": () => {
                    this.ferramentaSelecionada = this.borracha;
                    document.getElementById("borracha").click();
                },
                "f": () => {
                    this.ferramentaSelecionada = this.formaGeometrica;
                    document.getElementById("forma-geometrica").click();
                },
                "m": () => {
                    this.ferramentaSelecionada = this.mover;
                    document.getElementById("mover").click();
                },
                "i": () => {
                    this.ferramentaSelecionada = this.selecionaCor;
                    document.getElementById("seleciona-cor").click();
                },
                "t": () => {
                    this.ferramentaSelecionada = this.texto;
                    document.getElementById("cria-texto").click();
                },
            }

            if (tecla.ctrlKey) {
                if (tecla.key.toLocaleLowerCase() === "z") {
                    this.DesfazerAcao();
                }
            }
            else if (this.ferramentaSelecionada !== this.texto) {
                if (atalhoSimples[tecla.key.toLocaleLowerCase()]) {
                    atalhoSimples[tecla.key.toLocaleLowerCase()]();
                }
            }


        });
    }

    MovimentoMouse(mouse) {
        if (this.ferramentaSelecionada === null) {
            this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
        }

        if (this.ferramentaSelecionada === this.pincel) {
            this.pincel.desenhando = true;
            this.borracha.apagando = false;
            this.pincel.Desenhar(mouse.offsetX, mouse.offsetY, this.contextoAtual);
        }
        else if (this.ferramentaSelecionada === this.borracha) {
            this.pincel.desenhando = false;
            this.borracha.apagando = true;
            this.borracha.Apagar(mouse.offsetX, mouse.offsetY, this.contextoAtual);
        }
    }

    CriaCamada(larguraTela, alturaTela) {
        //cria a camada 
        const container = document.getElementsByTagName("main")[0];
        const novaCamada = document.createElement("canvas");
        container.appendChild(novaCamada);

        this.camadas.push(novaCamada);
        this.camadaAtual = novaCamada;

        this.camadaAtual.classList.add("camada");
        this.contextoAtual = this.camadaAtual.getContext("2d");
        this.DefineTamanhoTela(larguraTela, alturaTela);
        this.GerenciaEventosTela();

        //cria o selecionador da camada
        const containerNovaCamada = document.getElementById("camadas-container");
        let containerCamadaInfo = document.createElement("div");
        let visivelBtn = document.createElement("img");
        let criarCamadaBtn = document.createElement("img");
        let excluirBtn = document.createElement("img");
        let novoTexto = document.createElement("p");

        containerCamadaInfo.classList.add("camada-info", "selecionado");
        criarCamadaBtn.classList.add("imagem");
        criarCamadaBtn.src = "../img/file-plus-alt-1-svgrepo-com.svg";
        excluirBtn.classList.add("imagem");
        excluirBtn.src = "../img/file-xmark-svgrepo-com.svg";
        novoTexto.classList.add("nome-camada");

        //adiciona lógica para trocar de camada
        containerCamadaInfo.addEventListener("click", () => {
            this.TrocarCamada(novaCamada);
        });

        //coloca a nova camada como a selecionada
        let camadas = containerNovaCamada.querySelectorAll("div.camada-info");
        for (let tmp of camadas) {
            tmp.classList.add("nao-selecionado");
        }
        containerCamadaInfo.classList.remove("nao-selecionado");
        containerCamadaInfo.classList.add("selecionado");

        novoTexto.innerText = "Camada " + this.camadas.length;
        novoTexto.setAttribute("contenteditable", "true");


        //lógica para as funções das camadas
        visivelBtn.classList.add("imagem");
        visivelBtn.src = "../img/eye-svgrepo-com.svg";
        visivelBtn.addEventListener("click", () => {
            if (this.camadaAtual.style.opacity > 0) {
                this.camadaAtual.style.opacity = 0;
                visivelBtn.src = "../img/eye-off-svgrepo-com.svg";
            }
            else {
                this.camadaAtual.style.opacity = 1;
                visivelBtn.src = "../img/eye-svgrepo-com.svg";
            }
        });

        excluirBtn.addEventListener("click", (e) => {
            this.DeletarCamada(novaCamada, containerCamadaInfo, e);
        });
        criarCamadaBtn.addEventListener("click", () => { this.CriaCamada(larguraTela, alturaTela) });

        //adiciona todos os novos elementos nos seus containers
        containerCamadaInfo.appendChild(novoTexto);
        containerCamadaInfo.appendChild(criarCamadaBtn);
        containerCamadaInfo.appendChild(excluirBtn);
        containerCamadaInfo.appendChild(visivelBtn);

        containerNovaCamada.appendChild(containerCamadaInfo);

    }

    TrocarCamada(camada) {
        this.camadaAtual = camada;
        this.contextoAtual = this.camadaAtual.getContext("2d");
        document.getElementsByTagName("main")[0].appendChild(this.camadaAtual);

        let camadas = document.querySelectorAll("div.camada-info");
        for (let tmp of camadas) {
            tmp.classList.add("nao-selecionado");
        }
        const indexContainer = this.camadas.findIndex((c) => c === camada);
        document.querySelectorAll("div.camada-info")[indexContainer].classList.remove("nao-selecionado");
        document.querySelectorAll("div.camada-info")[indexContainer].classList.add("selecionado");
    }

    DeletarCamada(camada, camadaInfo, clique) {
        if (this.camadas.length === 1) {
            return
        }
        const indexDeletar = this.camadas.findIndex((c) => c === camada);

        this.camadas.splice(indexDeletar, 1);
        camada.remove();
        camadaInfo.remove();

        const nomeCamada = document.getElementsByClassName("nome-camada");
        let i = 0;
        let pularCamadaComNome = 0;
        while (i + pularCamadaComNome < nomeCamada.length) {
            if (nomeCamada[i + pularCamadaComNome].innerText.includes("Camada")) {
                nomeCamada[i + pularCamadaComNome].innerText = `Camada ${i + 1}`;
                i++;
            }
            else {
                pularCamadaComNome++;
            }
        }
        this.TrocarCamada(this.camadas[this.camadas.length - 1]);

        clique.stopPropagation(); //impedir que o evento de clique do container das informações da camada seja disparado
    }

    DesfazerAcao() {
        if (this.pilhaAcoes.length > 0) {
            let estadoCamada = this.pilhaAcoes.pop();
            this.contextoAtual.putImageData(estadoCamada, 0, 0);
        }
    }

    SalvarDesenho() {
        const tmp = document.createElement("canvas");
        tmp.id = "criar-imagem";

        document.body.appendChild(tmp);

        tmp.width = this.camadaAtual.width;
        tmp.height = this.camadaAtual.height;

        const ctx = tmp.getContext("2d");

        for (let camada of this.camadas) {
            ctx.drawImage(camada, 0, 0);
        }

        const img = tmp.toDataURL("image/png", 1);

        const desenhoCompleto = document.createElement("img");
        desenhoCompleto.id = "desenho-completo";
        desenhoCompleto.width = tmp.width / 2;
        desenhoCompleto.src = img;

        const downloadImg = document.createElement("a");
        downloadImg.innerText = "Salvar desenho";
        downloadImg.setAttribute("download", "desenho.png");
        downloadImg.href = img;

        const containerSalvar = document.getElementById("salvar");
        containerSalvar.querySelectorAll("img, a").forEach(elemento => elemento.remove());

        containerSalvar.getElementsByTagName("h1")[0].insertAdjacentElement("afterend", desenhoCompleto);
        containerSalvar.getElementsByClassName("fechar-modal")[0].insertAdjacentElement("beforebegin", downloadImg);
    }
}