package backend.project.backend_project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSummaryDTO {
    private Long id;
    private String titre;
    private String typeContenu;
    private String dureeEstimee;
    private Integer xpReward;
    private Integer ordre;
    private String statut;
    private Boolean aQuiz;
    private Long quizId;
}
