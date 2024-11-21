import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inte-butao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inte-butao.component.html',
  styleUrl: './inte-butao.component.css'
})
export class InteButaoComponent {
  @Input() cargaAtual!: number;
  @Output() cargaAlterada = new EventEmitter<number>();
  
  isEditing = false;
  novaCarga!: number;

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.novaCarga = this.cargaAtual;
    }
  }

  salvarAjuste() {
    if (this.novaCarga !== undefined) {
      this.cargaAlterada.emit(this.novaCarga);
      this.isEditing = false;
    }
  }

  cancelarEdicao() {
    this.isEditing = false;
  }
}
