package com.klef.soa.docker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicSchool {
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE)
private Long id;
private String schoolName;
private String instrument;
private int studentCount;
private boolean active;
}

