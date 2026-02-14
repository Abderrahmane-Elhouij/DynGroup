import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CourseService, CourseDTO } from '@/gamification/services/course.service';

@Component({
    selector: 'app-cours-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, CardModule, ButtonModule, TagModule, ProgressBarModule, InputTextModule, SelectModule, SkeletonModule, IconFieldModule, InputIconModule],
    templateUrl: 'cours-list.html'
})
export class CoursList implements OnInit {
    courses = signal<CourseDTO[]>([]);
    filteredCourses = signal<CourseDTO[]>([]);
    loading = signal(true);
    searchTerm = '';
    selectedDifficulty: string | null = null;

    difficultyOptions = [
        { label: 'Debutant', value: 'DEBUTANT' },
        { label: 'Intermediaire', value: 'INTERMEDIAIRE' },
        { label: 'Avance', value: 'AVANCE' }
    ];

    constructor(private courseService: CourseService) {}

    ngOnInit(): void {
        this.courseService.getAll().subscribe({
            next: (data) => {
                this.courses.set(data);
                this.filteredCourses.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    filterCourses(): void {
        let result = this.courses();
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter((c) => c.titre.toLowerCase().includes(term) || c.description.toLowerCase().includes(term));
        }
        if (this.selectedDifficulty) {
            result = result.filter((c) => c.difficulte === this.selectedDifficulty);
        }
        this.filteredCourses.set(result);
    }

    getDifficultyColor(d: string): 'success' | 'warn' | 'danger' {
        switch (d) {
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

    getDifficultyLabel(d: string): string {
        switch (d) {
            case 'DEBUTANT':
                return 'Debutant';
            case 'INTERMEDIAIRE':
                return 'Intermediaire';
            case 'AVANCE':
                return 'Avance';
            default:
                return d;
        }
    }
}
