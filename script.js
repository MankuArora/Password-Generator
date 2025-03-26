const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebtn");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_-+=<>.?/{}[]|/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

setIndicator("#ccc")

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength -min)*100/(max-min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px $(color)`
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join('');
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        // Use textContent or innerText to get the text to copy
        await navigator.clipboard.writeText(passwordDisplay.textContent || passwordDisplay.innerText);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    // Show the copy message
    copyMsg.classList.add("active");

    // Remove the message after 2 seconds
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function handleCheckBoxChange() {
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funArr = [];

    if (uppercaseCheck.checked) funArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funArr.push(generateLowerCase);
    if (numbersCheck.checked) funArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funArr.push(generateSymbol);

    // Mandatory addition for selected checkboxes
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    // Remaining characters
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
});
