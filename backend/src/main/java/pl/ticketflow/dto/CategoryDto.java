package pl.ticketflow.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String fullPath;
    private Long parentId;
    private Integer slaMinutes;
    private List<CategoryDto> children;
}
