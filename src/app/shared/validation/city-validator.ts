import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validateCity =
  (validCities: string[]): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null => {
    if (c.value && !validCities.includes(c.value)) {
      return {
        city: {
          actualCity: c.value,
          validCities: validCities.join(', ')
        }
      };
    }

  return null;
};
