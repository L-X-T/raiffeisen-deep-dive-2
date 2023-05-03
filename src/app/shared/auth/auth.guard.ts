import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userName) {
    return true;
  }

  // Redirect to the login page
  return router.navigate(['/home', { needsLogin: true }]);
};
