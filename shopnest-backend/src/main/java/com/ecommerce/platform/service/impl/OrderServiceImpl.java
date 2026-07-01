package com.ecommerce.platform.service.impl;

import com.ecommerce.platform.dto.request.OrderRequest;
import com.ecommerce.platform.dto.request.UpdateOrderStatusRequest;
import com.ecommerce.platform.dto.response.DashboardStatsResponse;
import com.ecommerce.platform.dto.response.OrderResponse;
import com.ecommerce.platform.dto.response.PagedResponse;
import com.ecommerce.platform.entity.Cart;
import com.ecommerce.platform.entity.Order;
import com.ecommerce.platform.entity.OrderItem;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.entity.enums.OrderStatus;
import com.ecommerce.platform.entity.enums.PaymentMethod;
import com.ecommerce.platform.entity.enums.PaymentStatus;
import com.ecommerce.platform.exception.BadRequestException;
import com.ecommerce.platform.exception.InsufficientStockException;
import com.ecommerce.platform.exception.ResourceNotFoundException;
import com.ecommerce.platform.mapper.OrderMapper;
import com.ecommerce.platform.payment.PaymentGateway;
import com.ecommerce.platform.payment.PaymentRequest;
import com.ecommerce.platform.payment.PaymentResult;
import com.ecommerce.platform.repository.CartRepository;
import com.ecommerce.platform.repository.OrderRepository;
import com.ecommerce.platform.repository.ProductRepository;
import com.ecommerce.platform.repository.UserRepository;
import com.ecommerce.platform.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final PaymentGateway paymentGateway;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty. Add items before checking out.");
        }

        // Validate stock availability for every item before mutating anything.
        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new InsufficientStockException(
                        "Only " + product.getStock() + " unit(s) of '" + product.getName() + "' available in stock");
            }
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getFinalPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .shippingName(request.getShippingName())
                .shippingAddress(request.getShippingAddress())
                .shippingPhone(request.getShippingPhone())
                .build();

        for (Cart cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getProduct().getFinalPrice())
                    .build();
            order.getOrderItems().add(orderItem);
        }

        // Process the (simulated) payment before committing stock changes.
        PaymentRequest paymentRequest = PaymentRequest.builder()
                .amount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .customerEmail(user.getEmail())
                .customerName(user.getFullName())
                .cardNumber(request.getCardNumber())
                .cardExpiry(request.getCardExpiry())
                .cardCvv(request.getCardCvv())
                .upiId(request.getUpiId())
                .build();

        PaymentResult paymentResult = paymentGateway.process(paymentRequest);

        order.setPaymentStatus(paymentResult.getStatus());
        order.setTransactionRef(paymentResult.getTransactionRef());
        order.setOrderStatus(OrderStatus.CONFIRMED);

        Order savedOrder = orderRepository.save(order);

        // Deduct stock and clear the cart only after the order is successfully persisted.
        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }
        cartRepository.deleteByUserId(userId);

        return toOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersForUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long userId, Long orderId, boolean isAdmin) {
        Order order = isAdmin
                ? orderRepository.findById(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId))
                : orderRepository.findByIdAndUserId(orderId, userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        return toOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PagedResponse.from(page.map(this::toOrderResponse));
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setOrderStatus(request.getOrderStatus());

        if (request.getOrderStatus() == OrderStatus.DELIVERED
                && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        if (request.getOrderStatus() == OrderStatus.CANCELLED) {
            // Restock items if the order is cancelled.
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        Order saved = orderRepository.save(order);
        return toOrderResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        long pendingOrders = orderRepository.countByOrderStatus(OrderStatus.PENDING)
                + orderRepository.countByOrderStatus(OrderStatus.CONFIRMED)
                + orderRepository.countByOrderStatus(OrderStatus.PROCESSING);
        long deliveredOrders = orderRepository.countByOrderStatus(OrderStatus.DELIVERED);
        long inStockProducts = productRepository.countByStockGreaterThan(0);
        long outOfStockProducts = productRepository.countByStockLessThanEqual(0);

        List<OrderResponse> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::toOrderResponse)
                .toList();

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .deliveredOrders(deliveredOrders)
                .inStockProducts(inStockProducts)
                .outOfStockProducts(outOfStockProducts)
                .recentOrders(recentOrders)
                .build();
    }

    private OrderResponse toOrderResponse(Order order) {
        OrderResponse response = orderMapper.toResponse(order);
        response.setOrderItems(order.getOrderItems().stream()
                .map(orderMapper::toItemResponse)
                .toList());
        return response;
    }
}
