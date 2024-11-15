import { Exercicio } from "./Exercicio";
import { Usuario } from "./Usuario";

export interface Treino {
    id: string;
    nome: string;
    descricao: string;
    nivel: string;
    exercicios: Exercicio[];
    usuario: Usuario;
}
