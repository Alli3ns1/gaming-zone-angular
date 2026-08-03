import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Equivalente ao "if (password !== passwordConfirm)" do app.js,
 * só que como validator reativo do Angular (roda a cada mudança no form).
 */
export function passwordsMatchValidator(
  passwordControl: string,
  confirmControl: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordControl)?.value;
    const confirm = group.get(confirmControl)?.value;

    if (!password || !confirm) {
      return null;
    }

    return password === confirm ? null : { passwordsMismatch: true };
  };
}
