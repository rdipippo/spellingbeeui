import logo from './logo.svg';
import './App.css';
import LetterHex from './LetterHex';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const App = (props) => {

      const [word, setWord] = useState('');
      const [wordList, setWordList] = useState([]);
      const [data, setData] = useState({});
      const [score, setScore] = useState(0);
      const [error, setError] = useState('');
      const [sortOrder, setSortOrder] = useState(1);

      const letterClick = (event) => {
        let newWord = word + event.currentTarget.text;
        setWord(newWord);
      }

      const letterDrop = (dragTarget, dropTarget) => {
         let lettersCopy = data.letters.repeat(1);
         let centerCopy = data.center.repeat(1);
         var a = [lettersCopy[0],
                  lettersCopy[1],
                  lettersCopy[2],
                  centerCopy,
                  lettersCopy[3],
                  lettersCopy[4],
                  lettersCopy[5]];
         let dragIndex, dropIndex;
         a.forEach((letter, index) => {
            if (letter.toUpperCase() === dragTarget.name) {
               dragIndex = index;
            } else if (letter.toUpperCase() === dropTarget.name) {
               dropIndex = index;
            }
         })

         //alert(`You dropped ${dragIndex} into ${dropIndex}...`);
         a[dropIndex] = dragTarget.name;
         a[dragIndex] = dropTarget.name;

         const newData = {...data,
                                           center: a[3],
                                           letters: a[0] + a[1] + a[2] + a[4] + a[5] + a[6]}

         setData(newData) ;
      }

      const deleteLetter = (event) => {
        let newWord = word.slice(0, word.length - 1);
        setWord(newWord);
      }

      const enterWord = (event) => {
        if (word.length < 4) {
           setError('Too short.');
        } else if (! word.includes(data.center.toUpperCase())) {
           setError("Must contain center letter.");
        } else if (! data.wordlist.includes(word.toLowerCase())) {
           setError("Invalid word.");
        } else if (wordList.includes(word)) {
           setError("Already found.");
        } else {
          setError("");
          wordList.unshift(word);
          // check for pangram
          let letters = word.split("");
          let uniqueLetters = [...new Set(letters) ]
          let newScore;

          if (uniqueLetters.length === 7) {
             newScore = score + word.length + 7;
             setError("Pangram!!!");
          } else {
             newScore = score + (word.length == 4 ? 1 : word.length);
          }

          setScore(newScore);

          localStorage.setItem("score", newScore);
          localStorage.setItem("wordlist", JSON.stringify(wordList));
        }
        setWord('');
      }

      const keyDownHandler = event => {
        console.log('User pressed: ', event.key);

        if (event.key === 'Enter') {
          enterWord();
        } else if(event.key === 'Backspace') {
          deleteLetter();
        } else if (data.letters !== undefined &&
                   (data.letters.includes(event.key.toLowerCase()) || data.center === (event.key.toLowerCase()))) {
          letterClick({currentTarget: {text: event.key.toUpperCase()}})
        }
      };

      useEffect(() => {
          document.addEventListener("keyup", keyDownHandler);
          return () => {
            document.removeEventListener("keyup", keyDownHandler);
          };
        }, [keyDownHandler]);

      useEffect(() => {
          if (localStorage.getItem("wordlist") !== null) {
            setWordList(JSON.parse(localStorage.getItem("wordlist")));
          }

          if (localStorage.getItem("score") !== null) {
            setScore(parseInt(localStorage.getItem("score")));
          }

          if (localStorage.getItem("data") !== null) {
            setData(JSON.parse(localStorage.getItem("data")));
          } else {
            fetchGame();
          }
        }, []);

useEffect(() => {
    console.log(data);
  }, [data]);
      const shuffle = () => {
          var a = data.letters.split(""),
              n = a.length;

          for(var i = n - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var tmp = a[i];
              a[i] = a[j];
              a[j] = tmp;
          }
          setData({...data, letters: a.join("")} ) ;
      }

      const fetchGame = () => {
        axios
             .get("https://j2p2qurf76.execute-api.us-east-1.amazonaws.com/prod")
             .then((res) => {
                setData(res.data)
                localStorage.setItem("data", JSON.stringify(res.data));
              })
      }

      const newGame = () => {
         localStorage.clear();

         setWord('');
         setWordList([]);
         setData({});
         setScore(0);
         setError('');

         fetchGame();
      }

      const showSolution = () => {
        window.open("/solution");
      }

      const showHints = () => {
        window.open("/hints");
      }

      const changeSortOrder = (e) => {
         setSortOrder(parseInt(e.target.value));
      }

      let splitWordList = [];
      let wordRow = [];
      let sortedWordList;

      if (wordList !== null) {
         if (sortOrder === 2) { // alphabetical order
            let wordListCopy = wordList.map((x) => x);
            sortedWordList = wordListCopy.sort();
         } else {
            sortedWordList = wordList;
         }
         sortedWordList.forEach((word, index) => {
            if (wordRow.length % Math.ceil(sortedWordList.length / 4) == 0 && wordRow.length !== 0) {
              splitWordList.push(wordRow.map((x) => x));
              wordRow.length = 0;
            }

            wordRow.push(word);
         })

         splitWordList.push(wordRow);
      }

      /** TODO move styles to css */
      return(
          data.wordlist !== undefined &&
          <DndProvider backend={HTML5Backend}>
          <div>
            <div style={{display:"flex", flexDirection:"row", height: "30px", paddingTop: "20px", justifyContent:"center"}}>
              <span style={{fontWeight: "bold", color: "red"}}>{error}</span>
            </div>
            <div style={{display:"flex", flexDirection:"row", height: "30px", justifyContent:"center"}}>
              <span id="wordSpan">{word}</span>
            </div>
            <div className="hexRow">
              <LetterHex letter={data.letters[0]} dropHandler={letterDrop} clickHandler={letterClick}/>
              <LetterHex letter={data.letters[1]} dropHandler={letterDrop} clickHandler={letterClick}/>
            </div>
            <div className="hexRow secondHexRow">
              <LetterHex letter={data.letters[2]} dropHandler={letterDrop} clickHandler={letterClick}/>
              <LetterHex center={true} letter={data.center} dropHandler={letterDrop} clickHandler={letterClick}/>
              <LetterHex letter={data.letters[3]} dropHandler={letterDrop} clickHandler={letterClick}/>
            </div>
            <div className="hexRow thirdHexRow">
              <LetterHex letter={data.letters[4]} dropHandler={letterDrop} clickHandler={letterClick}/>
              <LetterHex letter={data.letters[5]} dropHandler={letterDrop} clickHandler={letterClick}/>
            </div>
            <div style={{paddingBottom: "40px", display:"flex", flexDirection:"row", height: "30px", justifyContent:"center"}}>
              <button className="button" onClick={deleteLetter}>Delete</button>
              <button className="button" onClick={shuffle}>Shuffle</button>
              <button className="button" onClick={enterWord}>Enter</button>
            </div>
            <div style={{display:"flex", flexDirection:"row", height: "30px", justifyContent:"center"}}>
              <span style={{width: "200px", textAlign: "center", fontWeight: "bold"}}>Score: {score}/{data.total} points</span>
            </div>
            <div style={{display:"flex", flexDirection:"row", height: "auto", justifyContent:"center"}}>
              <div>
                <select onChange={changeSortOrder} className="button select">
                  <option value="1">Sort words by order found</option>
                  <option value="2">Sort words alphabetically</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"row", height: "30px", justifyContent:"center", width: "auto", height: "auto", position: "relative", left: "-40px"}}>
              <div style={{fontWeight: "bold", width: "300px"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                  {splitWordList !== null && splitWordList.map((wordRow) => {
                    return (<div style={{paddingRight: "30px"}}>
                      {wordRow.map((word) =>
                        <p>{word}</p>
                      )}
                    </div>);
                    })}
                </div>
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"row", height: "30px", justifyContent:"center"}}>
               <button className="button" onClick={newGame}>New Game</button>
               <button className="button" onClick={showHints}>Show Hints</button>
               <button className="button" onClick={showSolution}>Show Solution</button>
            </div>
          </div>
          </DndProvider>
      );



}

export default App;
