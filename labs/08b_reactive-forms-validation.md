# Reactive Forms - Custom Validators

- [Reactive Forms](#reactive-forms)
  - [Custom Validators](#custom-validators)
  - [Parameterized Validators](#parameterized-validators)
  - [Multi-Field-Validators](#multi-field-validators)
  - [Bonus: Load a Flight *](#bonus-load-a-flight-)
  - [Bonus: Save a Flight *](#bonus-save-a-flight-)

## Custom Validators

In this exercise, you will write your own validator for your reactive form, which checks the cities entered against a hard-coded whitelist.

1. Create a ``validation`` folder in the ``shared`` folder (if it does not already exist).

2. Create a city-validator.ts file in the validation folder. Place a validation function ``validateCity`` there, which receives an ``AbstractControl``, checks the recorded city against hard-coded values and returns an error description object.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    import {AbstractControl, ValidationErrors} from '@angular/forms';

    export function validateCity(c: AbstractControl): ValidationErrors | null {
        const validCities: string[] = ['Vienna', 'Cologne', 'Bern'];
        if (c.value && validCities.indexOf(c.value) === -1) {
            return {
                city: {
                    actualValue: c.value,
                    validCities: validCities
                }
            }
        }
        return null;
    }
    ```

    </p>
    </details>

3. Switch to the ``flight-edit.component.ts`` file and register the new validation function for the ``from`` field there.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    [...]
    import {validateCity} from '[...]';

    @Component({
        [...]
    })
    export class FlightEditComponent implements OnInit {
    
    ngOnInit(): void {
        this.editForm = this.fb.group({
            [...]
            from: [null, [[...], validateCity]],
            [...]
        });
    }
    ```
    </p>
    </details>

4. Go to the file ``flight-edit.component.html`` and check whether the custom error ``city`` has occurred. In this case, issue an error message - you might use your previously created ``FieldValidationErrorsComponent`` again here

    <details>
    <summary>Show source</summary>
    <p>

    ```html
    [...]
    <div class="text-danger" *ngIf="editForm.controls.from?.hasError('city')">
        ...city...
    </div>
    [...]
    ```

    </p>
    </details>

5. Test your solution

## Parametrizable Validators

In this exercise, you will make the validator from the last exercise parameterizable so that it checks the entries against a whitelist that is passed as parameters.

1. Switch to the ``city-validator.ts`` file and expand the ``validateCity`` function so that it accepts a whitelist with city names as a string array and returns the actual validation function.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    import {[...], ValidatorFn} from '@angular/forms';
    [...]
    export function validateCity (validCities: string[]): ValidatorFn {
        return (c: AbstractControl) => {
            if (c.value && validCities.indexOf(c.value) === -1) {
                return {
                    city: {
                        actualValue: c.value,
                        validCities: validCities
                    }
                };
            }
            return null;
        };
    }
    ```

    </p>
    </details>

2. Open the file ``flight-edit.component.ts`` and update the use of ``validateCity`` here so that a whitelist is transferred.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    [...]
    this.editForm = this.fb.group({
        [...]
        from: [null, [[...], validateCity(['Vienna', 'Berlin', 'Gleisdorf'])]],
        [...]
        });
    [...]
    ```

    </p>
    </details>

3. Test your solution.

## Async Validator

In this lab we want to add an asynchronous validator for validating the ``from`` city field.

1. Add a file `async-city-validator.ts`:

   ```typescript
   import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
   import { delay, map } from 'rxjs';
   import { FlightService } from '../../flight-search/flight.service';
   
   export const validateAsyncCity =
      (flightService: FlightService): AsyncValidatorFn =>
      (c: AbstractControl): Observable<ValidationErrors | null> =>
         flightService.find(c.value, '').pipe(
            map((flights) => (flights.length > 0 ? null : { asyncCity: { value: c.value } })),
            delay(2000) // <-- delay; can be removed later...
         );
   ```

2. Add the async validator to the from and to field in your `flight-edit.component.ts`. Be careful to not mix the async validator with the synchronous ones.

3. Add a pending flag to your `flight-edit.component.html` like this:

   ```html
   <div *ngIf="editForm.controls.from.pending" class="text-danger">Checking city ...</div
   ```

4. Don't forget to display the error.

5. Try out your application.

## Bonus: Parametrizable Async Validator

Now try to use the just created validator for both fields.

## Bonus: Multifield Validators

In this exercise you will write a multifield validator that ensures that a different value is recorded in the fields ``from`` and ``to``.

1. Create a file ``round-trip-validator.ts`` under shared / validation.

2. Add a validation function to this new file called ``validateRoundTrip``, which receives a ``FormGroup``, determines its controls ``from`` and ``to`` and - if they exist - checks whether they have the same value.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    [...]   
    export function validateRoundTrip(c: AbstractControl): ValidationErrors | null {
       const formGroup = c as FormGroup;
       const fromCtrl = formGroup.controls.from;
       const toCtrl = formGroup.controls.to;

       if (!fromCtrl || !toCtrl || !fromCtrl.value) {
         return null
       };

       if (fromCtrl.value === toCtrl.value) {
           return { roundTrip: true };
       }

       return null;
    }
    [...]
    ```
    </p>
    </details>

3. Switch to the ``flight-edit.component.ts`` file and register the new validator with the ``FormGroup``.

    <details>
    <summary>Show source</summary>
    <p>

    ```typescript
    [...]
    import {validateRountTrip} from '[...]';

    @Component({
        [...]
    })
    export class FlightEditComponent implements OnInit {
    
        ngOnInit(): void {
            [...]
            this.editForm.validator = validateRoundTrip;
        }

    }
    ```
    </p>
    </details>


4. Open the file ``flight-edit.component.html`` and check whether the error ``rountTrip`` has occurred. In this case, issue an error message.

    <details>
    <summary>Show source</summary>
    <p>

    ```html
    [...]
    <div class="text-danger" *ngIf="editForm?.hasError('roundTrip')">
        ...roundTrip...
    </div>
    [...]
    ```

    </p>
    </details>

## Bonus: Load flight *

Load any flight whose id you save as a constant for the time being and write it in the form. To do this, you can transfer the flight to the ``patchValue`` method of ``editForm``.

<!--
**Extension**: **If** you have already implemented routing, you can also receive the ID of the flight via the url.
-->

## Bonus: Save flight *

Create a save button. This should retrieve the current flight from the form (``editForm.value``) and transfer it to a ``save`` method of the ``FlightService``.

This should send the flight to the server with the ``post`` method of the ``HttpClient`` (``http.post<Flight>(url, flight).subscribe(...)``).

**Please note** that you cannot save data sets with IDs 1 to 5. These are reserved for presentations. To insert a new data record, assign the ID 0.
