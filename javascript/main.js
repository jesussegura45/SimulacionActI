let puntuacionJugador1 = [];
let puntuacionJugador2 = [];
let dadoJugador1 = [];
let dadoJugador2 = [];
let contadorLanzamientos = 0;
let contadorRondas = 0;
let unicaFilaPosible = "blank";
let cartaComodin = false;
let turnoJugadorUno = true;
let valoresTransformacion = [
  [0, 30], [-5, 40], [0, 35], [5, 40], [0, 30]
];
const player1Container = document.getElementById("player1Container");
const player2Container = document.getElementById("player2Container");
const elementosDado = document.querySelectorAll(".dado");
const botonLanzar = document.getElementById("lanzar");
const botonFin = document.getElementById("finJuego");
const celdasTablaPuntuacion = document.querySelectorAll(".cell");
botonLanzar.addEventListener("click", lanzarDado);
botonFin.addEventListener("click", function() {
  location.reload(); // Recarga la página
});
let sonidoLanzamiento = new Audio("roll.wav");

function lanzarDado() {
  contadorLanzamientos++;
  let dadoArr = [1, 2, 3, 4, 5];
  let randomdado = [];
  for (let i = 0; i < dadoArr.length; i++) {
    randomdado.push(Math.floor(Math.random() * 6) + 1);
  }
  const playArea = document.getElementById("playArea");
  const dadoContainer = document.getElementById("player1Container");
  let numdado = dadoContainer.children.length;
  let counter = 0;
  elementosDado.forEach(function(dadoElement, index) {
    if (dadoElement.classList.contains("active") || contadorLanzamientos == 1) {
      reiniciarPosicionesDado();
      const x = valoresTransformacion[index][0];
      const y = valoresTransformacion[index][1];

      setTimeout(function() {
        counter++;
        cambiarPosicionDado(dadoElement, x, y);
        cambiarCarasDado(randomdado);

        if (counter == 1) {
          if (turnoJugadorUno) escribirValoresTemporalesEnTablaPuntuacion(dadoJugador1);
          else escribirValoresTemporalesEnTablaPuntuacion(dadoJugador2);
        }
        if (contadorLanzamientos == 3) {
          botonLanzar.disabled = true;
          botonLanzar.style.opacity = 0.5;
        }
        sonidoLanzamiento.play();
      }, 500);
    }
  });
}

function reiniciarPosicionesDado() {
  elementosDado.forEach(function(dadoElement) {
    dadoElement.style.transform = "none";
  });
}

function cambiarPosicionDado(dadoElement, x, y) {
  let angle = 135 * Math.floor(Math.random() * 10);
  let dadoRollDirection = -1;
  if (!turnoJugadorUno) dadoRollDirection = 1;
  angle = 135 * Math.floor(Math.random() * 10);
  dadoElement.style.transform =
    "translateX(" +
    x + "vw) translateY(" + dadoRollDirection * y +
    "vh) rotate(" + angle + "deg)";
}

function cambiarCarasDado(randomdado) {
  for (let i = 0; i < elementosDado.length; i++) {
    if (contadorLanzamientos === 1) elementosDado[i].classList.add("active");
    if (elementosDado[i].classList.contains("active")) {
      if (turnoJugadorUno) dadoJugador1[i] = randomdado[i];
      else dadoJugador2[i] = randomdado[i];

      let face = elementosDado[i].getElementsByClassName("face")[0];
      face.src = "imagenes/dado" + randomdado[i] + ".png";
    }
  }
}

function reiniciarCarasDado() {
  for (let i = 0; i < elementosDado.length; i++) {
    let face = elementosDado[i].getElementsByClassName("face")[0];
    elementosDado[i].classList.remove("active");
    let dadoNumber = i + 1;
    face.src = "imagenes/dado" + dadoNumber + ".png";
  }
}

elementosDado.forEach(function(dadoElement, index) {
  dadoElement.addEventListener("click", function() {
    if (contadorLanzamientos == 0) return;
    dadoElement.classList.toggle("active");
    if (!dadoElement.classList.contains("active")) {
      dadoElement.style.transform = "none";
    } else {
      const dadoNumber = dadoElement.id.charAt(3);
      const x = valoresTransformacion[dadoNumber - 1][0];
      const y = valoresTransformacion[dadoNumber - 1][1];
      cambiarPosicionDado(dadoElement, x, y);
    }
  });
});

