import {DOCUMENT} from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Input,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import {shouldCall} from '@tinkoff/ng-event-plugins';

@Component({
    selector: 'custom-select',
    templateUrl: './select.template.html',
    styleUrls: ['./select.style.less'],
})
export class SelectComponent {
    @ViewChild('input')
    private readonly input!: ElementRef;

    @ViewChildren('option')
    private readonly options!: QueryList<ElementRef>;

    @HostBinding('class._open')
    open = false;

    @Input()
    items: readonly string[] = [];

    @Input()
    value = '';

    @Output()
    valueChange = new EventEmitter<string>();

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        @Inject(ElementRef) private readonly elementRef: ElementRef,
    ) {}

    @HostBinding('class._focused')
    get focused(): boolean {
        return this.elementRef.nativeElement.contains(this.document.activeElement);
    }

    // Only react to Esc if dropdown is open
    @shouldCall((_, open) => open)
    @HostListener('keydown.esc.init', ['$event'])
    @HostListener('keydown.esc.silent', ['$event', 'open'])
    onEsc(event: KeyboardEvent): void {
        event.stopPropagation();
        this.input.nativeElement.focus();
        this.open = false;
    }

    // Only react to focusout if focus leaves component boundaries
    @shouldCall((relatedTarget, nativeElement) => !nativeElement.contains(relatedTarget))
    @HostListener('focusout.init', ['$event'])
    @HostListener('focusout.silent', ['$event.relatedTarget', 'elementRef.nativeElement'])
    onBlur(): void {
        this.open = false;
    }

    // Only react to mousemove if focus is required
    @shouldCall(element => element !== document.activeElement)
    @HostListener('mousemove.init', ['$event'])
    onMouseMove(element: HTMLElement): void {
        element.focus();
    }

    // Only react to arrow down if we are not on the last item
    @shouldCall((currentIndex, length) => currentIndex < length - 1)
    @HostListener('keydown.arrowDown.init', ['$event'])
    onArrowDown(currentIndex: number): void {
        this.options
            .find((_item, index) => index === currentIndex + 1)!
            .nativeElement.focus();
    }

    // Only react to arrow up if we are not on the first item
    @shouldCall(currentIndex => !!currentIndex)
    @HostListener('keydown.arrowUp.init', ['$event'])
    onArrowUp(currentIndex: number): void {
        this.options
            .find((_item, index) => index === currentIndex - 1)!
            .nativeElement.focus();
    }

    onClick(): void {
        this.open = !this.open;
    }

    onSelect(value: string): void {
        this.input.nativeElement.focus();
        this.value = value;
        this.valueChange.emit(value);
        this.open = false;
    }

    onInputArrowDown(): void {
        if (!this.options.first) {
            this.open = true;
        } else {
            this.options.first.nativeElement.focus();
        }
    }
}
