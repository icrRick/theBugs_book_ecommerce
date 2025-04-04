package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.VoucherDTO;
import com.thebugs.back_end.entities.Voucher;

@Component
public class VoucherMapper {
    
    public VoucherDTO toDTO(Voucher voucher){
        if(voucher == null){
            return null;
        }
        VoucherDTO voucherDTO = new VoucherDTO();
        voucherDTO.setId(voucher.getId());
        voucherDTO.setCodeVoucher(voucher.getCodeVoucher());
        voucherDTO.setCreateAt(voucher.getCreateAt());
        voucherDTO.setStartDate(voucher.getStartDate());
        voucherDTO.setExpireDate(voucher.getExpireDate());
        voucherDTO.setQuantity(voucher.getQuantity());
        voucherDTO.setMaxDiscount(voucher.getMaxDiscount());
        voucherDTO.setMinTotalOrder(voucher.getMinTotalOrder());
        voucherDTO.setDiscountPercentage(voucher.getDiscountPercentage());
        voucherDTO.setDescription(voucher.getDescription());
        voucherDTO.setActive(voucher.getActive());
        return voucherDTO;
    }

    // có thể chuyển dịnh dạnh ngày về dd-MM-yyyy tại đây

}
