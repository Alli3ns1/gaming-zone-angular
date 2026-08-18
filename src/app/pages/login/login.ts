import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ClienteService } from '../../core/services/cliente';
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
  private readonly clienteService = inject(ClienteService);
  private readonly router = inject(Router);

  readonly activeTab = signal<AuthTab>('login');

  readonly loginFeedback = signal('');
  readonly loginError = signal(false);

  readonly registerFeedback = signal('');
  readonly registerError = signal(false);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  readonly registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
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
      this.loginFeedback.set('Informe o usuário e senha com no mínimo 6 caracteres.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    const result = this.auth.login(username ?? '', password ?? '');

    if (!result.ok) {
      this.loginError.set(true);
      this.loginFeedback.set(result.message);
      return;
    }

    // Login bem-sucedido: mostra mensagem brevemente e redireciona de acordo com o papel
    this.loginError.set(false);
    this.loginFeedback.set(`Bem-vindo(a), ${result.user.name}! Redirecionando...`);
    this.loginForm.reset({ remember: false });

    const destination =
      result.user.role === 'admin' || result.user.name.toLowerCase() === 'administrador'
        ? '/painel-principal'
        : '/';

    setTimeout(() => {
      this.router.navigate([destination]);
    }, 700);
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerError.set(true);

      const mismatch = this.registerForm.errors?.['passwordsMismatch'];
      this.registerFeedback.set(
        mismatch ? 'As senhas precisam ser iguais.' : 'Preencha o nome (mínimo 3 letras) e a senha (mínimo 6 caracteres).'
      );
      return;
    }

    const { name, password } = this.registerForm.getRawValue();
    const registeredName = (name ?? '').trim();

    const result = this.auth.register({
      name: registeredName,
      password: password ?? '',
    });

    if (!result.ok) {
      this.registerError.set(true);
      this.registerFeedback.set(result.message);
      return;
    }

    // Sincroniza o novo cadastro diretamente com a API de clientes para aparecer no painel do administrador
    const dataCadastro = new Date().toLocaleDateString('pt-BR');
    this.clienteService
      .adicionarCliente({
        nome: registeredName,
        dataCadastro,
      })
      .subscribe({
        next: () => this.clienteService.carregarClientes(),
        error: () => console.warn('Não foi possível sincronizar o cliente com a API local.'),
      });

    this.registerError.set(false);
    this.registerFeedback.set('Cadastro realizado com sucesso.');

    this.registerForm.reset();

    // Após cadastrar, volta para a aba de login com o usuário preenchido.
    setTimeout(() => {
      this.loginForm.patchValue({ username: registeredName });
      this.switchTab('login');
      this.loginError.set(false);
      this.loginFeedback.set('Cadastro realizado com sucesso. Entre com sua senha.');
    }, 700);
  }
}
