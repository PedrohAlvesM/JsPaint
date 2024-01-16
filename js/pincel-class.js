export class Pincel {
    constructor() {
        this.tamanhoPincel = 20;
        this.desenhando = false;

        this.icone = document.getElementById("pincel");
        this.containerOpcoes = document.getElementsByClassName("ferramenta-pincel");

        const tamanhoPincel = document.getElementsByClassName("tamanho-pincel");
        for (let i = 0; i < tamanhoPincel.length; i++) {
            tamanhoPincel[i].addEventListener("input", () => {
                this.tamanhoPincel = Number(tamanhoPincel[i].value);
                tamanhoPincel[1].value = this.tamanhoPincel;
            });
        }
    }

    Desenhar(x, y, ctx) {
        if (this.desenhando) {
            ctx.strokeStyle = document.getElementById("cor-pincel").value;
            ctx.lineWidth = this.tamanhoPincel;
            ctx.lineJoin = "round";

            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}