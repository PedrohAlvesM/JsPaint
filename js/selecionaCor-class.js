export class SelecionaCor {
    constructor() {
        this.icone = document.getElementById("seleciona-cor");
    }

    CorSelecionada(x, y, camadas) {
        let corRGB;
        let corHEX;

        const tmp = document.createElement("canvas");

        tmp.width = camadas[0].width;
        tmp.height = camadas[0].height;

        const ctx = tmp.getContext("2d");
        for (let camada of camadas) {
            ctx.beginPath();
            ctx.filter = `opacity(${Number(camada.style.opacity)*100}%)`;
            ctx.closePath();
            ctx.drawImage(camada, 0, 0);
        }

        corRGB = ctx.getImageData(x, y, 1,1).data;
        if (corRGB[3] !== 0) { //o alpha da cor como 0 é usado apenas em pixels não pintados
            corHEX = this.RGBAParaHex(corRGB);
            document.querySelectorAll("input[type='color']").forEach(e => e.value = corHEX);
        }

        document.getElementById("pincel").click();
    }

    RGBAParaHex(corRGB) {
        const [r, g, b] = corRGB;

        const rHex = r.toString(16).padStart(2, "0");
        const gHex = g.toString(16).padStart(2, "0");
        const bHex = b.toString(16).padStart(2, "0");

        return `#${rHex}${gHex}${bHex}`;
    }
}
