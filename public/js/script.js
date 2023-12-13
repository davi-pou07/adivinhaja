
function msmAcerto(msm) {
    const toastLiveExample = document.getElementById('toastSuccess')
    $('#toastSuccessMsm').text(msm)
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}

function msmErro(msm) {
    const toastLiveExample = document.getElementById('toastError')
    $('#toastErrorMsm').text(msm)
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}
class Jogo {
    constructor(jogador1, jogador2) {
        this.venceu = false
        this.jogador1 = jogador1;
        this.jogador2 = jogador2
        this.numeroSecreto = this.gerarnumeroSecreto();
        this.rodada = 1;
        this.jogadorDaRodada = 1;
    }
    gerarnumeroSecreto() {
        if (this.numeroSecreto != null) {
            return this.numeroSecreto
        } else {
            return Math.floor(Math.random() * 10000) + 1;
        }
    }
    addAcerto() {
        new Audio('./public/audio/acerto.mp3').play()
        this.getJogadorAtual().acertos++
        this.getJogadorAtual().score += 5
    }

    addErro() {
        new Audio('./public/audio/erro.mp3').play()
        this.getJogadorAtual().erros++
        this.getJogadorAtual().score -= 3
    }

    addErroTentativa() {
        new Audio('./public/audio/erro-tentativa.mp3').play()
        this.getJogadorAtual().tentativas++
        this.getJogadorAtual().score -= 15
    }

    addAcertoTentativa() {
        new Audio('./public/audio/success.mp3').play()
        this.getJogadorAtual().tentativas++
        this.getJogadorAtual().score += 100
        this.getJogadorAtual().descobertas++
        this.numeroSecreto = this.gerarnumeroSecreto()
    }

    addPassarVez() {
        this.getJogadorAtual().passes++
        this.getJogadorAtual().score -= 1
        this.nextRodada()
    }

    nextRodada() {
        this.vencerGame()
        if (!this.venceu) {
            this.rodada++
            this.jogadorDaRodada = this.jogadorDaRodada === 1 ? 2 : 1
        }
    }

    getJogadorAtual() {
        if (this.jogadorDaRodada == 1) {
            return this.jogador1
        } else {
            return this.jogador2
        }
    }


    vencerGame() {
        const jogaodorRodada = this.getJogadorAtual()
        if (jogaodorRodada.score >= 100 || jogaodorRodada.descobertas >= 1) {
            this.venceu = true
            msmAcerto(`Parabéns, o jogador ${jogaodorRodada.nome} VENCEU!`)

            $('#span_numero_secreto').text('O número secreto é:')
            $('#world').removeClass('d-none')
            $('#div_resultado_final').html(`<h1 class="mt-4">${this.numeroSecreto}</h1>`)
            setTimeout(() => {
                msmAcerto('O jogo será reiniciado:')
                document.location.reload()
            }, 5000)
        }
    }
}



class Jogador {
    constructor(nome) {
        this.nome = nome
        this.score = 0
        this.perguntas = 0
        this.tentativas = 0
        this.acertos = 0
        this.erros = 0
        this.passes = 0
        this.descobertas = 0
    }
}

let game;


function handleValidaInput(input) {
    if (input.value) {
        input.classList.add('is-valid')
    } else {
        input.classList.add('is-invalid')
    }
}

function hancleClickStart() {

    const in_jogador1 = $('#jogador1')
    const in_jogador2 = $('#jogador2')
    if (!in_jogador1.val()) {
        return msmErro('Necessario informar apelido do jogador 1')
    }
    if (!in_jogador2.val()) {
        return msmErro('Necessario informar apelido do jogador 2')
    }
    if (in_jogador1.val() == in_jogador2.val()) {
        return msmErro('Apelidos devem ser diferentes')
    }
    const jogador1 = new Jogador(in_jogador1.val())
    const jogador2 = new Jogador(in_jogador2.val())
    game = new Jogo(jogador1, jogador2)

    $('#div-cadastro').addClass('animate__backOutRight')
    setTimeout(() => {
        $('#div-cadastro').addClass('d-none')
        $('#div-game').removeClass('d-none')
        $('#div-game').addClass('animate__backInLeft')
    }, 1000)
    gameUpdate()

}


