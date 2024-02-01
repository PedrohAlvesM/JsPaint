import { Pincel } from "./pincel-class.js";
import { Borracha } from "./borracha-class.js";
import { CriarTexto } from "./criarTexto-class.js";
import { FormaGeometrica } from "./formaGeometrica-class.js";
import { MoverArea } from "./moverArea-class.js";
import { SelecionaCor } from "./selecionaCor-class.js";

export class App {
    constructor() {
        this.touchscreen = false;

        this.camadas = [];
        this.camadaAtual = null;
        this.contextoAtual = null;
        this.pilhaAcoes = [];

        this.ferramentaSelecionada = null;
        this.pincel = new Pincel();
        this.borracha = new Borracha();
        this.texto = new CriarTexto();
        this.formaGeometrica = new FormaGeometrica();
        this.mover = new MoverArea();
        this.selecionaCor = new SelecionaCor();

        this.MovimentoMouse = this.MovimentoMouse.bind(this);

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
        let eventoComecar = "mousedown";
        let eventoTerminar = "mouseup";
        let eventoDeMovimento = "mousemove";

        if (this.touchscreen) {
            eventoComecar = "touchstart";
            eventoTerminar = "touchend";
            eventoDeMovimento = "touchmove";
        }

        this.camadaAtual.addEventListener(eventoComecar, (e)=>{
            let coordenadas = {x: e.offsetX, y: e.offsetY};

            if (eventoComecar === "touchstart")  {
                e.preventDefault();
                coordenadas.x =  e.touches[0].clientX;
                coordenadas.y =  e.touches[0].clientY;
            }

            if (this.pilhaAcoes.length > 9) {
                this.pilhaAcoes.shift();
                this.pilhaAcoes.push(this.contextoAtual.getImageData(0, 0, this.camadaAtual.width, this.camadaAtual.height));
            }
            else {
                this.pilhaAcoes.push(this.contextoAtual.getImageData(0, 0, this.camadaAtual.width, this.camadaAtual.height));
            }
    
    
            if (this.ferramentaSelecionada === this.pincel || this.ferramentaSelecionada === this.borracha) {
                this.camadaAtual.addEventListener(eventoDeMovimento, this.MovimentoMouse);
            }
            else if (this.ferramentaSelecionada === this.selecionaCor) {
                this.selecionaCor.CorSelecionada(coordenadas.x, coordenadas.y, this.camadas);
            }
            else if (this.ferramentaSelecionada === this.texto) {
                this.texto.CriaTexto(coordenadas.x, coordenadas.y, this.contextoAtual);
            }
            else if (this.ferramentaSelecionada === this.formaGeometrica) {
                this.formaGeometrica.ctx = this.contextoAtual;
                this.formaGeometrica.DesenhaForma();
            }
            else if (this.ferramentaSelecionada === this.BaldeTinta) {
                this.BaldeTinta.Pintar(this.contextoAtual, this.camadaAtual.width, this.camadaAtual.height, coordenadas.x, coordenadas.y);
            }
        });

        this.camadaAtual.addEventListener(eventoTerminar, (e)=>{
            if (eventoTerminar === "touchend") e.preventDefault();

            if (this.borracha.apagando) {
                this.camadaAtual.removeEventListener(eventoDeMovimento, this.MovimentoMouse);
                this.borracha.apagando = false;
            }
            else if (this.pincel.desenhando) {
                this.camadaAtual.removeEventListener(eventoDeMovimento, this.MovimentoMouse);
                this.pincel.desenhando = false;
            }
            this.contextoAtual.beginPath();
        });
        
        if (this.touchscreen) {
            document.addEventListener("touchstart", (e)=>{
                if (e.touches.length === 2) {
                    this.DesfazerAcao();
                }
            });
        }
        else {
            document.addEventListener("keydown", (tecla) => {
                if (document.activeElement === document.getElementById("texto-inserido")) {
                    return
                }
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
                else if (this.ferramentaSelecionada) {
                    if (atalhoSimples[tecla.key.toLocaleLowerCase()]) {
                        atalhoSimples[tecla.key.toLocaleLowerCase()]();
                    }
                }
    
    
            });
        }
    }

