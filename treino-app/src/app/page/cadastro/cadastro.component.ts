import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule],
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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.cadastrar(this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro no cadastro:', error);
      }
    });
  }
}