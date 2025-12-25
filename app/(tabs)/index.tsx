import { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FILTER_PANEL_WIDTH = 280;

// Dummy product data
const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 2453,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    badge: 'Best Seller',
    badgeColor: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Minimalist Smart Watch',
    price: 449.00,
    originalPrice: 599.00,
    rating: 4.9,
    reviews: 1872,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    badge: 'New',
    badgeColor: '#4ECDC4',
  },
  {
    id: '3',
    name: 'Designer Leather Bag',
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 986,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Fashion',
    badge: null,
    badgeColor: null,
  },
  {
    id: '4',
    name: 'Premium Sneakers',
    price: 159.00,
    originalPrice: 199.00,
    rating: 4.6,
    reviews: 3241,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Fashion',
    badge: 'Hot Deal',
    badgeColor: '#FF9F43',
  },
  {
    id: '5',
    name: 'Organic Skincare Set',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    category: 'Beauty',
    badge: '-38%',
    badgeColor: '#EE5A24',
  },
  {
    id: '6',
    name: 'Wireless Earbuds Pro',
    price: 199.00,
    originalPrice: 249.00,
    rating: 4.7,
    reviews: 4521,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    category: 'Electronics',
    badge: 'Popular',
    badgeColor: '#9B59B6',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'electronics', name: 'Electronics', icon: 'laptop' },
  { id: 'fashion', name: 'Fashion', icon: 'shirt' },
  { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
  { id: 'home', name: 'Home', icon: 'home' },
  { id: 'sports', name: 'Sports', icon: 'fitness' },
  { id: 'books', name: 'Books', icon: 'book' },
];

