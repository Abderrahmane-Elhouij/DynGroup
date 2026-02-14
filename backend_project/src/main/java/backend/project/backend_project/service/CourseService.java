package backend.project.backend_project.service;

import backend.project.backend_project.dto.*;
import backend.project.backend_project.entity.*;
import backend.project.backend_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final UserCourseEnrollmentRepository enrollmentRepository;
    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CourseDTO> getAllCourses(String email) {
        List<Course> courses = courseRepository.findByActifTrue();
        User user = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        return courses.stream().map(course -> {
            int nbChapitres = course.getChapters().size();
            int nbLecons = course.getChapters().stream()
                    .mapToInt(ch -> ch.getLessons().size())
                    .sum();

            boolean inscrit = false;
            int progression = 0;
            if (user != null) {
                Optional<UserCourseEnrollment> enrollment =
                        enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId());
                inscrit = enrollment.isPresent();
                progression = enrollment.map(UserCourseEnrollment::getProgression).orElse(0);
            }

            return CourseDTO.builder()
                    .id(course.getId())
                    .titre(course.getTitre())
                    .description(course.getDescription())
                    .imageUrl(course.getImageUrl())
                    .dureeEstimee(course.getDureeEstimee())
                    .difficulte(course.getDifficulte().name())
                    .nombreChapitres(nbChapitres)
                    .nombreLecons(nbLecons)
                    .inscrit(inscrit)
                    .progression(progression)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDetailDTO getCourseDetail(Long courseId, String email) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouve"));

        User user = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        boolean inscrit = false;
        int progression = 0;
        if (user != null) {
            Optional<UserCourseEnrollment> enrollment =
                    enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId());
            inscrit = enrollment.isPresent();
            progression = enrollment.map(UserCourseEnrollment::getProgression).orElse(0);
        }

        List<ChapterDTO> chapitres = chapterRepository.findByCourseIdOrderByOrdreAsc(courseId)
                .stream().map(chapter -> {
                    List<LessonSummaryDTO> lecons = chapter.getLessons().stream().map(lesson -> {
                        String statut = null;
                        if (user != null) {
                            statut = progressRepository.findByUserIdAndLessonId(user.getId(), lesson.getId())
                                    .map(p -> p.getStatut().name())
                                    .orElse(null);
                        }
                        return LessonSummaryDTO.builder()
                                .id(lesson.getId())
                                .titre(lesson.getTitre())
                                .typeContenu(lesson.getTypeContenu().name())
                                .dureeEstimee(lesson.getDureeEstimee())
                                .xpReward(lesson.getXpReward())
                                .ordre(lesson.getOrdre())
                                .statut(statut)
                                .aQuiz(!lesson.getQuizzes().isEmpty())
                                .quizId(lesson.getQuizzes().isEmpty() ? null : lesson.getQuizzes().get(0).getId())
                                .build();
                    }).collect(Collectors.toList());

                    return ChapterDTO.builder()
                            .id(chapter.getId())
                            .titre(chapter.getTitre())
                            .description(chapter.getDescription())
                            .ordre(chapter.getOrdre())
                            .lecons(lecons)
                            .build();
                }).collect(Collectors.toList());

        return CourseDetailDTO.builder()
                .id(course.getId())
                .titre(course.getTitre())
                .description(course.getDescription())
                .imageUrl(course.getImageUrl())
                .dureeEstimee(course.getDureeEstimee())
                .difficulte(course.getDifficulte().name())
                .inscrit(inscrit)
                .progression(progression)
                .chapitres(chapitres)
                .build();
    }

    @Transactional
    public void enrollInCourse(Long courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new RuntimeException("Deja inscrit a ce cours");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouve"));

        UserCourseEnrollment enrollment = UserCourseEnrollment.builder()
                .user(user)
                .course(course)
                .build();

        enrollmentRepository.save(enrollment);
    }
}
