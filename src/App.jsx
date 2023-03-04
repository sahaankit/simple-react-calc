import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./index.css"


//object defining all kind of actions
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) { //action is divided into two parts, type (type of action) and payload (parameter of action)
  switch(type) {

    //case when digit button is pressed
    case ACTIONS.ADD_DIGIT:
      //if overwrite is set to true, replace result with new operand and set overwrite to false
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }

      //if a 0 is already present and don't allow pressing another 0
      if(payload.digit === "0" && state.currentOperand==="0") {return state}

      //if no operand present and . is entered, consider it as 0.XXX...
      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: payload.digit
        }
      }

      //do not allow repeating decimal point
      if (payload.digit === "." && state.currentOperand.includes(".")) { return state }

      //append all operands
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    //case when a operation button is clicked
    case ACTIONS.CHOOSE_OPERATION:
      //if current and previous operands are null
      if(state.currentOperand==null && state.previousOperand==null) {return state}

      //if current operand is null, but previous operand & operation is not
      //and new operation is entered, overwrite operation with new operation
      if(state.currentOperand==null) { 
        return { 
          ...state, 
          operation: payload.operation 
        }
      }
      
      //if previous operand is null but current operand is not
      //set current operand to previous operand and append operation to previous operand
      //set current operand to null
      if(state.previousOperand==null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      //evaluate all previous operands, set operation to the current operation in output and current operand to null
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    
    //case where "C" is clicked
    case ACTIONS.CLEAR:
      return {}
    
    //case when "DEL" button is clicked
    case ACTIONS.DELETE_DIGIT:
      //if overwrite is true, overwrite everything and clear current Operand
      if(state.overwrite) {
        return {
        ...state,
        overwrite: false,
        currentOperand: null,
        }
      }

      //if current operand is null, do nothing
      if(state.currentOperand==null) return state

      if(state.currentOperand.length===1) return {...state, currentOperand: null}
       
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    //case when "=" is clicked
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previousOperand==null || state.currentOperand==null) { return state }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

  }
}

//evaluate operands
function evaluate({previousOperand, currentOperand, operation}) { 
  const curr = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  if(isNaN(prev) || isNaN(curr)) return ""
  let res = 0
  switch(operation) {
    case "+":
      res = (prev+curr)
      break
    case "-":
      res = (prev-curr)
      break
    case "*":
      res = (prev*curr)
      break
    case "÷":
      res = (prev/curr)
      break
  }
  return parseFloat(res.toFixed(8)).toString() //omit trailing zeroes and keep decimal numbers to 8 decimal places
}


//Integer formatter to format the integer portion of a number
const INTEGER_FORMATTER = new Intl.NumberFormat("en-in",{
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
 if(operand==null) return
 const [integer, decimal] = operand.toString().split('.')
 if(decimal==null) return INTEGER_FORMATTER.format(integer)
 return`${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand=0, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={()=>  dispatch({ type: ACTIONS.CLEAR })}>C</button>
      <button onClick={()=>  dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={()=> dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
    )
}

export default App
