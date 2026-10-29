// 1. ELEMENTOS DO HTML

const imani = document.getElementById("imani");
const ataque = document.getElementById("ataque");
const ressonancia = document.getElementById("ressonancia");
const energiaRessonancia = document.getElementById("energiaRessonancia");
const barraRessonancia = document.getElementById("barraRessonancia");

const fragmentoAlma = document.getElementById("fragmentoAlma");

const inimigo = document.getElementById("inimigo");
const ataqueInimigo = document.getElementById("ataqueInimigo");

const vidaHUD = document.getElementById("vida");

const telaFim = document.getElementById("telaFim");
const tituloFim = document.getElementById("tituloFim");
const mensagemFim = document.getElementById("mensagemFim");
const botaoReiniciar = document.getElementById("botaoReiniciar");

// 2. VARIÁVEIS DO INIMIGO

let vidaInimigo = 5;

// CONTROLE DOS DIÁLOGOS DO MINI-CHEFE

let primeiroDialogoChefe = false;

// SEGUNDA INTERRUPÇÃO DO MINI-CHEFE
let segundoDialogoChefe = false;

// PROTEÇÃO APÓS OS DIÁLOGOS

let protecaoDialogo = false;

// AGUARDANDO A IMANI POUSAR
let aguardandoPousoDialogo = false;

// RETOMAR O COMBATE COM SEGURANÇA

function retomarCombateChefe() {
  // RESTAURA A ILUMINAÇÃO
  document.getElementById("jogo").classList.remove("dialogoAtivo");

  // Protege a Imani temporariamente
  protecaoDialogo = true;

  // Cancela o ataque atual do Véu
  ataqueInimigo.classList.remove("ativo");

  // Retoma o combate
  definirEstado("jogando");

  // Termina a proteção depois de 1,5 segundo
  setTimeout(function () {
    protecaoDialogo = false;
  }, 1500);
}

let posicaoInimigoX = 650;
let velocidadeInimigo = 3.2;

// INVESTIDA DO PRIMEIRO VÉU

let framesInvestida = 0;
let recargaInvestida = 0;

let inimigoAtacando = false;

// Direção para onde o inimigo está olhando
let direcaoInimigo = "esquerda";

// 3. VARIÁVEIS DA IMANI

let vidaImani = 3;
let imaniInvulneravel = false;

let posicaoX = 80;
let posicaoY = 85;

let velocidadeY = 0;
let pulando = false;

let atacando = false;

// INTERVALO ENTRE OS ATAQUES DA IMANI
let ultimoAtaqueImani = 0;

// ENERGIA DA RESSONÂNCIA
let energiaAtual = 0;

// Valor máximo da energia
const energiaMaxima = 100;

// Cada golpe de Nahara gera 50 pontos
const energiaPorGolpe = 50;

// CONTROLE DO JOGO
let jogoIniciado = false;

// ESTADOS DO JOGO

let estadoJogo = "menu";

// ALTERAR O ESTADO DO JOGO

function definirEstado(novoEstado) {
  estadoJogo = novoEstado;

  // Permite jogar somente durante a partida
  jogoIniciado = novoEstado === "jogando";

  // INTERROMPE AÇÕES QUANDO O JOGO NÃO ESTÁ ATIVO
  if (!jogoIniciado) {
    direita = false;
    esquerda = false;

    // Interrompe imediatamente o ataque do Véu
    ataqueInimigo.classList.remove("ativo");

    // Cancela o golpe da Imani apenas em transição ou fim
    if (novoEstado === "transicao" || novoEstado === "fim") {
      ataque.classList.remove("ativo");
    }
  }

  console.log("Estado atual:", estadoJogo);
}

// 4. CONTROLE DE MOVIMENTO

let direita = false;
let esquerda = false;

let direcao = "direita";

// 5. CONFIGURAÇÕES DO JOGO

const gravidade = 0.8;
const forcaPulo = 14;
const chao = 85;

// 6. TECLAS PRESSIONADAS

