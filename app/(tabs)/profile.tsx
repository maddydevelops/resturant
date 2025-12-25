import { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
    StatusBar,
    Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy user data
const USER_DATA = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    memberSince: 'March 2023',
    membershipTier: 'Gold',
    totalOrders: 47,
    wishlistItems: 12,
    rewardPoints: 2450,
};

const MENU_SECTIONS = [
    {
        title: 'My Account',
        items: [
            { id: 'orders', icon: 'cube-outline', label: 'My Orders', badge: '3', color: '#667eea' },
            { id: 'wishlist', icon: 'heart-outline', label: 'Wishlist', badge: '12', color: '#FF6B6B' },
            { id: 'addresses', icon: 'location-outline', label: 'Saved Addresses', color: '#4ECDC4' },
            { id: 'payments', icon: 'card-outline', label: 'Payment Methods', color: '#FFB347' },
        ],
    },
    {
        title: 'Preferences',
        items: [
            { id: 'notifications', icon: 'notifications-outline', label: 'Notifications', toggle: true, color: '#9B59B6' },
            { id: 'darkmode', icon: 'moon-outline', label: 'Dark Mode', toggle: true, color: '#34495e' },
            { id: 'language', icon: 'globe-outline', label: 'Language', value: 'English', color: '#3498db' },
            { id: 'currency', icon: 'cash-outline', label: 'Currency', value: 'USD', color: '#27ae60' },
        ],
    },
    {
        title: 'Support',
        items: [
            { id: 'help', icon: 'help-circle-outline', label: 'Help Center', color: '#667eea' },
            { id: 'chat', icon: 'chatbubbles-outline', label: 'Live Chat', color: '#4ECDC4' },
            { id: 'faq', icon: 'document-text-outline', label: 'FAQs', color: '#FFB347' },
            { id: 'feedback', icon: 'star-outline', label: 'Rate Us', color: '#FFD700' },
        ],
    },
    {
        title: 'Legal',
        items: [
            { id: 'privacy', icon: 'shield-outline', label: 'Privacy Policy', color: '#666' },
            { id: 'terms', icon: 'document-outline', label: 'Terms of Service', color: '#666' },
        ],
    },
];

const RECENT_ORDERS = [
    {
        id: 'ORD-2024-001',
        date: 'Dec 20, 2024',
        status: 'Delivered',
        total: 299.99,
        items: 2,
        statusColor: '#4ECDC4',
    },
    {
        id: 'ORD-2024-002',
        date: 'Dec 18, 2024',
        status: 'In Transit',
        total: 159.00,
        items: 1,
        statusColor: '#FFB347',
    },
    {
        id: 'ORD-2024-003',
        date: 'Dec 15, 2024',
        status: 'Processing',
        total: 449.00,
        items: 3,
        statusColor: '#667eea',
    },
];

