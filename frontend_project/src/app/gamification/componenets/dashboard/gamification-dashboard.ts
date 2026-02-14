import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardService, DashboardDTO, BadgeDTO, CoursRecentDTO } from '@/gamification/services/dashboard.service';

@Component({
    selector: 'app-gamification-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, ProgressBarModule, BadgeModule, TagModule, SkeletonModule, KnobModule, TooltipModule],
    templateUrl: './gamification-dashboard.html'
})
export class GamificationDashboard implements OnInit {
    dashboard = signal<DashboardDTO | null>(null);
    loading = signal(true);

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.dashboardService.getDashboard().subscribe({
            next: (data) => {
                this.dashboard.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    xpProgress(): number {
        return this.dashboard()?.progressionNiveau || 0;
    }

    xpInLevel(): number {
        const xpTotal = this.dashboard()?.xpTotal || 0;
        return xpTotal % 100;
    }

    getDifficultyColor(difficulte: string): 'success' | 'warn' | 'danger' {
        switch (difficulte) {
            case 'DEBUTANT':
                return 'success';
            case 'INTERMEDIAIRE':
                return 'warn';
            case 'AVANCE':
                return 'danger';
            default:
                return 'success';
        }
    }
}
