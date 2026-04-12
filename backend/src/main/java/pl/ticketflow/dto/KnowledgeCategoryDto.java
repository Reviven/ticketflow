package pl.ticketflow.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class KnowledgeCategoryDto {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private long articleCount;
}
