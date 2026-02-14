import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '@/gamification/componenets/auth/auth.service';
import { DashboardService, DashboardDTO } from '@/gamification/services/dashboard.service';

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule, ProgressBarModule, TagModule, AvatarModule, SkeletonModule, TooltipModule, DividerModule, KnobModule, FormsModule],
    template: `
        @if (loading()) {
            <div class="card"><p-skeleton height="20rem" /></div>
        } @else if (user()) {
            <div class="grid grid-cols-12 gap-8">
                <!-- Carte profil -->
                <div class="col-span-12 lg:col-span-4">
                    <div class="card text-center">
                        <p-avatar icon="pi pi-user" size="xlarge" shape="circle" styleClass="bg-primary/10 text-primary mb-4" [style]="{ width: '6rem', height: '6rem', fontSize: '2.5rem' }"> </p-avatar>

                        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ user()!.prenom }} {{ user()!.nom }}</h2>
                        <p class="text-surface-500 dark:text-surface-400 mb-4">{{ user()!.email }}</p>
                        <p-tag [value]="getRoleLabel(user()!.role)" [severity]="user()!.role === 'ADMIN' ? 'danger' : user()!.role === 'ENSEIGNANT' ? 'warn' : 'info'" />

                        <p-divider />

                        <div class="flex justify-center mb-4">
                            <p-knob [(ngModel)]="xpKnob" [readonly]="true" [size]="120" [max]="100" valueTemplate="{value}%" valueColor="var(--p-primary-color)" />
                        </div>
                        <p class="text-surface-500 dark:text-surface-400 text-sm m-0">Progression vers le niveau {{ (user()!.niveau || 1) + 1 }}</p>

                        <p-divider />

                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-primary">{{ user()!.xpTotal }}</div>
                                <div class="text-surface-500 dark:text-surface-400 text-sm">XP Total</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-teal-500">{{ user()!.niveau }}</div>
                                <div class="text-surface-500 dark:text-surface-400 text-sm">Niveau</div>
                            </div>
                        </div>

                        <p-divider />

                        <p class="text-surface-400 text-sm m-0">
                            <i class="pi pi-calendar mr-1"></i>
                            Membre depuis le {{ formatDate(user()!.dateCreation) }}
                        </p>
                    </div>
                </div>

                <!-- Statistiques & badges -->
                <div class="col-span-12 lg:col-span-8">
                    <!-- Stats -->
                    <div class="card mb-8">
                        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-6 m-0">Statistiques</h3>
                        <div class="grid grid-cols-12 gap-6">
                            <div class="col-span-6 md:col-span-3">
                                <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                    <i class="pi pi-book text-2xl text-primary mb-2 block"></i>
                                    <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ dashboard()?.coursInscrits || 0 }}</div>
                                    <div class="text-surface-500 dark:text-surface-400 text-sm">Cours inscrits</div>
                                </div>
                            </div>
                            <div class="col-span-6 md:col-span-3">
                                <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                    <i class="pi pi-check-circle text-2xl text-green-500 mb-2 block"></i>
                                    <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ dashboard()?.leconsTerminees || 0 }}</div>
                                    <div class="text-surface-500 dark:text-surface-400 text-sm">Lecons terminees</div>
                                </div>
                            </div>
                            <div class="col-span-6 md:col-span-3">
                                <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                    <i class="pi pi-file text-2xl text-cyan-500 mb-2 block"></i>
                                    <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ dashboard()?.leconsTerminees || 0 }}</div>
                                    <div class="text-surface-500 dark:text-surface-400 text-sm">Lecons terminees</div>
                                </div>
                            </div>
                            <div class="col-span-6 md:col-span-3">
                                <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                    <i class="pi pi-trophy text-2xl text-yellow-500 mb-2 block"></i>
                                    <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ dashboard()?.badgesObtenus || 0 }}</div>
                                    <div class="text-surface-500 dark:text-surface-400 text-sm">Badges</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Badges -->
                    <div class="card">
                        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-6 m-0">Mes badges</h3>
                        @if (dashboard()?.derniersBadges?.length) {
                            <div class="grid grid-cols-12 gap-4">
                                @for (badge of dashboard()!.derniersBadges; track badge.id) {
                                    <div class="col-span-6 md:col-span-4">
                                        <div class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl" [pTooltip]="badge.description" tooltipPosition="top">
                                            <div class="flex items-center justify-center bg-primary/10 rounded-full" style="width: 3rem; height: 3rem">
                                                <i class="pi pi-trophy text-primary text-xl"></i>
                                            </div>
                                            <div>
                                                <div class="font-semibold text-surface-900 dark:text-surface-0">{{ badge.nom }}</div>
                                                <div class="text-surface-500 dark:text-surface-400 text-xs">{{ formatDate(badge.dateObtention) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        } @else {
                            <div class="text-center py-8">
                                <i class="pi pi-trophy text-4xl text-surface-300 dark:text-surface-600 mb-4 block"></i>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Completez des lecons pour gagner vos premiers badges !</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
    `
})
export class Profil implements OnInit {
    loading = signal(true);
    dashboard = signal<DashboardDTO | null>(null);
    xpKnob = 0;

    private authService = inject(AuthService);
    private dashboardService = inject(DashboardService);

    user = this.authService.user;

    ngOnInit(): void {
        this.authService.loadProfile();
        this.dashboardService.getDashboard().subscribe({
            next: (data) => {
                this.dashboard.set(data);
                this.xpKnob = (data.xpTotal || 0) % 100;
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getRoleLabel(role: string): string {
        switch (role) {
            case 'ADMIN':
                return 'Administrateur';
            case 'ENSEIGNANT':
                return 'Enseignant';
            case 'ETUDIANT':
                return 'Etudiant';
            default:
                return role;
        }
    }

    formatDate(date: string): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
}
