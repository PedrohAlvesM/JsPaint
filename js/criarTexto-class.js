export class CriarTexto {
    constructor() {
        this.tamanhoFonte = 16;
        this.fonte = "Arial";

        this.icone = document.getElementById("cria-texto");

        const tamanhoTexto = document.getElementsByClassName("tamanho-fonte");

        for (let i = 0; i < tamanhoTexto.length; i++) {
            tamanhoTexto[i].addEventListener("input", () => {
                this.tamanhoFonte = Number(tamanhoTexto[i].value);
                tamanhoTexto[1].value = this.tamanhoFonte;
            });
        }
    }

    CriaTexto(x, y, ctx) {
        const fonte = document.getElementById("fontes").value;
        const texto = document.getElementById("texto-inserido").value;
        const cor = document.getElementById("cor-texto").value;
        ctx.fillStyle = cor;

        ctx.font = `${this.tamanhoFonte}px ${fonte}`;
        ctx.textAlign = "center";
        ctx.fillText(texto, x, y);
    }
}
