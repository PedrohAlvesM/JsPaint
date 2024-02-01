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

        
        let eventoDeMovimento = "dragover";
        if (navigator.maxTouchPoints > 0) {
           eventoDeMovimento = "touchmove";
        }

        area.addEventListener(eventoDeMovimento, (e) => {
            e.preventDefault();
            let coordenadas = {x: e.clientX, y: e.clientY};

            if (e.touches)  {
                coordenadas.x =  e.touches[0].clientX;
                coordenadas.y =  e.touches[0].clientY;
            }
    
            const posicao = area.getBoundingClientRect();
            const menuLateral = document.getElementsByClassName("ferramentas")[0];
            const desconsiderar = menuLateral.getBoundingClientRect();

            area.style.top = (coordenadas.y - posicao.height / 2) + "px";
            area.style.left = (coordenadas.x - posicao.width / 2) + "px";

            if (this.mover) {
                this.posFinal.x = posicao.x - desconsiderar.right;
                this.posFinal.y = posicao.y;
                this.posFinal.largura = posicao.width;
                this.posFinal.altura = posicao.height;
            } 
            else {
                this.posInicial.x = posicao.x - desconsiderar.right;
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
            const areaSobreposta = ctx.getImageData(this.posInicial.x, this.posInicial.y, this.posInicial.largura, this.posInicial.altura);
            const areaSelecionada = ctx.getImageData(this.posFinal.x, this.posFinal.y, this.posFinal.largura, this.posFinal.altura);
            
            const areaFinal = new ImageData(this.posFinal.largura, this.posFinal.altura);
            for (let i = 0; i < areaSobreposta.data.length; i++) {
                if (areaSobreposta.data[i] !== 0) {
                    areaFinal.data[i] = areaSobreposta.data[i];
                }
                else {
                    areaFinal.data[i] = areaSelecionada.data[i];
                }
            }

            ctx.putImageData(areaFinal, this.posFinal.x, this.posFinal.y);

            this.mover = false;
            this.posInicial.x = 0;
            this.posInicial.y = 0;
            this.posInicial.largura = 0;
            this.posInicial.altura = 0;
            document.getElementById("area-mover").style.resize = "both";
        }
    }
}