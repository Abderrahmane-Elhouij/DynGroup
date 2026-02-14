package backend.project.backend_project.repository;

import backend.project.backend_project.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByActifTrue();
}
