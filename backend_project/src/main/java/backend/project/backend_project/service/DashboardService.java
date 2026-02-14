package backend.project.backend_project.service;

import backend.project.backend_project.dto.*;
import backend.project.backend_project.entity.*;
import backend.project.backend_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final UserProgressRepository progressRepository;
    private final UserCourseEnrollmentRepository enrollmentRepository;
    private final UserBadgeRepository userBadgeRepository;

    private static final int XP_PAR_NIVEAU = 100;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        long leconsTerminees = progressRepository.countByUserIdAndStatut(user.getId(), StatutProgression.TERMINE);
        long coursInscrits = enrollmentRepository.countByUserId(user.getId());
        long badgesObtenus = userBadgeRepository.countByUserId(user.getId());

        int xpDansNiveau = user.getXpTotal() % XP_PAR_NIVEAU;
        int progressionNiveau = (xpDansNiveau * 100) / XP_PAR_NIVEAU;
        int xpPourProchain = XP_PAR_NIVEAU - xpDansNiveau;

        List<CourseDTO> coursRecents = enrollmentRepository.findByUserId(user.getId())
                .stream()
                .sorted((a, b) -> b.getDateInscription().compareTo(a.getDateInscription()))
                .limit(3)
                .map(e -> CourseDTO.builder()
                        .id(e.getCourse().getId())
                        .titre(e.getCourse().getTitre())
                        .description(e.getCourse().getDescription())
                        .difficulte(e.getCourse().getDifficulte().name())
                        .dureeEstimee(e.getCourse().getDureeEstimee())
                        .progression(e.getProgression())
                        .inscrit(true)
                        .build())
                .collect(Collectors.toList());

        List<BadgeDTO> derniersBadges = userBadgeRepository.findByUserId(user.getId())
                .stream()
                .sorted((a, b) -> b.getDateObtention().compareTo(a.getDateObtention()))
                .limit(5)
                .map(ub -> BadgeDTO.builder()
                        .id(ub.getBadge().getId())
                        .nom(ub.getBadge().getNom())
                        .description(ub.getBadge().getDescription())
                        .icone(ub.getBadge().getIcone())
                        .dateObtention(ub.getDateObtention().toString())
                        .build())
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .xpTotal(user.getXpTotal())
                .niveau(user.getNiveau())
                .xpPourProchainNiveau(xpPourProchain)
                .progressionNiveau(progressionNiveau)
                .leconsTerminees(leconsTerminees)
                .coursInscrits(coursInscrits)
                .badgesObtenus(badgesObtenus)
                .coursRecents(coursRecents)
                .derniersBadges(derniersBadges)
                .build();
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDTO> getLeaderboard() {
        AtomicInteger rang = new AtomicInteger(1);
        return userRepository.findAllByOrderByXpTotalDesc()
                .stream()
                .limit(20)
                .map(user -> LeaderboardEntryDTO.builder()
                        .rang(rang.getAndIncrement())
                        .nom(user.getNom())
                        .prenom(user.getPrenom())
                        .xpTotal(user.getXpTotal())
                        .niveau(user.getNiveau())
                        .avatarUrl(user.getAvatarUrl())
                        .build())
                .collect(Collectors.toList());
    }
}
