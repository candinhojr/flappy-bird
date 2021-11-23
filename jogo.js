console.log("[Candinho Jr] Flappy Bird");

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

const chao = {
  spriteX: 0, // Sprite X position
  spriteY: 610, // Sprite Y position
  largura: 224, // Largura - Width: Tamanho do recorte
  altura: 112, // Altura - Height: Tamanho do recorte
  x: 0, // canva X position
  y: canvas.height - 112, // canva Y position
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

const flappyBird = {
  sX: 0,
  sY: 0,
  w: 33,
  h: 24,
  x: 10,
  y: 50,
  gravidade: 0.25,
  velocidade: 0,
  atualiza() {
    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
    flappyBird.y = flappyBird.y + flappyBird.velocidade;
  },
  desenha() {
    contexto.drawImage(
      sprites,
      flappyBird.sX,
      flappyBird.sY,
      flappyBird.w,
      flappyBird.h,
      flappyBird.x,
      flappyBird.y,
      flappyBird.w,
      flappyBird.h
    );
  },
};

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

let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
}

const Telas = {
  INICIO: {
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {},
  },
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    chao.desenha();
    flappyBird.desenha();
  },
  atualiza() {
    flappyBird.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

window.addEventListener("click", () => telaAtiva.click && telaAtiva.click());

mudaParaTela(Telas.INICIO);
loop();
