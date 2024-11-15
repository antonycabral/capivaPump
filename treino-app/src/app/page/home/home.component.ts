import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TreinoService } from '../../service/treino.service';
import { DesempenhoComponent } from "../../components/desempenho/desempenho.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, DesempenhoComponent],
  providers: [UserService,AuthService,TreinoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  usuario: any = {
    treinos: []
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private treinoService: TreinoService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        this.userService.getUserById(userId).subscribe({
            next: (data) => {
                this.usuario = data;
                this.carregarTreinos(); // Remove userId parameter
            }
        });
    }
}

  calcularIMC(): number {
    const altura = this.usuario.altura / 100; // convertendo cm para metros
    return this.usuario.peso / (altura * altura);
}

getClassificacaoIMC(): string {
    const imc = this.calcularIMC();
    
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 24.9) return 'Peso normal';
    if (imc < 29.9) return 'Sobrepeso';
    if (imc < 34.9) return 'Obesidade Grau I';
    if (imc < 39.9) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
}

  carregarTreinos() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        this.treinoService.listarTreinosPorUsuario(userId)
            .subscribe({
                next: (treinos) => {
                    console.log('Treinos carregados:', treinos);
                    this.usuario.treinos = treinos;
                },
                error: (error) => {
                    console.error('Erro ao carregar treinos:', error);
                }
            });
    }
  }


removerTreino(userId: string) {
  this.treinoService.deletarTreino(userId)
    .subscribe(() => {
      this.carregarTreinos();
    });
}

adicionarTreino() {
  this.router.navigate(['treino/novo']);
}

editarTreino(treino: any) {
  this.router.navigate(['treino/editar', treino.id]);
}

selecionarTreino(treinoId: string) {
  this.router.navigate(['/treino', treinoId]);
}

  navegarParaPerfil() {
    this.router.navigate(['/perfil']);
  }
}
