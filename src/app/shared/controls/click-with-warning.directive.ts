import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appClickWithWarning]'
})
export class ClickWithWarningDirective implements OnInit {
  // add Input and Output
  @Input() warning = 'Are you sure?';
  @Output() appClickWithWarning = new EventEmitter();

  // add HostBinding
  @HostBinding('class') classBinding: string | undefined;

  constructor(private elementRef: ElementRef) {}

  // add HostListener
  @HostListener('click', ['$event.shiftKey'])
  handleClick(shiftKey: boolean): void {
    if (shiftKey || confirm(this.warning)) {
      this.appClickWithWarning.emit();
    }
  }

  ngOnInit(): void {
    // assign classes via HostBinding:
    this.classBinding = 'btn btn-danger';
  }
}
