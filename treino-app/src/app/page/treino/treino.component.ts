import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreinoService } from '../../service/treino.service';
import { ExercicioService } from '../../service/exercicio.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExercicioHistoricoService } from '../../service/exercicio-historico.service';
import { ExercicioProgressoComponent } from "../../components/exercicio-progresso/exercicio-progresso.component";

interface Exercicio {
  id: string;
  nome: string;
  descricao: string;
  series: number;
  repeticoes: number;
  carga: number;
}

@Component({
  selector: 'app-treino',
  standalone: true,
  imports: [CommonModule, ExercicioProgressoComponent,FormsModule],
  templateUrl: './treino.component.html',
  styleUrl: './treino.component.css'
})
export class TreinoComponent implements OnInit {
  treino: any = {
    exercicios: []
  };
  exercicioForm: FormGroup;
  modal: any;
  historicoExercicio: { [key: string]: any[] } = {};
  mostrarDesempenho: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private treinoService: TreinoService,
    private exercicioService: ExercicioService,
    private exercicioHistoricoService: ExercicioHistoricoService,
    private router: Router
  ) {this.exercicioForm = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    series: ['', Validators.required],
    repeticoes: ['', Validators.required],
    carga: ['', Validators.required]
  });}

  ngOnInit() {
    const treinoId = this.route.snapshot.params['id'];
    if (treinoId) {
      this.carregarTreino(treinoId);
    }
  }

  carregarTreino(id: string) {
    this.treinoService.getTreino(id).subscribe({
      next: (data) => {
        this.treino = data;
        this.exercicioForm.patchValue({ treinoId: id });
      }
    });
  }

  adicionarExercicio() {
    this.router.navigate(['/exercicio/novo'], { queryParams: { treinoId: this.treino.id } });
}

  removerExercicio(exercicioId: string) {
    this.exercicioService.deletarExercicio(exercicioId).subscribe({
        next: () => {
            this.treino.exercicios = this.treino.exercicios.filter((ex: Exercicio) => ex.id !== exercicioId);
        },
        error: (error) => {
            console.error('Erro ao deletar exercício:', error);
        }
    });
  }

  iniciarTreino() {
    this.router.navigate(['/treino-tela', this.treino.id]);
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  mostrarHistorico(exercicioId: string) {
    this.exercicioHistoricoService.getHistorico(exercicioId).subscribe({
      next: (historico) => {
        this.historicoExercicio[exercicioId] = historico;
      },
      error: (error) => {
        console.error('Erro ao carregar histórico:', error);
      }
    });
  }
}
