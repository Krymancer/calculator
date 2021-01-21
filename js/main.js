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
      expression = expression.removeCharAt(expression.length - 1);
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
  expression = eval(exp);
  flagClear = true;
}

let expressionToParse = '3*2+4*1+(4+9)*6';
let index = 0;

function peek() {
  return expressionToParse;
}

function get() {
  return expressionToParse[index++];
}

function number() {
  let result = get() - '0';
  while (peek() >= '0' && peek() <= '9') {
    result = 10 * result + get() - '0';
  }
  return result;
}

function factor() {
  if (peek() >= '0' && peek() <= '9') return number();
  else if (peek() == '(') {
    get(); // '('
    let result = express();
    get(); // ')'
    return result;
  } else if (peek() == '-') {
    get();
    return -factor();
  }
  return 0; // error
}

function term() {
  let result = factor();
  while (peek() == '*' || peek() == '/')
    if (get() == '*') result *= factor();
    else result /= factor();
  return result;
}

function express() {
  let result = term();
  while (peek() == '+' || peek() == '-')
    if (get() == '+') result += term();
    else result -= term();
  return result;
}
