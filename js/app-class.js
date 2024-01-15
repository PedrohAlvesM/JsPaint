import { ferramentas } from "./ferramentas.js";

export class App {
    constructor() {
        this.camadas = [];
        this.camadaAtual = null;
        this.contextoAtual = null;
        this.pilhaAcoes = [];

        this.MovimentoMouse = this.MovimentoMouse.bind(this);
    }

    Init(larguraTela, alturaTela) {
        this.CriaCamada(larguraTela, alturaTela);

        for (let ferramenta in ferramentas) {
            if (ferramenta !== "icones" && ferramenta !== "ferramentaSelecionada" && ferramenta !== "GerenciaFerramenta" && ferramenta !== "DefineCorPrincipal") {
                ferramentas[ferramenta].Init();
            }
        }

        ferramentas.pincel.tamanhoPincel = 2;
        
        document.getElementById("confirmar-mover").addEventListener("click", () => { ferramentas.mover.MoverArea(this.contextoAtual); });
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


            if (ferramentas.ferramentaSelecionada === ferramentas.pincel || ferramentas.ferramentaSelecionada === ferramentas.borracha) {
                this.camadaAtual.addEventListener("mousemove", this.MovimentoMouse);
            }
            else if (ferramentas.ferramentaSelecionada === ferramentas.SelecionaCor) {
                ferramentas.SelecionaCor.CorSelecionada(mouse.offsetX, mouse.offsetY, this.contextoAtual);
            }
            else if (ferramentas.ferramentaSelecionada === ferramentas.texto) {
                ferramentas.texto.CriaTexto(mouse.offsetX, mouse.offsetY, this.contextoAtual);
            }
            else if (ferramentas.ferramentaSelecionada === ferramentas.formaGeometrica) {
                ferramentas.formaGeometrica.ctx = this.contextoAtual;
                ferramentas.formaGeometrica.DesenhaForma();
            }
            else if (ferramentas.ferramentaSelecionada === ferramentas.BaldeTinta) {
                ferramentas.BaldeTinta.Pintar(this.contextoAtual, this.camadaAtual.width, this.camadaAtual.height, mouse.offsetX, mouse.offsetY);
            }

        });

        this.camadaAtual.addEventListener("mouseup", () => {
            if (ferramentas.borracha.apagando) {
                this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
                ferramentas.borracha.apagando = false;
            }
            else if (ferramentas.pincel.desenhando) {
                this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
                ferramentas.pincel.desenhando = false;
            }
            this.contextoAtual.beginPath();
        });

        document.addEventListener("keydown", (tecla) => {
            const atalhoSimples = {
                "p": () => {
                    ferramentas.ferramentaSelecionada = ferramentas.pincel;
                    document.getElementById("pincel").click();
                },
                "b": () => {
                    ferramentas.ferramentaSelecionada = ferramentas.borracha;
                    document.getElementById("borracha").click();
                },
                "f": ()=>{
                    ferramentas.ferramentaSelecionada = ferramentas.formaGeometrica;
                    document.getElementById("forma-geometrica").click();
                },
                "m": ()=>{
                    ferramentas.ferramentaSelecionada = ferramentas.mover;
                    document.getElementById("mover").click();
                },
                "i": () => {
                    ferramentas.ferramentaSelecionada = ferramentas.SelecionaCor;
                    document.getElementById("seleciona-cor").click();
                },
                "t": () => {
                    ferramentas.ferramentaSelecionada = ferramentas.texto;
                    document.getElementById("cria-texto").click();
                },
            }

            if (tecla.ctrlKey) {
                if (tecla.key.toLocaleLowerCase() === "z") {
                    this.DesfazerAcao();
                }
            }
            else if (ferramentas.ferramentaSelecionada !== ferramentas.texto) {
                if (atalhoSimples[tecla.key.toLocaleLowerCase()]) {
                    atalhoSimples[tecla.key.toLocaleLowerCase()]();
                }
            }


        });
    }

    MovimentoMouse(mouse) {
        if (ferramentas.ferramentaSelecionada === null) {
            this.camadaAtual.removeEventListener("mousemove", this.MovimentoMouse);
        }

        if (ferramentas.ferramentaSelecionada === ferramentas.pincel) {
            ferramentas.pincel.desenhando = true;
            ferramentas.borracha.apagando = false;
            ferramentas.pincel.Desenhar(mouse.offsetX, mouse.offsetY, this.contextoAtual);
        }
        else if (ferramentas.ferramentaSelecionada === ferramentas.borracha) {
            ferramentas.pincel.desenhando = false;
            ferramentas.borracha.apagando = true;
            ferramentas.borracha.Apagar(mouse.offsetX, mouse.offsetY, this.contextoAtual);
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
        containerCamadaInfo.addEventListener("click", ()=>{
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
        criarCamadaBtn.addEventListener("click", ()=>{this.CriaCamada(larguraTela, alturaTela)});

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
        const indexContainer = this.camadas.findIndex((c)=>c === camada);
        document.querySelectorAll("div.camada-info")[indexContainer].classList.remove("nao-selecionado");
        document.querySelectorAll("div.camada-info")[indexContainer].classList.add("selecionado");
    }

    DeletarCamada(camada, camadaInfo, clique) {
        if (this.camadas.length === 1) {
            return
        }
        const indexDeletar = this.camadas.findIndex((c)=>c === camada);

        this.camadas.splice(indexDeletar, 1);
        camada.remove();
        camadaInfo.remove();
        
        const nomeCamada = document.getElementsByClassName("nome-camada");
        let i = 0;
        let pularCamadaComNome = 0;
        while (i+pularCamadaComNome < nomeCamada.length) {
            if (nomeCamada[i+pularCamadaComNome].innerText.includes("Camada")) {
                nomeCamada[i+pularCamadaComNome].innerText = `Camada ${i+1}`;
                i++;
            }
            else {
                pularCamadaComNome++;
            }
        }
        this.TrocarCamada(this.camadas[this.camadas.length-1]);

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