document.addEventListener("keydown", function (event) {
  // Impede ações antes do início do jogo
  if (!jogoIniciado || aguardandoPousoDialogo) {
    return;
  }

  // INTERAGIR COM O VESTÍGIO - TECLA E

  if (event.key.toLowerCase() === "e" && !event.repeat) {
    const vestigio = document.getElementById("vestigioFinal");

    // Só funciona após o desaparecimento do mini-chefe
    if (
      areaAtual === 2 &&
      segundoDialogoChefe &&
      vidaInimigo <= 0 &&
      !vestigioInvestigado &&
      !pulando
    ) {
      const areaImani = imani.getBoundingClientRect();
      const areaVestigio = vestigio.getBoundingClientRect();

      const centroImani = areaImani.left + areaImani.width / 2;
      const centroVestigio = areaVestigio.left + areaVestigio.width / 2;

      const distancia = Math.abs(centroImani - centroVestigio);

      // Imani precisa estar perto do objeto
      if (distancia <= 80) {
        investigarVestigio();
      }
    }

    return;
  }

  // ANDAR PARA DIREITA
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    direita = true;
    direcao = "direita";
  }

  // ANDAR PARA ESQUERDA
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    esquerda = true;
    direcao = "esquerda";
  }

  // ATUALIZA A DIREÇÃO VISUAL DA IMANI

  imani.classList.toggle("viradaEsquerda", direcao === "esquerda");

  // PULO W / Z / J / SETA PARA CIMA
  const teclaPulo =
    event.key === "ArrowUp" ||
    event.key.toLowerCase() === "w" ||
    event.key.toLowerCase() === "z" ||
    event.key.toLowerCase() === "j";

  if (teclaPulo && !pulando && !event.repeat && vidaImani > 0) {
    event.preventDefault();

    velocidadeY = forcaPulo;
    pulando = true;

    console.log("PULOU");
  }

  // ATAQUE NORMAL DA IMANI K / X / ESPAÇO

  const teclaAtaque =
    event.key.toLowerCase() === "k" ||
    event.key.toLowerCase() === "x" ||
    event.code === "Space";

  if (
    teclaAtaque &&
    !atacando &&
    !event.repeat &&
    performance.now() - ultimoAtaqueImani >= 450 &&
    vidaImani > 0
  ) {
    event.preventDefault();

    // REGISTRA O ÚLTIMO ATAQUE
    ultimoAtaqueImani = performance.now();

    atacando = true;

    // Posiciona Nahara na direção da Imani
    if (direcao === "direita") {
      ataque.style.left = "45px";
    } else {
      ataque.style.left = "-70px";
    }

    // Mostra o ataque
    ataque.classList.add("ativo");

    // Verifica o golpe sem atraso
    verificarAtaque();

    // Finaliza o ataque
    setTimeout(function () {
      ataque.classList.remove("ativo");
      atacando = false;
    }, 180);
  }

  // COLETAR FRAGMENTO COM R
  if (
    event.key.toLowerCase() === "r" &&
    !event.repeat &&
    fragmentoDisponivel &&
    vidaImani > 0
  ) {
    coletarFragmento();
    return;
  }

  // RESSONÂNCIA DA IMANI — TECLA R

  if (
    event.key.toLowerCase() === "r" &&
    !event.repeat &&
    energiaAtual >= energiaMaxima &&
    vidaImani > 0
  ) {
    // Consome toda a energia
    energiaAtual = 0;
    atualizarBarraRessonancia();

    // Mostra a explosão de energia
    ressonancia.classList.add("ativa");

    console.log("RESSONÂNCIA ATIVADA!");

    // Verifica se atingiu o inimigo
    setTimeout(function () {
      verificarRessonancia();
    }, 100);

    // Remove o efeito visual
    setTimeout(function () {
      ressonancia.classList.remove("ativa");
    }, 500);
  }
});

// 7. TECLAS SOLTAS

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    direita = false;
  }

  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    esquerda = false;
  }
});

// 8. ATAQUE DO INIMIGO

function atacarImani() {
  // NÃO ATACA DURANTE A PROTEÇÃO DO DIÁLOGO
  if (protecaoDialogo) {
    return;
  }
  // Impede ataques antes ddo início do jogo
  if (!jogoIniciado) {
    return;
  }
  // Não ataca se já estiver atacando ou se algum dos personagens morreu
  if (inimigoAtacando || vidaInimigo <= 0 || vidaImani <= 0) {
    return;
  }

  inimigoAtacando = true;

  // Atualiza a posição do inimigo
  inimigo.style.left = posicaoInimigoX + "px";

  // Mostra o ataque roxo
  ataqueInimigo.classList.add("ativo");

  console.log("O Véu está atacando!");

  // Verifica se acertou a Imani
  setTimeout(function () {
    if (vidaInimigo > 0 && vidaImani > 0) {
      verificarAtaqueInimigo();
    }
  }, 50);

  // Esconde o ataque
  setTimeout(function () {
    ataqueInimigo.classList.remove("ativo");
  }, 300);

  // INTERVALO ENTRE OS ATAQUES DO VÉU
  setTimeout(function () {
    inimigoAtacando = false;
  }, 950);
}

// 9. ATAQUE DA IMANI CONTRA O INIMIGO

