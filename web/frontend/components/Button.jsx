import React from 'react'
import {Button} from "@shopify/polaris";
export default function ButtonAddComponent  (props)  {
    return (
        <Button onClick={props.onClick}>{props.text}</Button>
    )
}
