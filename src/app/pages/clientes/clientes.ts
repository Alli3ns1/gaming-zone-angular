import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, Header, Footer],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  private readonly clienteService = inject(ClienteService);

  readonly clientes = this.clienteService.clientes;
  readonly carregando = this.clienteService.carregando;
  readonly erroApi = this.clienteService.erroApi;

  readonly mensagem = signal<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);
  readonly confirmandoExclusao = signal<number | null>(null);

  // Modal / Formulário de inclusão/edição
  readonly modalAberto = signal(false);
  readonly modoEdicao = signal(false);

  clienteForm: Partial<Cliente> = {
    nome: '',
    dataCadastro: '',
  };

  abrirModalNovo(): void {
    const hoje = new Date().toLocaleDateString('pt-BR');
    this.clienteForm = {
      nome: '',
      dataCadastro: hoje,
    };
    this.modoEdicao.set(false);
    this.modalAberto.set(true);
  }

  abrirModalEditar(cliente: Cliente): void {
    this.clienteForm = { ...cliente };
    this.modoEdicao.set(true);
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
  }

  salvarCliente(): void {
    if (!this.clienteForm.nome?.trim()) {
      return;
    }

    if (!this.clienteForm.dataCadastro) {
      this.clienteForm.dataCadastro = new Date().toLocaleDateString('pt-BR');
    }

    if (this.modoEdicao() && this.clienteForm.id) {
      this.clienteService.atualizarCliente(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => {
          this.mensagem.set({ texto: 'Cliente atualizado com sucesso!', tipo: 'sucesso' });
          this.clienteService.carregarClientes();
          this.fecharModal();
          setTimeout(() => this.mensagem.set(null), 3000);
        },
        error: () => {
          this.mensagem.set({ texto: 'Erro ao atualizar cliente.', tipo: 'erro' });
          setTimeout(() => this.mensagem.set(null), 3000);
        },
      });
    } else {
      this.clienteService.adicionarCliente(this.clienteForm).subscribe({
        next: () => {
          this.mensagem.set({ texto: 'Cliente cadastrado com sucesso!', tipo: 'sucesso' });
          this.clienteService.carregarClientes();
          this.fecharModal();
          setTimeout(() => this.mensagem.set(null), 3000);
        },
        error: () => {
          this.mensagem.set({ texto: 'Erro ao cadastrar cliente.', tipo: 'erro' });
          setTimeout(() => this.mensagem.set(null), 3000);
        },
      });
    }
  }

  pedirConfirmacao(id: number): void {
    this.confirmandoExclusao.set(id);
  }

  cancelarExclusao(): void {
    this.confirmandoExclusao.set(null);
  }

  confirmarExclusao(): void {
    const id = this.confirmandoExclusao();
    if (id === null) return;

    const cliente = this.clientes().find((c) => c.id === id);
    this.confirmandoExclusao.set(null);

    this.clienteService.deletarCliente(id, cliente?.nome).subscribe({
      next: () => {
        this.mensagem.set({ texto: 'Cliente excluído com sucesso!', tipo: 'sucesso' });
        this.clienteService.carregarClientes();
        setTimeout(() => this.mensagem.set(null), 3000);
      },
      error: () => {
        this.mensagem.set({ texto: 'Erro ao excluir cliente. Tente novamente.', tipo: 'erro' });
        setTimeout(() => this.mensagem.set(null), 3000);
      },
    });
  }
}
