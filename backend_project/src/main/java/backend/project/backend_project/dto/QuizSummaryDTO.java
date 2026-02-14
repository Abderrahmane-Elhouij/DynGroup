package backend.project.backend_project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizSummaryDTO {
    private Long id;
    private String titre;
    private String description;
    private Integer xpReward;
    private Integer nombreQuestions;
}
