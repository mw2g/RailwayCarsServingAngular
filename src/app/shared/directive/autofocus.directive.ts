import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[appMyAutofocus]'
})
export class AutofocusDirective implements OnInit {

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.elementRef.nativeElement.focus();
    }

}
