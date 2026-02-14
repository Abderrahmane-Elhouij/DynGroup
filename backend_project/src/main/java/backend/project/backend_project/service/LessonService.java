package backend.project.backend_project.service;

import backend.project.backend_project.dto.*;
import backend.project.backend_project.entity.*;
import backend.project.backend_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final UserProgressRepository progressRepository;
    private final GamificationService gamificationService;

    @Transactional(readOnly = true)
    public LessonDTO getLesson(Long lessonId, String email) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lecon non trouvee"));

        User user = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        String statut = null;
        if (user != null) {
            statut = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                    .map(p -> p.getStatut().name())
                    .orElse(null);
        }

        List<QuizSummaryDTO> quizzes = lesson.getQuizzes().stream().map(quiz ->
                QuizSummaryDTO.builder()
                        .id(quiz.getId())
                        .titre(quiz.getTitre())
                        .description(quiz.getDescription())
                        .xpReward(quiz.getXpReward())
                        .nombreQuestions(quiz.getQuestions().size())
                        .build()
        ).collect(Collectors.toList());

        return LessonDTO.builder()
                .id(lesson.getId())
                .titre(lesson.getTitre())
                .contenu(lesson.getContenu())
                .typeContenu(lesson.getTypeContenu().name())
                .dureeEstimee(lesson.getDureeEstimee())
                .xpReward(lesson.getXpReward())
                .ordre(lesson.getOrdre())
                .statut(statut)
                .chapterId(lesson.getChapter().getId())
                .chapterTitre(lesson.getChapter().getTitre())
                .courseId(lesson.getChapter().getCourse().getId())
                .courseTitre(lesson.getChapter().getCourse().getTitre())
                .quizzes(quizzes)
                .build();
    }

    @Transactional
    public void completeLesson(Long lessonId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lecon non trouvee"));

        UserProgress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElse(UserProgress.builder()
                        .user(user)
                        .lesson(lesson)
                        .build());

        if (progress.getStatut() == StatutProgression.TERMINE) {
            return;
        }

        progress.setStatut(StatutProgression.TERMINE);
        progress.setDateCompletion(LocalDateTime.now());
        progressRepository.save(progress);

        gamificationService.addXp(user, lesson.getXpReward());
        gamificationService.checkAndAwardBadges(user);
        gamificationService.updateCourseProgress(user, lesson.getChapter().getCourse().getId());
    }
}
