import React from 'react';

class LetterHex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      /** TODO move styles to css */
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <div className={this.props.center === true ? "centerHexTop": "hexTop"}></div>
        <div className={this.props.center === true ? "centerHexMiddle" : "hexMiddle"}>
          <p className="hexText">
            <a className="hexLink" href="javascript:void(0)" onClick={this.props.clickHandler}>
              {this.props.letter.toUpperCase()}
            </a>
          </p>
        </div>
        <div className={this.props.center === true ? "centerHexBottom" : "hexBottom"}></div>
      </div>
    );
  }


}

export default LetterHex;