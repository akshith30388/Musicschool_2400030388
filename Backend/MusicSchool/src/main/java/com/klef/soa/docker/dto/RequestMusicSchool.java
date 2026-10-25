package com.klef.soa.docker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestMusicSchool {
	@NotBlank
	private String schoolName;
	@NotBlank
	private String instrument;
	@Min(0)
	private int studentCount;
	private boolean active;
}
