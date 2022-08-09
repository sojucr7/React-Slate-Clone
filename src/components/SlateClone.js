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

    const [innerHtml, setInnerHtml] = useState(html)

    const [activeCmd, setActiveCmd] = useState(null)

    const [suggessionStyle, setSuggessionStyle] = useState({
        left: '0 px',
        top: '0 px',
        display: 'none'
    })

    const [showSuggession, setShowSuggession] = useState(false)

    const suggessionTriggers = ['@', '#']

    const editor = document.getElementById('content-editor')

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
        if(editor)
            updateEditor()

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

    function getTextSegments(element) {
        console.log(element);
        const textSegments = [];
        Array.from(element.childNodes).forEach((node) => {
            switch(node.nodeType) {
                case Node.TEXT_NODE:
                    textSegments.push({text: node.nodeValue, node});
                    break;
                    
                case Node.ELEMENT_NODE:
                    textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                    break;
                    
                default:
                    throw new Error(`Unexpected node type: ${node.nodeType}`);
            }
        });
        return textSegments;
    }
    

    
    function updateEditor() {
        const sel = window.getSelection();
        const textSegments = getTextSegments(editor);
        const textContent = textSegments.map(({text}) => text).join('');
        let anchorIndex = null;
        let focusIndex = null;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            if (node === sel.anchorNode) {
                anchorIndex = currentIndex + sel.anchorOffset;
            }
            if (node === sel.focusNode) {
                focusIndex = currentIndex + sel.focusOffset;
            }
            currentIndex += text.length;
        });
        
        editor.innerHTML = renderText(textContent);
        
        restoreSelection(anchorIndex, focusIndex);
    }
    
    function restoreSelection(absoluteAnchorIndex, absoluteFocusIndex) {
        const sel = window.getSelection();
        const textSegments = getTextSegments(editor);
        let anchorNode = editor;
        let anchorIndex = 0;
        let focusNode = editor;
        let focusIndex = 0;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            const startIndexOfNode = currentIndex;
            const endIndexOfNode = startIndexOfNode + text.length;
            if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                anchorNode = node;
                anchorIndex = absoluteAnchorIndex - startIndexOfNode;
            }
            if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                focusNode = node;
                focusIndex = absoluteFocusIndex - startIndexOfNode;
            }
            currentIndex += text.length;
        });
        
        sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
    }
    
    function renderText(text) {
        const words = text.split(/(\s+)/);
        const output = words.map((word) => {
            if (word === 'red') {
                return `<span style='color:red'>${word}</span>`;
            }
            else {
                return word;
            }
        })
        return output.join('');
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
                    dangerouslySetInnerHTML={{ __html: innerHtml }}
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
