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
import {filter} from '@tinkoff/ng-event-filters';

@Component({
    selector: 'custom-select',
    templateUrl: './select.template.html',
    styleUrls: ['./select.style.less'],
})
export class SelectComponent {
    @Input()
    items: ReadonlyArray<string> = [];

    @Input()
    value = '';

    @Output()
    valueChange = new EventEmitter<string>();

    @HostBinding('class._open')
    open = false;

    @ViewChild('input')
    private readonly input!: ElementRef;

    @ViewChildren('option')
    private readonly options!: QueryList<ElementRef>;

    constructor(@Inject(ElementRef) private readonly elementRef: ElementRef) {}

    @HostBinding('class._focused')
    get focused(): boolean {
        return this.elementRef.nativeElement.contains(document.activeElement);
    }

    // Only react to Esc if dropdown is open
    @filter((_, open) => open)
    @HostListener('keydown.esc.silent', ['$event', 'open'])
    onEsc(event: KeyboardEvent) {
        event.stopPropagation();
        this.input.nativeElement.focus();
        this.open = false;
    }

    // Only react to focusout if focus leaves component boundaries
    @filter((relatedTarget, nativeElement) => !nativeElement.contains(relatedTarget))
    @HostListener('focusout.silent', ['$event.relatedTarget', 'elementRef.nativeElement'])
    onBlur() {
        this.open = false;
    }

    // Only react to mousemove if focus is required
    @filter(element => element !== document.activeElement)
    onMouseMove(element: HTMLElement) {
        element.focus();
    }

    // Only react to arrow down if we are not on the last item
    @filter((currentIndex, length) => currentIndex < length - 1)
    onArrowDown(currentIndex: number) {
        this.options
            .find((_item, index) => index === currentIndex + 1)!
            .nativeElement.focus();
    }

    // Only react to arrow up if we are not on the first item
    @filter(currentIndex => !!currentIndex)
    onArrowUp(currentIndex: number) {
        this.options
            .find((_item, index) => index === currentIndex - 1)!
            .nativeElement.focus();
    }

    onClick() {
        this.open = !this.open;
    }

    onSelect(value: string) {
        this.input.nativeElement.focus();
        this.value = value;
        this.valueChange.emit(value);
        this.open = false;
    }

    onInputArrowDown() {
        if (!this.options.first) {
            this.open = true;
        } else {
            this.options.first.nativeElement.focus();
        }
    }
}
