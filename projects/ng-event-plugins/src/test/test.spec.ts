import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
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
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class TestComponent {
        flag = false;
        onStoppedClick = jasmine.createSpy('onStoppedClick');
        onPreventedClick = jasmine.createSpy('onPreventedClick');
        onWrapper = jasmine.createSpy('onWrapper');

        @shouldCall(bubbles => bubbles)
        @HostListener('init', ['$event'])
        @HostListener('document:click.silent.stop.prevent')
        @HostListener('document:init')
        onFilteredClicks(_bubbles: boolean) {
            this.flag = true;
        }
    }

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
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
});
