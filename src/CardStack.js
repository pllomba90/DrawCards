import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import Card from "./Card";

const CardStack = () =>{

    const [deckId, setDeckId] = useState(null);
    const[remaining, setRemaining] = useState(0);
    const [drawnCard, setDrawnCard] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        async function createNewDeck() {
          try {
            const response = await axios.get(
              "https://deckofcardsapi.com/api/deck/new/shuffle/"
            );
            setDeckId(response.data.deck_id);
            setRemaining(response.data.remaining);
          } catch (error) {
            console.error("Error creating a new deck:", error);
          }
        }
    
        createNewDeck();
      }, []);

      const shuffleDeck = async ()=>{
        try{
            const response = await axios.get(
                `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
            );
            setRemaining(response.data.remaining);
            setDrawnCard(null);
        } catch (error){
            console.error("Error shuffling deck:", error);
        }
      }
      const startDrawing = () => {
        if (remaining === 0) {
          alert("Error: no cards remaining!");
          return;
        }
    
        setDrawing(true);
        intervalRef.current = setInterval(() => {
          drawCard();
        }, 1000); 
      };
    
      const stopDrawing = () => {
        setDrawing(false);
        clearInterval(intervalRef.current);
      };

      const toggleDrawing = () => {
        if (drawing) {
          stopDrawing();
        } else {
          startDrawing();
        }
      };

      const drawCard = async () => {
        if (remaining === 0) {
          alert("Error: no cards remaining!");
          return;
        }
    
        try {
          const response = await axios.get(
            `https://deckofcardsapi.com/api/deck/${deckId}/draw/`
          );
          setRemaining(response.data.remaining);
          setDrawnCard(response.data.cards[0]);
        } catch (error) {
          console.error("Error drawing a card:", error);
        }
      };
    return(
        <div>
           <button onClick={toggleDrawing}>
        {drawing ? "Stop Drawing" : "Start Drawing"}
      </button>
            <button onClick={shuffleDeck}>Shuffle!</button>
            {drawnCard && <Card image={drawnCard.image} />}
        </div>
    );
}

export default CardStack;