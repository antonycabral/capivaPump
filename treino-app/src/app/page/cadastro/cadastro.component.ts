import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AuthService],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  usuario = {
    nome: '',
    email: '',
    password: '',
    peso: null,
    idade: null,
    altura: null
  };

  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.usuario.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    
    // Convert string inputs to numbers
    const dadosUsuario = {
      ...this.usuario,
      peso: Number(this.usuario.peso),
      idade: Number(this.usuario.idade),
      altura: Number(this.usuario.altura)
    };

    this.passwordMismatch = false;
    this.authService.cadastrar(dadosUsuario).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro no cadastro:', error);
      }
    });
  }
}