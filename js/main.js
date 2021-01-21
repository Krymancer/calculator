const buttonsColletion = document.getElementsByClassName('button');
const query = document.getElementById('query');
const result = document.getElementById('result');

const buttons = Array.from(buttonsColletion);

String.prototype.removeCharAt = function (i) {
  var tmp = this.split(''); // convert to an array
  tmp.splice(i, 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
  return tmp.join(''); // reconstruct the string
};

let expression = '0';
let flagClear = true;

let expressionToParse = '';
let index = 0;

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttonClick(button.innerHTML);
  });
});

function buttonClick(button) {
  switch (button) {
    case 'C': {
      expression = '0';
      break;
    }
    case '⌫': {
      if (expression.length == 1) {
        expression = '0';
        flagClear = true;
      } else {
        expression = expression.removeCharAt(expression.length - 1);
      }
      break;
    }
    case '⁺∕₋': {
      if (expression[0] == '-') {
        expression = expression.removeCharAt(0);
      } else {
        expression = '-' + expression;
      }
      break;
    }
    case 'CE': {
      let id = 0;
      for (let i = expression.length - 1; i > 0; i--) {
        if (
          expression[i] == '+' ||
          expression[i] == '-' ||
          expression[i] == '÷' ||
          expression[i] == '×'
        ) {
          id = i;
          break;
        }
      }
      if (id != 0) expression = expression.substring(0, id);
      break;
    }
    case '=': {
      evaluate(expression);
      break;
    }
    default: {
      if (expression.length > 10) {
        break;
      }
      if (flagClear) {
        expression = button;
        flagClear = false;
      } else {
        expression += button;
      }
      break;
    }
  }
  result.innerHTML = expression;
}

function evaluate(exp) {
  query.innerHTML = exp;
  exp = exp.replace('÷', '/');
  exp = exp.replace('×', '*');
  exp = exp.replace('²', '**2');

  expressionToParse = exp;

  //expression = eval(exp).toString();
  expression = solve().toString();
  index = 0;
  expressionToParse = '';
  flagClear = true;
}

//Parse expression

function solve() {
  let result = term();
  while (peek() == '+' || peek() == '-') {
    if (get() == '+') {
      result += term();
    } else {
      result -= term();
    }
  }
  return result;
}

function term() {
  let result = factor();
  while (peek() == '*' || peek() == '/') {
    if (get() == '*') {
      result *= factor();
    } else {
      result /= factor();
    }
  }
  return result;
}

function factor() {
  let n = 0;
  if (peek() >= '0' && peek() <= '9') {
    n = number();
  } else if (peek() == '-') {
    get();
    return -factor();
  }
  return n;
}

function number() {
  let result = 0;
  while (peek() >= '0' && peek() <= '9') {
    let i = get() - '0'; // lazy way to convert string to number
    result = result * 10 + i;
  }
  return result;
}

function peek() {
  return expressionToParse[index];
}

function get() {
  return expressionToParse[index++];
}

// End Parse Expression
