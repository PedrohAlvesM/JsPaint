export class BaldeDeTinta {
  constructor() {
    this.cor;
    this.corRGBA = {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    };
    this.icone = document.getElementById("balde-tinta");

    document.getElementById("cor-balde").addEventListener("input", (e) => {
      this.cor = e.target.value;
      this.corRGBA = this.HEXparaRGB(this.cor);
    });
  }

  HEXparaRGB(hex) {
    if (hex[0] === "#") hex = hex.slice(1);

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = 0xff;

    return { r, g, b, a };
  }

  ObterCorPixel(imageData, x, y) {
    const largura = imageData.width;
    const dados = imageData.data;
    return {
      r: dados[4 * (largura * y + x) + 0],
      g: dados[4 * (largura * y + x) + 1],
      b: dados[4 * (largura * y + x) + 2],
      a: dados[4 * (largura * y + x) + 3],
    };
  }

  DefinirCorPixel(imageData, cor, x, y) {
    const largura = imageData.width;
    const dados = imageData.data;
    dados[4 * (largura * y + x) + 0] = cor.r & 0xff;
    dados[4 * (largura * y + x) + 1] = cor.g & 0xff;
    dados[4 * (largura * y + x) + 2] = cor.b & 0xff;
    dados[4 * (largura * y + x) + 3] = cor.a & 0xff;
  }

  CoresIguais(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
  }

  PreencherArea(dadosImagem, xInicial, yInicial) {
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const corBase = this.ObterCorPixel(dadosImagem, xInicial, yInicial);
    const visitados = new Set();
    const pilha = [{ x: xInicial, y: yInicial }];

    if (this.CoresIguais(corBase, this.corRGBA)) {
      return;
    }

    const jaVisitado = (x, y) => visitados.has(`${x},${y}`);

    const marcarVisitado = (x, y) => visitados.add(`${x},${y}`);

    const dentroLimites = (x, y) => x >= 0 && x < largura && y >= 0 && y < altura;

    while (pilha.length) {
      const { x, y } = pilha.pop();

      if (jaVisitado(x, y)) {
        continue;
      }

      marcarVisitado(x, y);

      this.DefinirCorPixel(dadosImagem, this.corRGBA, x, y);

      const vizinhos = [
        { x: x, y: y - 1 }, // cima
        { x: x, y: y + 1 }, // baixo
        { x: x - 1, y: y }, // esquerda
        { x: x + 1, y: y }, // direita
      ];

      for (const vizinho of vizinhos) {
        if (dentroLimites(vizinho.x, vizinho.y)) {
          const corVizinho = this.ObterCorPixel(
            dadosImagem,
            vizinho.x,
            vizinho.y
          );

          if (this.CoresIguais(corVizinho, corBase) && !jaVisitado(vizinho.x, vizinho.y)) {
            pilha.push(vizinho);
          }
        }
      }
    }
  }
}
