import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BadgeDTO {
    id: number;
    nom: string;
    description: string;
    icone: string;
    dateObtention: string;
}

export interface DashboardDTO {
    xpTotal: number;
    niveau: number;
    xpPourProchainNiveau: number;
    progressionNiveau: number;
    leconsTerminees: number;
    coursInscrits: number;
    badgesObtenus: number;
    coursRecents: CoursRecentDTO[];
    derniersBadges: BadgeDTO[];
}

export interface CoursRecentDTO {
    id: number;
    titre: string;
    progression: number;
    difficulte: string;
}

export interface LeaderboardEntryDTO {
    rang: number;
    nom: string;
    prenom: string;
    avatarUrl: string | null;
    xpTotal: number;
    niveau: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(private http: HttpClient) {}

    getDashboard(): Observable<DashboardDTO> {
        return this.http.get<DashboardDTO>('/api/dashboard');
    }

    getLeaderboard(): Observable<LeaderboardEntryDTO[]> {
        return this.http.get<LeaderboardEntryDTO[]>('/api/leaderboard');
    }
}
