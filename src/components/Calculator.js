import React, {useState} from "react"
import Button from "./Button"

const maxNumberLength = 20
const error = "Error"
const overflow = "Overflow"
const operations = {
    "plus": (a, b) => a + b,
    "minus": (a, b) => a - b,
    "multiply": (a, b) => a * b,
    "divide": (a, b) => a / b
}
const resultInto = {
    "plus": 1,
    "minus": 1,
    "multiply": 2,
    "divide": 1
}

let operation
let clearOutput = false

function toString(number) {
    let str = number.toString()
    const expIndex = str.indexOf("e")
    if (str === "NaN" || str === "Infinity") {
        str = error
    } else if (expIndex !== -1) {
        str = number.toFixed(expIndex + 5)
    }
    return str.length <= maxNumberLength ? str : overflow
}

export default function Calculator() {
    const [output, setOutput] = useState("0")

    function clear() {
        clearOutput = false
        operation = undefined
        setOutput("0")
    }

    function digit(d) {
        if (clearOutput || output === "0") {
            setOutput(d)
            clearOutput = false
        } else if (output.length < maxNumberLength) {
            setOutput(output + d)
        }
    }

    function decimal() {
        if (clearOutput) {
            setOutput("0")
            clearOutput = false
        }
        if (output.length < maxNumberLength && !output.includes(".")) {
            setOutput(output + ".")
        }
    }

    function sign() {
        if (output.length < maxNumberLength
            && output !== "0" && output !== "0." && output[0] !== '-') {
            setOutput("-" + output)
        } else if (output[0] === '-') {
            setOutput(output.slice(1))
        }
    }

    function sqrt() {
        setOutput(toString(Math.sqrt(Number.parseFloat(output))))
        clearOutput = true
    }

    function calculate() {
        if (operation !== undefined) {
            if (operation.length < 3) {
                operation.push(Number.parseFloat(output))
            }
            const operationName = operation[0]
            const result = operations[operationName](operation[1], operation[2])
            setOutput(toString(result))
            operation[resultInto[operationName]] = result
        }
        clearOutput = true
    }

    function binaryOp(action) {
        operation = [action, Number.parseFloat(output)]
        clearOutput = true
    }

    return <div className="Calculator">
        <div className="output">{output}</div>
        <div className="keys">
            {[{handler: digit, text: "7"},
                {handler: digit, text: "8"},
                {handler: digit, text: "9"},
                {handler: binaryOp, text: "÷", action: "divide"},
                {handler: binaryOp, text: "×", action: "multiply"},
                {handler: digit, text: "4"},
                {handler: digit, text: "5"},
                {handler: digit, text: "6"},
                {handler: sign, text: "±"},
                {handler: binaryOp, text: "-", action: "minus"},
                {handler: digit, text: "1"},
                {handler: digit, text: "2"},
                {handler: digit, text: "3"},
                {handler: sqrt, text: "√"},
                {handler: binaryOp, text: "+", action: "plus", className: "key_plus"},
                {handler: digit, text: "0"},
                {handler: decimal, text: "."},
                {handler: calculate, text: "="},
                {handler: clear, text: "AC"}].map(button => {
                return <Button handler={button.handler} text={button.text} action={button.action}
                               className={button.className}
                               disabled={button.text !== "AC"
                                   && (output === error || output === overflow)}
                               key={button.text}/>
            })}
        </div>
    </div>
}
