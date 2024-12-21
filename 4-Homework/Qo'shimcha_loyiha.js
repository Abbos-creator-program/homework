console.clear();


const inputText = prompt("Iltimos, matn kiriting:");

const changeType = prompt("Matnni qanday o'zgartirmoqchisiz?\n1 - Katta harflar\n2 - Kichik harflar\n3 - Teskari tartibda");

function toUpperCase(text) {
  return text.toUpperCase();
}

function toLowerCase(text) {
  return text.toLowerCase();
}

function reverseText(text) {
  return text.split('').reverse().join('');
}

let result;
switch (changeType) {
  case '1':
    result = toUpperCase(inputText);
    break;
  case '2':
    result = toLowerCase(inputText);
    break;
  case '3':
    result = reverseText(inputText);
    break;
  default:
    result = "Noto'g'ri tanlov!";
}

console.log("Natija:", result);
