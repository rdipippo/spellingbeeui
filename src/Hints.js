import './App.css';
import React, { useState } from 'react';

const Hints = (props) => {
  let data = JSON.parse(localStorage.getItem("data"));
  let twoLetterHintMap = new Map();
  let threeLetterHintMap = new Map();

  const [hintSize, setHintSize] = useState(2);

  const changeHintLength = (event) => {
     setHintSize(parseInt(event.target.value));
  }

  data.wordlist.forEach((word) => {
    let firstTwo = word.substring(0, 2);
    let firstThree = word.substring(0, 3);

    let previousTotal = twoLetterHintMap.get(firstTwo);
    if ( previousTotal === undefined) {
       twoLetterHintMap.set(firstTwo, 1);
    } else {
       twoLetterHintMap.set(firstTwo, previousTotal + 1)
    }

    let previousTotal3 = threeLetterHintMap.get(firstThree);
    if ( previousTotal3 === undefined) {
       threeLetterHintMap.set(firstThree, 1);
    } else {
       threeLetterHintMap.set(firstThree, previousTotal3 + 1)
    }
  })

  let splitWordList = [];
  let wordRow = [];
  let hintMap = (hintSize === 2 ? twoLetterHintMap : threeLetterHintMap);

  for (const [hint, count] of hintMap.entries()) {
      if (wordRow.length % 10 == 0 && wordRow.length !== 0) {
         splitWordList.push(wordRow.map((x) => x));
         wordRow.length = 0;
      }

      wordRow.push(hint + ": " + count);
  }

  splitWordList.push(wordRow);

  return (
     <div>
       <div style={{display:"flex", flexDirection:"column", height: "30px", paddingTop: "20px", textAlign: "center", justifyContent:"center", height: "auto", position: "relative"}}>
         <div>
           <select onChange={changeHintLength} className="button select">
             <option value="2">Show first two letters</option>
             <option value="3">Show first three letters</option>
           </select>
         </div>
         <div style={{display: "flex", fontWeight: "bold", width: "100%", justifyContent: "center"}}>
           <div style={{display: "flex", flexDirection: "row"}}>
            {splitWordList !== null && splitWordList.map((wordRow) => {
              return (
                <div style={{paddingRight: "30px"}}>
                  {wordRow.map((word) =>
                    <p>{word}</p>
                  )}
               </div>
              )
            })}
           </div>
         </div>
       </div>
     </div>
  );
}

export default Hints;