function escribirValoresTemporalesEnTablaPuntuacion(dado) {
  let scoreTable = [];
  scoreTable = puntuacionJugador1.slice();
  let playerNumber = 1;
  if (!turnoJugadorUno) {
    scoreTable = [];
    playerNumber = 2;
    scoreTable = puntuacionJugador2.slice();
  }
  cartaComodin = false;
  unicaFilaPosible = "blank";
  let yahtzeeScore = calcularYahtzee(dado);
  const yahtzeeElement = document.getElementById("yahtzee" + playerNumber);
  if (scoreTable[12] === undefined) {
    yahtzeeElement.innerHTML = yahtzeeScore;
  } else if (yahtzeeScore > 0 && scoreTable[12]) {
    yahtzeeScore = parseInt(yahtzeeElement.innerHTML) + 100;
    yahtzeeElement.innerHTML = yahtzeeScore;
  }
  if (yahtzeeScore > 0 && scoreTable[dado[0] - 1] != undefined && scoreTable[12] !== undefined) {
    cartaComodin = true;
  }
  if (yahtzeeScore > 0 && scoreTable[dado[0] - 1] == undefined && scoreTable[12] !== undefined) {
    unicaFilaPosible = dado[0];
    escribirValorTemporalEnUnicaFila(dado, playerNumber);
    return;
  }
  //------------------------------------------------------------
  if (scoreTable[0] === undefined) {
    let onesScore = calcularUnos(dado);
    document.getElementById("unos" + playerNumber).innerHTML = onesScore;
  }
  if (scoreTable[1] === undefined) {
    let twosScore = calcularDoses(dado);
    document.getElementById("doses" + playerNumber).innerHTML = twosScore;
  }
  if (scoreTable[2] === undefined) {
    let threesScore = calcularTreses(dado);
    document.getElementById("treses" + playerNumber).innerHTML = threesScore;
  }
  if (scoreTable[3] === undefined) {
    let foursScore = calcularCuatros(dado);
    document.getElementById("cuatros" + playerNumber).innerHTML = foursScore;
  }
  if (scoreTable[4] === undefined) {
    let fivesScore = calcularCincos(dado);
    document.getElementById("cincos" + playerNumber).innerHTML = fivesScore;
  }
  if (scoreTable[5] === undefined) {
    let sixesScore = calcularSeises(dado);
    document.getElementById("seises" + playerNumber).innerHTML = sixesScore;
  }
  if (scoreTable[6] === undefined) {
    let threeOfAKindScore = calcularTresDeUnTipo(dado);
    document.getElementById("tresDeUnTipo" + playerNumber).innerHTML =
      threeOfAKindScore;
  }
  if (scoreTable[7] === undefined) {
    let fourOfAKindScore = calcularCuatroDeUnTipo(dado);
    document.getElementById("cuatroDeUnTipo" + playerNumber).innerHTML =
      fourOfAKindScore;
  }
  if (scoreTable[8] === undefined) {
    let fullHouseScore = calcularCasaLlena(dado);
    document.getElementById("casaLlena" + playerNumber).innerHTML =
      fullHouseScore;
  }
  if (scoreTable[9] === undefined) {
    let smallStraightScore = cartaComodin ? 30 : calcularPequenaEscalera(dado);
    document.getElementById("pequenaEscalera" + playerNumber).innerHTML =
      smallStraightScore;
  }
  if (scoreTable[10] === undefined) {
    let largeStraightScore = cartaComodin ? 40 : calcularEscaleraLarga(dado);
    document.getElementById("escaleraLarga" + playerNumber).innerHTML =
      largeStraightScore;
  }
  if (scoreTable[11] === undefined) {
    let chanceScore = calcularOportunidad(dado);
    document.getElementById("oportunidad" + playerNumber).innerHTML = chanceScore;
  }
}

function escribirValorTemporalEnUnicaFila(dado, playerNumber) {
  if (dado[0] == 1) {
    let score = calcularUnos(dado);
    document.getElementById("unos" + playerNumber).innerHTML = score;
  }
  if (dado[0] == 2) {
    let score = calcularDoses(dado);
    document.getElementById("doses" + playerNumber).innerHTML = score;
  }
  if (dado[0] == 3) {
    let score = calcularTreses(dado);
    document.getElementById("treses" + playerNumber).innerHTML = score;
  }
  if (dado[0] == 4) {
    let score = calcularCuatros(dado);
    document.getElementById("cuatros" + playerNumber).innerHTML = score;
  }
  if (dado[0] == 5) {
    let score = calcularCincos(dado);
    document.getElementById("cincos" + playerNumber).innerHTML = score;
  }
  if (dado[0] == 6) {
    let score = calcularSeises(dado);
    document.getElementById("seises" + playerNumber).innerHTML = score;
  }
}

