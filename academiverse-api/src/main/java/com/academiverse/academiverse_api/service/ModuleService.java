package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.ModuleSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.Module;
import com.academiverse.academiverse_api.repository.InstructRepository;
import com.academiverse.academiverse_api.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final InstructRepository instructRepository;

    public BaseResponse<List<Module>> getModulesByInstructId(Long instructId){
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        if(instruct.isPresent()){
            List<Module> moduleList = moduleRepository.findByInstructsInstructIdAndParentModuleIsNull(instructId);
            BaseResponse<List<Module>> response = new BaseResponse<>();
            response.data = moduleList;
            response.message = "List of all modules.";
            response.isError = false;
            return response;
        }
        else{
            BaseResponse<List<Module>> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id: {0} does not exist", instructId);
            return response;
        }

    }

    public BaseResponse<Module> saveModule(ModuleSaveRequest moduleSaveRequest){
        Optional<Instruct> instruct = instructRepository.findById(moduleSaveRequest.instructId);
        if(instruct.isPresent()){
            Module m = new Module();
            m.setInstructs(instruct.get());
            m.setModuleName(moduleSaveRequest.moduleName);
            m.setCreatedAt(LocalDateTime.now());
            m.setUpdatedAt(LocalDateTime.now());
            m.setCreatedBy(moduleSaveRequest.createdBy);
            m.setUpdatedBy(moduleSaveRequest.updatedBy);
            Module savedModule = moduleRepository.save(m);
            BaseResponse<Module> response = new BaseResponse<>();
            response.data = savedModule;
            response.isError = false;
            response.message = MessageFormat.format("Module with id: {0} saved successfully", savedModule.getModuleId());
            return response;
        }
        else{
            BaseResponse<Module> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Module with id: {0} does not exist", moduleSaveRequest.instructId);
            return response;
        }
    }
}
