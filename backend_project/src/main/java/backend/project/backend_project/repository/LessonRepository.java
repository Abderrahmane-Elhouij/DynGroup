package backend.project.backend_project.repository;

import backend.project.backend_project.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByChapterIdOrderByOrdreAsc(Long chapterId);
    List<Lesson> findByChapterCourseId(Long courseId);
}
