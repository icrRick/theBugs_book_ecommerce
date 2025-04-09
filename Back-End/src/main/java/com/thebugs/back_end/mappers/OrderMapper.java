package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.OrderDTO;
import com.thebugs.back_end.dto.ProductOrderDTO;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        if (order == null) {
            return null;
        }
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setCustomerInfo(order.getCustomerInfo());
        orderDTO.setPaymentMethod(order.getPaymentMethod());
        orderDTO.setPaymentStatus(order.getPaymentStatus());
        orderDTO.setNoted(order.getNoted());
        orderDTO.setShippingFee(order.getShippingFee());
        orderDTO.setCreatedAt(order.getCreatedAt());
        return orderDTO;
    }

    public List<ProductOrderDTO> toProductOrderDTOs(List<OrderItem> orderItems) {
        if (orderItems == null) {
            return null;
        }
        List<ProductOrderDTO> productOrderDTOs = new ArrayList<>();
        for (OrderItem orderItem : orderItems) {
            ProductOrderDTO productOrderDTO = new ProductOrderDTO();
            productOrderDTO.setProductName(orderItem.getProduct().getName());
            productOrderDTO.setProductImage(orderItem.getProduct().getImages().get(0).getImageName());// lấy ảnh đầu
                                                                                                      // tiên
            productOrderDTO.setPriceProduct(orderItem.getPrice());
            productOrderDTO.setQuantityProduct(orderItem.getQuantity());
            productOrderDTOs.add(productOrderDTO);
        }
        return productOrderDTOs;
    }

}
