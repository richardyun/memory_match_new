$(document).ready(initiateApp);

const imageArrays = [
  [
    'assets/images/edward.jpg',
    'assets/images/ein.jpg',
    'assets/images/faye.jpg',
    'assets/images/jet.jpg',
    'assets/images/julia.jpg',
    'assets/images/punch_and_judy.jpg',
    'assets/images/spike.jpg',
    'assets/images/vicious.jpg',
  ],
  [
    'assets/images/edward.jpg',
    'assets/images/ein.jpg',
    'assets/images/faye.jpg',
    'assets/images/jet.jpg',
    'assets/images/julia.jpg',
    'assets/images/punch_and_judy.jpg',
    'assets/images/spike.jpg',
    'assets/images/vicious.jpg',
  ],
  [
    'assets/images/edward.jpg',
    'assets/images/ein.jpg',
    'assets/images/faye.jpg',
    'assets/images/jet.jpg',
    'assets/images/julia.jpg',
    'assets/images/punch_and_judy.jpg',
    'assets/images/spike.jpg',
    'assets/images/vicious.jpg',
  ]
];
let shuffledDuplicatedImageArray = [];
let firstCardClicked = null;
let secondCardClicked = null;
let firstCardClickedImageURL = null;
let secondCardClickedImageURL = null;
let twoCardsClicked = false;
let cardMatches = null;
let matchAttempts = null;
let gamesPlayed = null;
let accuracy = null;
let difficultyLevel = ['Easy', 'Medium', 'Hard'];
let currentDifficulty = 0;
let highestDifficultyCompleted = 0;
const maxCardMatches = imageArrays[currentDifficulty].length;

function initiateApp() {
  $("#difficultyDegree").text(difficultyLevel[currentDifficulty]);
  if (currentDifficulty > 0) {
    $("#extraSectionTitle").text("Timer");
    $(".gameInstructions").addClass("hidden");
  } else {
    $("#extraSectionTitle").text("Help");
    $(".gameInstructions").removeClass("hidden");
  }
  const duplicatedImageArray = duplicateArray(imageArrays[currentDifficulty]);
  shuffledDuplicatedImageArray = shuffleArray(duplicatedImageArray);
  createMultipleCardElements();
  $(".scene").on("click", ".card", handleCardClick);
  $(".gameInstructions").click(function() {
    $(".instructionModal").addClass("showModal");
  })
  $(".closeInstructionModal").click(closeModal);
  $(document).click(function(event) {
    if ($(event.target).is(".modal")) {
      closeModal();
    }
  });
  console.log("currentDifficulty",currentDifficulty);
  console.log("highestDifficultyCompleted", highestDifficultyCompleted);
}

function duplicateArray(someArray) {
  return someArray.reduce(function(res, current) {
    return res.concat([current, current]);
  }, []);
}

function shuffleArray(someArray) {
  for (let i = someArray.length - 1; i > 0; i--) {
    let k = Math.floor(Math.random() * (i + 1));
    [someArray[i], someArray[k]] = [someArray[k], someArray[i]];
  }
  return someArray;
}

function generateSingleCardElements(imageURL) {
  const cardDivs = $("<div class='card'>")
    .append("<div class='image cardFace' style='background-image: url(assets/images/smiley_edit.png)'>")
    .append("<div class='image cardFaceBackground'>")
    .append("<div class='image cardBack' style='background-image: url(" + imageURL + ")'>");
  const animationScene = $("<div class='scene'>").append(cardDivs);
  $(".cardsContainer").append(animationScene);
}

function createMultipleCardElements() {
  shuffledDuplicatedImageArray.map(imageURL => generateSingleCardElements(imageURL));
}

function handleCardClick(event) {
  if ($(event.currentTarget).hasClass("isFlipped") || twoCardsClicked) {
    return;
  }
  if (firstCardClicked === null) {
    firstCardClicked = $(event.currentTarget).addClass("isFlipped");
    firstCardClickedImageURL = event.currentTarget.children[2].style.backgroundImage;
  } else {
    secondCardClicked = $(event.currentTarget).addClass("isFlipped");
    secondCardClickedImageURL = event.currentTarget.children[2].style.backgroundImage;
    twoCardsClicked = true;
    if (firstCardClickedImageURL !== secondCardClickedImageURL) {
      matchAttempts++;
      setTimeout(function() {
        twoCardsClicked = false;
        firstCardClicked.removeClass("isFlipped");
        secondCardClicked.removeClass("isFlipped");
        firstCardClicked = null;
        secondCardClicked = null;
        firstCardClickedImageURL = null;
        secondCardClickedImageURL = null;
      }, 1500);
    } else {
      twoCardsClicked = false;
      matchAttempts++;
      cardMatches++;
        if (cardMatches === maxCardMatches) {
          gamesPlayed++;
          if (currentDifficulty > highestDifficultyCompleted) {
            highestDifficultyCompleted = currentDifficulty;
          }
          setTimeout(function() {
            $(".winModal").addClass("showModal");
          }, 500);
          $(".resetGame").click(function(event){
            if ($(event.target).is(".levelEasy")) {
              currentDifficulty = 0;
              resetGame();
            }
            if ($(event.target).is(".levelMedium")) {
              currentDifficulty = 1;
              resetGame();
            }
            if ($(event.target).is(".levelHard")) {
              currentDifficulty = 2;
              resetGame();
            }
          });
          $(document).click(function(event) {
            if ($(event.target).is(".winModal")) {
              closeModal();
              resetGame();
            }
          });
        }
      firstCardClicked = null;
      secondCardClicked = null;
    }
  }
  displayStats();
}

function displayStats() {
  accuracy = calculateAccuracy();
  if (gamesPlayed) {
    $("#gameCountNumber").text(gamesPlayed);
  }
  if (matchAttempts) {
    $("#matchAttemptsNumber").text(matchAttempts); 
  } else {
    $("#matchAttemptsNumber").text("0");
  }
  if (!isNaN(accuracy)) {
    $("#matchAccuracyNumber").text( accuracy + "%" );
  } else {
    $("#matchAccuracyNumber").text("0%");
  }
}

function resetStats() {
  cardMatches = null;
  matchAttempts = null;
  accuracy = null;
  closeModal();
  displayStats();
  $(".image").removeClass("isFlipped");
}

function calculateAccuracy(){
  return Math.round( (cardMatches / matchAttempts) * 100 );
}

function showModal() {
  $(".modal").addClass("showModal");
}

function closeModal() {
  $(".modal").removeClass("showModal");
}

function resetGame() {
  resetStats();
  $(".cardsContainer").empty();
  initiateApp();
}