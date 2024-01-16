export class SelecionaCor {
    constructor () {
        this.icone = document.getElementById("seleciona-cor");
    }
    
    CorSelecionada(x, y, ctx) {
        const corRGB = ctx.getImageData(x, y, 1, 1).data;

        let corHex = this.RGBAParaHex(corRGB);

        document.querySelectorAll("input[type='color']").forEach(e => e.value = corHex);

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
