// Everything else:
const input = document.querySelector("#urlInput");
const submit = document.querySelector("#urlSubmit");
const submitText = document.querySelector('#urlSubmit-text');
const radios = document.querySelectorAll('.domainBtn');
const links = document.querySelector('#links');
const spinner = document.querySelector('#spinner');
const errorMsg = document.querySelector('#errorMsg');
const register = document.querySelector('#register');
const login = document.querySelector('#login')

let selectedRadio = 'shrtco.de';
const newLinksArr = [];
const oldLinks = [];

// Event listener for radio buttons 
for(const radio of radios){
    radio.addEventListener("click",()=>{
        selectedRadio = radio.value;
    })
}
// Event listener for 'clear links' anchor - triggered when clear link is created
const clearLinksEventListener = () => {
    document.querySelector('#clearLinks').addEventListener("click",() =>{
        oldLinks.length = 0;
        while(links.firstChild){
            links.removeChild(links.firstChild)
        };
    })
}

// Error message 
const handleError = (code) => {
    console.log(code);
    let message;
    switch(code){
        case 1:
        case 2:
            message = "Please enter enter a valid URL";
            break;
        case 3: 
            message = "Sorry! Rate limit reached. Please wait a second and try again";
            break;
        case 4: 
            message = `Sorry! The IP-Address has been blocked because of violating Shrtco's terms of service`;
            break;
        case 5: 
            message: "Sorry! Shrtcode code (slug) already taken or in use";
            break;
        default: 
            message = "Sorry! Something went wrong."
    }
    errorMsg.textContent = message;
    submitText.innerText = "Shorten It!";
    spinner.classList.add('spinner-hidden');
}

// clears old list and generates new short link display
const createLink = () => {
    while(links.firstChild){
        links.removeChild(links.firstChild)
    };
    input.value = "";
    submitText.innerText = "Shorten It!";
    spinner.classList.add('spinner-hidden');
    let clearLinks = document.createElement('a');
    clearLinks.setAttribute('id','clearLinks');
    clearLinks.setAttribute('class','link');
    clearLinks.innerText = "Clear Links";
    links.appendChild(clearLinks);
    clearLinksEventListener();
    oldLinks.forEach(item => {
        let title = document.createElement('h5');
        title.innerText = "Link Generated!"
        let aTag = document.createElement('a');
        aTag.setAttribute('href', 'https://' + item.link);
        aTag.setAttribute('target', '_blank');
        aTag.setAttribute('class', 'link wordwrap');
        aTag.setAttribute('id','new-link')
        aTag.innerText = item.link;
        let copy = document.createElement('button');
        copy.setAttribute('id','copy');
        copy.innerText = 'Copy to Clipboard';
        copy.addEventListener("click",()=>{
            navigator.clipboard.writeText(item.link);
            copy.innerText = 'Copied!';
            setTimeout(() => {
                copy.innerText = 'Copy to Clipboard';
            }, 5000);
        })
        let aTag2 = document.createElement('a');
        aTag2.setAttribute('href', 'https://' + item.originalLink);
        aTag2.setAttribute('target', '_blank');
        aTag2.setAttribute('class', 'link wordwrap');
        aTag2.setAttribute('id', 'original-link');
        aTag2.innerText = item.originalLink;
        let linkDiv = document.createElement('div');
        linkDiv.setAttribute('class','linkDiv');
        linkDiv.appendChild(title);
        linkDiv.appendChild(aTag);
        linkDiv.appendChild(copy);
        linkDiv.appendChild(aTag2);
        links.appendChild(linkDiv);
    })
}

// Submit button messages: 
let submitBtnArr = ["Shortening...","Getting there...", "Working on it...", "Sorry for the delay..."];

// event listener for submit button
submit.addEventListener("click",(e)=>{
    e.preventDefault();
    if(input.value){
        errorMsg.textContent = "";
        spinner.classList.remove('spinner-hidden');
        submitText.innerText = "Shortening...";
        // looping through submit button messages:
        let num = 0;
        let msgChange = () => {
            num = num === 3 ? 0 : num+1;
            submitText.innerText = submitBtnArr[num];
        }
        let submitBtnChg = setInterval(msgChange, 5000);
        submitBtnChg;
        const start = 'https://api.shrtco.de/v2/shorten?url=';
        const longLink = input.value;
        console.log("fetching...");
        fetch(start + longLink)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            clearInterval(submitBtnChg);
            if(!data.ok){
                handleError(data.error_code);
            } else {
                let display = selectedRadio === "shrtco.de" ? data.result.short_link
                : selectedRadio === "9qr.de" ? data.result.short_link2
                    : data.result.short_link3;
            oldLinks.unshift(
                {link: display,
                originalLink: data.result.original_link}
            );
            createLink();
            }
            
        });
    } else {
        handleError(2)
    }
} );






/*
To do:
3) Firebase auth/ firebase 
*/