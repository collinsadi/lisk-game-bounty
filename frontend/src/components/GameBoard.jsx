import React, { useState } from "react";
import Card from "./Card";
import { cardsData } from "../cards";
import abi from "../abis/abi.json";
import { contractAddress } from "../config/contractAddress";
import { useWriteContract } from "wagmi";

function GameBoard() {
  // states
  const { writeContract, data, isSuccess, isPending } = useWriteContract();
  let [cardsState, setCardsState] = useState(cardsData);
  let [firstCard, setFirstCard] = useState(null);
  let [secondClick, setSecondClick] = useState(false);
  let [wait, setWait] = useState(false);
  let [wins, setWins] = useState(0);
  let [failCount, setFailCount] = useState(0);
  const maxFails = 6;
  const [disabled, setDisabled] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const resetGame = () => {
    console.log("Game restarting due to too many failed attempts");
    setDisabled(true);
  };

  const checker = async (card) => {
    if (card.name === firstCard.name) {
      setWins((prevWin) => prevWin + 1);
      card["passed"] = true;
      firstCard["passed"] = true;
      changeCardStatusHandler(card);
      changeCardStatusHandler(firstCard);

      if (wins + 1 == 6) {
        setDisabled(true);
        setHasWon(true);
      }
    } else {
      setWait(true);
      setFailCount((prevFails) => {
        const newFails = prevFails + 1;
        console.log("Incorrect trial:", newFails);
        if (newFails >= maxFails) {
          resetGame();
        }
        return newFails;
      });

      setTimeout(() => {
        changeCardStatusHandler(card);
        changeCardStatusHandler(firstCard);
        setWait(false);
      }, 1500);
    }
  };

  const changeCardStatusHandler = async (clickedCard) => {
    if (!clickedCard.passed) clickedCard.isFlipped = !clickedCard.isFlipped;
    let index = cardsState.findIndex((card) => card.id === clickedCard.id);
    let newState = [...cardsState];
    newState.splice(index, 1, clickedCard);
    await setCardsState(newState);
  };

  const handleClick = async (e, clickedCard) => {
    if (wait) {
      return;
    }
    if (!secondClick) {
      await setFirstCard(clickedCard);
      await setSecondClick(true);
      changeCardStatusHandler(clickedCard);
    } else {
      await setSecondClick(false);
      changeCardStatusHandler(clickedCard);
      checker(clickedCard);
      setFirstCard(null);
    }
  };

  const handleNewGame = () => {
    location.reload();
  };

  const handleClaimReward = () => {
    writeContract(
      {
        abi,
        address: contractAddress,
        functionName: "claimReward",
      },
      {
        onError: (e) => {
          // console.log(e.message);
          setError(e.shortMessage.split(":")[1]);
        },
      }
    );
  };

  return (
    <section className="flex flex-col items-center justify-center w-full py-20">
      <section className="memory-game">
        {cardsState?.map((card) => {
          return (
            <Card
              key={card.id}
              card={card}
              onClick={
                !disabled
                  ? (e) => handleClick(e, card)
                  : () => console.log("Game Disabled")
              }
            />
          );
        })}
      </section>

      <div className="flex items-center justify-center flex-col">
        {!hasWon && failCount < maxFails && (
          <div className="mt-10">
            <h1 className="text-white font-bold text-2xl">
              Trials Used : {failCount} of {maxFails}
            </h1>
          </div>
        )}

        {!hasWon && failCount >= maxFails && (
          <div className="mt-10">
            <h1 className="text-red-600 font-bold text-2xl">
              Too many Fails, Please Restart
            </h1>
          </div>
        )}

        {hasWon && (
          <div className="mt-5 flex flex-col items-center">
            <h1 className="text-green-500 text-lg font-bold">
              Yay You won, Claim your 0.5 LSK
            </h1>

            <button
              onClick={handleClaimReward}
              className="mt-8 bg-green-500 px-4 py-2 rounded-lg cursor-pointer text-white"
            >
              Claim LSK 0.5 LSK
            </button>
          </div>
        )}

        {!hasWon && (
          <button
            onClick={handleNewGame}
            className="mt-8 bg-[#30336B] px-4 py-2 rounded-lg cursor-pointer text-white"
          >
            New Game
          </button>
        )}
      </div>
    </section>
  );
}

export default GameBoard;
