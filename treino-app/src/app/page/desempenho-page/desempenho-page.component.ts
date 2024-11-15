import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { DesempenhoComponent } from '../../components/desempenho/desempenho.component';

@Component({
  selector: 'app-desempenho-page',
  standalone: true,
  imports: [CommonModule, DesempenhoComponent],
  templateUrl: './desempenho-page.component.html',
  styleUrl: './desempenho-page.component.css'
})
export class DesempenhoPageComponent implements OnInit {
usuario: any = {};

constructor(
  private userService: UserService,
  private router: Router
){}

ngOnInit(){
    const userId = localStorage.getItem('userId');
    if(userId){
      this.userService.getUserById(userId).subscribe({
        next: (data) => {
          this.usuario = data;
        }
      });
    }
}

voltar(){
  this.router.navigate(['/home']);
}
}