celdasTablaPuntuacion.forEach(function(cell) {
  cell.addEventListener("click", onCellClick);
});
function onCellClick() {
  let row = this.getAttribute("data-row");
  let column = this.getAttribute("data-column");
  if (
    contadorLanzamientos == 0 ||
    row === null || (unicaFilaPosible != "blank" && row != unicaFilaPosible)
  ) return;
  if (turnoJugadorUno && column == 1) {
    puntuacionJugador1[row - 1] = parseInt(this.innerHTML);
    let upperSectionScore1 = calcularSeccionSuperior(puntuacionJugador1);
    let bonusScore1 = upperSectionScore1 > 63 ? 35 : 0;
    let lowerSectionScore1 = calcularPuntuacionSeccionInferior(puntuacionJugador1);
    let totalScore1 = upperSectionScore1 + lowerSectionScore1 + bonusScore1;
    suma1.innerHTML = upperSectionScore1;
    bonus1.innerHTML = bonusScore1;
    total1.innerHTML = totalScore1;
    this.removeEventListener("click", onCellClick);
    this.style.color = "red";
    suma1.style.color = "red";
    bonus1.style.color = "red";
    total1.style.color = "red";
    cambiarTurno();
  }
  if (!turnoJugadorUno && column == 2) {
    puntuacionJugador2[row - 1] = parseInt(this.innerHTML);
    let upperSectionScore2 = calcularSeccionSuperior(puntuacionJugador2);
    let bonusScore2 = upperSectionScore2 > 63 ? 35 : 0;
    let lowerSectionScore2 = calcularPuntuacionSeccionInferior(puntuacionJugador2);
    let totalScore2 = upperSectionScore2 + lowerSectionScore2 + bonusScore2;
    suma2.innerHTML = upperSectionScore2;
    bonus2.innerHTML = bonusScore2;
    total2.innerHTML = totalScore2;
    this.removeEventListener("click", onCellClick);
    this.style.color = "red";
    suma2.style.color = "red";
    bonus2.style.color = "red";
    total2.style.color = "red";
    cambiarTurno();
  }
}

function cambiarTurno() {
  contadorRondas++;
  actualizarTablaPuntuacion();
  reiniciarCarasDado();
  turnoJugadorUno = !turnoJugadorUno;
  contadorLanzamientos = 0;
  if (turnoJugadorUno) {
    const player2Containerdado = player2Container.querySelectorAll(".dado");
    player2Containerdado.forEach((dadoElement) => {
      dadoElement.style.transform = "none";
      player2Container.removeChild(dadoElement);
      player1Container.appendChild(dadoElement);
    });
  } else {
    const player1Containerdado = player1Container.querySelectorAll(".dado");
    player1Containerdado.forEach((dadoElement) => {
      dadoElement.style.transform = "none";
      player1Container.removeChild(dadoElement);
      player2Container.appendChild(dadoElement);
    });
  }
  if (contadorRondas == 26) {
    calcularPuntuacionFinalJuego();
    return;
  }
  botonLanzar.disabled = false;
  botonLanzar.style.opacity = 1;
}

function actualizarTablaPuntuacion() {
  let scoreTable = [];
  scoreTable = puntuacionJugador1.slice();
  let column = 1;
  if (!turnoJugadorUno) {
    scoreTable = [];
    scoreTable = puntuacionJugador2.slice();
    column = 2;
  }
  let scoreCells = document.querySelectorAll('[data-column="' + column + '"]');
  for (let i = 0; i < scoreCells.length; i++) {
    if (scoreTable[i] === undefined) {
      scoreCells[i].innerHTML = "";
    }
  }
}

function calcularPuntuacionFinalJuego() {
  let player1Total = parseInt(document.getElementById("total1").innerHTML);
  let player2Total = parseInt(document.getElementById("total2").innerHTML);
  const endGameMessage = player1Total == player2Total ? "Empate" : player1Total > player2Total ? "Jugador 1 Ganador" : "Jugador 2 Ganador";
  document.getElementById("endGameMessage").innerHTML = endGameMessage;
  botonLanzar.disabled = true;
  botonLanzar.style.opacity = 0.5;
}

//--------------------------------------------------------------
function calcularUnos(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] === 1) {
      score += 1;
    }
  }
  return score;
}
function calcularDoses(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] === 2) {
      score += 2;
    }
  }
  return score;
}
function calcularTreses(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] === 3) {
      score += 3;
    }
  }
  return score;
}
function calcularCuatros(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] === 4) {
      score += 4;
    }
  }
  return score;
}
function calcularCincos(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] === 5) {
      score += 5;
    }
  }
  return score;
}
function calcularSeises(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] === 6) {
      score += 6;
    }
  }
  return score;
}
function calcularOportunidad(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    score += dado[i];
  }
  return score;
}
function calcularYahtzee(dado) {
  let firstDie = dado[0];
  let score = 50;
  for (let i = 0; i < dado.length; i++) {
    if (dado[i] !== firstDie) {
      score = 0;
    }
  }
  return score;
}

