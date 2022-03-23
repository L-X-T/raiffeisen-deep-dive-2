import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export const validateRoundTrip = (c: AbstractControl): ValidationErrors | null => {
  const formGroup = c as FormGroup;
  const fromCtrl = formGroup.controls.from;
  const toCtrl = formGroup.controls.to;

  if (!fromCtrl || !toCtrl) {
    return null;
  }

  if (fromCtrl.value && fromCtrl.value === toCtrl.value) {
    return { roundTrip: true };
  }

  return null;
};
