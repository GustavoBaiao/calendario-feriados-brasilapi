
const anoAtual = new Date().getFullYear();
const totalFeriados = document.getElementById('totalFeriados');

const campoAno = document.getElementById('ano');
campoAno.value = anoAtual;
const btnConsultar = document.getElementById('btnConsultar');

const tabelaFeriados = document.getElementById('tabelaFeriados');

const mensagemErro = document.getElementById('mensagemErro');

const proximoFeriado = document.getElementById("proximoFeriado");
const informacaoProximoFeriado = document.getElementById("informacaoProximoFeriado");

btnConsultar.addEventListener('click', function () {
    const ano = campoAno.value;

    mensagemErro.textContent = '';
    mensagemErro.hidden = true;

    totalFeriados.textContent = '0';
    tabelaFeriados.innerHTML = '';
    informacaoProximoFeriado.textContent = '';
    proximoFeriado.hidden = true;

    const url = `https://brasilapi.com.br/api/feriados/v1/${ano}`;

    fetch(url).then(function (response) {
        if (!response.ok) {
            throw new Error('Não foi possível consultar os feriados. Verifique o ano informado.');
        }

        return response.json();
    })
        .then(function (feriados) {
            totalFeriados.textContent = feriados.length;

            const hoje = new Date();

            hoje.setHours(12, 0, 0, 0);

            let proximoFeriadoEncontrado = null;

            feriados.forEach(function (feriado) {

                const data = new Date(feriado.date + "T12:00:00");

                const dataFormatada = data.toLocaleDateString('pt-BR');

                const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });

                const linha = document.createElement("tr");

                if(data >= hoje && (proximoFeriadoEncontrado === null || data < proximoFeriadoEncontrado.date)) {
                    proximoFeriadoEncontrado = {
                        date: data,
                        name: feriado.name
                        
                    };
                }

                if(data.getDay() === 0 || data.getDay() === 6) {
                    linha.classList.add("fim-de-semana");
                }

                const colunaData = document.createElement("td");
                const colunaDia = document.createElement("td");
                const colunaNome = document.createElement("td");

                colunaData.textContent = dataFormatada;
                colunaDia.textContent = diaSemana;
                colunaNome.textContent = feriado.name;

                linha.appendChild(colunaData);
                linha.appendChild(colunaDia);
                linha.appendChild(colunaNome);

                tabelaFeriados.appendChild(linha);

            });

            if(proximoFeriadoEncontrado !== null) {
                const diferenca = proximoFeriadoEncontrado.date - hoje;
                const diasRestantes = Math.round(diferenca / (1000 * 60 * 60 * 24));

                const dataFormatada = proximoFeriadoEncontrado.date.toLocaleDateString('pt-BR');

                informacaoProximoFeriado.textContent = `${proximoFeriadoEncontrado.name} - ${dataFormatada} - Faltam ${diasRestantes} dias.`;

                proximoFeriado.hidden = false;
            } else{
                informacaoProximoFeriado.textContent = "Não há feriados restantes neste ano.";
                proximoFeriado.hidden = false;
            }
        })
        .catch(function (error) {
            mensagemErro.textContent = error.message;
            mensagemErro.hidden = false;

            console.error(error.message);
        });
});


