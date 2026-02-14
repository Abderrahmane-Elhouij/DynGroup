package backend.project.backend_project.dto;

import lombok.Data;
import java.util.Map;

@Data
public class QuizSubmission {
    private Map<Long, Long> reponses;
}
