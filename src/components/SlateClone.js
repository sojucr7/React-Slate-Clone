import './SlateClone.css'
import Tool from "./Tool";
import React, { useRef, useEffect, useState } from 'react';
import { FaBold, FaItalic, FaHeading, FaLink, FaUnderline } from "react-icons/fa";

function SlateClone({ html }) {
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
    }, [inputRef])

    const [preview, setPreview] = useState(html)

    const [activeCmd, setActiveCmd] = useState(null)

    const [suggessionStyle, setSuggessionStyle] = useState({
        left: '0 px',
        top: '0 px',
        display: 'none'
    })

    const [showSuggession, setShowSuggession] = useState(false)

    const suggessionTriggers = ['@', '#']

    const handleInput = (e) => {
        setPreview(e.target.innerHTML)
        let { x, y } = getCaretCoordinates()
        let lastCharacterBeforeCursor = getCharacterPrecedingCaret(document.getElementById('content-editor'));
        if (suggessionTriggers.includes(lastCharacterBeforeCursor)) {
            setShowSuggession(true)
        }
        if (!lastCharacterBeforeCursor.trim()) {
            setShowSuggession(false)
        }

        if (x == 0 && y == 0) {
            setSuggessionStyle({
                left: -100 + 'vw',
                top: -100 + 'vh'
            })
            return;
        }
        setSuggessionStyle({
            left: x + 'px',
            top: y + 'px'
        })
    }

    function getCaretIndex(element) {
        let position = 0;
        const isSupported = typeof window.getSelection !== "undefined";
        if (isSupported) {
            const selection = window.getSelection();
            // Check if there is a selection (i.e. cursor in place)
            if (selection.rangeCount !== 0) {
                // Store the original range
                const range = window.getSelection().getRangeAt(0);
                // Clone the range
                const preCaretRange = range.cloneRange();
                // Select all textual contents from the contenteditable element
                preCaretRange.selectNodeContents(element);
                // And set the range end to the original clicked position
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                // Return the text length from contenteditable start to the range end
                position = preCaretRange.toString().length;
            }
        }
        return position;
    }

    function getCaretCoordinates() {
        let x = 0, y = 0
        const isSupported = typeof window.getSelection !== "undefined"
        if (isSupported) {
            const selection = window.getSelection()
            if (selection.rangeCount !== 0) {
                const range = selection.getRangeAt(0).cloneRange()
                range.collapse(true)
                const rect = range.getClientRects()[0]
                if (rect) {
                    x = rect.left
                    y = rect.top
                }
            }
        }
        return { x, y }
    }

    function getCharacterPrecedingCaret(containerEl) {
        var precedingChar = "", sel, range, precedingRange;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0).cloneRange();
                range.collapse(true);
                range.setStart(containerEl, 0);
                precedingChar = range.toString().slice(-1);
            }
        } else if ((sel = document.selection) && sel.type != "Control") {
            range = sel.createRange();
            precedingRange = range.duplicate();
            precedingRange.moveToElementText(containerEl);
            precedingRange.setEndPoint("EndToStart", range);
            precedingChar = precedingRange.text.slice(-1);
        }
        return precedingChar;
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
                        cmd="createLink"
                        arg="https://github.com/sojucr7"
                        name="hyperlink"
                        icon={<FaLink />}
                        activeCmd={activeCmd}
                        setActiveCmd={setActiveCmd} />
                </div>
                <div className="content-editor"
                    contentEditable="true"
                    id="content-editor"
                    ref={inputRef}
                    dangerouslySetInnerHTML={{ __html: html }}
                    onInput={handleInput}
                    placeholder="Type @,# for mentions">
                </div>
                {showSuggession && <div className='suggessions' id="suggessions" style={suggessionStyle}>
                    <div className='suggession'><span>suggessions1</span></div>
                    <div className='suggession'><span>suggessions1</span></div>
                    <div className='suggession'><span>suggessions1</span></div>
                    <div className='suggession'><span>suggessions1</span></div>
                </div>}
            </div>
        </>

    );
}

export default SlateClone;
