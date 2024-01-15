import { App } from "./app-class.js";

const app = new App();
let pilhaMenuAberto = [];
const btnFechar = document.getElementsByClassName("fechar-modal");

document.getElementById("confimar-tamanho-tela").addEventListener("click", ()=>{
    let resolucaoDefinida = false;

    const resolucao = document.getElementById("resolucao-escolhida").value;
    const larguraTela = Number(document.getElementById("altura-tela").value);
    const alturaTela = Number(document.getElementById("altura-tela").value);

    //valores digitados pelo usuário tem prioridade sobre as resoluções padrão
    if (resolucao !== "invalido" && (larguraTela === 0 && alturaTela === 0)) { 
        resolucaoDefinida = true;

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
                app.Init(larguraTela, alturaTela);
                
                document.getElementById("configuracao").style.display = "none";
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
        document.getElementById("configuracao").style.display = "none";
        document.getElementsByTagName("main")[0].style.display = "grid";
    
        document.getElementById("pincel").click();
    }
});

document.getElementById("mostrar-ajuda").addEventListener("click", ()=>{
    const modalAjuda = document.getElementById("tela-ajuda");
    document.getElementsByTagName("main")[0].style.display = "none";
    
    AbrirModal(modalAjuda);
});

document.getElementById("abrir-salvar").addEventListener("click", ()=>{
    const modalSalvar = document.getElementById("salvar");
    app.SalvarDesenho();
    
    AbrirModal(modalSalvar);
});

function AbrirModal(modal) {
    const estilo = getComputedStyle(modal);
    
    if (estilo.display === "none") {
        pilhaMenuAberto.push(modal);
        modal.style.setProperty("display", "flex");
        modal.style.setProperty("animation-name", "moveIn");

        // document.body.addEventListener("click", FecharModal);
    }
}

function FecharModal() {
    if (pilhaMenuAberto.length > 0) { 
        const modal = pilhaMenuAberto.pop();
        
        const estiloModal = getComputedStyle(modal);
        modal.style.setProperty("animation-name", "fadeOut");

        const tempoAnimacaoStr = estiloModal.animationDuration;
        const tempoAnimacaoInt = Number(tempoAnimacaoStr.slice(0, tempoAnimacaoStr.indexOf("s")));
        setTimeout(()=>{
            modal.style.setProperty("display", "none");
        }, tempoAnimacaoInt*1000);
    }
    document.body.removeEventListener("click", FecharModal);

    document.getElementsByTagName("main")[0].style.display = "grid";
    event.stopPropagation();
}

for (let btn of btnFechar) {
    btn.addEventListener("click", FecharModal);
}