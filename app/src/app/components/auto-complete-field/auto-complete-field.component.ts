import { EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'hmn-group-field',
  templateUrl: './auto-complete-field.component.html',
  styleUrls: ['./auto-complete-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteFieldComponent),
      multi: true,
    },
  ],
})
export class AutoCompleteFieldComponent implements ControlValueAccessor {
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onSearch = new EventEmitter<Event>();
  @Input() list: string[] = [];
  value!: string;
  showList: boolean = false;
  hasBeenFocused: boolean = false;

  onModelChange: (value: string) => void = () => {};
  onModelTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onModelTouched = fn;
  }

  setItem(item: string) {
    this.value = item;
    this.onModelChange(this.value);
    this.showList = false;
  }

  onSearchHandler(event: Event, isFocusEvent?: boolean) {
    if (isFocusEvent) {
      this.hasBeenFocused = true;
    }
    if (this.hasBeenFocused) {
      this.onSearch.emit(event);
      this.showList = true;
    }
  }

  onBlurHandler(event) {
    this.onBlur.emit(event);
    this.showList = false;
  }
}
