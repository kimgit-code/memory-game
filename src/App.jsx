import { useEffect, useState } from "react";
import Card from "./components/Card";
import GameHeader from "./components/GameHeader";

const cardValues = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); //store id of each card flipped
  const [matchedCards, setMatchedCards] = useState([]); //store id of each card flipped

  const initalizeGame = () => {
    //Shuffle cards once game starts
    const finalCards = cardValues.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
  };

  //useEffect runs only when game starts using EMPTY dependency array
  useEffect(() => {
    initalizeGame();
  }, []);

  const handleCardClick = (card) => {
    //nothing happens if card is already flipped/matched
    if (card.isFlipped || card.isMatched) {
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

    //Check for MATCH if two cards are flipped
    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]];

      if (firstCard.value === card.value) {
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);

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

          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  return (
    <>
      <div className="app">
        <GameHeader score={3} moves={10} />
        <div className="cards-grid">
          {cards.map((card) => (
            <Card card={card} onClick={handleCardClick} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
