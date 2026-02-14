import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { LessonService } from '@/gamification/services/lesson.service';
import { LessonDTO } from '@/gamification/services/course.service';
import { AuthService } from '@/gamification/componenets/auth/auth.service';

@Component({
    selector: 'app-lecon-view',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, MessageModule, SkeletonModule, DividerModule],
    templateUrl: 'lecon-view.html',
})
export class LeconView implements OnInit {
    lesson = signal<LessonDTO | null>(null);
    loading = signal(true);
    completing = signal(false);
    completionMessage = signal<string | null>(null);

    constructor(
        private lessonService: LessonService,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            this.loading.set(true);
            this.completionMessage.set(null);
            this.lessonService.getLesson(id).subscribe({
                next: data => { this.lesson.set(data); this.loading.set(false); },
                error: () => this.loading.set(false)
            });
        });
    }

    formattedContent(): string {
        const contenu = this.lesson()?.contenu || '';
        return contenu.replace(/\n/g, '<br>');
    }

    complete(): void {
        this.completing.set(true);
        this.lessonService.completeLesson(this.lesson()!.id).subscribe({
            next: (result: any) => {
                const updated = { ...this.lesson()!, statut: 'TERMINE' };
                this.lesson.set(updated);
                this.completing.set(false);
                const xp = result?.xpGagne || this.lesson()!.xpReward;
                this.completionMessage.set(`Lecon terminee ! Vous avez gagne ${xp} XP.`);
                this.authService.loadProfile();
            },
            error: () => this.completing.set(false)
        });
    }

    getTypeLabel(type: string): string {
        switch (type) { case 'TEXTE': return 'Texte'; case 'VIDEO': return 'Video'; case 'PDF': return 'PDF'; default: return type; }
    }
}
