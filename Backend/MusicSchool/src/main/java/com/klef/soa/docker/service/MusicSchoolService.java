package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.RequestMusicSchool;
import com.klef.soa.docker.dto.ResponseMusicSchool;

public interface MusicSchoolService {

	List<ResponseMusicSchool> getAll();
	ResponseMusicSchool getById(Long id);
	ResponseMusicSchool create(RequestMusicSchool request);
	ResponseMusicSchool update(Long id, RequestMusicSchool request);
	void delete(Long id);
}
