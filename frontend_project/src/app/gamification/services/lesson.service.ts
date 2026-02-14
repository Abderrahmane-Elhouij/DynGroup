import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LessonDTO } from './course.service';

@Injectable({ providedIn: 'root' })
export class LessonService {
    private readonly API_URL = '/api/lessons';

    constructor(private http: HttpClient) {}

    getLesson(id: number): Observable<LessonDTO> {
        return this.http.get<LessonDTO>(`${this.API_URL}/${id}`);
    }

    completeLesson(id: number): Observable<any> {
        return this.http.post(`${this.API_URL}/${id}/complete`, {});
    }
}
