import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Inject,
} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs';
import {NG_EVENT_PLUGINS} from '../constants/plugins';
import {shouldCall} from '../decorators/should-call';

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
            <div class="wrapper" (click.capture.stop)="noop()">
                <div id="captured-clicks" class="element" (click)="onCaptured()"></div>
            </div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class TestComponent {
        flag = false;
        onStoppedClick = jasmine.createSpy('onStoppedClick');
        onPreventedClick = jasmine.createSpy('onPreventedClick');
        onWrapper = jasmine.createSpy('onWrapper');
        onCaptured = jasmine.createSpy('onCaptured');

        @HostBinding('$.data-value.attr')
        @HostListener('$.data-value.attr')
        @HostBinding('$.tabIndex')
        @HostListener('$.tabIndex')
        @HostBinding('$.style.width.%')
        @HostListener('$.style.width.%')
        @HostBinding('$.class.active')
        @HostListener('$.class.active')
        readonly test = new BehaviorSubject(1);

        constructor(@Inject(ElementRef) readonly elementRef: ElementRef<HTMLElement>) {}

        @shouldCall(bubbles => bubbles)
        @HostListener('init', ['$event'])
        @HostListener('document:click.silent.stop.prevent')
        @HostListener('document:init')
        onFilteredClicks(_bubbles: boolean) {
            this.flag = true;
        }

        noop() {}
    }

    @Component({
        template: `<div (document:click.capture)="noop()"></div>`,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class BrokenComponent {
        noop() {}
    }

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, BrokenComponent],
            providers: NG_EVENT_PLUGINS,
        });

        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        testComponent.onWrapper.calls.reset();
        testComponent.onStoppedClick.calls.reset();
        testComponent.onPreventedClick.calls.reset();
    });

    it('Clicks are stopped', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(By.css('#stopped-clicks'))!
            .nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onWrapper).not.toHaveBeenCalled();
        expect(testComponent.onStoppedClick).toHaveBeenCalled();
    });

    it('Clicks go through with default prevented', () => {
        const event = new Event('click', {bubbles: true, cancelable: true});
        const element = fixture.debugElement.query(By.css('#prevented-clicks'))!
            .nativeElement;

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
        const element = fixture.debugElement.query(By.css('#filtered-clicks'))!
            .nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.flag).toBe(false);
    });

    it('Clicks go through filtered', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(By.css('#filtered-clicks'))!
            .nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.flag).toBe(true);
    });

    it('Clicks are captured', () => {
        const event = new Event('click', {bubbles: true});
        const element = fixture.debugElement.query(By.css('#captured-clicks'))!
            .nativeElement;

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(testComponent.onCaptured).not.toHaveBeenCalled();
    });

    it('Global capture throws', () => {
        expect(() => {
            TestBed.createComponent(BrokenComponent).detectChanges();
        }).toThrow();
    });

    it('Observable bindings work', () => {
        expect(testComponent.elementRef.nativeElement.getAttribute('data-value')).toBe(
            '1',
        );
        expect(testComponent.elementRef.nativeElement.tabIndex).toBe(1);
        expect(testComponent.elementRef.nativeElement.style.width).toBe('1%');
        expect(testComponent.elementRef.nativeElement.classList.contains('active')).toBe(
            true,
        );
    });

    it('Observable bindings are updated', () => {
        testComponent.test.next(0);

        expect(testComponent.elementRef.nativeElement.getAttribute('data-value')).toBe(
            '0',
        );
        expect(testComponent.elementRef.nativeElement.tabIndex).toBe(0);
        expect(testComponent.elementRef.nativeElement.style.width).toBe('0%');
        expect(testComponent.elementRef.nativeElement.classList.contains('active')).toBe(
            false,
        );
    });
});
