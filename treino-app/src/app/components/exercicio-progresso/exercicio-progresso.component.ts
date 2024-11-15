import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ExercicioHistoricoService } from '../../service/exercicio-historico.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-exercicio-progresso',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-chart">
      <canvas #chartCanvas></canvas>
    </div>
  `
})
export class ExercicioProgressoComponent implements OnInit, AfterViewInit {
  @Input() exercicioId!: string;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  constructor(private exercicioHistoricoService: ExercicioHistoricoService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    // Initialize any required data
  }
  
  ngAfterViewInit() {
    this.loadProgressData();
  }
  
  private loadProgressData() {
    this.exercicioHistoricoService.getHistorico(this.exercicioId).subscribe({
      next: (historico) => {
        this.renderChart(historico);
      },
      error: (error) => {
        console.error('Erro ao carregar histórico:', error);
      }
    });
  }
  
  private renderChart(historico: any[]) {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: historico.map(h => new Date(h.dataAlteracao).toLocaleDateString()),
        datasets: [
          {
            label: 'Carga (kg)',
            data: historico.map(h => h.cargaNova),
            borderColor: '#007bff',
            tension: 0.1
          },
          {
            label: 'Repetições',
            data: historico.map(h => h.repeticoesNovas),
            borderColor: '#28a745',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}