function verificarAtaque() {
  // Não ataca se alguém já morreu
  if (vidaImani <= 0 || vidaInimigo <= 0) {
    return;
  }

  const areaAtaque = ataque.getBoundingClientRect();
  const areaInimigo = inimigo.getBoundingClientRect();

  // Verifica se as áreas se encostaram
  const acertou =
    areaAtaque.right > areaInimigo.left &&
    areaAtaque.left < areaInimigo.right &&
    areaAtaque.bottom > areaInimigo.top &&
    areaAtaque.top < areaInimigo.bottom;

  if (acertou) {
    // Inimigo perde uma vida
    vidaInimigo--;

    atualizarVidaChefe();

    // VERIFICA O DIÁLOGO DO MINI-CHEFE
    verificarDialogoChefe();

    // RECUO DO VÉU AO RECEBER DANO

    if (vidaInimigo > 0) {
      // Se o Véu estiver à direita da Imani
      if (posicaoInimigoX > posicaoX) {
        posicaoInimigoX += 12;
      } else {
        // Se estiver à esquerda
        posicaoInimigoX -= 12;
      }

      // Impede que o Véu saia da tela
      posicaoInimigoX = Math.max(0, Math.min(845, posicaoInimigoX));

      // Atualiza a posição dele
      inimigo.style.left = posicaoInimigoX + "px";
    }

    console.log("Acertou!");
    console.log("Vida do inimigo:", vidaInimigo);

    // GANHAR ENERGIA DA RESSONÂNCIA

    // Cada golpe acertado gera energia
    energiaAtual += energiaPorGolpe;

    // Impede que ultrapasse 100
    if (energiaAtual > energiaMaxima) {
      energiaAtual = energiaMaxima;
    }

    // Atualiza a barra visual
    atualizarBarraRessonancia();

    console.log("Energia da Ressonância:", energiaAtual);

    // EFEITO VISUAL DE DANO
    inimigo.style.opacity = "0.4";

    setTimeout(function () {
      inimigo.style.opacity = "1";
    }, 120);

    // MORTE DO INIMIGO
    if (vidaInimigo <= 0) {
      vidaInimigo = 0;
      inimigo.style.display = "none";
      if (areaAtual === 1) {
        mostrarFragmento();
      }
    }
  }
}

// 10. ATAQUE DO INIMIGO CONTRA A IMANI

function verificarAtaqueInimigo() {
  // NÃO CAUSA DANO DURANTE OS DIÁLOGOS
  if (!jogoIniciado) {
    return;
  }

  // IMANI NÃO RECEBE DANO APÓS O DIÁLOGO
  if (protecaoDialogo) {
    return;
  }

  // Não verifica se alguém morreu ou se Imani está invulnerável
  if (vidaInimigo <= 0 || vidaImani <= 0 || imaniInvulneravel) {
    return;
  }

  const areaImani = imani.getBoundingClientRect();
  const areaAtaqueInimigo = ataqueInimigo.getBoundingClientRect();

  // Verifica se o golpe acertou
  const acertou =
    areaAtaqueInimigo.right > areaImani.left &&
    areaAtaqueInimigo.left < areaImani.right &&
    areaAtaqueInimigo.bottom > areaImani.top &&
    areaAtaqueInimigo.top < areaImani.bottom;

  if (!acertou) {
    return;
  }

  // IMANI RECEBE DANO
  vidaImani--;
  atualizarVida();

  console.log("O Véu acertou a Imani!");
  console.log("Vida da Imani:", vidaImani);

  // MORTE DA IMANI
  if (vidaImani <= 0) {
    vidaImani = 0;

    imani.style.display = "none";
    ataqueInimigo.classList.remove("ativo");

    console.log("Imani morreu!");

    finalizarJogo(false);
    return;
  }

  // EFEITO VISUAL DE DANO
  imaniInvulneravel = true;
  imani.style.opacity = "0.4";

  // Proteção temporária após receber dano
  setTimeout(function () {
    imani.style.opacity = "1";
    imaniInvulneravel = false;
  }, 700);
}

// DANO DA RESSONÂNCIA

function verificarRessonancia() {
  // Não atinge inimigos mortos
  if (
    vidaInimigo <= 0 ||
    vidaImani <= 0 ||
    !jogoIniciado ||
    aguardandoPousoDialogo
  ) {
    return;
  }
  const areaImani = imani.getBoundingClientRect();
  const areaInimigo = inimigo.getBoundingClientRect();

  // Centro dos personagens
  const centroImani = areaImani.left + areaImani.width / 2;

  const centroInimigo = areaInimigo.left + areaInimigo.width / 2;

  // Distância horizontal
  const distancia = Math.abs(centroImani - centroInimigo);

  // Atinge o inimigo se estiver próximo
  if (distancia <= 130) {
    // Causa 1 ponto de dano
    vidaInimigo--;

    // RECUO DO VÉU AO RECEBER RESSONÂNCIA

    if (vidaInimigo > 0) {
      if (posicaoInimigoX > posicaoX) {
        posicaoInimigoX += 65;
      } else {
        posicaoInimigoX -= 65;
      }

      posicaoInimigoX = Math.max(0, Math.min(845, posicaoInimigoX));

      inimigo.style.left = posicaoInimigoX + "px";
    }

    atualizarVidaChefe();

    // VERIFICA O DIÁLOGO DO MINI-CHEFE
    verificarDialogoChefe();

    console.log("Ressonância acertou o Véu!");

    // Efeito visual de dano
    inimigo.style.opacity = "0.3";

    setTimeout(function () {
      inimigo.style.opacity = "1";
    }, 150);

    // MORTE DO INIMIGO
    if (vidaInimigo <= 0) {
      vidaInimigo = 0;
      inimigo.style.display = "none";
      if (areaAtual === 1) {
        mostrarFragmento();
      }
    }
  }
}

// ATUALIZAR VIDA DO MINI-CHEFE

