import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { RouterModule } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { AuthService } from '@/gamification/componenets/auth/auth.service';

@Component({
    selector: '[app-profilesidebar]',
    imports: [
        ButtonModule,
        DrawerModule,
        BadgeModule,
        ProgressBarModule,
        RouterModule,
    ],
    template: `
        <p-drawer
            [visible]="visible()"
            (onHide)="onDrawerHide()"
            position="right"
            [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'"
            styleClass="layout-profile-sidebar w-full sm:w-25rem"
        >
            <div class="flex flex-col mx-auto md:mx-0">
                <span class="mb-2 font-semibold">Bienvenue</span>
                <span class="text-surface-500 dark:text-surface-400 font-medium mb-4">
                    {{ user()?.prenom }} {{ user()?.nom }}
                </span>

                <div class="flex items-center gap-4 mb-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <div class="flex-1">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-surface-500 dark:text-surface-400">Niveau {{ user()?.niveau || 1 }}</span>
                            <span class="font-semibold text-primary">{{ user()?.xpTotal || 0 }} XP</span>
                        </div>
                        <p-progressBar [value]="xpProgress()" [showValue]="false" styleClass="h-2" />
                    </div>
                </div>

                <ul class="list-none m-0 p-0">
                    <li>
                        <a routerLink="/profil" (click)="onDrawerHide()"
                            class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span><i class="pi pi-user text-xl text-primary"></i></span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Mon profil</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Voir mes statistiques</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a routerLink="/classement" (click)="onDrawerHide()"
                            class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span><i class="pi pi-trophy text-xl text-primary"></i></span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Classement</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Voir le classement</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a routerLink="/cours" (click)="onDrawerHide()"
                            class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span><i class="pi pi-book text-xl text-primary"></i></span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Mes cours</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Continuer l'apprentissage</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a (click)="logout()"
                            class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span><i class="pi pi-power-off text-xl text-primary"></i></span>
                            <div class="ml-4">
                                <span class="mb-2 font-semibold">Se deconnecter</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Fermer la session</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </p-drawer>
    `,
})
export class AppProfileSidebar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    user = this.authService.user;

    visible = computed(
        () => this.layoutService.layoutState().profileSidebarVisible,
    );

    xpProgress(): number {
        return (this.user()?.xpTotal || 0) % 100;
    }

    onDrawerHide() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: false,
        }));
    }

    logout(): void {
        this.onDrawerHide();
        this.authService.logout();
    }
}
