const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|\:;""<>?,./';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) +"% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

// getting random number between min and max value
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min))+min;
}

// getting random number from 0 to 9 
function generateRandomNumber(){
    return getRndInteger(0, 9);
}

// getting random lowercase letter from there ASCII value which is 
// a -> 97
// z -> 123
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

// getting random uppercase letter from the ASCII value which is 
// A -> 65
// Z -> 91
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

// generatting random symbols from the string created on line 12
function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// function  for calculating strength of the password using certain own rules 
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;
    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    // making the span tag visible using css
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000)
}

function shufflePassword(array){
    // fisher yeates  methods
    for(let i=array.length-1;i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=> (str+=el));
    return str;

}

function handleCheckboxCount(){
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // if condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxCount);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    if(checkCount ==0) 
        return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // main content starts here
    password = "";
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    // adding the checked letters and symbols
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // adding the remaining letter or symbols if necessary
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex = getRndInteger(0, funcArr.length);
        password+=funcArr[randomIndex]();
    }
    // shuffle the password
    password = shufflePassword(Array.from(password));
    // showing password in UI
    passwordDisplay.value = password;
    // tell the strength of password
    calcStrength();
})