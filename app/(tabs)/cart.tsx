import { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy cart data
const INITIAL_CART_ITEMS = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        color: 'Matte Black',
        size: null,
    },
    {
        id: '2',
        name: 'Minimalist Smart Watch',
        price: 449.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        color: 'Silver',
        size: '42mm',
    },
    {
        id: '3',
        name: 'Premium Sneakers',
        price: 159.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        color: 'Red/White',
        size: 'US 10',
    },
];

const PROMO_CODES = [
    { code: 'WELCOME20', discount: 20, type: 'percentage' },
    { code: 'SAVE50', discount: 50, type: 'fixed' },
];

export default function CartScreen() {
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<typeof PROMO_CODES[0] | null>(null);

    const updateQuantity = (id: string, change: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const removeItem = (id: string) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => setCartItems((prev) => prev.filter((item) => item.id !== id)),
                },
            ]
        );
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 15.99;
    const tax = subtotal * 0.08;

    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount = (subtotal * appliedPromo.discount) / 100;
        } else {
            discount = appliedPromo.discount;
        }
    }

    const total = subtotal + shipping + tax - discount;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const renderCartItem = (item: typeof INITIAL_CART_ITEMS[0]) => (
        <View key={item.id} style={styles.cartItem}>
            <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                contentFit="cover"
                transition={200}
            />
            <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                    <ThemedText style={styles.itemName} numberOfLines={2}>
                        {item.name}
                    </ThemedText>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem(item.id)}
                    >
                        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>
                <View style={styles.itemMeta}>
                    <ThemedText style={styles.itemMetaText}>Color: {item.color}</ThemedText>
                    {item.size && (
                        <ThemedText style={styles.itemMetaText}>Size: {item.size}</ThemedText>
                    )}
                </View>
                <View style={styles.itemFooter}>
                    <ThemedText style={styles.itemPrice}>${item.price.toFixed(2)}</ThemedText>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, -1)}
                        >
                            <Ionicons name="remove" size={16} color="#667eea" />
                        </TouchableOpacity>
                        <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, 1)}
                        >
                            <Ionicons name="add" size={16} color="#667eea" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <ThemedText style={styles.headerTitle}>My Cart</ThemedText>
                    <View style={styles.itemCountBadge}>
                        <ThemedText style={styles.itemCountText}>{totalItems} items</ThemedText>
                    </View>
                </View>
            </LinearGradient>

            {cartItems.length === 0 ? (
                <View style={styles.emptyCart}>
                    <View style={styles.emptyCartIcon}>
                        <Ionicons name="cart-outline" size={80} color="#ddd" />
                    </View>
                    <ThemedText style={styles.emptyCartTitle}>Your cart is empty</ThemedText>
                    <ThemedText style={styles.emptyCartSubtitle}>
                        Looks like you haven't added anything to your cart yet
                    </ThemedText>
                    <TouchableOpacity style={styles.shopNowButton}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.shopNowGradient}
                        >
                            <ThemedText style={styles.shopNowText}>Start Shopping</ThemedText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Cart Items */}
                        <View style={styles.section}>
                            {cartItems.map(renderCartItem)}
                        </View>

                        {/* Promo Code */}
                        <View style={styles.promoSection}>
                            <View style={styles.promoHeader}>
                                <Ionicons name="pricetag" size={20} color="#667eea" />
                                <ThemedText style={styles.promoTitle}>Promo Code</ThemedText>
                            </View>
                            {appliedPromo ? (
                                <View style={styles.appliedPromo}>
                                    <View style={styles.appliedPromoInfo}>
                                        <ThemedText style={styles.appliedPromoCode}>
                                            {appliedPromo.code}
                                        </ThemedText>
                                        <ThemedText style={styles.appliedPromoDiscount}>
                                            {appliedPromo.type === 'percentage'
                                                ? `${appliedPromo.discount}% off`
                                                : `$${appliedPromo.discount} off`}
                                        </ThemedText>
                                    </View>
                                    <TouchableOpacity onPress={() => setAppliedPromo(null)}>
                                        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.promoInputContainer}>
                                    <ThemedText style={styles.promoHint}>
                                        Try: WELCOME20 or SAVE50
                                    </ThemedText>
                                    <TouchableOpacity
                                        style={styles.applyPromoButton}
                                        onPress={() => {
                                            const promo = PROMO_CODES.find(
                                                (p) => p.code.toLowerCase() === 'welcome20'
                                            );
                                            if (promo) setAppliedPromo(promo);
                                        }}
                                    >
                                        <ThemedText style={styles.applyPromoText}>Apply WELCOME20</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Delivery Options */}
                        <View style={styles.deliverySection}>
                            <View style={styles.deliveryHeader}>
                                <Ionicons name="car" size={20} color="#667eea" />
                                <ThemedText style={styles.deliveryTitle}>Delivery Options</ThemedText>
                            </View>
                            <View style={styles.deliveryOptions}>
                                <TouchableOpacity style={[styles.deliveryOption, styles.deliveryOptionActive]}>
                                    <View style={styles.deliveryOptionLeft}>
                                        <View style={styles.deliveryRadio}>
                                            <View style={styles.deliveryRadioInner} />
                                        </View>
                                        <View>
                                            <ThemedText style={styles.deliveryOptionTitle}>Standard Delivery</ThemedText>
                                            <ThemedText style={styles.deliveryOptionSubtitle}>3-5 business days</ThemedText>
                                        </View>
                                    </View>
                                    <ThemedText style={styles.deliveryOptionPrice}>
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deliveryOption}>
                                    <View style={styles.deliveryOptionLeft}>
                                        <View style={styles.deliveryRadioInactive} />
                                        <View>
                                            <ThemedText style={styles.deliveryOptionTitle}>Express Delivery</ThemedText>
                                            <ThemedText style={styles.deliveryOptionSubtitle}>1-2 business days</ThemedText>
                                        </View>
                                    </View>
                                    <ThemedText style={styles.deliveryOptionPrice}>$29.99</ThemedText>
                                </TouchableOpacity>
                            </View>
                            {subtotal > 500 && (
                                <View style={styles.freeShippingBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                                    <ThemedText style={styles.freeShippingText}>
                                        You qualify for FREE shipping!
                                    </ThemedText>
                                </View>
                            )}
                        </View>

                        {/* Order Summary */}
                        <View style={styles.summarySection}>
                            <ThemedText style={styles.summaryTitle}>Order Summary</ThemedText>
                            <View style={styles.summaryRow}>
                                <ThemedText style={styles.summaryLabel}>Subtotal ({totalItems} items)</ThemedText>
                                <ThemedText style={styles.summaryValue}>${subtotal.toFixed(2)}</ThemedText>
                            </View>
                            <View style={styles.summaryRow}>
                                <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
                                <ThemedText style={[styles.summaryValue, shipping === 0 && styles.freeText]}>
                                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                </ThemedText>
                            </View>
                            <View style={styles.summaryRow}>
                                <ThemedText style={styles.summaryLabel}>Tax (8%)</ThemedText>
                                <ThemedText style={styles.summaryValue}>${tax.toFixed(2)}</ThemedText>
                            </View>
                            {discount > 0 && (
                                <View style={styles.summaryRow}>
                                    <ThemedText style={styles.summaryLabel}>Discount</ThemedText>
                                    <ThemedText style={[styles.summaryValue, styles.discountValue]}>
                                        -${discount.toFixed(2)}
                                    </ThemedText>
                                </View>
                            )}
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryRow}>
                                <ThemedText style={styles.totalLabel}>Total</ThemedText>
                                <ThemedText style={styles.totalValue}>${total.toFixed(2)}</ThemedText>
                            </View>
                        </View>

                        {/* Secure Payment Badge */}
                        <View style={styles.secureSection}>
                            <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
                            <ThemedText style={styles.secureText}>
                                Your payment is secure and encrypted
                            </ThemedText>
                        </View>
                    </ScrollView>

                    {/* Checkout Button */}
                    <View style={styles.checkoutContainer}>
                        <View style={styles.checkoutTotal}>
                            <ThemedText style={styles.checkoutTotalLabel}>Total</ThemedText>
                            <ThemedText style={styles.checkoutTotalValue}>${total.toFixed(2)}</ThemedText>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton}>
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.checkoutGradient}
                            >
                                <Ionicons name="lock-closed" size={18} color="#fff" />
                                <ThemedText style={styles.checkoutText}>Proceed to Checkout</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    itemCountBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    itemCountText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyCart: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyCartIcon: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyCartTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyCartSubtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginBottom: 32,
    },
    shopNowButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    shopNowGradient: {
        paddingVertical: 16,
        paddingHorizontal: 40,
    },
    shopNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 120,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    removeButton: {
        padding: 4,
    },
    itemMeta: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    itemMetaText: {
        fontSize: 12,
        color: '#999',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F4FF',
        borderRadius: 12,
        padding: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    promoSection: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    promoInputContainer: {
        gap: 12,
    },
    promoHint: {
        fontSize: 13,
        color: '#999',
    },
    applyPromoButton: {
        backgroundColor: '#F0F4FF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyPromoText: {
        color: '#667eea',
        fontWeight: '600',
        fontSize: 14,
    },
    appliedPromo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 12,
    },
    appliedPromoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appliedPromoCode: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    appliedPromoDiscount: {
        fontSize: 13,
        color: '#4CAF50',
    },
    deliverySection: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    deliveryOptions: {
        gap: 12,
    },
    deliveryOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    deliveryOptionActive: {
        borderColor: '#667eea',
        backgroundColor: '#F0F4FF',
    },
    deliveryOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deliveryRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deliveryRadioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#667eea',
    },
    deliveryRadioInactive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    deliveryOptionTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    deliveryOptionSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    deliveryOptionPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667eea',
    },
    freeShippingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        backgroundColor: '#E0F7FA',
        padding: 12,
        borderRadius: 10,
    },
    freeShippingText: {
        fontSize: 13,
        color: '#00838F',
        fontWeight: '500',
    },
    summarySection: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    freeText: {
        color: '#4ECDC4',
        fontWeight: '600',
    },
    discountValue: {
        color: '#4CAF50',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#667eea',
    },
    secureSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    secureText: {
        fontSize: 13,
        color: '#999',
    },
    checkoutContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 16,
    },
    checkoutTotal: {
        alignItems: 'flex-start',
    },
    checkoutTotalLabel: {
        fontSize: 12,
        color: '#999',
    },
    checkoutTotalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#667eea',
    },
    checkoutButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    checkoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
