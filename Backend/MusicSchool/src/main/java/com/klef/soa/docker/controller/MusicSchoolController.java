package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.RequestMusicSchool;
import com.klef.soa.docker.dto.ResponseMusicSchool;
import com.klef.soa.docker.service.MusicSchoolService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/music")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class MusicSchoolController {

	private final MusicSchoolService service;

	public MusicSchoolController(MusicSchoolService service) {
		this.service = service;
	}

	@GetMapping
	@Operation(summary = "Get all music schools")
	public List<ResponseMusicSchool> getAll() {
		return service.getAll();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get music school by ID")
	public ResponseMusicSchool getById(@PathVariable Long id) {
		return service.getById(id);
	}

	@PostMapping
	@Operation(summary = "Create Music School")
	public ResponseEntity<ResponseMusicSchool> create(@Valid @RequestBody RequestMusicSchool request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update Music School")
	public ResponseMusicSchool update(@PathVariable Long id, @Valid @RequestBody RequestMusicSchool request) {
		return service.update(id, request);
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Delete Music School")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}
