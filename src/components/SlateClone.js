import './SlateClone.css'
import Tool from "./Tool";
import React, { useRef, useEffect, useState } from 'react';
import { FaBold, FaItalic, FaHeading, FaLink, FaUnderline } from "react-icons/fa";

//https://stackoverflow.com/questions/72129403/reactjs-how-to-autofocus-an-element-with-contenteditable-attribute-true-in-rea
function SlateClone({ html }) {
    const inputRef = useRef(null);

    useEffect(() => {
      inputRef.current.focus();
  
    }, [inputRef]);

    const [preview, setPreview] = useState(html);

    const [activeCmd,setActiveCmd] = useState(null);

    const handleInput = (e) => {
        setPreview(e.target.innerHTML);
    }

    return (
        <>
            <div className='editor'>
                <h1 className='editor-heading'>Slate Clone</h1>
                <div className='toolbar'>
                    <Tool
                        cmd="bold"
                        icon={<FaBold />}
                        activeCmd={activeCmd}
                        setActiveCmd={setActiveCmd} />
                    <Tool
                        cmd="italic"
                        icon={<FaItalic />}
                        activeCmd={activeCmd}
                        setActiveCmd={setActiveCmd} />
                    <Tool
                        cmd="underline"
                        icon={<FaUnderline />}
                        activeCmd={activeCmd}
                        setActiveCmd={setActiveCmd} />
                    <Tool
                        cmd="formatBlock"
                        arg="h1" name="heading"
                        icon={<FaHeading />}
                        activeCmd={activeCmd}
                        setActiveCmd={setActiveCmd} />
                    <Tool
                        cmd="createLink"
                        arg="https://github.com/lovasoa/react-contenteditable"
                        name="hyperlink"
                        icon={<FaLink />}
                        activeCmd={activeCmd}
                        setActiveCmd={setActiveCmd} />
                </div> 
                <div className="content-editable"
                    contentEditable="true"
                    ref={inputRef}
                    dangerouslySetInnerHTML={{ __html: html }}
                    onInput={handleInput}>
                </div>
            </div>
        </>

    );
}

export default SlateClone;
