//import React from "react";
import './App.css';

function Cell(props){
    return(
        <td onClick={()=>props.cellClicked(props.row,props.cell)} >
            {props.value}
        </td>
    );
}
export default Cell;