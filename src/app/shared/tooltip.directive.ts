import { Directive, ElementRef, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
  @Input('appTooltip') template: TemplateRef<unknown> | undefined;

  private viewRef: EmbeddedViewRef<unknown> | undefined;

  constructor(private host: ElementRef, private viewContainer: ViewContainerRef) {}

  setHidden(hidden: boolean): void {
    this.viewRef?.rootNodes.forEach((nativeElement) => {
      nativeElement.hidden = hidden;
    });
  }

  ngOnInit(): void {
    if (!this.template) {
      return;
    }
    this.viewRef = this.viewContainer.createEmbeddedView(this.template);

    this.setHidden(true);

    const elm = this.host.nativeElement as HTMLElement;
    elm.addEventListener('mouseover', () => {
      this.setHidden(false);
    });

    elm.addEventListener('mouseout', () => {
      this.setHidden(true);
    });
  }
}
