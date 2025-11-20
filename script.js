// 1. SELECCIÓN DE ELEMENTOS DEL DOM
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equalsBtn');
const clearButton = document.getElementById('clearBtn');
const deleteButton = document.getElementById('deleteBtn');
const lastOperationScreen = document.getElementById('lastOperationScreen');
const currentOperationScreen = document.getElementById('currentOperationScreen');

// 2. VARIABLES DE ESTADO
let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false; // Bandera para saber si limpiar pantalla al escribir nuevo número

// 3. EVENT LISTENERS (Clicks)
numberButtons.forEach((button) =>
  button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach((button) =>
  button.addEventListener('click', () => setOperation(button.dataset.operator))
);

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);

// 4. EVENT LISTENERS (Teclado - Extra Credit)
window.addEventListener('keydown', handleKeyboardInput);

// 5. FUNCIONES PRINCIPALES

function appendNumber(number) {
  if (currentOperationScreen.textContent === '0' || shouldResetScreen) {
    resetScreen();
  }
  // Evitar múltiples puntos decimales
  if (number === '.' && currentOperationScreen.textContent.includes('.')) return;
  
  currentOperationScreen.textContent += number;
}

function resetScreen() {
  currentOperationScreen.textContent = '';
  shouldResetScreen = false;
}

function clear() {
  currentOperationScreen.textContent = '0';
  lastOperationScreen.textContent = '';
  firstOperand = '';
  secondOperand = '';
  currentOperation = null;
}

function deleteNumber() {
  // Si estamos en estado de reset, no borramos nada
  if (shouldResetScreen) return;
  
  let currentText = currentOperationScreen.textContent;
  currentOperationScreen.textContent = currentText.toString().slice(0, -1);
  
  // Si borramos todo, volver a poner 0
  if (currentOperationScreen.textContent === '') {
    currentOperationScreen.textContent = '0';
  }
}

function setOperation(operator) {
  if (currentOperation !== null) evaluate(); // Encadenar operaciones (ej: 5 + 5 + ...)
  
  firstOperand = currentOperationScreen.textContent;
  currentOperation = operator;
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;
  shouldResetScreen = true;
}

function evaluate() {
  // Si no hay operación o falta borrar pantalla, no hacemos nada
  if (currentOperation === null || shouldResetScreen) return;

  if (currentOperation === '/' && currentOperationScreen.textContent === '0') {
    alert("¡No puedes dividir por 0!"); // Mensaje snarky pedido por Odin
    clear();
    return;
  }

  secondOperand = currentOperationScreen.textContent;
  currentOperationScreen.textContent = roundResult(
    operate(currentOperation, firstOperand, secondOperand)
  );
  
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;
  currentOperation = null;
}

function roundResult(number) {
  // Redondear a 3 decimales máximo para evitar desbordes
  return Math.round(number * 1000) / 1000;
}

// 6. SOPORTE DE TECLADO
function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === '.') appendNumber(e.key);
  if (e.key === '=' || e.key === 'Enter') evaluate();
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clear();
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
    setOperation(convertOperator(e.key));
}

function convertOperator(keyboardOperator) {
  if (keyboardOperator === '/') return '/'; // A veces es diferente según teclado
  if (keyboardOperator === '*') return '*';
  if (keyboardOperator === '-') return '-';
  if (keyboardOperator === '+') return '+';
}

// 7. LÓGICA MATEMÁTICA
function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function div(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return sub(a, b);
    case '*':
      return mul(a, b);
    case '/':
      if (b === 0) return null;
      return div(a, b);
    default:
      return null;
  }
}
