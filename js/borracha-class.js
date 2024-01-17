export class Borracha {
    constructor() {
        this.tamanhoBorracha = 2;
        this.apagando = false;

        this.icone = document.getElementById("borracha");

        const tamanhoBorracha = document.getElementsByClassName("tamanho-borracha");
        for (let i = 0; i < tamanhoBorracha.length; i++) {
            tamanhoBorracha[i].addEventListener("input", () => {
                this.tamanhoBorracha = Number(tamanhoBorracha[i].value);
                tamanhoBorracha[1].value = this.tamanhoBorracha;
            });
        }
    }

    Apagar(x, y, ctx) {
        if (this.apagando) {
            const apagar = ctx.createImageData(this.tamanhoBorracha, this.tamanhoBorracha);
            ctx.putImageData(apagar, x, y, 0, 0, this.tamanhoBorracha, this.tamanhoBorracha);
        }
    }
}