function atualizarVidaChefe() {
  // Só atualiza na segunda área
  if (areaAtual !== 2) {
    return;
  }

  // Vida máxima do mini-chefe
  const vidaMaximaChefe = 8;

  // Calcula a porcentagem de vida
  const porcentagem = Math.max(0, (vidaInimigo / vidaMaximaChefe) * 100);

  // Atualiza a barra
  document.getElementById("vidaChefePreenchimento").style.width =
    porcentagem + "%";
}

// ATUALIZAR BARRA DE RESSONÂNCIA

function atualizarBarraRessonancia() {
  // Calcula a porcentagem da energia
  const porcentagem = (energiaAtual / energiaMaxima) * 100;

  // Atualiza a largura da barra
  energiaRessonancia.style.width = porcentagem + "%";

  // Faz a barra brilhar quando estiver cheia
  if (energiaAtual >= energiaMaxima) {
    barraRessonancia.classList.add("pronta");
  } else {
    barraRessonancia.classList.remove("pronta");
  }
}

// TELA DE VITÓRIA E DERROTA

function finalizarJogo(vitoria) {
  // IMPEDE FINALIZAR O JOGO MAIS DE UMA VEZ
  if (estadoJogo === "fim") return;

  // ENCERRA A PARTIDA
  definirEstado("fim");

  direita = false;
  esquerda = false;

  // CANCELA O EFEITO DA RESSONÂNCIA
  ressonancia.classList.remove("ativa");

  console.log("FINALIZAR JOGO:", vitoria);

  telaFim.style.display = "flex";

  if (vitoria) {
    tituloFim.textContent = "VITÓRIA!";
    mensagemFim.textContent = "Imani derrotou o Véu!";
  } else {
    tituloFim.textContent = "DERROTA";
    mensagemFim.textContent = "Imani foi derrotada!";
  }
}

// REINICIAR O JOGO

botaoReiniciar.addEventListener("click", function () {
  location.reload();
});

// 11. HUD DE VIDA DA IMANI

function atualizarVida() {
  if (vidaImani === 3) {
    vidaHUD.textContent = "🤍🤍🤍";
  }

  if (vidaImani === 2) {
    vidaHUD.textContent = "🤍🤍";
  }

  if (vidaImani === 1) {
    vidaHUD.textContent = "🤍";
  }

  if (vidaImani <= 0) {
    vidaHUD.textContent = "💀";
  }
}

// 12. LOOP PRINCIPAL DO JOGO

// CONTROLE DAS ÁREAS DO JOGO

let areaAtual = 1;
let transicaoEmAndamento = false;

// FRAGMENTO DE ALMA
let fragmentoDisponivel = false;

function mostrarFragmento() {
  console.log("O FRAGMENTO FOI CRIADO!");
  fragmentoDisponivel = true;

  // Aparece onde o Véu foi derrotado
  fragmentoAlma.style.left = posicaoInimigoX + 18 + "px";
  fragmentoAlma.style.display = "block";
}

// SISTEMA DE DIÁLOGO CINEMATOGRÁFICO

function mostrarDialogo(fala) {
  const dialogoImani = document.getElementById("dialogoImani");
  const textoDialogo = document.getElementById("textoDialogo");

  // Limpa a fala anterior
  textoDialogo.textContent = "";

  // Mostra o painel
  dialogoImani.style.display = "block";

  let letraAtual = 0;

  // Escreve uma letra de cada vez
  const digitacao = setInterval(function () {
    textoDialogo.textContent += fala[letraAtual];
    letraAtual++;

    // Quando terminar a frase
    if (letraAtual >= fala.length) {
      clearInterval(digitacao);

      // Aguarda antes de esconder
      setTimeout(function () {
        dialogoImani.style.display = "none";
      }, 2500);
    }
  }, 55);
}

// ESPERAR IMANI POUSAR ANTES DO DIÁLOGO

function esperarPousoDialogo() {
  aguardandoPousoDialogo = true;
  protecaoDialogo = true;

  direita = false;
  esquerda = false;

  // AFASTA O VÉU ANTES DO DIÁLOGO

  const distanciaSegura = 140;

  // Descobre de qual lado o Véu está
  if (posicaoInimigoX >= posicaoX) {
    // Véu fica à direita da Imani
    posicaoInimigoX = Math.max(posicaoInimigoX, posicaoX + distanciaSegura);
  } else {
    // Véu fica à esquerda da Imani
    posicaoInimigoX = Math.min(posicaoInimigoX, posicaoX - distanciaSegura);
  }

  // Impede que saia da tela
  posicaoInimigoX = Math.max(0, Math.min(835, posicaoInimigoX));

  // Atualiza a posição
  inimigo.style.left = posicaoInimigoX + "px";

  // Impede novos ataques do Véu
  ataqueInimigo.classList.remove("ativo");
  framesInvestida = 0;

  return new Promise(function (resolve) {
    function conferirPouso() {
      // Quando Imani tocar o chão
      if (posicaoY <= chao) {
        aguardandoPousoDialogo = false;
        resolve();
        return;
      }

      // Continua aguardando a queda
      requestAnimationFrame(conferirPouso);
    }

    conferirPouso();
  });
}

