package com.thebugs.back_end.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.VoucherDTO;
import com.thebugs.back_end.entities.Voucher;
import com.thebugs.back_end.mappers.VoucherMapper;
import com.thebugs.back_end.repository.VoucherJPA;

@Service
public class VoucherService {

        @Autowired
        private VoucherJPA voucherJPA;

        @Autowired
        private UserService userService;

        @Autowired
        private VoucherMapper voucherMapper;

        public Voucher getVoucherById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("Id Không được null");
                }
                return voucherJPA.findById(id).orElseThrow(() -> new IllegalArgumentException(
                                "Không tìm thấy đối tượng Voucher có id= " + id));

        }

        // delete
        // kiểm tra voucher có order sử dụng chưa

        public boolean deleteVoucher(Integer id) {
                Voucher voucher = getVoucherById(id);
                if (voucher.getOrders().size() > 0) {
                        throw new IllegalArgumentException("Voucher đã được sử dụng không thể xóa");
                }
                voucherJPA.delete(voucher);
                return true;
        }

        public VoucherDTO getVoucherIdByShopId(Integer id, String authorizationHeader) {
                Integer shopId = userService.getUserToken(authorizationHeader).getShop().getId();
                Voucher voucher = voucherJPA.getVoucherIdByShopId(id, shopId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy đối tượng Voucher có id= " + id));
                return voucherMapper.toDTO(voucher);
        }

        public VoucherDTO saveVoucher(String authorizationHeader,Voucher voucher) {
                voucher.setShop(userService.getUserToken(authorizationHeader).getShop());
                Voucher save = voucherJPA.save(voucher);
                return voucherMapper.toDTO(save);

        }

        public ArrayList<VoucherDTO> findByShopAndDateRange(String authorizationHeader, Date startDate,
                        Date expireDate, Pageable pageable) {
                Page<Voucher> page = voucherJPA.findByShopAndDateRange(
                                userService.getUserToken(authorizationHeader).getShop().getId(), startDate,
                                expireDate,
                                pageable);
                return page.stream()
                                .map(voucherMapper::toDTO)
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public int total(String authorizationHeader, Date startDate, Date expireDate) {
                return voucherJPA.countByShopAndDateRange(
                                userService.getUserToken(authorizationHeader).getShop().getId(), startDate, expireDate);
        }

}
