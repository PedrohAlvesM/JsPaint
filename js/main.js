import { App } from "./app-class.js";

const app = new App();
let pilhaMenuAberto = [];
const btnFechar = document.getElementsByClassName("fechar-modal");

document.getElementById("modal-configuracao").style.display = "grid";
VerificaDesenhosSalvos();

document.getElementById("confimar-tamanho-tela").addEventListener("click", ()=>{
    let resolucaoDefinida = false;

    const resolucao = document.getElementById("resolucao-escolhida").value;
    const larguraTela = Number(document.getElementById("altura-tela").value);
    const alturaTela = Number(document.getElementById("altura-tela").value);

    //valores digitados pelo usuário tem prioridade sobre as resoluções padrão
    if (resolucao !== "invalido" && (larguraTela === 0 && alturaTela === 0)) { 
        resolucaoDefinida = true;
        app.touchscreen = navigator.maxTouchPoints > 0;

        const valoresResolucao = {
           "sdr": function(){app.Init(480,720)}, 
           "sdp": function (){app.Init(720,480)}, 
           "hdr": function(){app.Init(1280, 720)},
           "hdp": function(){app.Init(720, 1280)},
           "fhdr": function(){app.Init(1920, 1080)},
           "fhdp": function(){app.Init(1080, 1920)},
        }
        if (valoresResolucao[resolucao]) {
            valoresResolucao[resolucao]();
        }
    }

    if (!resolucaoDefinida) {
        if ((larguraTela <= 0 || isNaN(larguraTela)) || (alturaTela <= 0 || isNaN(alturaTela))) {
            document.getElementById("mensagem").style.display = "block";
            document.getElementById("mensagem").innerText = "Digite valores válidos";
        }
        
        else if ((larguraTela > 1920 || alturaTela > 1920)) {
            document.getElementById("mensagem").style.display = "block";
            document.getElementById("mensagem").innerText = "Resoluções maiores que Full HD podem causar problemas de usabilidade e desempenho";
            document.getElementById("resolucao-alta-demais").style.display = "block";

            document.getElementById("criar-resolucao-alta").addEventListener("click", ()=>{
                resolucaoDefinida = true;
                
                let touchScreen = navigator.maxTouchPoints > 0;
                app.touchscreen = touchScreen;
                app.Init(larguraTela, alturaTela);
                
                document.getElementById("modal-configuracao").style.display = "none";
                document.getElementsByTagName("main")[0].style.display = "grid";
                document.body.style.backgroundColor = "white";
                document.documentElement.style.backgroundColor = "white";
                
                document.getElementById("pincel").click();
            });
        }
        else {
            resolucaoDefinida = true;
            app.Init(larguraTela, alturaTela)
        }
    }
    if (resolucaoDefinida) {
        document.getElementById("modal-configuracao").style.display = "none";
        document.getElementsByTagName("main")[0].style.display = "grid";
        document.documentElement.style.background = "#fff";
        document.body.style.background = "#fff";
        
        const sliders = document.getElementsByTagName("main")[0].querySelectorAll("input[type='range']:not(#camadas-container input[type='range']), input[type='number']");
        for (let s of sliders) {
            s.value = 5;
        }    
        document.getElementById("pincel").click();
    }
});

document.getElementById("abrir-ajuda").addEventListener("click", ()=>{
    const modalAjuda = document.getElementById("modal-ajuda");
    
    AbrirModal(modalAjuda);
});

document.getElementById("abrir-exportar").addEventListener("click", ()=>{
    const modalExportar = document.getElementById("modal-exportar");
    app.SalvarDesenho();
    
    AbrirModal(modalExportar);
});

document.getElementById("abrir-salvar").addEventListener("click", ()=>{
    const modalSalvar = document.getElementById("modal-salvar");
    
    AbrirModal(modalSalvar);
});

function AbrirModal(modal) {
    const estilo = getComputedStyle(modal);
    
    if (estilo.display === "none") {
        pilhaMenuAberto.push(modal);
        modal.style.setProperty("display", "grid");
        modal.style.setProperty("animation-name", "moveIn");
        modal.style.setProperty("z-index", pilhaMenuAberto.length+1);
    }
}

function FecharModal() {
    if (pilhaMenuAberto.length > 0) { 
        const modal = pilhaMenuAberto.pop();
        
        const estiloModal = getComputedStyle(modal);
        modal.style.setProperty("animation-name", "moveOut");

        const tempoAnimacaoStr = estiloModal.animationDuration;
        const tempoAnimacaoInt = Number(tempoAnimacaoStr.slice(0, tempoAnimacaoStr.indexOf("s")));
        setTimeout(()=>{
            modal.style.setProperty("display", "none");
        }, tempoAnimacaoInt*999);

        if (modal.id === "modal-salvar" && document.querySelector("#permitido-salvar-desenho").checked) {
            app.SalvarEstadoDesenho();
        }
    }

    document.getElementsByTagName("main")[0].style.display = "grid";
    event.stopPropagation();
}

function VerificaDesenhosSalvos() {
    const desenhosSalvos = localStorage.getItem("desenhosSalvos");
    if (desenhosSalvos !== null) {
        const dadosDesenhos = JSON.parse(desenhosSalvos);
        const containerDesenhos = document.createElement("div");
        
        for (let i = 0; i < dadosDesenhos.length; i++) {
            const container = document.createElement("div");
            container.classList.add("container-seleciona-desenho");

            const opcaoDesenho = document.createElement("label");
            opcaoDesenho.innerText = dadosDesenhos[i].nome;

            const carregarDesenhoBtn = document.createElement("button");
            carregarDesenhoBtn.addEventListener("click", ()=>{app.CarregarDesenho(i)});
            carregarDesenhoBtn.textContent = "Carregar Desenho";

            const apagarDesenhoBtn = document.createElement("button");
            apagarDesenhoBtn.addEventListener("click", ()=>{
                apagarDesenhoBtn.parentElement.remove();
                app.ApagarDesenho(i);
            });
            apagarDesenhoBtn.textContent = "Apagar desenho";


            container.appendChild(opcaoDesenho);
            container.appendChild(apagarDesenhoBtn);
            container.appendChild(carregarDesenhoBtn);

            containerDesenhos.appendChild(container);
        }

        document.getElementById("resolucao-escolhida").insertAdjacentElement("afterend", containerDesenhos);
    }
}

for (let btn of btnFechar) {
    btn.addEventListener("click", FecharModal);
}

window.addEventListener("beforeunload", ()=>{
    event.preventDefault();

    // Included for legacy support, e.g. Chrome/Edge < 119
    event.returnValue = true;

    return "Caso a página seja recarregada ou fechada, o desenho será perdido.";
});

document.getElementById("salvar-branco").addEventListener("click", (e)=>{
    if (e.target.innerText === "Salvar desenho com fundo branco") {
        app.SalvarDesenho("jpeg");
        e.target.innerText = "Salvar desenho sem fundo";
    }
    else {
        app.SalvarDesenho("png");
        e.target.innerText = "Salvar desenho com fundo branco";
    }
    
});