// PULSO DOURADO DA OUTRA CAMADA

function mostrarPulsoDourado() {
  const jogo = document.getElementById("jogo");

  jogo.animate(
    [
      { filter: "brightness(1) sepia(0)" },
      { filter: "brightness(1.35) sepia(0.8) saturate(1.6)" },
      { filter: "brightness(1) sepia(0)" },
    ],
    {
      duration: 1000,
      easing: "ease-in-out",
    },
  );
}

// DIÁLOGOS DO MINI-CHEFE

async function verificarDialogoChefe() {
  // Só acontece na segunda área
  if (areaAtual !== 2) {
    return;
  }

  // PRIMEIRA INTERRUPÇÃO - 5 VIDAS

  if (vidaInimigo <= 5 && !primeiroDialogoChefe) {
    primeiroDialogoChefe = true;

    // ESPERA IMANI POUSAR
    await esperarPousoDialogo();

    definirEstado("dialogo");

    // ESCURECE O CENÁRIO
    document.getElementById("jogo").classList.add("dialogoAtivo");

    direita = false;
    esquerda = false;

    ataqueInimigo.classList.remove("ativo");

    const dialogoVeu = document.getElementById("dialogoVeu");
    const textoVeu = document.getElementById("textoVeu");

    textoVeu.textContent = "Você... ainda está viva?";
    dialogoVeu.style.display = "block";

    setTimeout(function () {
      dialogoVeu.style.display = "none";

      mostrarDialogo("Como sabe quem eu sou?");

      // RETOMA O COMBATE COM PROTEÇÃO
      setTimeout(function () {
        retomarCombateChefe();
      }, 4000);
    }, 2500);

    return;
  }

  // SEGUNDA INTERRUPÇÃO - 2 VIDAS

  if (vidaInimigo <= 2 && !segundoDialogoChefe) {
    segundoDialogoChefe = true;

    // ESPERA IMANI POUSAR
    await esperarPousoDialogo();

    definirEstado("dialogo");

    // ESCURECE O CENÁRIO
    document.getElementById("jogo").classList.add("dialogoAtivo");

    direita = false;
    esquerda = false;

    ataqueInimigo.classList.remove("ativo");

    const dialogoVeu = document.getElementById("dialogoVeu");
    const textoVeu = document.getElementById("textoVeu");

    // Primeira fala do Véu
    textoVeu.textContent = "Eles não deveriam ter deixado você escapar.";
    dialogoVeu.style.display = "block";

    setTimeout(function () {
      dialogoVeu.style.display = "none";

      // Resposta de Imani
      mostrarDialogo("Quem são eles? Do que você está falando?");

      setTimeout(function () {
        // Última fala do Véu
        textoVeu.textContent = "Corra. Antes que percebam.";
        dialogoVeu.style.display = "block";

        setTimeout(function () {
          dialogoVeu.style.display = "none";

          // O Véu desaparece sem morrer
          inimigo.style.display = "none";
          vidaInimigo = 0;

          // O VESTÍGIO SURGE NA FLORESTA
          document.getElementById("vestigioFinal").style.display = "block";

          // Esconde a barra de vida
          document.getElementById("hudChefe").style.display = "none";

          // RESTAURA A ILUMINAÇÃO
          document.getElementById("jogo").classList.remove("dialogoAtivo");

          // A OUTRA CAMADA REAGE
          mostrarPulsoDourado();

          // FINALIZA A PROTEÇÃO
          protecaoDialogo = false;

          // Devolve o controle para Imani
          definirEstado("jogando");
        }, 2500);
      }, 5000);
    }, 2500);
  }
}

// COLETAR FRAGMENTO DE ALMA

let fragmentosColetados = 0;

// PRIMEIRO FLASH - CORREDOR DO NEXO

function mostrarPrimeiroFlash() {
  definirEstado("transicao");

  const memorias = document.getElementById("memoriasFinais");
  const imagem = document.getElementById("imagemMemoria");
  const texto = document.getElementById("textoMemoria");

  // Prepara a sequência de memórias
  memorias.style.display = "block";
  memorias.classList.remove("sistemaFalhando");

  texto.classList.remove("visivel");
  texto.textContent = "";

  // Primeira lembrança: Imani sendo transportada
  imagem.style.background =
    '#07060b url("imagens/flash-corredor.png") center / cover no-repeat';

  requestAnimationFrame(function () {
    imagem.classList.add("visivel");
  });

  // Próxima lembrança
  setTimeout(function () {
    imagem.classList.remove("visivel");

    setTimeout(function () {
      mostrarSegundoFlash();
    }, 300);
  }, 1500);
}

// SEGUNDO FLASH - EXTRAÇÃO DA IMANI

function mostrarSegundoFlash() {
  const imagem = document.getElementById("imagemMemoria");

  // Segunda lembrança: a sala de extração
  imagem.style.background =
    '#07060b url("imagens/flash-extracao.png") center / cover no-repeat';

  requestAnimationFrame(function () {
    imagem.classList.add("visivel");
  });

  // Próxima lembrança
  setTimeout(function () {
    imagem.classList.remove("visivel");

    setTimeout(function () {
      mostrarTerceiroFlash();
    }, 300);
  }, 1500);
}

