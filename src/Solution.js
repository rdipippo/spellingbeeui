import './App.css';
import React from 'react';

const Solution = (props) => {
  let data = JSON.parse(localStorage.getItem("data"));
  let splitWordList = [];
  let wordRow = [];
  data.wordlist.forEach((word, index) => {
     if (wordRow.length % 30 == 0 && wordRow.length !== 0) {
        splitWordList.push(wordRow.map((x) => x));
        wordRow.length = 0;
     }

     wordRow.push(word);
  })

  splitWordList.push(wordRow);

  let foundWords = JSON.parse(localStorage.getItem("wordlist"));
  if (foundWords === null) {
     foundWords = [];
  }

  return(
    <div style={{display:"flex", flexDirection:"row", height: "30px", justifyContent:"center", height: "auto"}}>
      <div style={{fontWeight: "bold", width: "300px"}}>
        <div style={{display: "flex", flexDirection: "row"}}>
          {splitWordList !== null && splitWordList.map((wordRow) => {
            return (
              <div style={{paddingRight: "30px"}}>
                {wordRow.map((word) =>
                  <p style={foundWords.includes(word.toUpperCase()) ? {color: "green"} : {color: "red"}}>{word}</p>
                )}
              </div>);
            })}
        </div>
      </div>
    </div>
   );
}

export default Solution;