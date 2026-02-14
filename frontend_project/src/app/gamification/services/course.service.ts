import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseDTO {
    id: number;
    titre: string;
    description: string;
    imageUrl: string | null;
    dureeEstimee: number;
    difficulte: string;
    nombreChapitres: number;
    nombreLecons: number;
    inscrit: boolean;
    progression: number;
}

export interface ChapterDTO {
    id: number;
    titre: string;
    ordre: number;
    lecons: LessonSummaryDTO[];
}

export interface LessonSummaryDTO {
    id: number;
    titre: string;
    typeContenu: string;
    xpReward: number;
    ordre: number;
    statut: string | null;
    dureeEstimee: string | null;
    aQuiz: boolean;
    quizId: number | null;
}

export interface CourseDetailDTO {
    id: number;
    titre: string;
    description: string;
    imageUrl: string | null;
    dureeEstimee: number;
    difficulte: string;
    actif: boolean;
    chapitres: ChapterDTO[];
    inscrit: boolean;
    progression: number;
}

export interface LessonDTO {
    id: number;
    titre: string;
    contenu: string;
    typeContenu: string;
    dureeEstimee: string | null;
    xpReward: number;
    ordre: number;
    statut: string | null;
    chapterId: number;
    chapterTitre: string;
    courseId: number;
    courseTitre: string;
    quizzes: QuizSummaryDTO[];
    previousLessonId?: number | null;
    nextLessonId?: number | null;
}

export interface QuizSummaryDTO {
    id: number;
    titre: string;
    description: string;
    xpReward: number;
    nombreQuestions: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
    private readonly API_URL = '/api/courses';

    constructor(private http: HttpClient) {}

    getAll(): Observable<CourseDTO[]> {
        return this.http.get<CourseDTO[]>(this.API_URL);
    }

    getDetail(id: number): Observable<CourseDetailDTO> {
        return this.http.get<CourseDetailDTO>(`${this.API_URL}/${id}`);
    }

    enroll(id: number): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/${id}/enroll`, {});
    }
}
