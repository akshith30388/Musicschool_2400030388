package com.klef.soa.docker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.klef.soa.docker.dto.RequestMusicSchool;
import com.klef.soa.docker.dto.ResponseMusicSchool;
import com.klef.soa.docker.entity.MusicSchool;
import com.klef.soa.docker.repository.MusicScoolRepository;

@Service
public class MusicSchoolImpl implements MusicSchoolService{

	private final MusicScoolRepository repo;
	public MusicSchoolImpl(MusicScoolRepository repo){
	this.repo=repo;
	}
	@Override
	public List<ResponseMusicSchool> getAll() {
		List<ResponseMusicSchool> schools = new ArrayList<>();
		for (MusicSchool school : repo.findAll()) {
			schools.add(toResponse(school));
		}
		return schools;
	}

	@Override
	public ResponseMusicSchool getById(Long id) {
		return toResponse(findById(id));
	}

	@Override
	public ResponseMusicSchool create(RequestMusicSchool request) {
		MusicSchool school = new MusicSchool();
		copyRequest(request, school);
		return toResponse(repo.save(school));
	}

	@Override
	public ResponseMusicSchool update(Long id, RequestMusicSchool request) {
		MusicSchool school = findById(id);
		copyRequest(request, school);
		return toResponse(repo.save(school));
	}

	@Override
	public void delete(Long id) {
		repo.delete(findById(id));
	}

	private MusicSchool findById(Long id) {
		return repo.findById(id).orElseThrow(() ->
			new ResponseStatusException(HttpStatus.NOT_FOUND, "Music school not found"));
	}

	private void copyRequest(RequestMusicSchool request, MusicSchool school) {
		school.setSchoolName(request.getSchoolName());
		school.setInstrument(request.getInstrument());
		school.setStudentCount(request.getStudentCount());
		school.setActive(request.isActive());
	}

	private ResponseMusicSchool toResponse(MusicSchool school) {
		return ResponseMusicSchool.builder()
				.id(school.getId())
				.schoolName(school.getSchoolName())
				.instrument(school.getInstrument())
				.studentCount(school.getStudentCount())
				.active(school.isActive())
				.build();
	}
	
}
