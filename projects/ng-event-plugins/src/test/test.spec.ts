import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Inject,
} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By, EventManager} from '@angular/platform-browser';
import {BehaviorSubject, identity} from 'rxjs';

import {shouldCall} from '../decorators/should-call';
import {EventPluginsModule} from '../module';
import {BindEventPlugin} from '../plugins/bind.plugin';
import {asCallable} from '../utils/as-callable';

describe('EventManagers', () => {
    @Component({
        template: `
            <div class="wrapper" (click)="onWrapper($event)">
                <div
                    id="stopped-clicks"
                    class="element"
                    (click.stop)="onStoppedClick()"
                ></div>
                <div
                    id="prevented-clicks"
                    class="element"
                    (click.prevent)="onPreventedClick()"
                ></div>
                <div
                    id="filtered-clicks"
                    class="element"
                    (click.silent)="onFilteredClicks($event.bubbles)"
                ></div>
            </div>
            <div class="wrapper" (click.capture.stop)="(0)">
                <div id="captured-clicks" class="element" (click)="onCaptured()"></div>
            </div>
            <div class="wrapper" (click.self)="onBubbled()">
                <div id="bubbled-clicks" class="element" (click)="(0)"></div>
            </div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class TestComponent {
        @HostBinding('$.data-value.attr')
        @HostListener('$.data-value.attr')
        @HostBinding('$.tabIndex')
        @HostListener('$.tabIndex')
        @HostBinding('$.style.marginTop.%')
        @HostListener('$.style.marginTop.%')
        @HostBinding('$.class.active')
        @HostListener('$.class.active')
        readonly test = asCallable(new BehaviorSubject<number | null>(1));

        flag = false;
        onStoppedClick = jasmine.createSpy('onStoppedClick');
        onPreventedClick = jasmine.createSpy('onPreventedClick');
        onWrapper = jasmine.createSpy('onWrapper');
        onCaptured = jasmine.createSpy('onCaptured');
        onBubbled = jasmine.createSpy('onBubbled');

        constructor(@Inject(ElementRef) readonly elementRef: ElementRef<HTMLElement>) {}

        @shouldCall(bubbles => bubbles)
        @HostListener('click.init', ['$event'])
        @HostListener('document:click.silent.stop.prevent')
        @HostListener('document:click.init')
        onFilteredClicks(_bubbles: boolean): void {
            this.flag = true;
        }
    }

    @Component({
        template: `
            <div (document:click.capture)="(0)"></div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class BrokenComponent {}

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [EventPluginsModule],
            declarations: [TestComponent, BrokenComponent],
        });

        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        testComponent.onWrapper.calls.reset();
        testComponent.onStoppedClick.calls.reset();
        testComponent.onPreventedClick.calls.reset();
        testComponent.onBubbled.calls.reset();
    });

    it('Clicks are stopped', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(
            By.css('#stopped-clicks'),
        )!.nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onWrapper).not.toHaveBeenCalled();
        expect(testComponent.onStoppedClick).toHaveBeenCalled();
    });

    it('Clicks go through with default prevented', () => {
        const event = new Event('click', {bubbles: true, cancelable: true});
        const element = fixture.debugElement.query(
            By.css('#prevented-clicks'),
        )!.nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onPreventedClick).toHaveBeenCalled();
        expect(testComponent.onWrapper).toHaveBeenCalled();
        expect(testComponent.onWrapper.calls.mostRecent().args[0].defaultPrevented).toBe(
            true,
        );
    });

    it('Clicks are filtered', () => {
        const event = new Event('click');
        const element = fixture.debugElement.query(
            By.css('#filtered-clicks'),
        )!.nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.flag).toBe(false);
    });

    it('Clicks go through filtered', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(
            By.css('#filtered-clicks'),
        )!.nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.flag).toBe(true);
    });

    it('Clicks are captured', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(
            By.css('#captured-clicks'),
        )!.nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onCaptured).not.toHaveBeenCalled();
    });

    it('Self listeners not triggered on bubbled events', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(
            By.css('#bubbled-clicks'),
        )!.nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onBubbled).not.toHaveBeenCalled();
    });

    it('Self listeners triggered on events originated on the same element', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(By.css('#bubbled-clicks'))!
            .nativeElement.parentElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onBubbled).toHaveBeenCalled();
    });

    // TODO: Maybe new testing zone.js swallows it?
    xit('Global capture throws', () => {
        expect(() => {
            TestBed.createComponent(BrokenComponent).detectChanges();
        }).toThrow();
    });

    it('Observable bindings work', () => {
        expect(testComponent.elementRef.nativeElement.getAttribute('data-value')).toBe(
            '1',
        );
        expect(testComponent.elementRef.nativeElement.tabIndex).toBe(1);
        expect(testComponent.elementRef.nativeElement.style.marginTop).toBe('1%');
        expect(testComponent.elementRef.nativeElement.classList.contains('active')).toBe(
            true,
        );
    });

    it('Observable bindings are updated', () => {
        testComponent.test.next(null);

        expect(testComponent.elementRef.nativeElement.getAttribute('data-value')).toBe(
            null,
        );
        expect(testComponent.elementRef.nativeElement.tabIndex).toBe(0);
        expect(testComponent.elementRef.nativeElement.style.marginTop).toBe('1%');
        expect(testComponent.elementRef.nativeElement.classList.contains('active')).toBe(
            false,
        );
    });

    it('bind plugin doesnt crash if observable is missing', () => {
        const bind = new BindEventPlugin();
        const element: any = document.createElement('div');

        bind.manager = TestBed.inject(EventManager);

        expect(() => bind.addEventListener(element, 'test')).not.toThrow();
    });

    describe('shouldCall does not crash without zone', () => {
        class Test {
            flag = false;

            @shouldCall(identity)
            test(flag: boolean): void {
                this.flag = flag;
            }
        }

        it('and calls the method', () => {
            const test = new Test();

            test.test(true);

            expect(test.flag).toBe(true);
        });

        it('and doesnt call the method', () => {
            const test = new Test();

            test.flag = true;
            test.test(false);

            expect(test.flag).toBe(true);
        });
    });
});