// TERCEIRO FLASH - SILHUETA DE MAIA

function mostrarTerceiroFlash() {
  const imagem = document.getElementById("imagemMemoria");

  // Terceira lembrança: a pesquisadora misteriosa
  imagem.style.background =
    '#07060b url("imagens/flash-maia.png") center / cover no-repeat';

  requestAnimationFrame(function () {
    imagem.classList.add("visivel");
  });

  // Próxima lembrança
  setTimeout(function () {
    imagem.classList.remove("visivel");

    setTimeout(function () {
      mostrarQuartoFlash();
    }, 300);
  }, 1500);
}

// QUARTO FLASH - REVELAÇÃO DO NEXO

function mostrarQuartoFlash() {
  const memorias = document.getElementById("memoriasFinais");
  const imagem = document.getElementById("imagemMemoria");
  const texto = document.getElementById("textoMemoria");

  // Última lembrança: símbolo oficial do Nexo
  imagem.style.background =
    '#07060b url("imagens/flash-nexo.png") center / contain no-repeat';

  // Não sobrepõe outro texto à imagem do símbolo
  texto.textContent = "";
  texto.classList.remove("visivel");

  requestAnimationFrame(function () {
    imagem.classList.add("visivel");
  });

  // Encerramento cinematográfico
  setTimeout(function () {
    imagem.classList.remove("visivel");

    // Aguarda o escurecimento
    setTimeout(function () {
      // Encerra oficialmente a demonstração
      definirEstado("fim");

      // Mensagem final
      texto.textContent = "Sujeito perdido.";
      texto.classList.add("visivel");

      // Ativa a falha do sistema do Nexo
      setTimeout(function () {
        memorias.classList.add("sistemaFalhando");
      }, 1200);

      // BOTÃO PARA VOLTAR AO MENU INICIAL

      setTimeout(function () {
        const botaoInicio = document.createElement("button");

        botaoInicio.id = "botaoVoltarInicio";
        botaoInicio.textContent = "VOLTAR AO INÍCIO";
        botaoInicio.type = "button";

        memorias.appendChild(botaoInicio);

        botaoInicio.addEventListener("click", function () {
          location.reload();
        });
      }, 3500);
    }, 600);
  }, 1800);
}

// INVESTIGAÇÃO DO VESTÍGIO

let vestigioInvestigado = false;

function investigarVestigio() {
  // Impede investigar mais de uma vez
  if (vestigioInvestigado) return;

  vestigioInvestigado = true;

  // ESCONDE O VESTÍGIO APÓS A INTERAÇÃO
  document.getElementById("vestigioFinal").style.display = "none";

  // Pausa a movimentação
  definirEstado("dialogo");

  // Reação da Imani
  mostrarDialogo("Isso... está ligado à Outra Camada.");

  // INICIA A PRIMEIRA LEMBRANÇA APÓS A FALA
  setTimeout(function () {
    if (estadoJogo === "dialogo") {
      mostrarPrimeiroFlash();
    }
  }, 4800);
}

function coletarFragmento() {
  // Só coleta se o Fragmento estiver disponível
  if (!fragmentoDisponivel) {
    return;
  }

  // Calcula a distância entre Imani e o Fragmento
  const posicaoFragmento = parseFloat(fragmentoAlma.style.left);

  const distancia = Math.abs(posicaoX + 22 - (posicaoFragmento + 10));

  // Precisa estar perto do Fragmento
  if (distancia > 65) {
    return;
  }

  // Coleta o Fragmento
  fragmentoDisponivel = false;
  fragmentosColetados++;

  fragmentoAlma.style.display = "none";

  console.log("FRAGMENTO DE ALMA COLETADO!");
  console.log("Total:", fragmentosColetados);

  // Mensagem dentro do jogo
  const mensagemColeta = document.getElementById("mensagemColeta");

  mensagemColeta.style.display = "flex";

  // Esconde a mensagem após 2 segundos
  setTimeout(function () {
    mensagemColeta.style.display = "none";
  }, 2000);

  // PRIMEIRA REAÇÃO DA IMANI

  if (fragmentosColetados === 1) {
    setTimeout(function () {
      mostrarDialogo("O que... foi isso?");
    }, 2200);
  }
}

// TRANSIÇÃO PARA A SEGUNDA ÁREA

