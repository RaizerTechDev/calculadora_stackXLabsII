// Obtém referências a elementos HTML por seus IDs e declara uma variável de histórico vazia
let display = document.getElementById("display");
let historicList = document.getElementById("historic-list");
let clearHistoricButton = document.getElementById("clear-historic-button");
let saveHistoricButton = document.getElementById("save-historic-button");

let historic = [];

// Função para adicionar um valor ao visor da calculadora
function appendToDisplay(value) {
  display.value += value;
}

// Função para limpar o visor da calculadora
function clearDisplay() {
  display.value = "";
}

// Função para calcular a expressão no visor
function calculate() {
  // Obtém a expressão do visor e declara variáveis para o resultado e o histórico
  let expression = display.value;
  let result;

  try {
    // A função eval para avaliar o resultado da expressão
    result = eval(expression);

    // Adiciona a operação e o resultado ao histórico com um timestamp
    historic.unshift({
      expression: expression,
      result: result,
      timestamp: new Date(),
    });

    // Limita o histórico a 4 entradas, removendo a mais antiga, se necessário
    if (historic.length > 4) {
      historic.pop();
    }

    // Atualiza o histórico na página, define o resultado no visor
    updateHistoric();
    display.value = result;

    if (historic.length > 0) {
      clearHistoricButton.style.display = "block";
    } else {
      clearHistoricButton.style.display = "button";
    }
  } catch (error) {
    // Em caso de erro na expressão, exibe "Error" no visor
    display.value = "Error";
  }
}

// Função para limpar o histórico
function clearHistoric() {
  historic = [];
  updateHistoric();
}

// Função para atualizar a exibição do histórico na página
function updateHistoric() {
  historicList.innerHTML = "";

  for (let entry of historic) {
    // Cria elementos HTML para cada entrada no histórico
    let row = document.createElement("tr");
    let exprCell = document.createElement("td");
    let resultCell = document.createElement("td");
    let timeCell = document.createElement("td");
    let time = document.createElement("td");

    // Obtém informações de data e hora da entrada no histórico
    let timestamp = new Date(entry.timestamp);

    let month = ("0" + (timestamp.getMonth() + 1)).slice(-2);

    // Define o conteúdo dos elementos criados
    exprCell.textContent = entry.expression;
    resultCell.textContent = entry.result;
    timeCell.textContent = `${timestamp.getDate()}/${month}/${timestamp.getFullYear()}`;
    time.textContent = `${timestamp.toLocaleTimeString()}`;

    // Adiciona os elementos à linha do histórico e define um evento de clique para restaurar a expressão no visor
    row.appendChild(exprCell);
    row.appendChild(resultCell);
    row.appendChild(timeCell);
    row.appendChild(time);

    row.onclick = () => {
      display.value = entry.expression;
    };
    historicList.appendChild(row);
  }
}

// Função para salvar o histórico em um arquivo de texto
function saveHistoricToFile() {
  let historicText = "";

  for (let entry of historic) {
    let timestamp = new Date(entry.timestamp);

    let month = ("0" + (timestamp.getMonth() + 1)).slice(-2);

    // Formata o texto do histórico
    historicText += `Operação: ${entry.expression}\n`;
    historicText += `Resultado: ${entry.result}\n`;
    historicText += `Data: ${timestamp.getDate()}/${month}/${timestamp.getFullYear()}, ${timestamp.toLocaleTimeString()}\n\n`;
  }

  // Cria um Blob (objeto binário) com o texto do histórico e cria um link para fazer o download
  let blob = new Blob([historicText], { type: "text/plain" });
  let url = URL.createObjectURL(blob);

  let link = document.createElement("a");
  link.href = url;
  link.download = "data_historic.txt";
  link.click();

  // Libera a URL do objeto após o download
  URL.revokeObjectURL(url);
}

// Função para apagar o último caractere do visor
function backspace() {
  display.value = display.value.slice(0, -1);
}

