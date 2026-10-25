package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseMusicSchool {
	private Long id;
	private String schoolName;
	private String instrument;
	private int studentCount;
	private boolean active;
}
