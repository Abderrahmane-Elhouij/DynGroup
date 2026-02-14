package backend.project.backend_project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private Integer xpTotal;
    private Integer niveau;
    private Integer xpPourProchainNiveau;
    private Integer progressionNiveau;
    private Long leconsTerminees;
    private Long coursInscrits;
    private Long badgesObtenus;
    private List<CourseDTO> coursRecents;
    private List<BadgeDTO> derniersBadges;
}
