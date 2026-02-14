package backend.project.backend_project.repository;

import backend.project.backend_project.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByCourseIdOrderByOrdreAsc(Long courseId);
}