function gameUpdate() {

    $('#perguntas_numero').val('')
    $('#perguntas_numero_X').val('')
    $('#perguntas_numero_y').val('')

    $('#perguntas_numero').removeClass('is-valid')
    $('#perguntas_numero_X').removeClass('is-valid')
    $('#perguntas_numero_y').removeClass('is-valid')

    $('#sel_perguntas').val('1')

    $('#div_opcoes').removeClass('d-none')
    $('#div_perguntas').addClass('d-none')
    $('#div_sugestao').addClass('d-none')

    $('#sp_rodada_atual').text(game.rodada)

    $('#sp_jogador1').text(game.jogador1.nome)
    $('#sp_perguntas1').text(game.jogador1.perguntas)
    $('#sp_tentativas1').text(game.jogador1.tentativas)
    $('#sp_passes1').text(game.jogador1.passes)
    $('#sp_score1').text(game.jogador1.score)
    $('#sp_erros1').text(game.jogador1.erros)
    $('#sp_acertos1').text(game.jogador1.acertos)
    $('#sp_descobertas1').text(game.jogador1.descobertas)

    $('#sp_jogador2').text(game.jogador2.nome)
    $('#sp_perguntas2').text(game.jogador2.perguntas)
    $('#sp_tentativas2').text(game.jogador2.tentativas)
    $('#sp_passes2').text(game.jogador2.passes)
    $('#sp_score2').text(game.jogador2.score)
    $('#sp_erros2').text(game.jogador2.erros)
    $('#sp_acertos2').text(game.jogador2.acertos)
    $('#sp_descobertas2').text(game.jogador2.descobertas)


    if (game.jogadorDaRodada == 1) {
        $('#sp_vez1').text('⭐')
        $('#sp_vez2').text('')
    } else {
        $('#sp_vez1').text('')
        $('#sp_vez2').text('⭐')
    }
}

function handleClickPassarVez() {
    const jogadoratual = game.getJogadorAtual()
    msmErro(`Jogador ${jogadoratual.nome} passou a vez`)
    game.addPassarVez()
    gameUpdate()
}

function handleClickPergunta() {
    hancleChangePergunta(1)
    $('#div_opcoes').addClass('d-none')
    $('#div_sugestao').addClass('d-none')
    $('#div_perguntas').removeClass('d-none')
    if (game.jogadorDaRodada == 1) {
        game.jogador1.perguntas++
    } else {
        game.jogador2.perguntas++
    }
}

function handleClickSugerir() {
    $('#div_opcoes').addClass('d-none')
    $('#div_perguntas').addClass('d-none')
    $('#div_sugestao').removeClass('d-none')
}

function handleSugerir() {
    const sugestao_numero = $('#sugestao_numero')
    if (!sugestao_numero.val() || isNaN(parseInt(sugestao_numero.val())) || sugestao_numero.val() <= 0) {
        sugestao_numero.addClass('is-invalid')
        return msmErro('O número sugerido deve ser um número válido e maior que 0')
    }
    if (sugestao_numero.val() == game.numeroSecreto) {
        game.addAcertoTentativa()
        // $('#perguntas_realizadas').html('')
    } else {
        msmErro('Errado, esse NÃO É o número secreto!')
        game.addErroTentativa()
    }

    game.nextRodada()
    gameUpdate()
}

