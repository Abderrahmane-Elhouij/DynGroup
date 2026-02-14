import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { QuizService, QuizDTO, QuizResultDTO } from '@/gamification/services/quiz.service';

@Component({
    selector: 'app-quiz-play',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, RadioButtonModule, CheckboxModule, CardModule, ProgressBarModule, MessageModule, SkeletonModule, DividerModule, TagModule],
    templateUrl: 'quiz-play.html',
})
export class QuizPlay implements OnInit {
    quiz = signal<QuizDTO | null>(null);
    result = signal<QuizResultDTO | null>(null);
    loading = signal(true);
    submitting = signal(false);
    currentIndex = signal(0);
    selectedAnswers = signal<{ [questionId: number]: number[] }>({});

    currentQuestion = computed(() => this.quiz()?.questions[this.currentIndex()] || null);
    progressPercent = computed(() => Math.round(((this.currentIndex() + 1) / (this.quiz()?.questions.length || 1)) * 100));

    constructor(private quizService: QuizService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.quizService.getQuiz(id).subscribe({
            next: data => { this.quiz.set(data); this.loading.set(false); },
            error: () => this.loading.set(false)
        });
    }

    selectSingle(questionId: number, optionId: number): void {
        this.selectedAnswers.update(a => ({ ...a, [questionId]: [optionId] }));
    }

    toggleMultiple(questionId: number, optionId: number): void {
        this.selectedAnswers.update(a => {
            const current = a[questionId] || [];
            const updated = current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId];
            return { ...a, [questionId]: updated };
        });
    }

    isOptionSelected(questionId: number, optionId: number): boolean {
        return (this.selectedAnswers()[questionId] || []).includes(optionId);
    }

    hasAnswer(questionId: number): boolean {
        return (this.selectedAnswers()[questionId] || []).length > 0;
    }

    allAnswered(): boolean {
        return this.quiz()?.questions.every(q => this.hasAnswer(q.id)) || false;
    }

    previous(): void { this.currentIndex.update(i => Math.max(0, i - 1)); }
    next(): void { this.currentIndex.update(i => i + 1); }

    submit(): void {
        this.submitting.set(true);
        const answers = this.selectedAnswers();
        const reponses: { [questionId: number]: number } = {};
        for (const [qId, optionIds] of Object.entries(answers)) {
            reponses[Number(qId)] = optionIds[0];
        }
        const submission = { reponses };
        this.quizService.submitQuiz(this.quiz()!.id, submission).subscribe({
            next: res => { this.result.set(res); this.submitting.set(false); },
            error: () => this.submitting.set(false)
        });
    }

    isSuccess(): boolean { return (this.result()?.score || 0) >= (this.result()?.totalQuestions || 1) * 0.5; }

    backToCourse(): void {
        this.router.navigate(['/cours']);
    }
}
