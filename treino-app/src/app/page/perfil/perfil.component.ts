import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UserService],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario: any = {};
  modoEdicao = false;
  novaSenha = '';
  confirmarSenha = '';
  mostrarAlteracaoSenha = false;
  senhasNaoCoincidem = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data) => {
          this.usuario = data;
        },
        error: (error) => {
          console.error('Erro ao carregar usuário:', error);
        }
      });
    }
  }

  toggleAlteracaoSenha() {
    this.mostrarAlteracaoSenha = !this.mostrarAlteracaoSenha;
    if (!this.mostrarAlteracaoSenha) {
      this.novaSenha = '';
    }
  }

  toggleEdicao() {
    this.modoEdicao = !this.modoEdicao;
  }

  validarSenhas(): boolean {
    if (this.novaSenha && this.confirmarSenha) {
      this.senhasNaoCoincidem = this.novaSenha !== this.confirmarSenha;
      return !this.senhasNaoCoincidem;
    }
    return true;
  }

  salvarAlteracoes() {
    if (!this.validarSenhas()) {
      return;
    }

    const dadosAtualizados = {
      ...this.usuario,
      password: this.novaSenha || undefined
    };

    this.userService.atualizarUsuario(this.usuario.id, dadosAtualizados).subscribe({
      next: () => {
        this.modoEdicao = false;
        this.mostrarAlteracaoSenha = false;
        this.novaSenha = '';
        this.confirmarSenha = '';
        this.senhasNaoCoincidem = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
      }
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}