// Esperar que o DOM seja totalmente carregado antes de executar o script
window.addEventListener('DOMContentLoaded', () => {
    // Guardar em variáveis os elementos do DOM
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    // Variáveis do estado inicial do jogo
    let board = ['', '', '', '', '', '', '', '', '', '', '', ''];
    let currentPlayer = '1';
    let isGameActive = true;

    // Combinações que resultam numa vitória
    const winningConditions = [
        [0, 1, 2],
        [1, 2, 3],
        [4, 5, 6],
        [5, 6, 7],
        [8, 9, 10],
        [9, 10, 11],
        [0, 4, 8],
        [1, 5, 9],
        [2, 6, 10],
        [3, 7, 11],
        [0, 5, 10],
        [1, 6, 11],
        [3, 6, 9],
        [2, 5, 8]
    ];

    // Função que verifica se já alguém ganhou o jogo
    function handleResultValidation() {
        let roundWon = false;

        // Para cada combinação de vitória possível vai verificar se estão, nessas posições do tabuleiro, 3 letras iguais
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        // Se um jogador já tiver ganho chama a função para anunciar o vencedor e termina o jogo
        if (roundWon) {
            announce(currentPlayer === '1' ? 'PLAYER1_WON' : 'PLAYER2_WON');
            isGameActive = false;
            return;
        }
    }

    // Função para anunciar o vencedor
    const announce = (type) => {
        switch(type){
            case 'PLAYER2_WON':
                announcer.innerHTML = 'Player <span class="player2">2</span> Won';
                break;
            case 'PLAYER1_WON':
                announcer.innerHTML = 'Player <span class="player1">1</span> Won';
                break;
        }
        announcer.classList.remove('hide');
    };

    // Função para verificar se é possível colocar ou trocar uma peça do tabuleiro
    const isValidAction = (tile) => {
        return tile.innerText === '' || tile.innerText === '🟢' || tile.innerText === '🟡';
    };

    // Função para atualizar o tabuleiro consoante o jogada feito pelo jogador
    const updateBoard =  (index) => {
        switch (board[index]){
            case '':
                board[index] = '🟢';
                break;
            case '🟢':
                board[index] = '🟡';
                break;
            case '🟡':
                board[index] = '🔴';
                break;
            default:
                break;
        }
    }

    // Função para mudar para o próximo jogador
    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === '1' ? '2' : '1';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    // Função que efetua a jogada quando o jogador clica no tabuleiro
    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive) {
            updateBoard(index);
            tile.innerText = board[index];
            tile.classList.remove('🟢', '🟡', '🔴');
            tile.classList.add(board[index]);
            handleResultValidation();
            changePlayer();
        }
    }
    
    // Função para repor o tabuleiro ao estado inicial
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === '2') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('player1');
            tile.classList.remove('player2');
        });
    }

    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});