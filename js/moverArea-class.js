export class MoverArea {
    constructor() {
        this.posInicial = {
            x: 0,
            y: 0,
            largura: 0,
            altura: 0,
        };
        this.posFinal = {
            x: 0,
            y: 0,
            largura: 0,
            altura: 0,
        };

        this.mover = false;

        this.icone = document.getElementById("mover");

        const area = document.getElementById("area-mover");

        document.addEventListener("dragover", (e) => {
            e.preventDefault();
            const posicao = area.getBoundingClientRect();
            const menuLateral = document.getElementsByClassName("ferramentas")[0];
            const desconsiderar = menuLateral.getBoundingClientRect();

            area.style.top = (e.clientY - posicao.height / 2) + "px";
            area.style.left = (e.clientX - posicao.width / 2) + "px";

            if (this.mover) {
                this.posFinal.x = posicao.x - desconsiderar.width;
                this.posFinal.y = posicao.y;
                this.posFinal.largura = posicao.width;
                this.posFinal.altura = posicao.height;
            } else {
                this.posInicial.x = posicao.x - desconsiderar.width;
                this.posInicial.y = posicao.y;
                this.posInicial.largura = posicao.width;
                this.posInicial.altura = posicao.height;
            }
        });

        document.getElementById("area-selecionada").addEventListener("click", () => { this.mover = true; area.style.resize = "none";});
        document.getElementById("cancelar-mover").addEventListener("click", () => { this.mover = false; area.style.resize = "both";});
    }

    MoverArea(ctx) {
        if (this.mover) {
            const areaMover = ctx.getImageData(this.posInicial.x, this.posInicial.y, this.posInicial.largura, this.posInicial.altura);
            const areaSobreposta = ctx.getImageData(this.posFinal.x, this.posFinal.y, this.posFinal.largura, this.posFinal.altura);
            const areaFinal = new ImageData(this.posFinal.largura, this.posFinal.altura);
            for (let i = 0; i < areaMover.data.length; i++) {
                if (areaMover.data[i] !== 0) {
                    areaFinal.data[i] = areaMover.data[i];
                }
                else {
                    areaFinal.data[i] = areaSobreposta.data[i];
                }
            }

            ctx.putImageData(areaFinal, this.posFinal.x, this.posFinal.y);

            this.mover = false;
            document.getElementById("area-mover").style.resize = "both";
        }
    }
}