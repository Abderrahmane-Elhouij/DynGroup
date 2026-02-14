package backend.project.backend_project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private Integer rang;
    private String nom;
    private String prenom;
    private Integer xpTotal;
    private Integer niveau;
    private String avatarUrl;
}