const FILTER_OPTIONS = {
  priceRanges: [
    { id: '1', label: 'Under $50', min: 0, max: 50 },
    { id: '2', label: '$50 - $100', min: 50, max: 100 },
    { id: '3', label: '$100 - $200', min: 100, max: 200 },
    { id: '4', label: '$200 - $500', min: 200, max: 500 },
    { id: '5', label: 'Over $500', min: 500, max: Infinity },
  ],
  ratings: [
    { id: '1', label: '4.5 & above', value: 4.5 },
    { id: '2', label: '4.0 & above', value: 4.0 },
    { id: '3', label: '3.5 & above', value: 3.5 },
  ],
  sortOptions: [
    { id: '1', label: 'Most Popular' },
    { id: '2', label: 'Price: Low to High' },
    { id: '3', label: 'Price: High to Low' },
    { id: '4', label: 'Newest First' },
    { id: '5', label: 'Top Rated' },
  ],
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('1');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filterAnimation = useRef(new Animated.Value(0)).current;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const toggleFilter = () => {
    const toValue = isFilterOpen ? 0 : 1;
    Animated.spring(filterAnimation, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filterTranslateX = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [FILTER_PANEL_WIDTH, 0],
  });

  const overlayOpacity = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const renderProductCard = (product: typeof PRODUCTS[0]) => {
    const isInWishlist = wishlist.includes(product.id);
    const discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

    return (
      <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.9}>
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            contentFit="cover"
            transition={300}
          />
          {product.badge && (
            <View style={[styles.productBadge, { backgroundColor: product.badgeColor }]}>
              <ThemedText style={styles.productBadgeText}>{product.badge}</ThemedText>
            </View>
          )}
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => toggleWishlist(product.id)}
          >
            <Ionicons
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={22}
              color={isInWishlist ? '#FF6B6B' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <ThemedText style={styles.productCategory}>{product.category}</ThemedText>
          <ThemedText style={styles.productName} numberOfLines={2}>
            {product.name}
          </ThemedText>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <ThemedText style={styles.ratingText}>{product.rating}</ThemedText>
            <ThemedText style={styles.reviewsText}>({product.reviews.toLocaleString()})</ThemedText>
          </View>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
            <ThemedText style={styles.originalPrice}>
              ${product.originalPrice.toFixed(2)}
            </ThemedText>
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>-{discount}%</ThemedText>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addToCartGradient}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={styles.welcomeText}>Welcome back! 👋</ThemedText>
            <ThemedText style={styles.headerTitle}>Discover Products</ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.notificationBadge}>
                <ThemedText style={styles.notificationCount}>3</ThemedText>
              </View>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.cartBadge}>
                <ThemedText style={styles.cartCount}>2</ThemedText>
              </View>
              <Ionicons name="cart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
            <Ionicons name="options" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    selectedCategory === category.id && styles.categoryIconContainerActive,
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={selectedCategory === category.id ? '#fff' : '#667eea'}
                  />
                </View>
                <ThemedText
                  style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.categoryNameActive,
                  ]}
                >
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Flash Sale Banner */}
        <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <View>
                <ThemedText style={styles.bannerSubtitle}>🔥 Flash Sale</ThemedText>
                <ThemedText style={styles.bannerTitle}>Up to 50% OFF</ThemedText>
                <ThemedText style={styles.bannerDescription}>
                  Limited time offer on selected items
                </ThemedText>
                <View style={styles.bannerButton}>
                  <ThemedText style={styles.bannerButtonText}>Shop Now</ThemedText>
                  <Ionicons name="arrow-forward" size={16} color="#FF6B6B" />
                </View>
              </View>
              <View style={styles.bannerTimerContainer}>
                <ThemedText style={styles.bannerTimerLabel}>Ends in</ThemedText>
                <View style={styles.timerBoxes}>
                  <View style={styles.timerBox}>
                    <ThemedText style={styles.timerNumber}>05</ThemedText>
                    <ThemedText style={styles.timerLabel}>hrs</ThemedText>
                  </View>
                  <ThemedText style={styles.timerSeparator}>:</ThemedText>
                  <View style={styles.timerBox}>
                    <ThemedText style={styles.timerNumber}>23</ThemedText>
                    <ThemedText style={styles.timerLabel}>min</ThemedText>
                  </View>
                  <ThemedText style={styles.timerSeparator}>:</ThemedText>
                  <View style={styles.timerBox}>
                    <ThemedText style={styles.timerNumber}>41</ThemedText>
                    <ThemedText style={styles.timerLabel}>sec</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Featured Products</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {PRODUCTS.map((product) => renderProductCard(product))}
          </View>
        </View>

        {/* Special Offer Banner */}
        <TouchableOpacity style={styles.specialOfferContainer} activeOpacity={0.9}>
          <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.specialOffer}
          >
            <View style={styles.specialOfferContent}>
              <ThemedText style={styles.specialOfferBadge}>EXCLUSIVE</ThemedText>
              <ThemedText style={styles.specialOfferTitle}>Premium Membership</ThemedText>
              <ThemedText style={styles.specialOfferDescription}>
                Get free shipping, early access & more
              </ThemedText>
              <View style={styles.specialOfferButton}>
                <ThemedText style={styles.specialOfferButtonText}>Join Now - $9.99/mo</ThemedText>
              </View>
            </View>
            <View style={styles.specialOfferDecoration}>
              <Ionicons name="diamond" size={80} color="rgba(255,255,255,0.1)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recently Viewed */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recently Viewed</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Clear All</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentlyViewedContainer}
          >
            {PRODUCTS.slice(0, 4).map((product) => (
              <TouchableOpacity key={product.id} style={styles.recentlyViewedItem}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.recentlyViewedImage}
                  contentFit="cover"
                  transition={200}
                />
                <ThemedText style={styles.recentlyViewedName} numberOfLines={1}>
                  {product.name}
                </ThemedText>
                <ThemedText style={styles.recentlyViewedPrice}>
                  ${product.price.toFixed(2)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Filter Overlay */}
      {isFilterOpen && (
        <Animated.View
          style={[styles.filterOverlay, { opacity: overlayOpacity }]}
        >
          <TouchableOpacity style={styles.overlayTouchable} onPress={toggleFilter} />
        </Animated.View>
      )}

      {/* Filter Panel */}
      <Animated.View
        style={[
          styles.filterPanel,
          {
            transform: [{ translateX: filterTranslateX }],
          },
        ]}
      >
        <View style={styles.filterHeader}>
          <ThemedText style={styles.filterTitle}>Filters</ThemedText>
          <TouchableOpacity onPress={toggleFilter}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
          {/* Sort By */}
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterSectionTitle}>Sort By</ThemedText>
            {FILTER_OPTIONS.sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterOption,
                  selectedSort === option.id && styles.filterOptionActive,
                ]}
                onPress={() => setSelectedSort(option.id)}
              >
                <ThemedText
                  style={[
                    styles.filterOptionText,
                    selectedSort === option.id && styles.filterOptionTextActive,
                  ]}
                >
                  {option.label}
                </ThemedText>
                {selectedSort === option.id && (
                  <Ionicons name="checkmark" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterSectionTitle}>Price Range</ThemedText>
            {FILTER_OPTIONS.priceRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.filterOption,
                  selectedPriceRange === range.id && styles.filterOptionActive,
                ]}
                onPress={() =>
                  setSelectedPriceRange(selectedPriceRange === range.id ? null : range.id)
                }
              >
                <ThemedText
                  style={[
                    styles.filterOptionText,
                    selectedPriceRange === range.id && styles.filterOptionTextActive,
                  ]}
                >
                  {range.label}
                </ThemedText>
                {selectedPriceRange === range.id && (
                  <Ionicons name="checkmark" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating */}
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterSectionTitle}>Customer Rating</ThemedText>
            {FILTER_OPTIONS.ratings.map((rating) => (
              <TouchableOpacity
                key={rating.id}
                style={[
                  styles.filterOption,
                  selectedRating === rating.id && styles.filterOptionActive,
                ]}
                onPress={() =>
                  setSelectedRating(selectedRating === rating.id ? null : rating.id)
                }
              >
                <View style={styles.ratingOption}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <ThemedText
                    style={[
                      styles.filterOptionText,
                      selectedRating === rating.id && styles.filterOptionTextActive,
                    ]}
                  >
                    {rating.label}
                  </ThemedText>
                </View>
                {selectedRating === rating.id && (
                  <Ionicons name="checkmark" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Filter Actions */}
        <View style={styles.filterActions}>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedPriceRange(null);
              setSelectedRating(null);
              setSelectedSort('1');
            }}
          >
            <ThemedText style={styles.clearFiltersText}>Clear All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyFiltersButton} onPress={toggleFilter}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyFiltersGradient}
            >
              <ThemedText style={styles.applyFiltersText}>Apply Filters</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cartCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryItemActive: {},
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIconContainerActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  categoryNameActive: {
    color: '#667eea',
    fontWeight: '700',
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  banner: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 12,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  bannerButtonText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 13,
  },
  bannerTimerContainer: {
    alignItems: 'center',
  },
  bannerTimerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 8,
  },
  timerBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  timerNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  timerSeparator: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  productCard: {
    width: (SCREEN_WIDTH - 40) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    height: 160,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  productBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 14,
  },
  productCategory: {
    color: '#999',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewsText: {
    color: '#999',
    fontSize: 11,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FFE8E8',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  discountText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addToCartButton: {
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  specialOfferContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  specialOffer: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  specialOfferContent: {
    zIndex: 1,
  },
  specialOfferBadge: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  specialOfferTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  specialOfferDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 16,
  },
  specialOfferButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  specialOfferButtonText: {
    color: '#0F2027',
    fontWeight: 'bold',
    fontSize: 14,
  },
  specialOfferDecoration: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -40 }],
    opacity: 0.5,
  },
  recentlyViewedContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  recentlyViewedItem: {
    width: 120,
    marginRight: 16,
  },
  recentlyViewedImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 8,
  },
  recentlyViewedName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  recentlyViewedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 100,
  },
  overlayTouchable: {
    flex: 1,
  },
  filterPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: FILTER_PANEL_WIDTH,
    backgroundColor: '#fff',
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  filterOptionActive: {
    backgroundColor: '#F0F4FF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFiltersText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  applyFiltersButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyFiltersGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyFiltersText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