function addPerguntaList(type, numerox, numeroy, acerto) {
    const perguntas_realizadas = $('#perguntas_realizadas');
    let pergunta = "";

    const perguntas = {
        1: `O número secreto É MAIOR que ${numerox}?`,
        2: `O número secreto É MENOR que ${numerox}?`,
        3: `O número secreto É DIVISÍVEL por ${numerox}?`,
        4: `O número secreto está ENTRE ${numerox} e ${numeroy}?`,
        5: `O número secreto É PRIMO?`,
        6: `O número secreto NÃO É PRIMO?`,
        7: `O número secreto É PAR?`,
        8: `O número secreto É ÍMPAR?`
    };

    pergunta = `<li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${game.getJogadorAtual().nome}</div>
                    ${perguntas[type]}
                </div>
                <span class="badge bg-${acerto ? 'success' : 'danger'} rounded-pill">${acerto ? 'Correto' : 'Incorreto'}</span>
            </li>`;

    perguntas_realizadas.append(pergunta);
}

function handlePerguntar() {
    const sel_perguntas = $('#sel_perguntas').val()
    if (!sel_perguntas || isNaN(parseInt(sel_perguntas)) || sel_perguntas < 1 || sel_perguntas > 8) {
        return msmErro('Tipo de Pergunta Inválida')
    }
    const perguntas_numero = $('#perguntas_numero')
    const perguntas_numero_X = $('#perguntas_numero_X')
    const perguntas_numero_y = $('#perguntas_numero_y')

    if ((parseInt(sel_perguntas) > 1 && parseInt(sel_perguntas) < 4) && !perguntas_numero.val()) {
        perguntas_numero.addClass('is-invalid')
        return msmErro('Necessário informar um número')
    }


    switch (parseInt(sel_perguntas)) {
        case 1:
            if (game.numeroSecreto > perguntas_numero.val()) {
                msmAcerto(`Acertou, o número secreto é MAIOR que ${perguntas_numero.val()}`)
                game.addAcerto()
                addPerguntaList(1, perguntas_numero.val(), null, true)
            } else {
                msmErro(`Errou, o número secreto NÃO é MAIOR que ${perguntas_numero.val()}`)
                game.addErro()
                addPerguntaList(1, perguntas_numero.val(), null, false)
            }
            break;
        case 2:
            if (game.numeroSecreto < perguntas_numero.val()) {
                msmAcerto(`Acertou, o número secreto é MENOR que ${perguntas_numero.val()}`)
                game.addAcerto()
                addPerguntaList(2, perguntas_numero.val(), null, true)
            } else {
                msmErro(`Errou, o número secreto NÃO é MENOR que ${perguntas_numero.val()}`)
                game.addErro()
                addPerguntaList(2, perguntas_numero.val(), null, false)
            }
            break;
        case 3:
            if (perguntas_numero.val() <= 1) {
                msmErro(`O número informado deve ser maior que 1`)
            }
            if (game.numeroSecreto % perguntas_numero.val() === 0) {
                msmAcerto(`Acertou, o número secreto é DIVISÍVEL por ${perguntas_numero.val()}`)
                game.addAcerto()
                addPerguntaList(3, perguntas_numero.val(), null, true)
            } else {
                msmErro(`Errou, o número secreto NÃO é DIVISÍVEL por ${perguntas_numero.val()}`)
                game.addErro()
                addPerguntaList(3, perguntas_numero.val(), null, false)
            }
            break;
        case 4:
            if (!perguntas_numero_X.val() || isNaN(parseInt(perguntas_numero_X.val()))) {
                perguntas_numero_X.add('is-invalid')
                msmErro('Necessário informar o valor de X válido')
            }
            if (!perguntas_numero_y.val() || isNaN(parseInt(perguntas_numero_y.val()))) {
                perguntas_numero_y.add('is-invalid')
                return msmErro('Necessário informar o valor de Y válido')
            }
            if (perguntas_numero_X.val() < game.numeroSecreto && perguntas_numero_y.val() > game.numeroSecreto) {
                msmAcerto(`Acertou, o número secreto ESTÁ entre ${perguntas_numero_X.val()} e ${perguntas_numero_y.val()}`)
                game.addAcerto()
                addPerguntaList(4, perguntas_numero_X.val(), perguntas_numero_y.val(), true)
            } else {
                msmErro(`Errou, o número secreto NÃO está entre ${perguntas_numero_X.val()} e ${perguntas_numero_y.val()}`)
                game.addErro()
                addPerguntaList(4, perguntas_numero_X.val(), perguntas_numero_y.val(), false)
            }
            break;
        case 5:
            if (ehPrimo(game.numeroSecreto)) {
                msmAcerto(`Acertou, o número secreto É UM NÚMERO PRIMO`)
                game.addAcerto()
                addPerguntaList(5, null, null, true)
            } else {
                msmErro(`Errou, o número secreto NÃO É UM NÚMERO PRIMO`)
                game.addErro()
                addPerguntaList(5, null, null, false)
            }
            break;
        case 6:
            if (!ehPrimo(game.numeroSecreto)) {
                msmAcerto(`Acertou, o número secreto NÃO É UM NÚMERO PRIMO`)
                game.addAcerto()
                addPerguntaList(6, null, null, true)
            } else {
                msmErro(`Errou, o número secreto É UM NÚMERO PRIMO`)
                game.addErro()
                addPerguntaList(6, null, null, false)
            }
            break;
        case 7:
            if (game.numeroSecreto % 2 === 0) {
                msmAcerto(`Acertou, o número secreto É UM NÚMERO PAR`)
                game.addAcerto()
                addPerguntaList(7, null, null, true)
            } else {
                msmErro(`Errou, o número secreto NÃO É UM NÚMERO PAR`)
                game.addErro()
                addPerguntaList(7, null, null, false)
            }
            break;
        case 8:
            if (game.numeroSecreto % 2 !== 0) {
                msmAcerto(`Acertou, o número secreto É UM NÚMERO IMPAR`)
                game.addAcerto()
                addPerguntaList(8, null, null, true)
            } else {
                msmErro(`Errou, o número secreto NÃO É UM NÚMERO IMPAR`)
                game.addErro()
                addPerguntaList(8, null, null, false)
            }
            break;
        default:
            break;
    }
    game.nextRodada()
    gameUpdate()
}

