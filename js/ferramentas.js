export const ferramentas = {
    icones: [],
    ferramentaSelecionada: null,


    pincel: {
        corPincel: "black",
        tamanhoPincel: 20,
        desenhando: false,

        Init: function () {
            const icone = document.getElementById("pincel");
            ferramentas.icones.push(icone);

            icone.addEventListener("click", () => {
                ferramentas.ferramentaSelecionada = this;

                ferramentas.icones.forEach(elemento => elemento.classList.remove("nao-selecionado"));
                ferramentas.GerenciaFerramenta(document.getElementsByClassName("ferramenta-pincel")[0]);

                icone.classList.add("nao-selecionado");
            });

            const tamanhoPincel = document.getElementsByClassName("tamanho-pincel");
            for (let i = 0; i < tamanhoPincel.length; i++) {
                tamanhoPincel[i].addEventListener("input", () => {
                    this.tamanhoPincel = Number(tamanhoPincel[i].value);
                    tamanhoPincel[1].value = this.tamanhoPincel;
                });
            }

            const corPincel = document.getElementById("cor-pincel");
            corPincel.addEventListener("input", () => {
                this.corPincel = corPincel.value;
                ferramentas.DefineCorPrincipal(corPincel.value);
            });
        },

        Desenhar: function (x, y, ctx) {
            if (this.desenhando) {
                ctx.strokeStyle = this.corPincel;
                ctx.lineWidth = this.tamanhoPincel;
                ctx.lineJoin = "round";

                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    },

    borracha: {
        tamanhoBorracha: 2,
        apagando: false,

        Init: function () {
            const icone = document.getElementById("borracha");
            ferramentas.icones.push(icone);

            icone.addEventListener("click", () => {
                ferramentas.icones.forEach(elemento => elemento.classList.remove("nao-selecionado"));
                ferramentas.GerenciaFerramenta(document.getElementsByClassName("ferramenta-borracha")[0]);
                ferramentas.ferramentaSelecionada = this;

                icone.classList.add("nao-selecionado");
            });

            const tamanhoBorracha = document.getElementsByClassName("tamanho-borracha");
            for (let i = 0; i < tamanhoBorracha.length; i++) {
                tamanhoBorracha[i].addEventListener("input", () => {
                    this.tamanhoBorracha = Number(tamanhoBorracha[i].value);
                    tamanhoBorracha[1].value = this.tamanhoBorracha;
                });
            }

        },

        Apagar: function (x, y, ctx) {
            if (this.apagando) {

                const apagar = ctx.createImageData(this.tamanhoBorracha, this.tamanhoBorracha);
                ctx.putImageData(apagar, x, y, 0, 0, this.tamanhoBorracha, this.tamanhoBorracha);
            }
        },
    },

    formaGeometrica: {
        ctx: null,
        quadrado: false,
        circulo: false,
        reta: false,
        xIncial: null,
        yInicial: null,
        xFinal: null,
        yFinal: null,
        estadoAntesDaForma: null,
        estadoDepoisDaForma: null,

        DesenhaForma: function () {
            const self = ferramentas.formaGeometrica;
            self.xFinal =event.offsetX;
            self.yFinal = event.offsetY;

            if (self.xIncial === null && self.yInicial === null) {
                
                self.xIncial = self.xFinal;
                self.yInicial = self.yFinal;
                self.estadoAntesDaForma = self.ctx.getImageData(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);

                self.ctx.canvas.addEventListener("mousemove", self.DesenhaForma);
                self.ctx.canvas.addEventListener("mouseup", () => {
                    
                    self.xIncial = null;
                    self.yInicial = null;
                    self.ctx.putImageData(self.estadoDepoisDaForma, 0, 0);
                    self.estadoAntesDaForma = null;

                    self.ctx.canvas.removeEventListener("mousemove", self.DesenhaForma);
                }, { once: true });
            }

            self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);

            self.ctx.fillStyle = document.getElementById("cor-preenchimento-forma-geometrica").value;
            self.ctx.lineWidth = Number(document.getElementById("tamanho-linha-forma-geometrica").value);
            self.ctx.strokeStyle = document.getElementById("cor-linha-forma-geometrica").value;

            self.ctx.beginPath();

            if (self.quadrado) {
                if (self.xFinal - self.xIncial === 0) {
                    return
                }

                self.ctx.rect(self.xIncial, self.yInicial, self.xFinal - self.xIncial, self.yFinal - self.yInicial);
                
                if (document.getElementById("preenchimento-forma-geometrica").checked) {
                    self.ctx.fill();
                }
                if (document.getElementById("linha-forma-geometrica").checked) {
                    self.ctx.rect(self.xIncial, self.yInicial, self.xFinal - self.xIncial, self.yFinal - self.yInicial);
                    self.ctx.stroke();
                }
            }
            else if (self.circulo) {
                let ajustaRaio = 1;

                if (self.xFinal - self.xIncial === 0) {
                    return
                }

                if (self.xFinal - self.xIncial < 0) {
                    //raio do círculo não pode ser negativo
                    ajustaRaio *= -1;
                }

                self.ctx.arc(self.xFinal, self.yFinal, (self.xFinal - self.xIncial) * ajustaRaio, 0, self.xIncial);

                if (document.getElementById("preenchimento-forma-geometrica").checked) {
                    self.ctx.fill();
                }
                if (document.getElementById("linha-forma-geometrica").checked) {
                    self.ctx.arc(self.xFinal, self.yFinal, (self.xFinal - self.xIncial) * ajustaRaio, 0, self.xIncial);
                    self.ctx.stroke();
                }
            }

            else if (self.reta) {
                self.ctx.moveTo(self.xIncial, self.yInicial);
                self.ctx.lineTo(self.xFinal, self.yFinal);
                self.ctx.stroke();

            }
            self.ctx.closePath();

            let estadoFormaGeometrica = self.ctx.getImageData(0,0, self.ctx.canvas.width, self.ctx.canvas.height);
            
            self.estadoDepoisDaForma = new ImageData(self.ctx.canvas.width, self.ctx.canvas.height);
            
            //sobrepondo os pixels do desenho para colocar os pixels da forma geométrica desenhada
            for (let i = 0; i < estadoFormaGeometrica.data.length; i++) {
                if (estadoFormaGeometrica.data[i] !== 0) {
                    self.estadoDepoisDaForma.data[i] = estadoFormaGeometrica.data[i]        
                }
                else {
                    self.estadoDepoisDaForma.data[i] = self.estadoAntesDaForma.data[i];
                }
            }

            self.ctx.putImageData(self.estadoDepoisDaForma, 0, 0);
        },

        Init: function () {
            const icone = document.getElementById("forma-geometrica");
            ferramentas.icones.push(icone);
            icone.addEventListener("click", () => {
                ferramentas.icones.forEach(elemento => elemento.classList.remove("nao-selecionado"));
                ferramentas.GerenciaFerramenta(document.getElementsByClassName("ferramenta-forma-geometrica")[0]);
                ferramentas.ferramentaSelecionada = this;

                icone.classList.add("nao-selecionado");
            });

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
    },


    SelecionaCor: {
        CorSelecionada: function (x, y, ctx) {
            const corRGB = ctx.getImageData(x, y, 1, 1).data;
            console.log(corRGB);
            let corHex = this.RGBAParaHex(corRGB);

            console.log(corHex);

            ferramentas.pincel.corPincel = corHex;
            ferramentas.DefineCorPrincipal(corHex.substring(0, 7));

            document.getElementById("pincel").click();
        },

        Init: function () {
            const icone = document.getElementById("seleciona-cor");
            ferramentas.icones.push(icone);

            icone.addEventListener("click", () => {
                ferramentas.icones.forEach(elemento => elemento.classList.remove("nao-selecionado"));
                ferramentas.ferramentaSelecionada = this;
                icone.classList.add("nao-selecionado");
            });
        },

        RGBAParaHex: function (cor) {
            const [r, g, b] = cor;

            const rHex = r.toString(16).padStart(2, "0");
            const gHex = g.toString(16).padStart(2, "0");
            const bHex = b.toString(16).padStart(2, "0");
            // const aHex = a.toString(16).padStart(2, "0");

            return `#${rHex}${gHex}${bHex}`;
            // return `#${rHex}${gHex}${bHex}${aHex}`;
        },
    },

    texto: {
        tamanhoFonte: 16,
        fonte: "Arial",

        Init: function () {
            const icone = document.getElementById("cria-texto");
            ferramentas.icones.push(icone);

            icone.addEventListener("click", () => {
                ferramentas.icones.forEach(elemento => elemento.classList.remove("nao-selecionado"));
                ferramentas.GerenciaFerramenta(document.getElementsByClassName("ferramenta-texto")[0]);

                ferramentas.ferramentaSelecionada = this;
                icone.classList.add("nao-selecionado");
            });

            const tamanhoTexto = document.getElementsByClassName("tamanho-fonte");

            for (let i = 0; i < tamanhoTexto.length; i++) {
                tamanhoTexto[i].addEventListener("input", () => {
                    this.tamanhoFonte = Number(tamanhoTexto[i].value);
                    tamanhoTexto[1].value = this.tamanhoFonte;
                });
            }

        },

        CriaTexto: function (x, y, ctx) {
            const fonte = document.getElementById("fontes").value;
            const texto = document.getElementById("texto-inserido").value;
            const cor = document.getElementById("cor-texto").value;
            ctx.fillStyle = cor;

            ctx.font = `${this.tamanhoFonte}px ${fonte}`;
            ctx.textAlign = "center";
            ctx.fillText(texto, x, y);
        }
    },

    mover: {
        posInicial: {
            x: 0,
            y: 0,
            largura: 0,
            altura: 0,
        },
        posFinal: {
            x: 0,
            y: 0,
            largura: 0,
            altura: 0,
        },

        mover: false,

        Init: function () {
            const icone = document.getElementById("mover");
            ferramentas.icones.push(icone);

            icone.addEventListener("click", () => {
                ferramentas.ferramentaSelecionada = this;

                ferramentas.icones.forEach(elemento => elemento.classList.remove("nao-selecionado"));
                ferramentas.GerenciaFerramenta(document.getElementsByClassName("ferramenta-mover")[0]);

                icone.classList.add("nao-selecionado");
            });
            const area = document.getElementById("area-mover");

            document.addEventListener("dragover", (e) => {
                e.preventDefault();
                const posicao = area.getBoundingClientRect();
                const menuLateral = document.getElementsByClassName("ferramentas")[0];
                const desconsiderar = menuLateral.getBoundingClientRect(); //a função retorna as posições em relação a toda a tela, então é necessário subtrair o tamanho do menu de seleção de ferramentas para ter mais precisão

                area.style.top = (e.clientY - posicao.height / 2) + "px";
                area.style.left = (e.clientX - posicao.width / 2) + "px";

                if (this.mover) {
                    this.posFinal.x = posicao.x - desconsiderar.width;
                    this.posFinal.y = posicao.y;
                    this.posFinal.largura = posicao.width;
                    this.posFinal.altura = posicao.height;
                }
                else {
                    this.posInicial.x = posicao.x - desconsiderar.width;
                    this.posInicial.y = posicao.y;
                    this.posInicial.largura = posicao.width;
                    this.posInicial.altura = posicao.height;
                }
            });

            document.getElementById("area-selecionada").addEventListener("click", () => { this.mover = true; });
            document.getElementById("cancelar-mover").addEventListener("click", () => { this.mover = false; });
        },

        MoverArea: function (ctx) {
            if (this.mover) {
                const areaMover = ctx.getImageData(this.posInicial.x, this.posInicial.y, this.posInicial.largura, this.posInicial.altura);
                ctx.putImageData(areaMover, this.posFinal.x, this.posFinal.y);

                this.mover = false;
            }
        }
    },

    GerenciaFerramenta: function (foco) {
        const elementosApagar = document.querySelectorAll(".ferramentas-info > div");

        for (let elemento of elementosApagar) {
            elemento.style.display = "none";
        }
        foco.style.display = "flex";
    },

    DefineCorPrincipal: function(cor) {
        const inputCor = document.querySelectorAll("input[type='color']");
        for (let input of inputCor) {
            input.value = cor;
        }
    }
}