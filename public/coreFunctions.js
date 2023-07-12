const preloadedStarsImage = new Image();
preloadedStarsImage.src = "https://i.imgur.com/TEnDJBI.png";
if (window.matchMedia) { // Check if user using mobile
    if (window.matchMedia("(max-width: 600px)").matches) {
              document.body.style.overflow = 'hidden';
              const newDivForMobile = document.createElement("div");
              newDivForMobile.style.position = 'fixed';
              newDivForMobile.style.width = '100vw';
              newDivForMobile.style.height = '100vh';
              newDivForMobile.style.zIndex = '99';
              newDivForMobile.style.background = "#1C7293";
              newDivForMobile.style.border = "6px solid #2D99C2";
              newDivForMobile.style.fontFamily = "Graduate";
              newDivForMobile.style.fontSize = "32px";
              newDivForMobile.style.color = "#FFFFFF";
              newDivForMobile.style.display = "flex";
              newDivForMobile.style.justifyContent = "center";
              newDivForMobile.style.alignItems = "center";
              newDivForMobile.style.textAlign = "center";
  
              const textDiv = document.createElement("div");
              textDiv.textContent = 'this game is only accessible with a computer'
             
              newDivForMobile.appendChild(textDiv);
  
              document.body.appendChild(newDivForMobile);
          }
}
document.addEventListener('dragstart', (event) => {     // Disable dragging elements
        const tagName = event.target.tagName.toLowerCase();
        if (tagName === 'img' || tagName === 'div') {
          event.preventDefault();
        }
       });
document.addEventListener('contextmenu', function(event) { // Disable left click
          event.preventDefault();
       });

// Random positions for Demon Enemy:
const positionsTopRandomToLeft = [];
const positionsTopRandomToRight = [];
const positionsLeftRandomToTop = [];
const positionsLeftRandomToBottom = [];

for (let i = 0; i < 250; i++) {
    const top = Math.floor(Math.random() * container.offsetHeight);
    const left = '0';

    const position = { 'top': top, 'left': left };
    positionsTopRandomToLeft.push(position);
  };
for (let i = 0; i < 250; i++) {
    const top = Math.floor(Math.random() * container.offsetHeight);
    const right = '0';

    const position = { 'top': top, 'right': right };
    positionsTopRandomToRight.push(position);
  };
for (let i = 0; i < 250; i++) {
    const top = '0';
    const left = Math.floor(Math.random() * container.offsetWidth);

    const position = { 'top': top, 'left': left };
    positionsLeftRandomToTop.push(position);
  };
for (let i = 0; i < 250; i++) {
    const bottom = '0';
    const left = Math.floor(Math.random() * container.offsetWidth);

    const position = { 'bottom': bottom, 'left': left };
    positionsLeftRandomToBottom.push(position);
  };

  function shakeScreen(magnitude, duration) {
    // Get the <html> element
    const htmlElement = document.getElementById('wrapperAll');
  
    // Define the amount of rotation (in degrees) and the duration of the animation
    const shakeMagnitude = magnitude;
    const shakeDuration = duration;
  
    // Define the CSS animation keyframes
    const animationKeyframes = [
      { transform: `rotate(${shakeMagnitude}deg)` },
      { transform: `rotate(-${shakeMagnitude}deg)` },
      { transform: `rotate(${shakeMagnitude}deg)` },
      { transform: `rotate(-${shakeMagnitude}deg)` },
      { transform: `rotate(${shakeMagnitude}deg)` },
      { transform: `rotate(-${shakeMagnitude}deg)` },
      { transform: 'none' },
    ];
  
    // Define the CSS animation properties
    const animationOptions = {
      duration: shakeDuration,
      easing: 'linear',
    };
  
    // Create an array of animation Promises
    const animations = [];
    for (let i = 0; i < 10; i++) {
      animations.push(htmlElement.animate(animationKeyframes, animationOptions).finished);
    }
  
    // Wait for all animations to complete
    Promise.all(animations).then(() => {
      // Animation is complete
      htmlElement.style.transform = 'none';
    });
};

function starsMoveIngame() {
    const starsFullScreenOne = document.createElement('img');
  const starsFullScreenTwo = document.createElement('img');
  const starsFullScreenContainer = document.createElement('div');
  
  starsFullScreenOne.src = preloadedStarsImage.src;
  starsFullScreenTwo.src = preloadedStarsImage.src;

  starsFullScreenContainer.className = 'full-screen-stars-container';
  starsFullScreenContainer.id = 'starsFullScreenContainer';
  starsFullScreenOne.classList.add('stars-full-screen-one');
  starsFullScreenTwo.classList.add('stars-full-screen-two');
  starsFullScreenTwo.addEventListener("animationend", changeClassForStars);
  function changeClassForStars(){
    starsFullScreenTwo.removeEventListener("animationend", changeClassForStars);
    starsFullScreenTwo.classList.remove('stars-full-screen-two');
    starsFullScreenTwo.classList.add('stars-full-screen-three');
  }

  starsFullScreenContainer.appendChild(starsFullScreenOne);
  starsFullScreenContainer.appendChild(starsFullScreenTwo);

  document.body.appendChild(starsFullScreenContainer);
};

function createReturnHomeButton(){
    const returnButtonHoverableContainer = document.createElement("div");
    const returnButton = document.createElement("div");
    const returnHomeImg = document.createElement("img");
    const returnHomeSpan = document.createElement("span");
  
    returnButtonHoverableContainer.style.width = '5%';
    returnButtonHoverableContainer.style.height = '7.5%';
    returnButtonHoverableContainer.style.top = '-30%';
    returnButtonHoverableContainer.className = 'hoverable-container';
    returnButtonHoverableContainer.style.transition = 'top 0.5s ease';
    returnButton.classList.add('return-button');
    returnButton.classList.add('lobby-icons');
    returnHomeSpan.className = 'name-tag-lobby';
  
    returnHomeImg.src = 'https://i.ibb.co/0hsm7vB/home-1.png';
    returnHomeSpan.innerText = 'home';
  
    returnButton.appendChild(returnHomeImg);
    returnButton.appendChild(returnHomeSpan);
    returnButtonHoverableContainer.appendChild(returnButton);
    
    return returnButtonHoverableContainer;
};
let everythingIsMuted = false;
function handleMuteClick() {
  const muteButtonImg = document.getElementById('muteButtonImg');
  const muteButtonSpan = document.getElementById('muteButtonSpan');

  if(everythingIsMuted){
    muteButtonImg.src = 'https://i.imgur.com/dKiMctL.png';
    muteButtonSpan.innerText = 'mute';
    everythingIsMuted = false;
  } else {
    muteButtonImg.src = 'https://i.imgur.com/RNFH436.png';
    muteButtonSpan.innerText = 'unmute';
    everythingIsMuted = true;
  }
};
function playSound(volume, filePath){
  let audio = new Audio(filePath);
  audio.volume = volume;
  audio.play();
}

// coreFunctions.js
export { positionsLeftRandomToBottom, positionsLeftRandomToTop, positionsTopRandomToLeft, positionsTopRandomToRight, 
    shakeScreen, starsMoveIngame, createReturnHomeButton, handleMuteClick, playSound };