function ehPrimo(numero) {
    if (numero <= 1) {
        return false; // Números menores ou iguais a 1 não são primos
    }

    for (let i = 2; i <= Math.sqrt(numero); i++) {
        if (numero % i === 0) {
            return false; // Se for divisível por algum número, não é primo
        }
    }

    return true; // Se não for divisível por nenhum número, é primo
}

function hancleChangePergunta(valor) {
    const div_perguntas_1_3 = $('#div_perguntas_1_3')
    const div_perguntas_4 = $('#div_perguntas_4')
    const div_pergunta_codicao_variado = $('#div_pergunta_codicao_variado')

    switch (parseInt(valor)) {
        case 1:
            div_perguntas_4.addClass('d-none')
            div_perguntas_1_3.removeClass('d-none')
            div_pergunta_codicao_variado.html('<p class="fw-bold mt-3 fs-4">(MAIOR) ></p>')

            break;
        case 2:

            div_perguntas_4.addClass('d-none')
            div_perguntas_1_3.removeClass('d-none')
            div_pergunta_codicao_variado.html('<p class="fw-bold mt-3 fs-4">< (MENOR)</p>')

            break;
        case 3:

            div_perguntas_4.addClass('d-none')
            div_perguntas_1_3.removeClass('d-none')
            div_pergunta_codicao_variado.html('<p class="fw-bold mt-3 fs-4"> / (DIVISÍVEL)</p>')
            break;
        case 4:
            div_perguntas_4.removeClass('d-none')
            div_perguntas_1_3.addClass('d-none')
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            div_perguntas_4.addClass('d-none')
            div_perguntas_1_3.addClass('d-none')
            break;
        default:
            break;
    }
}