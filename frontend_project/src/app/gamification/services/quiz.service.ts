import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionDTO {
    id: number;
    question: string;
    typeQuestion: string;
    ordre: number;
    options: OptionDTO[];
}

export interface OptionDTO {
    id: number;
    libelle: string;
    ordre: number;
}

export interface QuizDTO {
    id: number;
    titre: string;
    description: string;
    xpReward: number;
    questions: QuestionDTO[];
}

export interface QuizSubmission {
    reponses: { [questionId: number]: number };
}

export interface QuizResultDTO {
    score: number;
    totalQuestions: number;
    xpGagne: number;
    dejaRepondu: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
    private readonly API_URL = '/api/quizzes';

    constructor(private http: HttpClient) {}

    getQuiz(id: number): Observable<QuizDTO> {
        return this.http.get<QuizDTO>(`${this.API_URL}/${id}`);
    }

    submitQuiz(id: number, submission: QuizSubmission): Observable<QuizResultDTO> {
        return this.http.post<QuizResultDTO>(`${this.API_URL}/${id}/submit`, submission);
    }
}
