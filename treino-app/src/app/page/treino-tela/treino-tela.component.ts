import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreinoService } from '../../service/treino.service';
import { DesempenhoService } from '../../service/desempenho.service';
import { FormsModule } from '@angular/forms';
import { ExercicioHistoricoService } from '../../service/exercicio-historico.service';
import { SeriesFeedback } from '../../../Models/SeriesFeedback';
import { AjusteExercicio } from '../../../Models/AjusteExercicio';
import { ExercicioService } from '../../service/exercicio.service';
import { TreinoRegistro } from '../../../Models/TreinoRegistro';



@Component({
  selector: 'app-treino-tela',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './treino-tela.component.html',
  styleUrl: './treino-tela.component.css'
})
export class TreinoTelaComponent implements OnInit, OnDestroy {
  treino: any = {
    nome: '',
    exercicios: []
  };
  currentExercise: any = null;
  remainingExercises: any[] = [];
  completedExercises: any[] = [];
  elapsedTime = 0;
  timerInterval: any;
  currentSeries: number = 1;
  isResting: boolean = false;
  restTimeLeft: number = 60;
  restInterval: any;
  seriesCompleted: boolean = false;
  showFeedbackForm: boolean = false;
  seriesFeedback: SeriesFeedback = {
    repeticoesExecutadas: 0,
    cargaFeedback: 'adequada'
  };
  ajusteSugerido: string = '';
  tempoDescansoExtra: number = 0;
  ajusteTemporario: AjusteExercicio | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private desempenhoService: DesempenhoService,
    private exercicioService: ExercicioService,
    private exercicioHistoricoService: ExercicioHistoricoService,
    private treinoService: TreinoService
  ) {}

  ngOnInit() {
    const treinoId = this.route.snapshot.params['id'];
    this.treinoService.getTreino(treinoId).subscribe({
      next: (treino) => {
        if (treino) {
          this.treino = treino;
          this.remainingExercises = [...(treino.exercicios || [])];
        } else {
          console.error('Treino não encontrado');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar treino:', error);
        this.router.navigate(['/home']);
      }
    });
  }


  ngOnDestroy() {
    this.stopTimer();
    this.stopRestTimer();
  }

  startTimer() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.elapsedTime++;
      }, 1000);
    }
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  stopRestTimer() {
    if (this.restInterval) {
      clearInterval(this.restInterval);
      this.restInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(remainingSeconds)}`;
  }

  padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  selectExercise(exercise: any) {
    if (this.currentExercise) {
      this.completedExercises.push(this.currentExercise);
    } else {
      this.startTimer();
    }
    
    this.currentExercise = exercise;
    this.remainingExercises = this.remainingExercises.filter(ex => ex !== exercise);
    this.seriesCompleted = false;
    this.currentSeries = 1;
    this.isResting = false;
    this.stopRestTimer();
  }

  startRestTimer() {
    this.isResting = true;
    this.restTimeLeft = 60;
    
    this.restInterval = setInterval(() => {
        this.restTimeLeft--;
        if (this.restTimeLeft <= 0) {
            this.finishRest();
        }
    }, 1000);
}

processarFeedback() {
  if (!this.currentExercise || !this.seriesFeedback) return;

  const alteracao: AjusteExercicio = {
    cargaAnterior: this.currentExercise.carga,
    repeticoesAnteriores: this.currentExercise.repeticoes,
    cargaNova: this.currentExercise.carga,
    repeticoesNovas: this.currentExercise.repeticoes,
    motivoAlteracao: ''
  };

  if (this.seriesFeedback.cargaFeedback === 'leve' &&
      this.seriesFeedback.repeticoesExecutadas >= this.currentExercise.repeticoes) {
    alteracao.cargaNova = this.currentExercise.carga + 2.5;
    alteracao.motivoAlteracao = 'Aumento de carga por feedback positivo';
    this.ajusteSugerido = `Sugerimos aumentar a carga para ${alteracao.cargaNova}kg`;
  }
  else if (this.seriesFeedback.cargaFeedback === 'pesada' &&
            this.seriesFeedback.repeticoesExecutadas < this.currentExercise.repeticoes) {
    alteracao.cargaNova = this.currentExercise.carga - 2.5;
    alteracao.motivoAlteracao = 'Redução de carga por feedback negativo';
    this.ajusteSugerido = `Sugerimos diminuir a carga para ${alteracao.cargaNova}kg`;
  }
  else if (this.seriesFeedback.cargaFeedback === 'adequada') {
    if (this.seriesFeedback.repeticoesExecutadas > this.currentExercise.repeticoes + 2) {
      alteracao.repeticoesNovas = this.seriesFeedback.repeticoesExecutadas;
      alteracao.motivoAlteracao = 'Aumento de repetições por superação consistente';
      this.ajusteSugerido = `Sugerimos aumentar para ${alteracao.repeticoesNovas} repetições`;
    }
    else if (this.seriesFeedback.repeticoesExecutadas < this.currentExercise.repeticoes - 2) {
      alteracao.repeticoesNovas = this.seriesFeedback.repeticoesExecutadas;
      alteracao.motivoAlteracao = 'Ajuste de repetições para melhor adequação';
      this.ajusteSugerido = `Sugerimos ajustar para ${alteracao.repeticoesNovas} repetições`;
    }
    else {
      this.ajusteSugerido = 'Execução adequada, mantenha o treino atual';
    }
  }

  if (alteracao.cargaNova !== this.currentExercise.carga ||
      alteracao.repeticoesNovas !== this.currentExercise.repeticoes) {
    this.ajusteTemporario = alteracao;
  }
}


  finishRest() {
    this.stopRestTimer();
    this.isResting = false;
    if (this.currentSeries < this.currentExercise.series) {
        this.currentSeries++;
    }
  }

  completeSeries() {
    if (this.currentSeries < this.currentExercise.series) {
        this.startRestTimer();
        this.showFeedbackForm = true;
    } else {
        this.seriesCompleted = true;
        if (this.remainingExercises.length === 0) {
            this.finishTraining();
        }
    }
  }

  finishTraining() {
    const exerciciosRealizados = this.completedExercises ? this.completedExercises.length : 0;
  
  const treinoData: TreinoRegistro = {
    usuarioId: localStorage.getItem('userId') || '',
    treinoId: this.treino.id,
    tipoTreino: this.treino.nivel,
    duracaoMinutos: Math.floor(this.elapsedTime / 60),
    exerciciosRealizados: exerciciosRealizados
  };

  this.desempenhoService.registrarTreino(treinoData).subscribe({
    next: () => {
      this.router.navigate(['/desempenho']);
    }
  });
}

  aceitarAjuste() {
    if (this.ajusteTemporario && this.currentExercise) {
        // First register the history
        this.exercicioHistoricoService.registrarAlteracao(this.currentExercise.id, this.ajusteTemporario)
            .subscribe({
                next: () => {
                    if (this.ajusteTemporario && this.currentExercise) {
                        // Update the current exercise with new values
                        if (this.ajusteTemporario.cargaNova !== this.currentExercise.carga) {
                            this.currentExercise.carga = this.ajusteTemporario.cargaNova;
                        }
                        if (this.ajusteTemporario.repeticoesNovas !== this.currentExercise.repeticoes) {
                            this.currentExercise.repeticoes = this.ajusteTemporario.repeticoesNovas;
                        }

                        // Update the exercise in the database
                        this.exercicioService.atualizarExercicio(this.currentExercise.id, this.currentExercise)
                            .subscribe({
                                next: () => {
                                    console.log('Exercício atualizado com sucesso');
                                    // Clear states
                                    this.ajusteSugerido = '';
                                    this.ajusteTemporario = null;
                                    this.showFeedbackForm = false;
                                },
                                error: (error) => console.error('Erro ao atualizar exercício:', error)
                            });
                    }
                },
                error: (error) => console.error('Erro ao registrar alteração:', error)
            });
    }
  }

  recusarAjuste() {
    // Limpar estados sem salvar alterações
    this.ajusteSugerido = '';
    this.ajusteTemporario = null;
    this.showFeedbackForm = false;
    
    // Continuar com o treino
    this.startRestTimer();
  }

  voltar() {
    this.stopTimer();
    this.stopRestTimer();
    this.router.navigate(['/treino', this.treino.id]);
}

}
