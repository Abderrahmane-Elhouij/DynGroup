import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { CourseService, CourseDetailDTO, LessonSummaryDTO } from '@/gamification/services/course.service';

@Component({
    selector: 'app-cours-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ProgressBarModule, AccordionModule, BadgeModule, SkeletonModule, MessageModule],
    templateUrl: 'cours-detail.html'
})
export class CoursDetail implements OnInit {
    course = signal<CourseDetailDTO | null>(null);
    loading = signal(true);
    enrolling = signal(false);
    enrollMessage = signal<string | null>(null);

    constructor(
        private courseService: CourseService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.courseService.getDetail(id).subscribe({
            next: (data) => {
                this.course.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    totalLecons(): number {
        return this.course()?.chapitres.reduce((sum, ch) => sum + ch.lecons.length, 0) || 0;
    }

    enroll(): void {
        this.enrolling.set(true);
        this.courseService.enroll(this.course()!.id).subscribe({
            next: () => {
                this.enrollMessage.set('Inscription reussie ! Vous pouvez maintenant acceder aux lecons.');
                const updated = { ...this.course()!, inscrit: true };
                this.course.set(updated);
                this.enrolling.set(false);
            },
            error: () => this.enrolling.set(false)
        });
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

    getTypeLabel(type: string): string {
        switch (type) {
            case 'TEXTE':
                return 'Texte';
            case 'VIDEO':
                return 'Video';
            case 'PDF':
                return 'PDF';
            default:
                return type;
        }
    }

    hasQuizzes(): boolean {
        return this.course()?.chapitres.some(ch => ch.lecons.some(l => l.aQuiz)) || false;
    }

    getQuizLessons(): LessonSummaryDTO[] {
        if (!this.course()) return [];
        return this.course()!.chapitres.flatMap(ch => ch.lecons.filter(l => l.aQuiz));
    }
}
