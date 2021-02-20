import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[appMyAutofocus]'
})
export class AutofocusDirective implements OnInit {

    @Input('appMyAutofocus') focus = true;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        if (this.focus) {
            this.elementRef.nativeElement.focus();
        }
    }

}
