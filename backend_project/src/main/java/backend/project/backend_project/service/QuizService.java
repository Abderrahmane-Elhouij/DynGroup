package backend.project.backend_project.service;

import backend.project.backend_project.dto.*;
import backend.project.backend_project.entity.*;
import backend.project.backend_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final UserQuizAttemptRepository attemptRepository;
    private final GamificationService gamificationService;

    @Transactional(readOnly = true)
    public QuizDTO getQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz non trouve"));

        List<QuestionDTO> questions = quiz.getQuestions().stream().map(q ->
                QuestionDTO.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .typeQuestion(q.getTypeQuestion().name())
                        .ordre(q.getOrdre())
                        .options(q.getOptions().stream().map(o ->
                                OptionDTO.builder()
                                        .id(o.getId())
                                        .libelle(o.getLibelle())
                                        .ordre(o.getOrdre())
                                        .build()
                        ).collect(Collectors.toList()))
                        .build()
        ).collect(Collectors.toList());

        return QuizDTO.builder()
                .id(quiz.getId())
                .titre(quiz.getTitre())
                .description(quiz.getDescription())
                .xpReward(quiz.getXpReward())
                .questions(questions)
                .build();
    }

    @Transactional
    public QuizResultDTO submitQuiz(Long quizId, QuizSubmission submission, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz non trouve"));

        Map<Long, Long> reponses = submission.getReponses();
        int score = 0;
        int totalQuestions = quiz.getQuestions().size();

        for (QuizQuestion question : quiz.getQuestions()) {
            Long selectedOptionId = reponses.get(question.getId());
            if (selectedOptionId != null) {
                boolean isCorrect = question.getOptions().stream()
                        .anyMatch(o -> o.getId().equals(selectedOptionId) && o.getEstCorrecte());
                if (isCorrect) {
                    score++;
                }
            }
        }

        // XP proportionnel au score
        int xpEarned = (int) ((double) score / totalQuestions * quiz.getXpReward());
        boolean parfait = score == totalQuestions;

        UserQuizAttempt attempt = UserQuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .score(score)
                .totalQuestions(totalQuestions)
                .xpEarned(xpEarned)
                .build();

        attemptRepository.save(attempt);
        gamificationService.addXp(user, xpEarned);

        List<BadgeDTO> nouveauxBadges = new ArrayList<>();
        if (parfait) {
            nouveauxBadges = gamificationService.checkPerfectQuizBadge(user);
        }
        nouveauxBadges.addAll(gamificationService.checkAndAwardBadges(user));

        return QuizResultDTO.builder()
                .score(score)
                .totalQuestions(totalQuestions)
                .xpGagne(xpEarned)
                .parfait(parfait)
                .nouveauxBadges(nouveauxBadges)
                .build();
    }
}