function calcularTresDeUnTipo(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    let count = 1;
    for (let j = 0; j < dado.length; j++) {
      if (j !== i && dado[i] === dado[j]) {
        count++;
      }
    }
    if (count >= 3) {
      score = dado.reduce((acc, val) => acc + val);
      break;
    }
  }
  return score;
}
function calcularCuatroDeUnTipo(dado) {
  let score = 0;
  for (let i = 0; i < dado.length; i++) {
    let count = 1;
    for (let j = 0; j < dado.length; j++) {
      if (j !== i && dado[i] === dado[j]) {
        count++;
      }
    }
    if (count >= 4) {
      score = dado.reduce((acc, val) => acc + val);
      break;
    }
  }
  return score;
}
function calcularCasaLlena(dado) {
  let score = 0;
  let dadoCopy = dado.slice();
  dadoCopy.sort();
  if (
    (dadoCopy[0] == dadoCopy[1] &&
      dadoCopy[1] == dadoCopy[2] &&
      dadoCopy[3] == dadoCopy[4]
    ) ||
    (dadoCopy[0] == dadoCopy[1] &&
      dadoCopy[2] == dadoCopy[3] &&
      dadoCopy[3] == dadoCopy[4]
    )
  ) {
    score = 25;
    return score;
  }
  return score;
}
function calcularPequenaEscalera(dado) {
  let score = 0;
  let dadoCopy = [...new Set(dado)];
  dadoCopy.sort();
  if (
    (dadoCopy[1] == dadoCopy[0] + 1 &&
      dadoCopy[2] == dadoCopy[1] + 1 &&
      dadoCopy[3] == dadoCopy[2] + 1
    ) ||
    (dadoCopy[2] == dadoCopy[1] + 1 &&
      dadoCopy[3] == dadoCopy[2] + 1 &&
      dadoCopy[4] == dadoCopy[3] + 1
    )
  ) {
    score = 30;
  }
  return score;
}
function calcularEscaleraLarga(dado) {
  let score = 0;
  let dadoCopy = [...new Set(dado)];
  dadoCopy.sort();
  if (
    (dadoCopy[1] == dadoCopy[0] + 1 &&
      dadoCopy[2] == dadoCopy[1] + 1 &&
      dadoCopy[3] == dadoCopy[2] + 1 &&
      dadoCopy[4] == dadoCopy[3] + 1
    )
  ) {
    score = 40;
  }
  return score;
}
function calcularSeccionSuperior(playerScore) {
  let score = 0;
  let unos = playerScore[0] == undefined ? 0 : playerScore[0];
  let doses = playerScore[1] == undefined ? 0 : playerScore[1];
  let treses = playerScore[2] == undefined ? 0 : playerScore[2];
  let cuatros = playerScore[3] == undefined ? 0 : playerScore[3];
  let cincos = playerScore[4] == undefined ? 0 : playerScore[4];
  let seises = playerScore[5] == undefined ? 0 : playerScore[5];
  score = unos + doses + treses + cuatros + cincos + seises;
  return score;
}
function calcularPuntuacionSeccionInferior(playerScore) {
  let lowerSectionScore = 0;
  let tresDeUnTipo = playerScore[6] === undefined ? 0 : playerScore[6];
  let cuatroDeUnTipo = playerScore[7] === undefined ? 0 : playerScore[7];
  let casaLlena = playerScore[8] === undefined ? 0 : playerScore[8];
  let pequenaEscalera = playerScore[9] === undefined ? 0 : playerScore[9];
  let escaleraLarga = playerScore[10] === undefined ? 0 : playerScore[10];
  let oportunidad = playerScore[11] === undefined ? 0 : playerScore[11];
  let yahtzee = playerScore[12] === undefined ? 0 : playerScore[12];
  if (yahtzee > 0) {
    playerNumber = turnoJugadorUno ? 1 : 2;
    yahtzee = parseInt(document.getElementById("yahtzee" + playerNumber).innerHTML);
  }
  lowerSectionScore = tresDeUnTipo + cuatroDeUnTipo + casaLlena + pequenaEscalera + escaleraLarga
    + oportunidad + yahtzee;
  return lowerSectionScore;
}