    MovimentoMouse(e) {
        let coordenadas = {x: e.offsetX, y: e.offsetY};

        if (e.touches)  {
            e.preventDefault();
            coordenadas.x =  e.touches[0].clientX - this.camadaAtual.offsetLeft;
            coordenadas.y =  e.touches[0].clientY - this.camadaAtual.offsetTop;
        }

        if (this.ferramentaSelecionada === null) {
            this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
        }

        if (this.ferramentaSelecionada === this.pincel) {
            this.pincel.desenhando = true;
            this.borracha.apagando = false;
            this.pincel.Desenhar(coordenadas.x,coordenadas.y, this.contextoAtual);
        }
        else if (this.ferramentaSelecionada === this.borracha) {
            this.pincel.desenhando = false;
            this.borracha.apagando = true;
            this.borracha.Apagar(coordenadas.x,coordenadas.y, this.contextoAtual);
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
        const containerCamadaInfo = document.createElement("div");

        const containerOpacidade = document.createElement("div");
        const iconeOpacidade = document.createElement("img");
        const opacidadeSlider = document.createElement("input");

        const criarCamadaBtn = document.createElement("img");
        const excluirBtn = document.createElement("img");
        const novoTexto = document.createElement("p");

        containerCamadaInfo.classList.add("camada-info", "selecionado");

        iconeOpacidade.classList.add("imagem");
        iconeOpacidade.src = "../img/eye-svgrepo-com.svg";
        opacidadeSlider.type = "range";
        opacidadeSlider.value = 100;

        criarCamadaBtn.classList.add("imagem");
        criarCamadaBtn.src = "../img/file-plus-alt-1-svgrepo-com.svg";

        excluirBtn.classList.add("imagem");
        excluirBtn.src = "../img/file-xmark-svgrepo-com.svg";

        novoTexto.classList.add("nome-camada");

        opacidadeSlider.addEventListener("input", ()=>{
            novaCamada.style.opacity = (Number(opacidadeSlider.value)/100);
        });

        //adiciona lógica para trocar de camada
        containerCamadaInfo.addEventListener("click", (e) => {
            this.TrocarCamada(novaCamada);
            e.stopPropagation();
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

        excluirBtn.addEventListener("click", (e) => {
            this.DeletarCamada(novaCamada, containerCamadaInfo, e);
        });
        criarCamadaBtn.addEventListener("click", () => { this.CriaCamada(larguraTela, alturaTela) });

        //adiciona todos os novos elementos nos seus containers
        containerOpacidade.appendChild(iconeOpacidade);
        containerOpacidade.appendChild(opacidadeSlider);

        containerCamadaInfo.appendChild(novoTexto);
        containerCamadaInfo.appendChild(criarCamadaBtn);
        containerCamadaInfo.appendChild(excluirBtn);
        containerCamadaInfo.appendChild(containerOpacidade);
        containerNovaCamada.appendChild(containerCamadaInfo);

    }

    TrocarCamada(camada) {
        this.camadaAtual = camada;
        this.contextoAtual = this.camadaAtual.getContext("2d");
        this.camadas.forEach(camada => camada.style.zIndex = 0);
        camada.style.zIndex = 1;

        for (let tmp of document.querySelectorAll("div.camada-info")) {
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

    SalvarDesenho(formato="png") {
        const tmp = document.createElement("canvas");
        tmp.id = "criar-imagem";

        document.body.appendChild(tmp);

        tmp.width = this.camadaAtual.width;
        tmp.height = this.camadaAtual.height;

        const ctx = tmp.getContext("2d");
        if (formato === "jpeg") {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(0,0, tmp.width, tmp.height);
            ctx.closePath();
        }

        for (let camada of this.camadas) {
            //colocar o filter no canvas temporario 
            ctx.beginPath();
            ctx.filter = `opacity(${Number(camada.style.opacity)*100}%)`;
            ctx.closePath();
            ctx.drawImage(camada, 0, 0);
        }

        const img = tmp.toDataURL(`image/${formato}`, 1);

        const desenhoCompleto = document.createElement("img");
        desenhoCompleto.id = "desenho-completo";
        desenhoCompleto.width = tmp.width / 2;
        desenhoCompleto.src = img;

        const downloadImg = document.createElement("a");
        downloadImg.innerText = "Salvar desenho";
        downloadImg.setAttribute("download", `desenho.${formato}`);
        downloadImg.href = img;

        const containerSalvar = document.getElementById("salvar");
        containerSalvar.querySelectorAll("img, a").forEach(elemento => elemento.remove());

        containerSalvar.getElementsByTagName("h1")[0].insertAdjacentElement("afterend", desenhoCompleto);
        containerSalvar.getElementsByClassName("fechar-modal")[0].insertAdjacentElement("beforebegin", downloadImg);
    }
}