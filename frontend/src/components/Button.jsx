export function Button({lable, onclick}) {
    return(
        <button className="bg-black text-white border-rounded" onClick={onclick}>
            {lable}
        </button>
    )
}