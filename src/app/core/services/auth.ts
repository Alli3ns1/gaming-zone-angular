import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

export type RegisterResult = { ok: true } | { ok: false; message: string };
export type LoginResult = { ok: true; user: User } | { ok: false; message: string };

const SESSION_KEY = 'gamingZoneSession';

/**
 * Gerencia autenticação, estado de sessão e permissões (Admin vs Cliente).
 * - Usuários são persistidos em localStorage.
 * - Usuário administrador padrão pré-cadastrado: "Administrador" / "admin123".
 * - O usuário logado fica em sessionStorage.
 * - `currentUser`, `isLoggedIn` e `isAdmin` são signals reativos usados por guards e layout.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'gamingZoneUsers';

  // ── Sessão ────────────────────────────────────────────────────────────────
  private readonly _currentUser = signal<User | null>(this.loadSession());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => {
    const user = this._currentUser();
    if (!user) return false;
    return user.role === 'admin' || user.name.toLowerCase() === 'administrador';
  });

  constructor() {
    this.ensureDefaultAdmin();
  }

  private loadSession(): User | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private saveSession(user: User): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this._currentUser.set(null);
  }

  // ── Usuários (localStorage) ───────────────────────────────────────────────
  private ensureDefaultAdmin(): void {
    const users = this.getUsers();
    const adminExists = users.some(
      (u) => this.normalize(u.name) === 'administrador' || u.role === 'admin'
    );

    if (!adminExists) {
      users.push({
        name: 'Administrador',
        password: 'admin123',
        role: 'admin',
      });
      this.saveUsers(users);
    }
  }

  getUsers(): User[] {
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

  getClientUsers(): User[] {
    return this.getUsers().filter(
      (u) => u.role !== 'admin' && this.normalize(u.name) !== 'administrador'
    );
  }

  deleteUser(name: string): void {
    const normalized = this.normalize(name);
    const users = this.getUsers().filter(
      (u) => this.normalize(u.name) !== normalized
    );
    this.saveUsers(users);
  }

  normalize(value: string): string {
    return String(value || '').trim().toLowerCase();
  }

  findUser(identifier: string): User | undefined {
    const normalized = this.normalize(identifier);
    if (!normalized) return undefined;

    return this.getUsers().find((user) => this.normalize(user.name) === normalized);
  }

  register(user: User): RegisterResult {
    const name = (user.name || '').trim();

    if (!name) {
      return { ok: false, message: 'Informe o nome de usuário.' };
    }

    if (this.findUser(name)) {
      return { ok: false, message: 'Usuário já possui cadastro.' };
    }

    const users = this.getUsers();
    users.push({
      ...user,
      name,
      role: 'client', // Usuários cadastrados no site são clientes por padrão
    });
    this.saveUsers(users);

    return { ok: true };
  }

  login(identifier: string, password: string): LoginResult {
    const user = this.findUser(identifier);

    if (!user) {
      return { ok: false, message: 'Usuário não encontrado. Cadastre-se para acessar.' };
    }

    if (user.password !== password) {
      return { ok: false, message: 'Senha incorreta.' };
    }

    this.saveSession(user);
    this._currentUser.set(user);
    return { ok: true, user };
  }
}
