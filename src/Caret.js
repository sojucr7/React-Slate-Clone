export default class Caret {
    /**
     * get/set caret position
     * @param {HTMLColletion} target 
     */
    constructor(target) {
        this.isContentEditable = target && target.contentEditable
        this.target = target
    }
    /**
     * get caret position
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range}
     * @returns {number}
     */
    getPos() {
        // for contentedit field
        if (this.isContentEditable) {
            this.target.focus()
            let _range = document.getSelection().getRangeAt(0)
            let range = _range.cloneRange()
            range.selectNodeContents(this.target)
            range.setEnd(_range.endContainer, _range.endOffset)
            return range.toString().length;
        }
        // for texterea/input element
        return this.target.selectionStart
    }

    /**
     * set caret position
     * @param {number} pos - caret position
     */
    setPos(pos) {
        // for contentedit field
        if (this.isContentEditable) {
            this.target.focus()
            document.getSelection().collapse(this.target, pos)
            return
        }
        this.target.setSelectionRange(pos, pos)
    }
}