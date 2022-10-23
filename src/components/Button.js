export default function Button(props) {
    return <button className={props.className}
                   onClick={() => props.handler(props.action || props.text)}
                   disabled={props.disabled}>{props.text}</button>
}
