import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesempenhoService } from '../../service/desempenho.service';




@Component({
  selector: 'app-desempenho',
  standalone: true,
  imports: [CommonModule],
  providers: [DesempenhoService],
  templateUrl: './desempenho.component.html'
})
export class DesempenhoComponent implements OnInit {
  @Input() usuario: any;
  estatisticas: any = {
    treinosCompletos: 0,
    tempoTotalTreino: 0,
    mediaExerciciosPorTreino: 0,
    ultimoTreino: null
  };

  constructor(private desempenhoService: DesempenhoService) {}

  ngOnInit() {
    this.carregarEstatisticas();
  }

  carregarEstatisticas() {
    if (this.usuario?.id) {
      this.desempenhoService.obterEstatisticas(this.usuario.id)
        .subscribe({
          next: (dados) => {
            this.estatisticas = dados;
          }
        });
    }
  }
}