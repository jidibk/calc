import './calculator.css'
import React, { useState } from 'react'


const btnValues = [
 
  {id: "clear", val: "C"},
  {id: "delete", val: "+-"},
  {id: 'percent', val: "%"},
  {id: "divide", val: "/"},
  {id:'seven', val: '7'}, 
  {id: 'eight', val: '8'}, 
  {id:'nine', val: "9"}, 
  {id:"multiply", val: "X"},
  {id: "four", val: '4'},
  {id: 'five', val: '5'}, 
  {id: 'six', val: '6'}, 
  {id: 'subtract', val: "-"},
  {id: 'one', val: '1'},
  {id: 'two', val: '2'}, 
  {id: 'three', val: '3'}, 
  {id:'add', val:"+"},
  {id:'zero', val: '0'}, 
  {id:'decimal', val: "."},
  {id:'equals', val: "="}

];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");


function Calculator() {
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
    history: ""
  });

  //Handlers

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
  
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num).includes(".")
            ? calc.num + value // Append directly if there's a decimal point
            : toLocaleString(Number(removeSpaces(calc.num + value))),
            history: calc.history + value,
      });
    }
  };
  
  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML; // This should be "."
  
    setCalc((prevCalc) => {
      const numStr = prevCalc.num;
  
      // Add decimal only if not already present
      if (!numStr.includes(".")) {
        return {
          ...prevCalc,
          num: numStr + value,
          history: prevCalc.history + value, // Add decimal to history
        };
      }
  
      return prevCalc; // No changes if decimal already exists
    });
  };
  
  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML; // The operator entered
  
    setCalc((prevCalc) => {
      const operators = ["+", "-", "X", "/"];
      const history = prevCalc.history.trim();
      const lastChar = history.slice(-1); // Get the last character in the history
  
      // Regular expression to match consecutive operators at the end of the history
      const trailingOperatorsRegex = /([+\-X/]\s?)+$/;
  
      let updatedHistory;
  
      if (prevCalc.num === 0 && prevCalc.res !== 0 && !prevCalc.history) {
        // If `=` was pressed previously, start a new calculation
        updatedHistory = `${prevCalc.res} ${value} `;
      } else if (trailingOperatorsRegex.test(history)) {
        if (value === "-") {
          // Retain `-` if it's part of a negative number (e.g., `5 * -`)
          updatedHistory = history + value;
        } else {
          // Replace all consecutive operators with the new operator
          updatedHistory = history.replace(trailingOperatorsRegex, " " + value + " ");
        }
      } else {
        // Append the new operator
        updatedHistory = history + " " + value + " ";
      }
  
      // Prevent operator input at the start unless it's "-"
      if (!prevCalc.num && !prevCalc.res && value !== "-") {
        return { ...prevCalc }; // Ignore invalid operator input
      }
  
      return {
        ...prevCalc,
        sign: value, // Update the current sign
        res: prevCalc.num ? prevCalc.num : prevCalc.res, // Store result or current number
        num: 0, // Reset number input for the next operand
        history: updatedHistory, // Update history
      };
    });
  };
  
  const equalsClickHandler = () => {
    if (calc.history) {
      try {
        // Replace "X" with "*" for multiplication (JavaScript syntax)
        let expression = calc.history.replace(/X/g, "*");
  
        // Evaluate the expression safely
        const result = eval(expression);
  
        // Update the calculator state with the result
        setCalc({
          ...calc,
          res: toLocaleString(parseFloat(result)), // Format the result for display
          num: 0,
          sign: "",
          history: '', // Clear history after evaluation
          
        });  

      
      } catch (error) {
        // Handle invalid expressions
        setCalc({
          ...calc,
          res: "Error", // Display error
          num: 0,
          sign: "",
          history: "",
        });
      }      
      
    }
  };
  
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
      history: ''
    });
  };

  //render the jsx
  return (
    <div className='wrapper'>
      <div >
        <Display value={calc.num !== 0 ? calc.num : calc.res} />
      </div>
      <div className="buttonbox">
        {btnValues.flat().map((btn, i) => {
            return (
              <Button
                key={i}
                id={btn.id}
                className={btn === "=" ? "equals" : ""}
                value={btn.val}
                onClick={
                btn.val === "C"
                  ? resetClickHandler
                  : btn.val === "+-"
                  ? invertClickHandler
                  : btn.val === "%"
                  ? percentClickHandler
                  : btn.val === "="
                  ? equalsClickHandler
                  : btn.val === "/" || btn.val === "X" || btn.val === "-" || btn.val === "+"
                  ? signClickHandler
                  : btn.val === "."
                  ? commaClickHandler
                  : numClickHandler
              }
              />
            );
          })
        }
      </div>
    </div>
  )
}

export default Calculator

const Button = ({ id, className, value, onClick }) => {
  return (
    <button id={id} className={className} onClick={onClick}>
      {value}
    </button>
  );
};

const Display = ({value}) => {
  return (
    <div id="display">
    {value}
    </div>
  ); 
};