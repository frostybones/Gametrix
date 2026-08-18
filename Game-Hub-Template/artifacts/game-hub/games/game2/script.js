let gameStarted = false;
let word = "";
const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
document.getElementById("WordInput").disabled = false;
document.getElementById("WordInput").readOnly = false;
document.getElementById("startBtn").disabled = false;
document.getElementById("resetBtn").disabled = true;
document.getElementById("randomBtn").disabled = false;
const randomWords=[
  "Age", "Bag", "Cat", "Dog", "Egg", "Fly", "Gum", "Hat", "Ice", "Jog", 
  "Key", "Lid", "Mop", "Net", "Owl", "Pen", "Rat", "Sun", "Tub", "Van",
  "Apple", "Beach", "Chair", "Dance", "Eagle", "Flame", "Grape", "House", "Juice", "Knife", 
  "Lemon", "Mouse", "Night", "Ocean", "Piano", "Queen", "River", "Stone", "Train", "Water",
  "Blanket", "Crystal", "Dolphin", "Express", "Feather", "Gorilla", "Horizon", "Impulse", "Journey", "Kitchen", 
  "Lantern", "Mountain", "Natural", "Orchard", "Paradox", "Quarter", "Rainbow", "Science", "Thunder", "Volcano",
  "Abyss", "Buoyant", "Crypt", "Dazzle", "Fixable", "Gnarled", "Injury", "Jazz", "Kayak", "Larynx", 
  "Mystic", "Nymph", "Onyx", "Pixel", "Quartz", "Rhythm", "Sphinx", "Tuxedo", "Voodoo", "Waltz",
  "Airport", "Bicycle", "Camera", "Diamond", "Eclipse", "Forest", "Guitar", "Helmet", "Island", "Jacket",
  "Library", "Magnet", "Notebook", "Oxygen", "Planet", "Rocket", "Shadow", "Tunnel", "Umbrella", "Winter"
]
let lives = 6;
const wordDiv= document.getElementById("word")
const lettersContainer = document.getElementById("LettersContainer");
let lettersGuessed = "";
let randomGame=false
lettersContainer.style.display = 'none';
placeLetters();

function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    const randomWord = randomWords[randomIndex].trim().toUpperCase();
    randomGame=true
    word = randomWord;
    startGame();
}
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    if (!randomGame) {
        word = document.getElementById("WordInput").value.trim().toUpperCase();
    }
    if (word.length <= 2) {
      alert("Please enter a word with more than 2 characters to start the game.");
      gameStarted = false;
      return;
    }

    if (![...word].every(letter => letters.includes(letter))) {
      alert("Please enter a valid word containing only letters A-Z.");
      console.log("Invalid word entered:", word);
      gameStarted = false;
      return;
    }
    wordDiv.innerHTML = "";
    for(let i= 0;i < word.length;i++){
        wordDiv.innerHTML += `<h1 class="hangline" width="30" id="${i}" >_ &nbsp</h1>`;
    }
    document.getElementById("WordInput").value = "";
    document.getElementById("WordInput").placeholder = "Guess the word!";
    document.getElementById("WordInput").disabled = true;
    document.getElementById("WordInput").readOnly = true;
    document.getElementById("startBtn").style.display = 'none';
    document.getElementById("randomBtn").style.display = 'none';
    document.getElementById("resetBtn").disabled = false;
    document.getElementById("man").style.display = 'none';
    lettersContainer.style.display = 'block';
  }
}
function resetGame() {
    gameStarted = false;
    randomGame=false
    word = "";
    lettersGuessed = ""
    lives=6
    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    document.getElementById("startBtn").style.display = 'inline-block';
    document.getElementById("randomBtn").style.display = 'inline-block';
    document.getElementById("WordInput").value = "";
    document.getElementById("WordInput").placeholder = "Enter a Word";
    document.getElementById("WordInput").disabled = false;
    document.getElementById("WordInput").readOnly = false;
    document.getElementById("resetBtn").disabled = true;
    document.getElementById("man").style.display = 'block';
    document.getElementById("man").src = "Hangman-Assets/FullBody.png";
    document.getElementById("hangPole").src = "Hangman-Assets/HangPole.png";
    document.getElementById("win-screen").classList.add("hidden");
    document.getElementById("lose-screen").classList.add("hidden");

    lettersContainer.style.display = 'none';
    wordDiv.innerHTML = "";
}

function placeLetters() {
    letters.forEach(letter => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.className = "letters";
        lettersContainer.appendChild(button);
        button.addEventListener("click", () => {
            if (lives <= 0 || lettersGuessed.length === word.length) {
                return;
            }
            button.disabled = true;
            if (word.includes(letter)) {
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === letter) {
                        const newElement = document.createElement('h1');
                        newElement.className = "hangline";
                        newElement.textContent = letter;
                        document.getElementById(String(i)).replaceWith(newElement);
                        lettersGuessed += letter;
                    }
                }
                if (lettersGuessed.length === word.length) {
                    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
                    document.getElementById("resetBtn").disabled = false;
                    document.getElementById("man").style.display = 'block';
                    document.getElementById("man").src = "Hangman-Assets/happy.png";
                    document.getElementById("hangPole").src = "Hangman-Assets/HangPole.png";
                    document.getElementById("win-screen").classList.remove("hidden");
                    document.getElementById("winWord").innerHTML = "The word was: " + word;
                }
            }
            else {
                switch (lives) {
                    case 6:
                        document.getElementById("hangPole").src = "Hangman-Assets/Hang1.png";
                        break;
                    case 5:
                        document.getElementById("hangPole").src = "Hangman-Assets/Hang2.png";
                        break;
                    case 4:
                        document.getElementById("hangPole").src = "Hangman-Assets/Hang3.png";
                        break;
                    case 3:
                        document.getElementById("hangPole").src = "Hangman-Assets/Hang4.png";
                        break;
                    case 2:
                        document.getElementById("hangPole").src = "Hangman-Assets/Hang5.png";
                        break;
                    case 1:
                        document.getElementById("hangPole").src = "Hangman-Assets/Hang6.png";
                        document.getElementById("loseWord").innerHTML = "The word was: " + word;
                        document.getElementById("lose-screen").classList.remove("hidden");
                        break; 
                }
                lives--;
          }
        })  
    })
}