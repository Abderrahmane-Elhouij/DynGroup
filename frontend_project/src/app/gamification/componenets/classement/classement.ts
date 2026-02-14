import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DashboardService, LeaderboardEntryDTO } from '@/gamification/services/dashboard.service';
import { AuthService } from '@/gamification/componenets/auth/auth.service';

@Component({
    selector: 'app-classement',
    standalone: true,
    imports: [CommonModule, TagModule, SkeletonModule, CardModule, AvatarModule],
    templateUrl: 'classement.html',
})
export class Classement implements OnInit {
    leaderboard = signal<LeaderboardEntryDTO[]>([]);
    loading = signal(true);

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.dashboardService.getLeaderboard().subscribe({
            next: (data) => {
                this.leaderboard.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    isCurrentUser(entry: LeaderboardEntryDTO): boolean {
        const user = this.authService.user();
        return !!user && user.nom === entry.nom && user.prenom === entry.prenom;
    }
}