function iniciarTransicaoArea() {
  if (transicaoEmAndamento || areaAtual !== 1) {
    return;
  }

  transicaoEmAndamento = true;

  // IMPEDE MOVIMENTO DURANTE A TRANSIÇÃO
  direita = false;
  esquerda = false;

  // ATIVA O ESTADO DE TRANSIÇÃO
  definirEstado("transicao");

  const transicaoArea = document.getElementById("transicaoArea");

  // Escurece a tela
  transicaoArea.classList.add("ativa");

  setTimeout(function () {
    // Marca a chegada à segunda área
    areaAtual = 2;

    // SEGUNDO VÉU - MINI-CHEFE

    // Define a vida do mini-chefe
    vidaInimigo = 8;

    // MOSTRAR BARRA DE VIDA DO MINI-CHEFE

    document.getElementById("hudChefe").style.display = "block";

    atualizarVidaChefe();

    // Coloca o mini-chefe na floresta
    posicaoInimigoX = 700;

    // Atualiza a posição dele
    inimigo.style.left = posicaoInimigoX + "px";

    // Faz o inimigo aparecer novamente
    inimigo.style.display = "block";

    // Restaura a aparência normal
    inimigo.style.opacity = "1";

    // Identifica o segundo Véu
    inimigo.classList.add("miniChefe");

    // Aumenta um pouco sua velocidade
    velocidadeInimigo = 3.6;

    // TROCA O CENÁRIO PARA A FLORESTA

    document.getElementById("fundoCidade").classList.add("areaFloresta");

    console.log("CENÁRIO DA FLORESTA CARREGADO!");

    // Reposiciona Imani no início da área
    posicaoX = 80;
    imani.style.left = posicaoX + "px";

    // Remove o escurecimento
    transicaoArea.classList.remove("ativa");

    // DEVOLVE O CONTROLE AO JOGADOR
    definirEstado("jogando");
    transicaoEmAndamento = false;

    console.log("IMANI ENTROU NA SEGUNDA ÁREA!");
  }, 1200);
}

// 13. CONTROLE DAS ANIMAÇÕES DA IMANI

const quadrosImani = {
  parada: ["imani-parada-direita.png"],

  corrida: [
    "imani-corrida-1.png",
    "imani-corrida-2.png",
    "imani-corrida-3.png",
  ],

  pulo: ["imani-pulo-1.png", "imani-pulo-2.png", "imani-pulo-3.png"],

  queda: ["imani-caindo.png"],

  pouso: ["imani-pousando.png"],

  ataque: ["imani-ataque-1.png", "imani-ataque-2.png", "imani-ataque-3.png"],
};

// CARREGAR AS IMAGENS ANTES DAS ANIMAÇÕES

const imagensPreCarregadas = [];

Object.values(quadrosImani)
  .flat()
  .forEach(function (arquivo) {
    const imagem = new Image();
    imagem.src = "imagens/" + arquivo;
    imagensPreCarregadas.push(imagem);
  });

// CONTROLE DOS QUADROS

let estadoVisualAnterior = "";
let quadroVisualAnterior = -1;
let inicioAnimacaoVisual = 0;

// ATUALIZAR A ANIMAÇÃO DA IMANI

function atualizarAnimacaoImani(agora) {
  // Define uma única animação por vez
  let estadoVisual = "parada";

  if (atacando) {
    estadoVisual = "ataque";
  } else if (pulando) {
    estadoVisual = velocidadeY < 0 ? "queda" : "pulo";
  } else if (jogoIniciado && direita !== esquerda) {
    estadoVisual = "corrida";
  }

  // Reinicia os quadros quando a animação muda
  if (estadoVisual !== estadoVisualAnterior) {
    estadoVisualAnterior = estadoVisual;
    inicioAnimacaoVisual = agora;
    quadroVisualAnterior = -1;
  }

  const quadros = quadrosImani[estadoVisual];

  // VELOCIDADE DAS ANIMAÇÕES
  const duracaoQuadro =
    estadoVisual === "ataque" ? 60 : estadoVisual === "corrida" ? 90 : 110;

  let indice = Math.floor((agora - inicioAnimacaoVisual) / duracaoQuadro);

  // Corrida se repete; outras animações param no último quadro
  if (estadoVisual === "corrida") {
    indice = indice % quadros.length;
  } else {
    indice = Math.min(indice, quadros.length - 1);
  }

  // Troca a imagem apenas quando necessário
  if (indice !== quadroVisualAnterior) {
    imani.style.setProperty(
      "--sprite-imani",
      'url("imagens/' + quadros[indice] + '")',
    );
    quadroVisualAnterior = indice;
  }

  // Ajusta a aparência visual
  imani.classList.toggle("atacandoVisual", estadoVisual === "ataque");
  imani.classList.toggle("viradaEsquerda", direcao === "esquerda");
}

