
export function Genre(props) {
    return( 
        <div onClick={() => props.clearSearch(0,props.search)} className="genre">{props.search}</div>
    )
}