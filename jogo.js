console.log("[Candinho Jr] Flappy Bird");

let frames = 0;
const som_HIT = new Audio();
const som_CAIU = new Audio();
const som_PONTO = new Audio();
const som_PULO = new Audio();
som_HIT.src = "./efeitos/hit.wav";
som_CAIU.src = "./efeitos/caiu.wav";
som_PONTO.src = "./efeitos/ponto.wav";
som_PULO.src = "./efeitos/pulo.wav";

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

function criaPlanoDeFundo() {
  const planoDeFundo = {
    sX: 390,
    sY: 0,
    w: 275,
    h: 204,
    x: 0,
    y: canvas.height - 204,
    atualiza() {
      const movimentoDoPlanoDeFundo = 0.7;
      const repeteEm = planoDeFundo.w;
      const movimentacao = planoDeFundo.x - movimentoDoPlanoDeFundo;

      planoDeFundo.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.fillStyle = "#70c5ce";
      contexto.fillRect(0, 0, canvas.width, canvas.height);

      for (i = 0; i < 3; i++) {
        contexto.drawImage(
          sprites,
          planoDeFundo.sX,
          planoDeFundo.sY,
          planoDeFundo.w,
          planoDeFundo.h,
          planoDeFundo.x + i * planoDeFundo.w,
          planoDeFundo.y,
          planoDeFundo.w,
          planoDeFundo.h
        );
      }
    },
  };

  return planoDeFundo;
}

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
    pulo: 4,
    gravidade: 0.25,
    velocidade: 0,
    pula() {
      flappyBird.velocidade = -flappyBird.pulo;
      som_PULO.play();
    },
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        som_CAIU.play();
        mudaParaTela(Telas.GAME_OVER);
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

const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX,
      mensagemGameOver.sY,
      mensagemGameOver.w,
      mensagemGameOver.h,
      mensagemGameOver.x,
      mensagemGameOver.y,
      mensagemGameOver.w,
      mensagemGameOver.h
    );
  },
};

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function (par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        contexto.drawImage(
          sprites,
          canos.ceu.spriteX,
          canos.ceu.spriteY,
          canos.largura,
          canos.altura,
          canoCeuX,
          canoCeuY,
          canos.largura,
          canos.altura
        );

        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX,
          canos.chao.spriteY,
          canos.largura,
          canos.altura,
          canoChaoX,
          canoChaoY,
          canos.largura,
          canos.altura
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        };
      });
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.h;

      if (globais.flappyBird.x + globais.flappyBird.w - 5 >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
          fimCano: canvas.width,
        });
      }
      canos.pares.forEach(function (par) {
        par.x = par.x - 2;
        par.fimCano = par.x + 52;

        if (canos.temColisaoComOFlappyBird(par)) {
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    },
  };
  return canos;
}

function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '24px "Press Start 2P"';
      contexto.textAlign = "right";
      contexto.fillStyle = "white";
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
    },
    desenhaPlacarFinal() {
      const placarSalvo = localStorage.getItem("melhorPlacar");
      if (placar.pontuacao > placarSalvo)
        localStorage.setItem("melhorPlacar", placar.pontuacao);

      contexto.font = '20px "Press Start 2P"';
      contexto.textAlign = "right";
      contexto.fillStyle = "black";
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 67, 149);
    },
    desenhaMelhorPlacar() {
      const placarSalvo = localStorage.getItem("melhorPlacar");
      contexto.font = '20px "Press Start 2P"';
      contexto.textAlign = "right";
      contexto.fillStyle = "black";
      contexto.fillText(`${placarSalvo ?? 0}`, canvas.width - 67, 191);
    },
    atualiza() {
      let flappyBirdX = globais.flappyBird.x;
      let canoX;

      switch (globais.canos.pares.length) {
        case 0:
          return;
        case 1:
          canoX = globais.canos.pares[0].fimCano;
          break;
        case 2:
          canoX = Math.min(
            globais.canos.pares[0].fimCano,
            globais.canos.pares[1].fimCano
          );
      }

      if (flappyBirdX === canoX) {
        placar.pontuacao = placar.pontuacao + 1;

        som_PONTO.play();
      }
    },
  };
  return placar;
}

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
      globais.planoDeFundo = criaPlanoDeFundo();
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      globais.planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.planoDeFundo.atualiza();
      globais.chao.atualiza();
    },
  },
};

Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();
    globais.placar.desenhaPlacarFinal();
    globais.placar.desenhaMelhorPlacar();
  },
  click() {
    mudaParaTela(Telas.INICIO);
  },
  atualiza() {},
};

Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar();
  },
  desenha() {
    globais.planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.planoDeFundo.atualiza();
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", () => telaAtiva.click && telaAtiva.click());
window.addEventListener(
  "keydown",
  (e) => telaAtiva.click && !e.repeat && e.code === "Space" && telaAtiva.click()
);

mudaParaTela(Telas.INICIO);
loop();
