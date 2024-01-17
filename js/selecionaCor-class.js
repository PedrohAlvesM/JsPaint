export class SelecionaCor {
    constructor () {
        this.icone = document.getElementById("seleciona-cor");
    }
    
    CorSelecionada(x, y, camadas) {
        let corRGB;
        for (let camada of camadas) {
            corRGB = camada.getContext("2d").getImageData(x, y, 1, 1).data;
            const pixelVazio = new Uint8ClampedArray(4);
            if (corRGB[0] !== pixelVazio[0] && corRGB[1] !== pixelVazio[1] && corRGB[2] !== pixelVazio[2] && corRGB[3] !== pixelVazio[3]) {
                break
            }
        }
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
