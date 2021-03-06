import $ from 'jquery';
import Widget from '../../js/widget';
import support from '../../js/support';
import { time as timeFormat } from '../../js/format';
import types from '../../js/types';
import events from '../../js/event';
import './timepicker';
import '../../js/dropdown.jquery';

class TimepickerExtended extends Widget {

    static get selector() {
        return '.question input[type="time"]:not([readonly])';
    }

    static condition() {
        return !support.touch || !support.inputTypes.time;
    }

    _init() {
        const fragment = document.createRange().createContextualFragment(
            `<div class="widget timepicker">
                <input class="ignore timepicker-default" type="text" placeholder="hh:mm" />
            </div>`
        );
        fragment.querySelector( '.widget' ).append( this.resetButtonHtml );
        this.element.classList.add( 'hide' );
        this.element.after( fragment );

        const resetBtn = this.question.querySelector( '.widget > .btn-reset' );
        this.fakeTimeI = this.question.querySelector( '.widget > input' );

        $( this.fakeTimeI )
            .timepicker( {
                showMeridian: timeFormat.hour12,
                meridianNotation: {
                    am: timeFormat.amNotation,
                    pm: timeFormat.pmNotation
                }
            } );

        // using setTime ensures that the fakeInput shows the meridan when needed
        this.value = this.originalInputValue;

        this.fakeTimeI.addEventListener( 'change', () => {
            const modified = timeFormat.hour12 ? types.time.convertMeridian( this.value ) : this.value;
            this.originalInputValue = modified;
        } );

        // reset button
        resetBtn.addEventListener( 'click', this._reset.bind( this ) );

        // handle original input focus
        this.element.addEventListener( events.ApplyFocus().type, () => {
            this.fakeTimeI.focus();
        } );

    }

    _reset() {
        const ev = this.originalInputValue ? events.Change() : null;
        if ( ev || this.value ) {
            this.value = '';
            //this.originalInputValue = '';
            this.fakeTimeI.dispatchEvent( ev );
        }
    }

    update() {
        $( this.element )
            .next( '.widget' )
            .find( 'input' )
            .timepicker( 'setTime', this.element.value );
    }

    get value() {
        return this.fakeTimeI.value;
    }

    set value( value ) {
        $( this.fakeTimeI ).timepicker( 'setTime', value );
    }
}

export default TimepickerExtended;
