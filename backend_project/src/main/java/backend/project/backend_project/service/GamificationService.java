package backend.project.backend_project.service;

import backend.project.backend_project.dto.BadgeDTO;
import backend.project.backend_project.entity.*;
import backend.project.backend_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserRepository userRepository;
    private final UserProgressRepository progressRepository;
    private final UserCourseEnrollmentRepository enrollmentRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final BadgeRepository badgeRepository;
    private final LessonRepository lessonRepository;

    private static final int XP_PAR_NIVEAU = 100;

    @Transactional
    public void addXp(User user, int xp) {
        user.setXpTotal(user.getXpTotal() + xp);
        int nouveauNiveau = (user.getXpTotal() / XP_PAR_NIVEAU) + 1;
        user.setNiveau(nouveauNiveau);
        userRepository.save(user);
    }

    @Transactional
    public List<BadgeDTO> checkAndAwardBadges(User user) {
        List<BadgeDTO> nouveauxBadges = new ArrayList<>();

        long lessonsCompleted = progressRepository.countByUserIdAndStatut(user.getId(), StatutProgression.TERMINE);
        nouveauxBadges.addAll(awardBadgesForCondition(user, "LESSONS_COMPLETED", (int) lessonsCompleted));

        int niveau = user.getNiveau();
        nouveauxBadges.addAll(awardBadgesForCondition(user, "LEVEL_REACHED", niveau));

        long coursesEnrolled = enrollmentRepository.countByUserId(user.getId());
        nouveauxBadges.addAll(awardBadgesForCondition(user, "COURSES_ENROLLED", (int) coursesEnrolled));

        return nouveauxBadges;
    }

    @Transactional
    public List<BadgeDTO> checkPerfectQuizBadge(User user) {
        List<BadgeDTO> nouveauxBadges = new ArrayList<>();
        nouveauxBadges.addAll(awardBadgesForCondition(user, "PERFECT_QUIZ", 1));
        return nouveauxBadges;
    }

    private List<BadgeDTO> awardBadgesForCondition(User user, String conditionType, int currentValue) {
        List<BadgeDTO> awarded = new ArrayList<>();
        List<Badge> badges = badgeRepository.findByConditionType(conditionType);

        for (Badge badge : badges) {
            if (currentValue >= badge.getConditionValeur()
                    && !userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {

                UserBadge userBadge = UserBadge.builder()
                        .user(user)
                        .badge(badge)
                        .dateObtention(LocalDateTime.now())
                        .build();
                userBadgeRepository.save(userBadge);

                awarded.add(BadgeDTO.builder()
                        .id(badge.getId())
                        .nom(badge.getNom())
                        .description(badge.getDescription())
                        .icone(badge.getIcone())
                        .dateObtention(userBadge.getDateObtention().toString())
                        .build());
            }
        }
        return awarded;
    }

    @Transactional
    public void updateCourseProgress(User user, Long courseId) {
        enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId).ifPresent(enrollment -> {
            List<Lesson> allLessons = lessonRepository.findByChapterCourseId(courseId);
            long completedLessons = progressRepository.findByUserIdAndLessonChapterCourseId(user.getId(), courseId)
                    .stream()
                    .filter(p -> p.getStatut() == StatutProgression.TERMINE)
                    .count();

            int progression = allLessons.isEmpty() ? 0 :
                    (int) ((completedLessons * 100) / allLessons.size());

            enrollment.setProgression(progression);
            enrollmentRepository.save(enrollment);
        });
    }
}
