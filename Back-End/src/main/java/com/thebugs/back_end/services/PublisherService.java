package com.thebugs.back_end.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.repository.PublisherJPA;


import com.thebugs.back_end.dto.PublisherDTO;
import com.thebugs.back_end.entities.Publisher;
import com.thebugs.back_end.mappers.PublisherMapper;

import java.util.List;

@Service
public class PublisherService {

        @Autowired
        private PublisherJPA publisherJPA;

        @Autowired
        private PublisherMapper publisherMapper;

        public List<PublisherDTO> getAllPublishers() {
                return publisherJPA.findAll().stream()
                                .map(publisherMapper::toDTO)
                                .toList();
        }

        public List<PublisherDTO> getPublishersByKeywordWithPagination(String keyword, Pageable pageable) {
                Page<Publisher> publishers;
                if (keyword == null || keyword.isEmpty()) {
                        publishers = publisherJPA.findAll(pageable);
                } else {
                        publishers = publisherJPA.findByName(keyword,pageable);
                }
                return publishers.stream()
                                .map(publisherMapper::toDTO)
                                .toList();
        }

        public int countPublishersByKeyword(String keyword) {
                if (keyword == null || keyword.isEmpty()) {
                        return (int) publisherJPA.count();
                } else {
                        return publisherJPA.countfindByName(keyword);
                }
        }


     
        public PublisherDTO save(Publisher publisher) {
                if (publisher == null) {
                        throw new IllegalArgumentException("Nhà xuất bản không thể null");
                }
                publisherJPA.findByNameExist(publisher.getId(), publisher.getName())
                                .ifPresent(existingPublisher -> {
                                        throw new IllegalArgumentException("Nhà xuất bản đã tồn tại");
                                });
                Publisher saved = publisherJPA.save(publisher);
                return publisherMapper.toDTO(saved);

        }

       
       
        public Publisher getPublisherById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("ID không được null");
                }
                return publisherJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("không tìm thấy" + id));
        }
       
        public boolean deletePublisher(Integer id) {
                Publisher publisher = getPublisherById(id);
                if (publisher.getId()==1) {
                        throw new IllegalArgumentException("Không thể xóa nhà xuất bản mặc định");
                } 
                if (publisher.getProducts().size() > 0) {
                        throw new IllegalArgumentException("Không thể xóa nhà xuất bản đã có sản phẩm");
                }

                publisherJPA.delete(publisher);
                return true;
        }
        public PublisherDTO getPublisherDTO(Publisher publisher) {
                if (publisher == null) {
                      return null;
                }
                return publisherMapper.toDTO(publisher);
        }

}