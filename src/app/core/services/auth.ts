import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

export type RegisterResult = { ok: true } | { ok: false; message: string };
export type LoginResult = { ok: true; user: User } | { ok: false; message: string };

/**
 * Migração direta das funções getUsers/saveUsers/findUser/normalizeEmail
 * do js/app.js. A regra de negócio é a mesma; só trocou o "onde mora o código".
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'gamingZoneUsers';

  private getUsers(): User[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as User[]) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  normalizeEmail(email: string): string {
    return String(email || '').trim().toLowerCase();
  }

  findUser(email: string): User | undefined {
    const normalized = this.normalizeEmail(email);
    return this.getUsers().find((user) => user.email === normalized);
  }

  register(user: User): RegisterResult {
    const email = this.normalizeEmail(user.email);

    if (this.findUser(email)) {
      return { ok: false, message: 'Usuário já possui cadastro.' };
    }

    const users = this.getUsers();
    users.push({ ...user, email });
    this.saveUsers(users);

    return { ok: true };
  }

  login(email: string, password: string): LoginResult {
    const user = this.findUser(email);

    if (!user) {
      return { ok: false, message: 'Usuário não encontrado. Cadastre-se para acessar.' };
    }

    if (user.password !== password) {
      return { ok: false, message: 'Senha incorreta.' };
    }

    return { ok: true, user };
  }
}
