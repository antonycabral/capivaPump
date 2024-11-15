import { Treino } from "./Treino";

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    peso: number;
    altura: number;
    idade: number;
    treinos?: Treino[];
}
