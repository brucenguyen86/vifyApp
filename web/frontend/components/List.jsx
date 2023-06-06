import React from "react";
import data from "./ListData"
function List(props){
    const filterData = data.filter((el) =>{
        if(props.input === '') {
            return el
        } else{
            return el.text.toLowerCase().includes(props.input)
        }
    })
    return(
        <ul>
            {filterData.map((item) => (<li key={item.id}>
                {item.text}
            </li> ))}
        </ul>
    )
}
export default List
