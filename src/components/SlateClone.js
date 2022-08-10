import './SlateClone.css'
import Tool from "./Tool"
import Caret from '../Caret'
import Rangy from 'rangy'
import RangSelectionSaveRestore from 'rangy/lib/rangy-selectionsaverestore'
import React, { useRef, useEffect, useState } from 'react'
import { FaBold, FaItalic, FaHeading, FaLink, FaUnderline } from "react-icons/fa"

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

    const [savedSel, setSavedSel] = useState(null)

    const suggessionTriggers = ['@', '#']

    const editor = document.getElementById('content-editor')

    const handleInput = (e) => {
        setPreview(e.target.innerHTML)

        let { x, y } = getCaretCoordinates()

        let lastCharacterBeforeCursor = getCharacterPrecedingCaret(document.getElementById('content-editor'))

        if (suggessionTriggers.includes(lastCharacterBeforeCursor)) {
            setShowSuggession(true)

            setSavedSel(RangSelectionSaveRestore.saveSelection())

        }
        if (!lastCharacterBeforeCursor.trim()) {
            setShowSuggession(false)
        }

        if (x == 0 && y == 0) {
            setSuggessionStyle({
                left: -100 + 'vw',
                top: -100 + 'vh'
            })
            return
        }

        setSuggessionStyle({
            left: x + 'px',
            top: y + 'px'
        })
            
    }

    function addSuggession(suggession){
        if (savedSel) {
            RangSelectionSaveRestore.restoreSelection(savedSel, true)           
        }
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
        var precedingChar = "", sel, range, precedingRange
        if (window.getSelection) {
            sel = window.getSelection()
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0).cloneRange()
                range.collapse(true)
                range.setStart(containerEl, 0)
                precedingChar = range.toString().slice(-1)
            }
        } else if ((sel = document.selection) && sel.type != "Control") {
            range = sel.createRange()
            precedingRange = range.duplicate()
            precedingRange.moveToElementText(containerEl)
            precedingRange.setEndPoint("EndToStart", range)
            precedingChar = precedingRange.text.slice(-1)
        }
        return precedingChar
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
                    <div className='suggession' onClick={() => addSuggession('Suggessions 1')}><span>Suggessions 1</span></div>
                    <div className='suggession' onClick={() => addSuggession('Suggessions 2')}><span>Suggessions 2</span></div>
                    <div className='suggession' onClick={() => addSuggession('Suggessions 3')}><span>Suggessions 3</span></div>
                    <div className='suggession' onClick={() => addSuggession('Suggessions 4')}><span>Suggessions 4</span></div>
                </div>}
            </div>
        </>

    )
}

export default SlateClone
