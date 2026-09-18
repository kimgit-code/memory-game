import { useEffect, useState } from "react";

export const useGameLogic = (cardValues) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); //store id of each card flipped
  const [matchedCards, setMatchedCards] = useState([]); //store id of each card flipped
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initalizeGame = () => {
    //Shuffle cards once game starts

    const shuffledCards = shuffleArray(cardValues);
    const finalCards = shuffledCards.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(finalCards);

    setFlippedCards([]);
    setMatchedCards([]);
    setIsLocked(false);
    setScore(0);
    setMoves(0);
  };

  //useEffect runs only when game starts using EMPTY dependency array
  useEffect(() => {
    initalizeGame();
  }, []);

  const endGame = () => {
    setScore(0);
    setMoves(0);
    initalizeGame();
  };

  const handleCardClick = (card) => {
    //nothing happens if card is already flipped/matched
    if (
      card.isFlipped ||
      card.isMatched ||
      isLocked ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newCards = cards.map((c) => {
      //CHECK IF we are updating the card being clicked
      if (c.id === card.id) {
        return { ...c, isFlipped: true }; //return card object and only change isFlipped value to True
      } else {
        return c;
      }
    });

    setCards(newCards);

    const newFlippedCards = [...flippedCards, card.id]; //append to the array the current card ID
    setFlippedCards(newFlippedCards);
    console.log(flippedCards);

    //Check for MATCH if two cards are flipped
    if (flippedCards.length === 1) {
      setIsLocked(true);
      const firstCard = cards[flippedCards[0]];
      setMoves((prev) => prev + 1);

      if (firstCard.value === card.value) {
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
          setScore((prev) => prev + 1);

          setCards((prev) =>
            prev.map((c) => {
              if (c.id === card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true }; //return card object and only change isMatched value to True
              } else {
                return c;
              }
            }),
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        //flip back card 1, card 2
        setTimeout(() => {
          const flippedBackCard = newCards.map((c) => {
            if (newFlippedCards.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });

          setCards(flippedBackCard);
          setIsLocked(false);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isGameComplete = matchedCards.length === cardValues.length;

  return {
    cards,
    moves,
    score,
    isGameComplete,
    initalizeGame,
    handleCardClick,
  };
};
