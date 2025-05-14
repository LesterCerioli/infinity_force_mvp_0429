

const router = createRouter();

router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/order/:id', isAuthenticatedUser, getSingleOrderDetails);
router.get('/orders/me', isAuthenticatedUser, myOrders);

router.get('/admin/orders', isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export const handlers = router.handlers();