function movimentar() {
  // PAUSA DO JOGO E POUSO DA IMANI

  if (!jogoIniciado) {
    // Durante os diálogos do mini-chefe,Imani continua caindo até tocar o chão
    if (areaAtual === 2 && primeiroDialogoChefe) {
      // Aplica a gravidade
      posicaoY += velocidadeY;
      velocidadeY -= gravidade;

      // Verifica se chegou ao chão
      if (posicaoY <= chao) {
        posicaoY = chao;
        velocidadeY = 0;
        pulando = false;
      }

      // Atualiza a altura da Imani
      imani.style.bottom = posicaoY + "px";
    }

    atualizarAnimacaoImani(performance.now());

    requestAnimationFrame(movimentar);
    return;

    requestAnimationFrame(movimentar);
    return;
  }
  // MOVIMENTO DA IMANI
  if (vidaImani > 0) {
    if (direita) {
      posicaoX += 5;
    }

    if (esquerda) {
      posicaoX -= 5;
    }
  }

  // DIREÇÃO DO ATAQUE DA IMANI
  if (direcao === "direita") {
    ataque.style.left = "45px";
  }

  if (direcao === "esquerda") {
    ataque.style.left = "-70px";
  }

  // MOVIMENTO DO INIMIGO
  if (
    vidaInimigo > 0 &&
    vidaImani > 0 &&
    !aguardandoPousoDialogo &&
    !protecaoDialogo
  ) {
    // CALCULA A DISTÂNCIA ENTRE OS PERSONAGENS

    const centroVeu = posicaoInimigoX + (areaAtual === 2 ? 32 : 27);
    const centroImani = posicaoX + 22;

    const diferenca = centroImani - centroVeu;
    const distancia = Math.abs(diferenca);

    // PERSEGUIÇÃO E INVESTIDA

    if (recargaInvestida > 0) {
      recargaInvestida--;
    }

    // INVESTIDA ALEATÓRIA DO VÉU

    if (distancia > 80 && distancia < 200 && recargaInvestida === 0) {
      // Sorteia se o Véu vai investir
      const sorteio = Math.random();

      // 40% de chance de investir
      if (sorteio < 0.4) {
        framesInvestida = 10;

        console.log("O VÉU INVESTIU!");
      }

      // Espera um tempo aleatório antes de tentar novamente
      recargaInvestida = 180 + Math.floor(Math.random() * 181);
    }

    // Define a velocidade
    let velocidadeAtual = velocidadeInimigo;

    // Durante a investida, ele fica mais rápido
    if (framesInvestida > 0) {
      velocidadeAtual = 7;
      framesInvestida--;
    }

    // IDENTIFICA A DIREÇÃO DA IMANI IMEDIATAMENTE

    if (diferenca > 0) {
      direcaoInimigo = "direita";
    } else if (diferenca < 0) {
      direcaoInimigo = "esquerda";
    }

    // PERSEGUE IMANI MESMO DURANTE A RECARGA

    const golpeVisivel = ataqueInimigo.classList.contains("ativo");

    if (distancia > 55 && !golpeVisivel) {
      if (direcaoInimigo === "direita") {
        posicaoInimigoX += velocidadeAtual;
      } else {
        posicaoInimigoX -= velocidadeAtual;
      }
    }

    // ATUALIZA O LADO DO ATAQUE

    if (direcaoInimigo === "esquerda") {
      ataqueInimigo.style.left = "-55px";
    } else {
      ataqueInimigo.style.left = "25px";
    }

    // ATAQUE
    if (distancia <= 55) {
      atacarImani();
    }

    // Atualiza a posição do inimigo
    inimigo.style.left = posicaoInimigoX + "px";
  }

  // GRAVIDADE DA IMANI
  posicaoY += velocidadeY;
  velocidadeY -= gravidade;

  // COLISÃO COM O CHÃO
  if (posicaoY <= chao) {
    posicaoY = chao;
    velocidadeY = 0;
    pulando = false;
  }

  // LIMITES DA TELA
  if (posicaoX < 0) {
    posicaoX = 0;
  }

  if (posicaoX > 855) {
    posicaoX = 855;
  }

  // ATUALIZA POSIÇÃO DA IMANI
  imani.style.left = posicaoX + "px";
  imani.style.bottom = posicaoY + "px";

  // PASSAGEM PARA A SEGUNDA ÁREA

  if (areaAtual === 1 && fragmentosColetados >= 1 && posicaoX >= 845) {
    iniciarTransicaoArea();
  }

  // ATUALIZA A APARÊNCIA DA IMANI

  atualizarAnimacaoImani(performance.now());

  // Continua o jogo
  requestAnimationFrame(movimentar);
}

// 13. INICIAR O JOGO

atualizarBarraRessonancia();
movimentar();

// BOTÃO INICIAR E INTRODUÇÃO

document.getElementById("botaoIniciar").addEventListener("click", function () {
  // Esconde o menu
  document.getElementById("telaInicial").style.display = "none";

  // Mostra a introdução
  const introducao = document.getElementById("telaIntroducao");
  introducao.classList.add("ativa");

  // Após a introdução, mostra o jogo
  setTimeout(function () {
    introducao.classList.remove("ativa");

    // INICIA O ESTADO DE JOGABILIDADE
    definirEstado("jogando");
  }, 4000);
});

// 14. TELA DE CONTROLES

const botaoControles = document.getElementById("botaoControles");
const botaoVoltarMenu = document.getElementById("botaoVoltarMenu");
const telaControles = document.getElementById("telaControles");
const telaInicial = document.getElementById("telaInicial");

// Abrir controles
botaoControles.addEventListener("click", function () {
  telaControles.style.display = "flex";
});

// Voltar ao menu inicial
botaoVoltarMenu.addEventListener("click", function () {
  telaControles.style.display = "none";
});