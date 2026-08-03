import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  readonly feedback = signal('');
  readonly hasError = signal(false);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasError.set(true);
      this.feedback.set('Preencha todos os campos obrigatórios.');
      return;
    }

    // Aqui entraria a chamada HTTP real (ex.: this.http.post('/api/contato', this.form.value)).
    // Como o projeto original também só simulava o envio, mantemos a mesma simulação.
    this.hasError.set(false);
    this.feedback.set('Mensagem enviada com sucesso.');
    this.form.reset();
  }
}
