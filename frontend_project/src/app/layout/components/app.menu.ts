import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li
                app-menuitem
                *ngIf="!item.separator"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `,
})
export class AppMenu {
    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Navigation',
                icon: 'pi pi-compass',
                items: [
                    {
                        label: 'Tableau de bord',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                    {
                        label: 'Catalogue des cours',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/cours'],
                    },
                    {
                        label: 'Classement',
                        icon: 'pi pi-fw pi-trophy',
                        routerLink: ['/classement'],
                    },
                ],
            },
            {
                label: 'Mon espace',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Mon profil',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/profil'],
                    },
                ],
            },
        ];
    }
}
