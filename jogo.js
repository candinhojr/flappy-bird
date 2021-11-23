console.log("[Candinho Jr] Flappy Bird");

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = "./efeitos/hit.wav";

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

function criaChao() {
  const chao = {
    spriteX: 0, // Sprite X position
    spriteY: 610, // Sprite Y position
    largura: 224, // Largura - Width: Tamanho do recorte
    altura: 112, // Altura - Height: Tamanho do recorte
    x: 0, // canva X position
    y: canvas.height - 112, // canva Y position
    atualiza() {
      const repeteEm = chao.largura / 2;

      if (chao.x <= -repeteEm) {
        return (chao.x = 0);
      }

      chao.x = chao.x - 1;
    },
    desenha() {
      contexto.drawImage(
        sprites, // Arquivo com as imagens
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x,
        chao.y,
        chao.largura,
        chao.altura
      );

      contexto.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x + chao.largura,
        chao.y,
        chao.largura,
        chao.altura
      );
    },
  };
  return chao;
}

const planoDeFundo = {
  sX: 390,
  sY: 0,
  w: 275,
  h: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.sX,
      planoDeFundo.sY,
      planoDeFundo.w,
      planoDeFundo.h,
      planoDeFundo.x,
      planoDeFundo.y,
      planoDeFundo.w,
      planoDeFundo.h
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.sX,
      planoDeFundo.sY,
      planoDeFundo.w,
      planoDeFundo.h,
      planoDeFundo.x + planoDeFundo.w,
      planoDeFundo.y,
      planoDeFundo.w,
      planoDeFundo.h
    );
  },
};

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.h;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) return true;
  else return false;
}
function criaFlappyBird() {
  const flappyBird = {
    sX: 0,
    sY: 0,
    w: 33,
    h: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    gravidade: 0.25,
    velocidade: 0,
    pula() {
      flappyBird.velocidade = -flappyBird.pulo;
    },
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        setTimeout(() => som_HIT.play(), 300);
        // som_HIT.play();
        mudaParaTela(Telas.INICIO);
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 26 }, // asa no meio
      { spriteX: 0, spriteY: 52 }, // asa pra baixo
      { spriteX: 0, spriteY: 26 }, // asa no meio
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX,
        spriteY,
        flappyBird.w,
        flappyBird.h,
        flappyBird.x,
        flappyBird.y,
        flappyBird.w,
        flappyBird.h
      );
    },
  };
  return flappyBird;
}

const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX,
      mensagemGetReady.sY,
      mensagemGetReady.w,
      mensagemGetReady.h,
      mensagemGetReady.x,
      mensagemGetReady.y,
      mensagemGetReady.w,
      mensagemGetReady.h
    );
  },
};

/**
 * TELAS
 */
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  novaTela.inicializa && telaAtiva.inicializa();
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    },
  },
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", () => telaAtiva.click && telaAtiva.click());

mudaParaTela(Telas.INICIO);
loop();
