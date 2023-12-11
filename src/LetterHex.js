import React, {useState} from 'react';
import { useDrag, useDrop } from 'react-dnd';

function LetterHex(props) {
    const [letter, setLetter]  = useState(props.letter.toUpperCase());
    const [{ opacity }, dragRef] = useDrag(
        () => ({
          type: "card",
          item: { name: letter.toUpperCase() },
          collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.5 : 1
          }),
          end: (item, monitor) => {
                const dropResult = monitor.getDropResult()
                if (item && dropResult) {
                  props.dropHandler(item, dropResult);
                }
              },
        }),
        [letter]
      )

    const [, dropRef] = useDrop(() => ({
       accept: 'card',
       collect: (monitor) => ({
       }),
       drop: () => ({ name: letter })
    }), [letter])


    return (
      /** TODO move styles to css */
      <div ref={(node) => dragRef(dropRef(node))} style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <div className={props.center === true ? "centerHexTop": "hexTop"}></div>
        <div className={props.center === true ? "centerHexMiddle" : "hexMiddle"}>
          <p className="hexText">
            <a className="hexLink" href="javascript:void(0)" onClick={props.clickHandler}>
              {letter}
            </a>
          </p>
        </div>
        <div className={props.center === true ? "centerHexBottom" : "hexBottom"}></div>
      </div>
    );
}

export default LetterHex;