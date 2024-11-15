export interface DesempenhoData {
    frequenciaTotal: number;
    mediaTreinos: number;
    treinosSemanais: number[];
    treinosMensais: number[];
    treinoMaisFrequente: string;
    ultimoTreino?: Date;
}