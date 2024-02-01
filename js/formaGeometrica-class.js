export class FormaGeometrica {
    constructor(ctx) {
        this.ctx = ctx;
        this.quadrado = false;
        this.circulo = false;
        this.reta = false;
        this.posInicio = {
            x: null,
            y: null,
        }
        this.posFinal = {
            x: null,
            y: null,
        }
        this.estadoAntesDaForma = null;
        this.estadoDepoisDaForma = null;

        this.icone = document.getElementById("forma-geometrica");

        const quadrado = document.getElementsByClassName("quadrado")[0];
        const circulo = document.getElementsByClassName("circulo")[0];
        const reta = document.getElementsByClassName("reta")[0];

        quadrado.addEventListener("click", () => {
            this.quadrado = true;
            quadrado.classList.add("nao-selecionado");

            this.circulo = false;
            this.reta = false;
            circulo.classList.remove("nao-selecionado");
            reta.classList.remove("nao-selecionado");
        });
        circulo.addEventListener("click", () => {
            this.circulo = true;
            circulo.classList.add("nao-selecionado");

            this.quadrado = false;
            this.reta = false;
            quadrado.classList.remove("nao-selecionado");
            reta.classList.remove("nao-selecionado");
        });
        reta.addEventListener("click", () => {
            this.reta = true;
            reta.classList.add("nao-selecionado");

            this.circulo = false;
            this.quadrado = false;
            circulo.classList.remove("nao-selecionado");
            quadrado.classList.remove("nao-selecionado");
        });

        quadrado.click();
    }

    DesenhaForma () {
        this.posFinal.x = event.offsetX;
        this.posFinal.y = event.offsetY;

        if (event.touches)  {
            event.preventDefault();
            this.posFinal.x =  event.touches[0].clientX - this.ctx.canvas.getBoundingClientRect().left;
            this.posFinal.y =  event.touches[0].clientY - this.ctx.canvas.getBoundingClientRect().top;
        }

        if (this.posInicio.x === null && this.posInicio.y === null) {
            let eventoDeMovimento = "mousemove";
            let eventoTerminar = "mouseup";
            if (event.touches) {
                eventoDeMovimento = "touchmove";
                eventoTerminar = "touchend";
            }

            this.posInicio.x = this.posFinal.x;
            this.posInicio.y = this.posFinal.y;
            this.estadoAntesDaForma = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            
            const self = this.DesenhaForma.bind(this);
            this.ctx.canvas.addEventListener(eventoDeMovimento, self);
            this.ctx.canvas.addEventListener(eventoTerminar, () => {
                this.posInicio.x = null;
                this.posInicio.y = null;
                this.ctx.putImageData(this.estadoDepoisDaForma, 0, 0);
                this.estadoAntesDaForma = null;

                this.ctx.canvas.removeEventListener(eventoDeMovimento, self);
            }, { once: true });
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.fillStyle = document.getElementById("cor-preenchimento-forma-geometrica").value;
        this.ctx.lineWidth = Number(document.getElementById("tamanho-linha-forma-geometrica").value);
        this.ctx.strokeStyle = document.getElementById("cor-linha-forma-geometrica").value;

        this.ctx.beginPath();

        if (this.quadrado) {
            if (this.posFinal.x - this.posInicio.x === 0) {
                return;
            }

            this.ctx.rect(this.posInicio.x, this.posInicio.y, this.posFinal.x - this.posInicio.x, this.posFinal.y - this.posInicio.y);

            if (document.getElementById("preenchimento-forma-geometrica").checked) {
                this.ctx.fill();
            }
            if (document.getElementById("linha-forma-geometrica").checked) {
                this.ctx.rect(this.posInicio.x, this.posInicio.y, this.posFinal.x - this.posInicio.x, this.posFinal.y - this.posInicio.y);
                this.ctx.stroke();
            }
        } else if (this.circulo) {
            let ajustaRaio = 1;

            if (this.posFinal.x - this.posInicio.x === 0) {
                return;
            }

            if (this.posFinal.x - this.posInicio.x < 0) {
                ajustaRaio *= -1;
            }

            this.ctx.arc(this.posFinal.x, this.posFinal.y, (this.posFinal.x - this.posInicio.x) * ajustaRaio, 0, this.posInicio.x);

            if (document.getElementById("preenchimento-forma-geometrica").checked) {
                this.ctx.fill();
            }
            if (document.getElementById("linha-forma-geometrica").checked) {
                this.ctx.arc(this.posFinal.x, this.posFinal.y, (this.posFinal.x - this.posInicio.x) * ajustaRaio, 0, this.posInicio.x);
                this.ctx.stroke();
            }
        } else if (this.reta) {
            this.ctx.moveTo(this.posInicio.x, this.posInicio.y);
            this.ctx.lineTo(this.posFinal.x, this.posFinal.y);
            this.ctx.stroke();
        }

        this.ctx.closePath();

        let estadoFormaGeometrica = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.estadoDepoisDaForma = new ImageData(this.ctx.canvas.width, this.ctx.canvas.height);

        for (let i = 0; i < estadoFormaGeometrica.data.length; i++) {
            if (estadoFormaGeometrica.data[i] !== 0) {
                this.estadoDepoisDaForma.data[i] = estadoFormaGeometrica.data[i];
            } else {
                this.estadoDepoisDaForma.data[i] = this.estadoAntesDaForma.data[i];
            }
        }

        this.ctx.putImageData(this.estadoDepoisDaForma, 0, 0);
    };
}