export default function ProfileScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const renderMenuItem = (item: any) => {
        const isToggle = item.toggle;
        const toggleValue = item.id === 'notifications' ? notificationsEnabled : darkModeEnabled;
        const onToggle = item.id === 'notifications' ? setNotificationsEnabled : setDarkModeEnabled;

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={isToggle ? 1 : 0.7}
            >
                <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                        <Ionicons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <ThemedText style={styles.menuItemLabel}>{item.label}</ThemedText>
                </View>
                <View style={styles.menuItemRight}>
                    {item.badge && (
                        <View style={styles.menuBadge}>
                            <ThemedText style={styles.menuBadgeText}>{item.badge}</ThemedText>
                        </View>
                    )}
                    {item.value && (
                        <ThemedText style={styles.menuItemValue}>{item.value}</ThemedText>
                    )}
                    {isToggle ? (
                        <Switch
                            value={toggleValue}
                            onValueChange={onToggle}
                            trackColor={{ false: '#ddd', true: '#667eea' }}
                            thumbColor="#fff"
                        />
                    ) : (
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header with Profile */}
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerTop}>
                        <ThemedText style={styles.headerTitle}>My Profile</ThemedText>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Ionicons name="settings-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: USER_DATA.avatar }}
                                style={styles.avatar}
                                contentFit="cover"
                                transition={200}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.membershipBadge}>
                                <Ionicons name="diamond" size={12} color="#FFD700" />
                            </View>
                        </View>
                        <ThemedText style={styles.userName}>{USER_DATA.name}</ThemedText>
                        <ThemedText style={styles.userEmail}>{USER_DATA.email}</ThemedText>
                        <View style={styles.membershipInfo}>
                            <View style={styles.membershipTierBadge}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <ThemedText style={styles.membershipTierText}>
                                    {USER_DATA.membershipTier} Member
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="cube" size={24} color="#fff" />
                            <ThemedText style={styles.statNumber}>{USER_DATA.totalOrders}</ThemedText>
                            <ThemedText style={styles.statLabel}>Orders</ThemedText>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient
                            colors={['#FF6B6B', '#FF8E53']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="heart" size={24} color="#fff" />
                            <ThemedText style={styles.statNumber}>{USER_DATA.wishlistItems}</ThemedText>
                            <ThemedText style={styles.statLabel}>Wishlist</ThemedText>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient
                            colors={['#4ECDC4', '#44A08D']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="gift" size={24} color="#fff" />
                            <ThemedText style={styles.statNumber}>{USER_DATA.rewardPoints}</ThemedText>
                            <ThemedText style={styles.statLabel}>Points</ThemedText>
                        </LinearGradient>
                    </View>
                </View>

                {/* Recent Orders */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Recent Orders</ThemedText>
                        <TouchableOpacity>
                            <ThemedText style={styles.seeAllText}>See All</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.ordersContainer}
                    >
                        {RECENT_ORDERS.map((order) => (
                            <TouchableOpacity key={order.id} style={styles.orderCard}>
                                <View style={styles.orderHeader}>
                                    <ThemedText style={styles.orderId}>{order.id}</ThemedText>
                                    <View style={[styles.orderStatus, { backgroundColor: `${order.statusColor}20` }]}>
                                        <View style={[styles.orderStatusDot, { backgroundColor: order.statusColor }]} />
                                        <ThemedText style={[styles.orderStatusText, { color: order.statusColor }]}>
                                            {order.status}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.orderDetails}>
                                    <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
                                    <ThemedText style={styles.orderItems}>{order.items} items</ThemedText>
                                </View>
                                <View style={styles.orderFooter}>
                                    <ThemedText style={styles.orderTotal}>${order.total.toFixed(2)}</ThemedText>
                                    <TouchableOpacity style={styles.trackButton}>
                                        <ThemedText style={styles.trackButtonText}>Track</ThemedText>
                                        <Ionicons name="arrow-forward" size={14} color="#667eea" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Rewards Card */}
                <TouchableOpacity style={styles.rewardsCard} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#0F2027', '#203A43', '#2C5364']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.rewardsGradient}
                    >
                        <View style={styles.rewardsContent}>
                            <View style={styles.rewardsLeft}>
                                <View style={styles.rewardsIconContainer}>
                                    <Ionicons name="gift" size={28} color="#FFD700" />
                                </View>
                                <View>
                                    <ThemedText style={styles.rewardsTitle}>Rewards Balance</ThemedText>
                                    <ThemedText style={styles.rewardsPoints}>{USER_DATA.rewardPoints} points</ThemedText>
                                </View>
                            </View>
                            <View style={styles.rewardsRight}>
                                <ThemedText style={styles.rewardsValue}>~${(USER_DATA.rewardPoints / 100).toFixed(2)}</ThemedText>
                                <View style={styles.redeemButton}>
                                    <ThemedText style={styles.redeemButtonText}>Redeem</ThemedText>
                                </View>
                            </View>
                        </View>
                        <View style={styles.rewardsProgress}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '65%' }]} />
                            </View>
                            <ThemedText style={styles.progressText}>550 more points to Platinum</ThemedText>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Menu Sections */}
                {MENU_SECTIONS.map((section) => (
                    <View key={section.title} style={styles.menuSection}>
                        <ThemedText style={styles.menuSectionTitle}>{section.title}</ThemedText>
                        <View style={styles.menuCard}>
                            {section.items.map((item, index) => (
                                <View key={item.id}>
                                    {renderMenuItem(item)}
                                    {index < section.items.length - 1 && <View style={styles.menuDivider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
                    <ThemedText style={styles.logoutText}>Log Out</ThemedText>
                </TouchableOpacity>

                {/* App Version */}
                <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
        paddingHorizontal: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileSection: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    membershipBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    userName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 12,
    },
    membershipInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    membershipTierBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
    },
    membershipTierText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    statGradient: {
        padding: 16,
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '600',
    },
    ordersContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    orderCard: {
        width: 240,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        gap: 6,
    },
    orderStatusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    orderStatusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 13,
        color: '#999',
    },
    orderItems: {
        fontSize: 13,
        color: '#999',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trackButtonText: {
        color: '#667eea',
        fontSize: 13,
        fontWeight: '600',
    },
    rewardsCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    rewardsGradient: {
        padding: 20,
    },
    rewardsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    rewardsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    rewardsIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,215,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardsTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    rewardsPoints: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rewardsRight: {
        alignItems: 'flex-end',
    },
    rewardsValue: {
        color: '#4ECDC4',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    redeemButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    redeemButtonText: {
        color: '#0F2027',
        fontSize: 13,
        fontWeight: 'bold',
    },
    rewardsProgress: {
        gap: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 3,
    },
    progressText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        textAlign: 'center',
    },
    menuSection: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    menuSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuBadge: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    menuBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    menuItemValue: {
        color: '#999',
        fontSize: 14,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginLeft: 70,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 32,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#FFF5F5',
        gap: 10,
    },
    logoutText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginTop: 20,
        marginBottom: 20,
    },
});
