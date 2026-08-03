import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { passwordsMatchValidator } from '../../core/validators/password-match.validator';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly activeTab = signal<AuthTab>('login');

  readonly loginFeedback = signal('');
  readonly loginError = signal(false);

  readonly registerFeedback = signal('');
  readonly registerError = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  readonly registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordsMatchValidator('password', 'passwordConfirm') }
  );

  switchTab(tab: AuthTab): void {
    this.activeTab.set(tab);
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError.set(true);
      this.loginFeedback.set('Informe e-mail válido e senha com no mínimo 6 caracteres.');
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    const result = this.auth.login(email ?? '', password ?? '');

    if (!result.ok) {
      this.loginError.set(true);
      this.loginFeedback.set(result.message);
      return;
    }

    this.loginError.set(false);
    this.loginFeedback.set(`Login realizado com sucesso. Bem-vindo(a), ${result.user.name}.`);
    this.loginForm.reset({ remember: false });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerError.set(true);

      const mismatch = this.registerForm.errors?.['passwordsMismatch'];
      this.registerFeedback.set(
        mismatch ? 'As senhas precisam ser iguais.' : 'Preencha todos os campos do cadastro.'
      );
      return;
    }

    const { name, email, phone, password } = this.registerForm.getRawValue();
    const result = this.auth.register({
      name: (name ?? '').trim(),
      email: email ?? '',
      phone: (phone ?? '').trim(),
      password: password ?? '',
    });

    if (!result.ok) {
      this.registerError.set(true);
      this.registerFeedback.set(result.message);
      return;
    }

    this.registerError.set(false);
    this.registerFeedback.set('Cadastro realizado com sucesso.');

    const registeredEmail = this.auth.normalizeEmail(email ?? '');
    this.registerForm.reset();

    // Mesmo comportamento do app.js original: após cadastrar, volta para a
    // aba de login já com o e-mail preenchido.
    setTimeout(() => {
      this.loginForm.patchValue({ email: registeredEmail });
      this.switchTab('login');
      this.loginError.set(false);
      this.loginFeedback.set('Cadastro realizado com sucesso. Entre com sua senha.');
    }, 700);
  }
}
