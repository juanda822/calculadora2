const filas = 10;
const columnas = 10;
const minas = 10;

let tablero = [];
let tableroHTML = document.getElementById("tablero");

function crearTablero() {
  tableroHTML.style.gridTemplateColumns = `repeat(${columnas}, 40px)`;
  tablero = [];

  for (let f = 0; f < filas; f++) {
    let fila = [];
    for (let c = 0; c < columnas; c++) {
      fila.push({
        f,
        c,
        bomba: false,
        revelada: false,
        numero: 0,
        flag: false,
      });
    }
    tablero.push(fila);
  }

  colocarMinas();
  calcularNumeros();
  renderizar();
}

function colocarMinas() {
  let puestas = 0;
  while (puestas < minas) {
    let f = Math.floor(Math.random() * filas);
    let c = Math.floor(Math.random() * columnas);

    if (!tablero[f][c].bomba) {
      tablero[f][c].bomba = true;
      puestas++;
    }
  }
}

function calcularNumeros() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (tablero[f][c].bomba) continue;

      let bombas = 0;

      for (let df = -1; df <= 1; df++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nf = f + df;
          let nc = c + dc;

          if (
            nf >= 0 &&
            nf < filas &&
            nc >= 0 &&
            nc < columnas &&
            tablero[nf][nc].bomba
          ) {
            bombas++;
          }
        }
      }

      tablero[f][c].numero = bombas;
    }
  }
}

function renderizar() {
  tableroHTML.innerHTML = "";

  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      const celda = document.createElement("div");
      celda.classList.add("celda");
      celda.dataset.f = f;
      celda.dataset.c = c;

      celda.addEventListener("click", clickCelda);
      celda.addEventListener("contextmenu", colocarBandera);

      tableroHTML.appendChild(celda);
    }
  }
}

function clickCelda(e) {
  let f = e.target.dataset.f;
  let c = e.target.dataset.c;

  revelar(f, c);
}

function colocarBandera(e) {
  e.preventDefault();
  let f = e.target.dataset.f;
  let c = e.target.dataset.c;

  const celda = tablero[f][c];

  if (celda.revelada) return;

  celda.flag = !celda.flag;

  e.target.classList.toggle("flag");
}

function revelar(f, c) {
  const celda = tablero[f][c];

  if (celda.revelada || celda.flag) return;

  celda.revelada = true;

  const div = document.querySelector(`[data-f="${f}"][data-c="${c}"]`);
  div.classList.add("revelada");

  if (celda.bomba) {
    div.classList.add("bomba");
    div.textContent = "💣";
    alert("💥 ¡Perdiste!");
    crearTablero();
    return;
  }

  if (celda.numero > 0) {
    div.textContent = celda.numero;
    return;
  }

  // Revelar en cadena
  for (let df = -1; df <= 1; df++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nf = parseInt(f) + df;
      const nc = parseInt(c) + dc;

      if (
        nf >= 0 &&
        nf < filas &&
        nc >= 0 &&
        nc < columnas
      ) {
        revelar(nf, nc);
      }
    }
  }
}

crearTablero();
