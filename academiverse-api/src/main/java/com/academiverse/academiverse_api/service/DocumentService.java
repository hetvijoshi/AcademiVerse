package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.DocumentSaveRequest;
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
public class DocumentService {
    private final ModuleRepository moduleRepository;
    private final InstructRepository instructRepository;
    public BaseResponse<Module> saveDocument(DocumentSaveRequest documentSaveRequest){
        Optional<Instruct> instruct = instructRepository.findById(documentSaveRequest.instructId);
        Optional<Module> module = moduleRepository.findById(documentSaveRequest.moduleId);
        if(instruct.isPresent()){
            Module m = new Module();
            m.setInstructs(instruct.get());
            if(module.isPresent()){
                m.setModuleName(documentSaveRequest.moduleName);
                m.setModuleLink(documentSaveRequest.moduleLink);
                m.setParentModule(module.get());
                m.setCreatedAt(LocalDateTime.now());
                m.setUpdatedAt(LocalDateTime.now());
                m.setCreatedBy(documentSaveRequest.createdBy);
                m.setUpdatedBy(documentSaveRequest.updatedBy);
                Module savedDocument = moduleRepository.save(m);
                BaseResponse<Module> response = new BaseResponse<>();
                response.data = savedDocument;
                response.isError = false;
                response.message = MessageFormat.format("Document with id: {0} saved successfully", savedDocument.getModuleId());
                return response;
            }
            else{
                BaseResponse<Module> response = new BaseResponse<>();
                response.data = null;
                response.isError = true;
                response.message = MessageFormat.format("Module with id: {0} does not exist", documentSaveRequest.moduleId);
                return response;
            }

        }
        else{
            BaseResponse<Module> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id: {0} does not exist", documentSaveRequest.instructId);
            return response;
        }
    }

    public BaseResponse deleteDocumentById (Long id) {
        Optional<Module> existingDocument = moduleRepository.findById(id);
        BaseResponse response = new BaseResponse<>();
        response.data = null;
        if(existingDocument.isPresent()){
            moduleRepository.deleteById(id);
            response.isError = false;
            response.message = MessageFormat.format("Document with id {0} is deleted.", id);
        }else{
            response.isError = true;
            response.message = MessageFormat.format("Document with id {0} not found.", id);
        }
        return response;
    }
}
