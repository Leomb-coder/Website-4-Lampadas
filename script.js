let clienteweb = null
const clienteId = "Esp32LMB_" + Math.random().toString(16).substr(2, 8)

// Criando cliente MQTT (WebSocket seguro)
clienteweb = new Paho.MQTT.Client(
    "broker.hivemq.com",
    8884,
    "/mqtt", // IMPORTANTE para WebSocket
    clienteId
)

// Callbacks
clienteweb.onConnectionLost = function (responseObject) {
    console.log("Conexão perdida:", responseObject.errorMessage)
}

clienteweb.onMessageArrived = function (message) {
    console.log("Mensagem recebida:", message.destinationName, message.payloadString)
}

// Conectar
clienteweb.connect({
    useSSL: true,
    timeout: 5,
    onSuccess: function () {
        console.log("Conectado ao broker MQTT")
        alert("Conexão OK")
    },
    onFailure: function (error) {
        console.error("Falha na conexão:", error)
        alert("Conexão falhou")
    }
})

// Função para enviar mensagem com segurança
function enviarMensagem(topico, payload = "") {
    if (!clienteweb || !clienteweb.isConnected()) {
        alert("MQTT não está conectado ainda!")
        return
    }

    const msg = new Paho.MQTT.Message(payload)
    msg.destinationName = topico
    clienteweb.send(msg)
}

// Funções das lâmpadas
// Lâmpada Sala
function ligarLampadaSala() {
    lampada = document.getElementById("lp-sala")
    lampada.classList.remove("apagada")
    lampada.classList.add("acesa")
    lampada.nextElementSibling.textContent = "Ligada"
    navigator.vibrate(5000);

    enviarMensagem("senai510/lampada/sala/ligar")
}

function desligarLampadaSala() {
    lampada = document.getElementById("lp-sala")
    lampada.classList.remove("acesa")
    lampada.classList.add("apagada")
    lampada.nextElementSibling.textContent = "Desligada"

    enviarMensagem("senai510/lampada/sala/desligar")
}

// Lâmpada Cozinha
function ligarLampadaCozinha() {
    lampada = document.getElementById("lp-cozinha")
    lampada.classList.remove("apagada")
    lampada.classList.add("acesa")
    lampada.nextElementSibling.textContent = "Ligada"
    navigator.vibrate(5000);

    enviarMensagem("senai510/lampada/cozinha/ligar")
}

function desligarLampadaCozinha() {
    lampada = document.getElementById("lp-cozinha")
    lampada.classList.remove("acesa")
    lampada.classList.add("apagada")
    lampada.nextElementSibling.textContent = "Desligada"

    enviarMensagem("senai510/lampada/cozinha/desligar")
}

// Lâmpada Quarto 1
function ligarLampadaQuarto1() {
    lampada = document.getElementById("lp-quarto1")
    lampada.classList.remove("apagada")
    lampada.classList.add("acesa")
    lampada.nextElementSibling.textContent = "Ligada"
    navigator.vibrate(5000);

    enviarMensagem("senai510/lampada/quarto1/ligar")
}

function desligarLampadaQuarto1() {
    lampada = document.getElementById("lp-quarto1")
    lampada.classList.remove("acesa")
    lampada.classList.add("apagada")
    lampada.nextElementSibling.textContent = "Desligada"

    enviarMensagem("senai510/lampada/quarto1/desligar")
}

// Lâmpada Quarto 2
function ligarLampadaQuarto2() {
    lampada = document.getElementById("lp-quarto2")
    lampada.classList.remove("apagada")
    lampada.classList.add("acesa")
    lampada.nextElementSibling.textContent = "Ligada"
    navigator.vibrate(5000);

    enviarMensagem("senai510/lampada/quarto2/ligar")
}

function desligarLampadaQuarto2() {
    lampada = document.getElementById("lp-quarto2")
    lampada.classList.remove("acesa")
    lampada.classList.add("apagada")
    lampada.nextElementSibling.textContent = "Desligada"

    enviarMensagem("senai510/lampada/quarto2/desligar")
}

// Todas as Lâmpadas
function ligarTodasLampadas() {
    const lampadas = document.getElementsByClassName("lampada");

    for (let lampada of lampadas) {
        lampada.classList.remove("apagada");
        lampada.classList.add("acesa");
        lampada.nextElementSibling.textContent = "Ligada";
    }

    enviarMensagem("senai510/lampada/ligar");
    navigator.vibrate(5000);
}

function desligarTodasLampadas() {
    const lampadas = document.getElementsByClassName("lampada");

    for (let lampada of lampadas) {
        lampada.classList.remove("acesa");
        lampada.classList.add("apagada");
        lampada.nextElementSibling.textContent = "Desligada";
    }

    enviarMensagem("senai510/lampada/desligar");
}

// Função Piscar

let intervaloPisca = null;
let piscando = false;

// Função que alterna estado das lâmpadas
let estadoPisca = false;

function alternarLampadas() {
    if (!estadoPisca) {
        // GRUPO A ON
        ligarLampadaSala();
        ligarLampadaQuarto1();

        // GRUPO B OFF
        desligarLampadaCozinha();
        desligarLampadaQuarto2();
    } else {
        // GRUPO A OFF
        desligarLampadaSala();
        desligarLampadaQuarto1();

        // GRUPO B ON
        ligarLampadaCozinha();
        ligarLampadaQuarto2();
    }

    estadoPisca = !estadoPisca;
}

function piscarTodasLampadas() {
    if (piscando) return; // evita duplicar

    piscando = true;

    intervaloPisca = setInterval(alternarLampadas, 500); // pisca a cada 0.5s

    // parar depois de 5 segundos
    setTimeout(() => {
        pararPiscarLampadas();
    }, 5000);
}

function pararPiscarLampadas() {
    if (intervaloPisca) {
        clearInterval(intervaloPisca);
        intervaloPisca = null;
    }

    piscando = false;

    // garante que termina tudo desligado (ou troque pra ligarTodasLampadas se quiser)
    desligarTodasLampadas();
}