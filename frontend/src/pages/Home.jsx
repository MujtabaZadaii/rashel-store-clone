import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ArrowRight, Star, Heart, Flame, Percent, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  
  const [sliders, setSliders] = useState([
    { title: 'Freshness from Head to Toe', subtitle: 'Flat 20% Off Shower Essentials & De-Tan Ranges', image_url: '/Shower_Essentials_Sale_Website_Banner-01.png' },
    { title: 'Exclusive Tiered Offers', subtitle: 'Shop more, save more with special discount tiers', image_url: '/Tiered_Offer_Campaign_Website_Banner_1-01.png' },
    { title: 'Professional Botanical Care', subtitle: 'Clinically proven vegan skincare formulations', image_url: '/jamal_website_banner_desktop_jpg_791fe946-fb17-4db6-854f-f3fcbfbfd38c.png' }
  ]);
  const [banners, setBanners] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'K-Derma', slug: 'k-derma', image_url: '/Range-08.png' },
    { id: 2, name: 'Scrub', slug: 'scrub', image_url: '/Range-01.png' },
    { id: 3, name: 'Nose Strips', slug: 'nose-strips', image_url: '/Range.jpg_1.png' },
    { id: 4, name: 'Face wash', slug: 'face-wash', image_url: '/Range-02.png' },
    { id: 5, name: 'Shop Under 99', slug: 'shop-under-99', image_url: '/Range.jpg_4.png' },
    { id: 6, name: 'Sunscreen', slug: 'sunscreen', image_url: '/Range-05.png' }
  ]);
  const [shopByCategories, setShopByCategories] = useState([
    { id: 1, name: 'Scrub', slug: 'scrub', image_url: '/Shop_By_Category/shop_by_category_summer_theme-02_jpg.png' },
    { id: 2, name: 'Face wash', slug: 'face-wash', image_url: '/Shop_By_Category/shop_by_category_summer_theme-03_jpg.png' },
    { id: 3, name: 'Sunscreen', slug: 'sunscreen', image_url: '/Shop_By_Category/shop_by_category_summer_theme-04_jpg.png' },
    { id: 4, name: 'Nose Strips', slug: 'nose-strips', image_url: '/Shop_By_Category/shop_by_category_summer_theme-01.jpg_1.png' },
    { id: 5, name: 'K-Derma', slug: 'k-derma', image_url: '/Range-08.png' },
    { id: 6, name: 'Shop Under 99', slug: 'shop-under-99', image_url: '/Range.jpg_4.png' }
  ]);
  const [loading, setLoading] = useState(true);

  // Concern Selector state
  const [selectedConcern, setSelectedConcern] = useState('Glass Skin');
  const [activeBestsellerCategory, setActiveBestsellerCategory] = useState('Scrub');
  
  // Hero slider index
  const [activeSlide, setActiveSlide] = useState(0);

  // Rice Water Hero slider states
  const [riceBanners, setRiceBanners] = useState([
    { image_url: '/hero_rice/Rice_Water_Serum_Website_Banner-01_11zon.png', link_url: '/shop?search=Rice' },
    { image_url: '/hero_rice/fab_five_Banner-1920x512_jpg.png', link_url: '/shop?search=Rice' }
  ]);
  const [activeRiceSlide, setActiveRiceSlide] = useState(0);

  // Product slider states
  const [productSlideIndex, setProductSlideIndex] = useState(0);
  const [isProductSliderPaused, setIsProductSliderPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Rice Water product slider states
  const [riceSlideIndex, setRiceSlideIndex] = useState(0);
  const [isRiceSliderPaused, setIsRiceSliderPaused] = useState(false);
  const [riceVisibleCount, setRiceVisibleCount] = useState(5);
  const [riceTransitionEnabled, setRiceTransitionEnabled] = useState(true);

  const [sliderProducts, setSliderProducts] = useState([
    { id: 1, name: 'Vitamin C Cleansing Gel', slug: 'vitamin-c-cleansing-gel', price: 349, originalPrice: 449, discount: '22% OFF', image: '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_4.png', rating: 4.8 },
    { id: 2, name: 'Charcoal Blackhead Mask', slug: 'charcoal-blackhead-mask', price: 399, originalPrice: 499, discount: '20% OFF', image: '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_5.png', rating: 4.7 },
    { id: 3, name: 'Gold Revitalizing Eye Gel', slug: 'gold-revitalizing-eye-gel', price: 549, originalPrice: 799, discount: '31% OFF', image: '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_6.png', rating: 4.9 },
    { id: 4, name: 'Salicylic Acid Clay Cleanser', slug: 'salicylic-acid-clay-cleanser', price: 299, originalPrice: 399, discount: '25% OFF', image: '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_7.png', rating: 4.6 },
    { id: 5, name: 'Vitamin C Brightening Fluid', slug: 'vitamin-c-brightening-fluid', price: 479, originalPrice: 599, discount: '20% OFF', image: '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_8.png', rating: 4.8 }
  ]);

  // BOGO (Buy One Get One) slider states
  const [bogoSlideIndex, setBogoSlideIndex] = useState(0);
  const [isBogoSliderPaused, setIsBogoSliderPaused] = useState(false);
  const [bogoVisibleCount, setBogoVisibleCount] = useState(2);
  const [bogoTransitionEnabled, setBogoTransitionEnabled] = useState(true);

  const [bogoProducts, setBogoProducts] = useState([
    { id: 1, image: '/byone_getfree/Buy1Get1Free_V2-04.jpg_1.png', title: 'Vitamin C Face Wash BOGO' },
    { id: 2, image: '/byone_getfree/Buy1Get1Free_V2-06.jpg_1.png', title: 'Korean Glass Skin Wash BOGO' },
    { id: 3, image: '/byone_getfree/WhatsAppImage2026-05-22at1.27.08PM_1.png', title: 'De-Tan Face Pack BOGO' },
    { id: 4, image: '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM.png', title: 'Charcoal Scrub BOGO' },
    { id: 5, image: '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM_1.png', title: 'Nose Strips Pack BOGO' },
    { id: 6, image: '/byone_getfree/WhatsAppImage2026-05-22at1.27.10PM.png', title: 'Sunscreen Gel BOGO' }
  ]);

  const [superSaverCombos, setSuperSaverCombos] = useState([
    { id: 1, image: '/Super_Saver_Combos/Combos_749_jpg.png', title: 'Combos @ 749' },
    { id: 2, image: '/Super_Saver_Combos/Combos_1099.jpg_1.png', title: 'Combos @ 1099' },
    { id: 3, image: '/Super_Saver_Combos/Combos_1499.jpg_1.png', title: 'Combos @ 1499' }
  ]);

  const [koreanBanner, setKoreanBanner] = useState({
    image_url: '/koren_products/korean_range_summer_theme-01_jpg.png',
    title: 'NO DRAMA, ONLY FLAWLESS GLOW!',
    link_url: '/shop'
  });
  const [koreanCards, setKoreanCards] = useState([
    { id: 'kc1', image_url: '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM.png', title: 'Korean Pack of 4 Flat 25% Off', link_url: '/shop' },
    { id: 'kc2', image_url: '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_1.png', title: 'Korean CSMS Flat 46% Off', link_url: '/shop' },
    { id: 'kc3', image_url: '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_2.png', title: 'Korean Glass Skin Set Flat 43% Off', link_url: '/shop' },
    { id: 'kc4', image_url: '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_3.png', title: 'Explore Korean Range Flat 50% Off', link_url: '/shop' }
  ]);

  const [shopBestsellers, setShopBestsellers] = useState([
    {
      id: 'sb1',
      name: 'Korean Glass Skin Essence Scrub - 380 ml',
      slug: 'korean-glass-skin-essence-scrub-380-ml',
      image: '/Shop_our_Bestsellers/Korean_Glass_Skin_Scrub.png',
      rating: 5,
      reviews: 30,
      price: 250,
      sale_price: 200,
      discount: '20% OFF',
      variants: [
        { id: 'sb1-var', sku: 'KGS-SCRUB-380ML', size: 'Standard', volume: '380ml', price: 250, sale_price: 200, stock: 50, image_url: '/Shop_our_Bestsellers/Korean_Glass_Skin_Scrub.png' }
      ]
    },
    {
      id: 'sb2',
      name: 'Rice Water Scrub - 380 ml',
      slug: 'rice-water-scrub-380-ml',
      image: '/Shop_our_Bestsellers/Rice_Water_Scrub_Front_Angle.png',
      rating: 5,
      reviews: 45,
      price: 299,
      sale_price: 223,
      discount: '25% OFF',
      variants: [
        { id: 'sb2-var', sku: 'RW-SCRUB-380ML', size: 'Standard', volume: '380ml', price: 299, sale_price: 223, stock: 50, image_url: '/Shop_our_Bestsellers/Rice_Water_Scrub_Front_Angle.png' }
      ]
    },
    {
      id: 'sb3',
      name: 'White Skin Scrub - 380 ml',
      slug: 'white-skin-scrub-380-ml',
      image: '/Shop_our_Bestsellers/Withe_Skin_Scrub_Front_Angle.png',
      rating: 5,
      reviews: 60,
      price: 299,
      sale_price: 223,
      discount: '25% OFF',
      variants: [
        { id: 'sb3-var', sku: 'WS-SCRUB-380ML', size: 'Standard', volume: '380ml', price: 299, sale_price: 223, stock: 50, image_url: '/Shop_our_Bestsellers/Withe_Skin_Scrub_Front_Angle.png' }
      ]
    },
    {
      id: 'sb4',
      name: 'Hyaluronic Acid Scrub - 380 ml',
      slug: 'hyaluronic-acid-scrub-380-ml',
      image: '/Shop_our_Bestsellers/Hyaluronic_Acid_Scrub_Front_Angle.png',
      rating: 5,
      reviews: 75,
      price: 250,
      sale_price: 223,
      discount: '11% OFF',
      variants: [
        { id: 'sb4-var', sku: 'HA-SCRUB-380ML', size: 'Standard', volume: '380ml', price: 250, sale_price: 223, stock: 50, image_url: '/Shop_our_Bestsellers/Hyaluronic_Acid_Scrub_Front_Angle.png' }
      ]
    },
    {
      id: 'sb5',
      name: 'Coffee Scrub - 380 ml',
      slug: 'coffee-scrub-380-ml',
      image: '/Shop_our_Bestsellers/Coffee_Scrub_Front.png',
      rating: 5,
      reviews: 90,
      price: 275,
      sale_price: 223,
      discount: '19% OFF',
      variants: [
        { id: 'sb5-var', sku: 'CF-SCRUB-380ML', size: 'Standard', volume: '380ml', price: 275, sale_price: 223, stock: 50, image_url: '/Shop_our_Bestsellers/Coffee_Scrub_Front.png' }
      ]
    }
  ]);

  const [riceProducts, setRiceProducts] = useState([
    {
      id: 'rp1',
      name: 'Rice Water Face Serum (50ml)',
      slug: 'rice-water-face-serum-50ml',
      image: '/hero_rice_products/RiceWaterSerumSlide-01_11zon.png',
      rating: 5,
      reviews: 142,
      price: 599,
      sale_price: 449,
      discount: '25% OFF',
      variants: [
        { id: 'rp1-var', sku: 'RW-SERUM-50ML', size: 'Standard', volume: '50ml', price: 599, sale_price: 449, stock: 50, image_url: '/hero_rice_products/RiceWaterSerumSlide-01_11zon.png' }
      ]
    },
    {
      id: 'rp2',
      name: 'Rice Water Day Cream (50g)',
      slug: 'rice-water-day-cream-50g',
      image: '/hero_rice_products/RiceWaterDayCreamSlide-01_11zon.png',
      rating: 5,
      reviews: 96,
      price: 499,
      sale_price: 399,
      discount: '20% OFF',
      variants: [
        { id: 'rp2-var', sku: 'RW-CREAM-50G', size: 'Standard', volume: '50g', price: 499, sale_price: 399, stock: 50, image_url: '/hero_rice_products/RiceWaterDayCreamSlide-01_11zon.png' }
      ]
    },
    {
      id: 'rp3',
      name: 'K-Derma Glass Skin Serum',
      slug: 'k-derma-glass-skin-serum',
      image: '/hero_rice_products/Koreanserumslide-01.png',
      rating: 5,
      reviews: 115,
      price: 699,
      sale_price: 499,
      discount: '28% OFF',
      variants: [
        { id: 'rp3-var', sku: 'KD-SERUM', size: 'Standard', volume: '30ml', price: 699, sale_price: 499, stock: 50, image_url: '/hero_rice_products/Koreanserumslide-01.png' }
      ]
    },
    {
      id: 'rp4',
      name: 'K-Derma Glass Skin Cleanser (45ml)',
      slug: 'k-derma-glass-skin-cleanser-45ml',
      image: '/hero_rice_products/KoreanJar45mlcleanserProductslide_1_jpg.png',
      rating: 4,
      reviews: 84,
      price: 399,
      sale_price: 299,
      discount: '25% OFF',
      variants: [
        { id: 'rp4-var', sku: 'KD-CLEANSER-45ML', size: 'Standard', volume: '45ml', price: 399, sale_price: 299, stock: 50, image_url: '/hero_rice_products/KoreanJar45mlcleanserProductslide_1_jpg.png' }
      ]
    },
    {
      id: 'rp5',
      name: 'K-Derma Glass Skin Travel Pack',
      slug: 'k-derma-glass-skin-travel-pack',
      image: '/hero_rice_products/KoreanPouchSlide-01.png',
      rating: 5,
      reviews: 73,
      price: 899,
      sale_price: 699,
      discount: '22% OFF',
      variants: [
        { id: 'rp5-var', sku: 'KD-TRAVEL-PACK', size: 'Standard', volume: 'Pack', price: 899, sale_price: 699, stock: 50, image_url: '/hero_rice_products/KoreanPouchSlide-01.png' }
      ]
    },
    {
      id: 'rp6',
      name: 'K-Derma Hydrating Face Mask',
      slug: 'k-derma-hydrating-face-mask',
      image: '/hero_rice_products/Korean_Face_Mask.png',
      rating: 5,
      reviews: 108,
      price: 299,
      sale_price: 199,
      discount: '33% OFF',
      variants: [
        { id: 'rp6-var', sku: 'KD-FACE-MASK', size: 'Standard', volume: '1pc', price: 299, sale_price: 199, stock: 50, image_url: '/hero_rice_products/Korean_Face_Mask.png' }
      ]
    },
    {
      id: 'rp7',
      name: 'Dr. Rashel Fab 5 Skincare Kit',
      slug: 'dr-rashel-fab-5-skincare-kit',
      image: '/hero_rice_products/Fab5Slide-01.png',
      rating: 5,
      reviews: 210,
      price: 1499,
      sale_price: 999,
      discount: '33% OFF',
      variants: [
        { id: 'rp7-var', sku: 'DR-FAB5-KIT', size: 'Standard', volume: 'Kit', price: 1499, sale_price: 999, stock: 50, image_url: '/hero_rice_products/Fab5Slide-01.png' }
      ]
    }
  ]);

  // GSAP animation refs
  const heroRef = useRef(null);
  const concernsRef = useRef(null);
  const cardsRef = useRef([]);

  const mapProductData = (p) => {
    const originalPrice = p.min_price || 0;
    const salePrice = p.min_sale_price || originalPrice;
    const discountVal = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
    const discountStr = discountVal > 0 ? `${discountVal}% OFF` : '';
    
    const formattedVariants = p.variants ? p.variants.map(v => ({
      id: v.id,
      sku: v.sku,
      size: v.size || 'Standard',
      volume: v.volume || 'Standard',
      price: v.price,
      sale_price: v.sale_price,
      stock: v.stock,
      image_url: v.image_url || p.image_url
    })) : [];

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.image_url || 'https://via.placeholder.com/300',
      rating: parseFloat(p.rating) || 5,
      reviews: p.reviews_count || Math.floor(Math.random() * 80) + 20,
      price: originalPrice,
      sale_price: salePrice,
      originalPrice: originalPrice,
      discount: discountStr,
      variants: formattedVariants
    };
  };

  // Fetch Homepage Data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const promoRes = await axios.get('/api/general/promos');
        if (promoRes.data.success) {
          if (promoRes.data.sliders && promoRes.data.sliders.length > 0) {
            setSliders(promoRes.data.sliders);
          }
          setBanners(promoRes.data.banners);
            const activeBns = promoRes.data.banners
              .filter(b => b.position === 'rice_water_hero' && b.status === 'active');
            if (activeBns.length > 0) {
              setRiceBanners(activeBns);
            }

            const bogoBns = promoRes.data.banners
              .filter(b => b.position === 'bogo_deal' && b.status === 'active')
              .map(b => ({
                id: b.id,
                image: b.image_url,
                title: b.title,
                link_url: b.link_url
              }));
            if (bogoBns.length > 0) {
              setBogoProducts(bogoBns);
            }

            const comboBns = promoRes.data.banners
              .filter(b => b.position === 'super_saver_combo' && b.status === 'active')
              .map(b => ({
                id: b.id,
                image: b.image_url,
                title: b.title,
                link_url: b.link_url
              }));
            if (comboBns.length > 0) {
              setSuperSaverCombos(comboBns);
            }

            const korBns = promoRes.data.banners
              .filter(b => b.position === 'korean_range_banner' && b.status === 'active');
            if (korBns.length > 0) {
              setKoreanBanner(korBns[0]);
            }

            const korCds = promoRes.data.banners
              .filter(b => b.position === 'korean_range_card' && b.status === 'active');
            if (korCds.length > 0) {
              setKoreanCards(korCds);
            }
          }
        } catch (error) {
          console.error("Error fetching promos:", error);
        }
        
        try {
          const catRes = await axios.get('/api/products/categories');
          if (catRes.data.success && catRes.data.categories && catRes.data.categories.length > 0) {
            setCategories(catRes.data.categories);
          }
        } catch (catErr) {
          console.warn('Failed to fetch categories, using mock defaults');
        }

        try {
          const sbcRes = await axios.get('/api/general/shop-by-categories');
          if (sbcRes.data.success && sbcRes.data.categories && sbcRes.data.categories.length > 0) {
            setShopByCategories(sbcRes.data.categories);
          }
        } catch (sbcErr) {
          console.warn('Failed to fetch shop-by-categories, using mock defaults');
        }

        try {
          const prodRes = await axios.get('/api/products?tag=Best+Seller');
          if (prodRes.data.success && prodRes.data.products && prodRes.data.products.length > 0) {
            setShopBestsellers(prodRes.data.products.map(mapProductData));
          }
        } catch (bestErr) {
          console.warn('Failed to fetch bestsellers, using mock defaults');
        }

        try {
          const sliderProdRes = await axios.get('/api/products?tag=Discount+Offer');
          if (sliderProdRes.data.success && sliderProdRes.data.products && sliderProdRes.data.products.length > 0) {
            setSliderProducts(sliderProdRes.data.products.map(mapProductData));
          }
        } catch (slideErr) {
          console.warn('Failed to fetch slider products, using mock defaults');
        }

        try {
          const riceRes = await axios.get('/api/products?category=face-care');
          if (riceRes.data.success && riceRes.data.products && riceRes.data.products.length > 0) {
            setRiceProducts(riceRes.data.products.map(mapProductData));
          }
        } catch (riceErr) {
          console.warn('Failed to fetch face-care/rice products, using mock defaults');
        }
        setLoading(false);
    };
    fetchHomeData();
  }, []);

  // Auto slide effect for hero banners (changes slide every 5 seconds)
  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  // Auto slide effect for Rice Water hero banners (changes slide every 5 seconds)
  useEffect(() => {
    if (riceBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveRiceSlide((prev) => (prev + 1) % riceBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [riceBanners.length]);

  // Fetch Bestsellers when category changes
  useEffect(() => {
    const fetchBestsellersByCategory = async () => {
      try {
        let url = '/api/products';
        if (activeBestsellerCategory !== 'View All') {
          const slug = activeBestsellerCategory.toLowerCase().replace(/\s+/g, '-');
          url = `/api/products?category=${slug}`;
        } else {
          url = '/api/products?tag=Best+Seller';
        }
        const res = await axios.get(url);
        if (res.data.success && res.data.products) {
          setShopBestsellers(res.data.products.map(mapProductData));
        }
      } catch (err) {
        console.warn('Failed to fetch bestsellers for category:', activeBestsellerCategory, err);
      }
    };
    fetchBestsellersByCategory();
  }, [activeBestsellerCategory]);

  // Handle resize for visibleCount in product slider
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide effect for product slider (changes every 2 seconds, paused on hover)
  useEffect(() => {
    if (isProductSliderPaused) return;
    const interval = setInterval(() => {
      setProductSlideIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isProductSliderPaused]);

  // Handle seamless loop reset
  const handleTransitionEnd = () => {
    if (productSlideIndex >= sliderProducts.length) {
      setTransitionEnabled(false);
      setProductSlideIndex(0);
    }
  };

  // Re-enable transition after reset
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  const handlePrevProduct = () => {
    if (productSlideIndex === 0) {
      setTransitionEnabled(false);
      setProductSlideIndex(sliderProducts.length);
      setTimeout(() => {
        setTransitionEnabled(true);
        setProductSlideIndex(sliderProducts.length - 1);
      }, 50);
    } else {
      setProductSlideIndex(prev => prev - 1);
    }
  };

  const handleNextProduct = () => {
    setProductSlideIndex(prev => prev + 1);
  };

  // Handle resize for bogoVisibleCount in BOGO slider
  useEffect(() => {
    const handleResize = () => {
      setBogoVisibleCount(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide effect for BOGO slider (changes every 2 seconds, paused on hover)
  useEffect(() => {
    if (isBogoSliderPaused) return;
    const interval = setInterval(() => {
      setBogoSlideIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isBogoSliderPaused]);

  // Handle BOGO seamless loop reset
  const handleBogoTransitionEnd = () => {
    if (bogoSlideIndex >= bogoProducts.length) {
      setBogoTransitionEnabled(false);
      setBogoSlideIndex(0);
    }
  };

  // Re-enable BOGO transition after reset
  useEffect(() => {
    if (!bogoTransitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setBogoTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [bogoTransitionEnabled]);

  const handlePrevBogo = () => {
    if (bogoSlideIndex === 0) {
      setBogoTransitionEnabled(false);
      setBogoSlideIndex(bogoProducts.length);
      setTimeout(() => {
        setBogoTransitionEnabled(true);
        setBogoSlideIndex(bogoProducts.length - 1);
      }, 50);
    } else {
      setBogoSlideIndex(prev => prev - 1);
    }
  };

  const handleNextBogo = () => {
    setBogoSlideIndex(prev => prev + 1);
  };

  // Handle resize for riceVisibleCount in Rice Water product slider
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRiceVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setRiceVisibleCount(3);
      } else {
        setRiceVisibleCount(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide effect for Rice Water product slider (changes every 2.5 seconds, paused on hover)
  useEffect(() => {
    if (isRiceSliderPaused) return;
    const interval = setInterval(() => {
      setRiceSlideIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isRiceSliderPaused]);

  // Handle Rice Water product slider seamless loop reset
  const handleRiceTransitionEnd = () => {
    if (riceSlideIndex >= riceProducts.length) {
      setRiceTransitionEnabled(false);
      setRiceSlideIndex(0);
    }
  };

  // Re-enable Rice Water transition after reset
  useEffect(() => {
    if (!riceTransitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setRiceTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [riceTransitionEnabled]);

  const handlePrevRiceProducts = () => {
    if (riceSlideIndex === 0) {
      setRiceTransitionEnabled(false);
      setRiceSlideIndex(riceProducts.length);
      setTimeout(() => {
        setRiceTransitionEnabled(true);
        setRiceSlideIndex(riceProducts.length - 1);
      }, 50);
    } else {
      setRiceSlideIndex(prev => prev - 1);
    }
  };

  const handleNextRiceProducts = () => {
    setRiceSlideIndex(prev => prev + 1);
  };

  // GSAP animation triggers
  useEffect(() => {
    if (!loading) {
      // Hero Slider Entry
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-fade'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );

      // Scroll reveal concerns grid
      gsap.fromTo(
        concernsRef.current?.querySelectorAll('.concern-card'),
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: concernsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Best sellers card scroll reveals
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bestsellers-section',
            start: 'top 75%'
          }
        }
      );
    }
  }, [loading, activeSlide]);

  const concerns = [
    { title: 'Glass Skin', desc: 'Fermented rice extract to tighten pores & smooth scars.', tag: 'Glass Skin' },
    { title: 'Tan Removal', desc: 'Clove & Walnut scrub to instantly fade sunburn.', tag: 'D-Tan' },
    { title: 'Intense Hydration', desc: 'Hyaluronic acid to deeply quench dry patches.', tag: 'Hydrating' },
    { title: 'Hair Fall Control', desc: 'Red onion black seed essence to strengthen roots.', tag: 'Hair Fall' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-[#D4AF37]" size={40} />
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Entering VIP Skincare Store...</p>
        </div>
      </div>
    );
  }

  const currentSlider = sliders[activeSlide] || sliders[0];

  return (
    <div>
      {/* 1. Category Bubble Slider */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container">
          <div className="bubble-nav md:justify-center">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="bubble-item">
                <div className="bubble-image-wrapper">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain p-1" />
                </div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Hero Slider Section (Full-width Clickable Banner) */}
      <section ref={heroRef} className="relative w-full overflow-hidden bg-gray-100">
        {sliders.length > 0 && (
          <Link to={sliders[activeSlide]?.link_url || "/shop"} className="block w-full">
            <img
              src={sliders[activeSlide]?.image_url}
              alt={sliders[activeSlide]?.title || 'Promo Banner'}
              className="w-full h-auto object-cover block transition-all duration-1000"
            />
          </Link>
        )}

        {/* Slide navigation controls */}
        {sliders.length > 1 && (
          <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-10">
            {sliders.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === activeSlide ? 'bg-[#FFD200] scale-125 shadow-md' : 'bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2.3 Shop By Category Section */}
      <section className="py-16 bg-[#FAF8F5] border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#FFD200] text-[#3F3E8F] text-lg sm:text-2xl font-serif font-black px-16 py-3.5 rounded-full border-2 border-[#3F3E8F]/10 text-center uppercase tracking-widest shadow-md">
              Shop By Category
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {shopByCategories.map((cat) => (
              <Link key={cat.id} to={cat.slug.startsWith('/') ? cat.slug : `/shop?category=${cat.slug}`} className="block rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-white relative group">
                <img 
                  src={cat.image_url} 
                  alt={cat.name} 
                  className="w-full h-auto object-cover block"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(cat.name); }}
                />
                {/* Overlay text description for custom admin-created categories */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-end p-3 sm:p-4">
                  <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/75 px-2.5 py-1 rounded-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Premium Offer Products Slider (Slides automatically, stops on hover, shows discount) */}
      <section 
        className="py-12 bg-white border-b border-gray-100 overflow-hidden"
        onMouseEnter={() => setIsProductSliderPaused(true)}
        onMouseLeave={() => setIsProductSliderPaused(false)}
      >
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1 block">LIMITED VIP DEALS</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">Best Discount Offers</h2>
            </div>
            
            {/* Manual Controls */}
            <div className="flex gap-2">
              <button 
                onClick={handlePrevProduct}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#FFD200] hover:border-[#FFD200] hover:text-black transition-all"
              >
                &larr;
              </button>
              <button 
                onClick={handleNextProduct}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#FFD200] hover:border-[#FFD200] hover:text-black transition-all"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Slider Container */}
          {(() => {
            const displayProducts = [...sliderProducts, ...sliderProducts.slice(0, visibleCount)];
            return (
              <div className="relative overflow-hidden w-full">
                <div 
                  className={`flex ${transitionEnabled ? 'transition-transform duration-700 ease-out' : ''}`}
                  style={{ 
                    transform: `translateX(-${productSlideIndex * (100 / displayProducts.length)}%)`,
                    width: `${(displayProducts.length / visibleCount) * 100}%`
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {displayProducts.map((prod, idx) => (
                    <div 
                      key={`${prod.id}-${idx}`} 
                      className="px-2 md:px-3 flex-shrink-0"
                      style={{ width: `${100 / displayProducts.length}%` }}
                    >
                      <div 
                        className="vip-card bg-[#FAF8F5] relative flex flex-col h-full border border-gray-100 hover:shadow-lg transition-all rounded-2xl overflow-hidden group cursor-pointer"
                        onClick={() => navigate(`/product/${prod.slug}`)}
                      >
                        {/* Discount Badge */}
                        <span className="absolute top-4 left-4 bg-red-600 text-white text-[0.65rem] md:text-xs font-black px-2.5 py-1 rounded-full z-10 shadow-sm tracking-wider uppercase">
                          {prod.discount}
                        </span>

                        {/* Image Wrapper */}
                        <div className="relative overflow-hidden aspect-square bg-[#FAF8F5] flex items-center justify-center">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[0.55rem] md:text-[0.6rem] text-[#D4AF37] font-extrabold uppercase tracking-wider">NEW FORMULATION</span>
                              <div className="flex items-center gap-0.5 text-[#FFC107] text-[0.65rem] font-bold">
                                <Star size={10} className="fill-[#FFC107]" /> {prod.rating}
                              </div>
                            </div>
                            <h3 className="font-serif text-sm md:text-base font-bold text-gray-800 leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-all">
                              {prod.name}
                            </h3>
                          </div>

                          <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-sm md:text-base font-black text-gray-800">₹{prod.price}</span>
                            <span className="text-xs text-gray-400 line-through">₹{prod.originalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 2.6 Shop & Get Free BOGO Section */}
      <section 
        className="py-12 bg-white border-b border-gray-100 overflow-hidden"
        onMouseEnter={() => setIsBogoSliderPaused(true)}
        onMouseLeave={() => setIsBogoSliderPaused(false)}
      >
        <div className="container">
          {/* Shop & Get Free Pill Header */}
          <div className="flex justify-center mb-6 sm:mb-12">
            <div className="relative group select-none">
              {/* 3D Black shadow block */}
              <div className="absolute inset-0 bg-black rounded-r-3xl rounded-l-full translate-x-1 translate-y-1 sm:translate-x-1.5 sm:translate-y-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"></div>
              
              {/* Main Banner block */}
              <div className="relative bg-gradient-to-r from-[#FFD200] via-[#FFE359] to-[#FFD200] text-black text-base sm:text-2xl md:text-3.5xl font-serif font-black px-6 py-2.5 sm:px-14 sm:py-4 rounded-r-3xl rounded-l-full border-2 sm:border-[3px] border-black text-center max-w-xl uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-3">
                <span className="inline-block text-red-600 animate-bounce text-xs sm:text-xl">★</span>
                <span className="font-serif italic font-black whitespace-nowrap">Shop & Get Free!</span>
                <span className="inline-block text-red-600 animate-bounce text-xs sm:text-xl">★</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1 block">EXCLUSIVE OFFER</span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800">Buy 1 Get 1 Deals</h2>
            </div>
            
            {/* Manual Controls */}
            <div className="flex gap-2">
              <button 
                onClick={handlePrevBogo}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#FFD200] hover:border-[#FFD200] hover:text-black transition-all"
              >
                &larr;
              </button>
              <button 
                onClick={handleNextBogo}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#FFD200] hover:border-[#FFD200] hover:text-black transition-all"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* BOGO Slider Container */}
          {(() => {
            const displayBogo = [...bogoProducts, ...bogoProducts.slice(0, bogoVisibleCount)];
            return (
              <div className="relative overflow-hidden w-full">
                <div 
                  className={`flex ${bogoTransitionEnabled ? 'transition-transform duration-700 ease-out' : ''}`}
                  style={{ 
                    transform: `translateX(-${bogoSlideIndex * (100 / displayBogo.length)}%)`,
                    width: `${(displayBogo.length / bogoVisibleCount) * 100}%`
                  }}
                  onTransitionEnd={handleBogoTransitionEnd}
                >
                  {displayBogo.map((prod, idx) => (
                    <div 
                      key={`${prod.id}-${idx}`} 
                      className="px-2 md:px-3 flex-shrink-0"
                      style={{ width: `${100 / displayBogo.length}%` }}>
                                    <Link 
                        to={prod.link_url || "/shop?tag=BOGO"}
                        className="vip-card bg-white relative flex flex-col h-full border border-gray-200 hover:shadow-lg transition-all rounded-2xl overflow-hidden group block"
                      >
                        {/* Image Wrapper */}
                        <div className="relative overflow-hidden aspect-[4/3] bg-white flex items-center justify-center p-2">
                          <img 
                            src={prod.image} 
                            alt={prod.title} 
                            className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500" 
                          />
                        </div>

                        {/* Title & Shop Button */}
                        <div className="p-3 bg-[#FAF8F5] flex flex-col gap-2 text-center items-center border-t border-gray-100 mt-auto">
                          <span className="font-serif text-xs sm:text-sm font-bold text-gray-800 tracking-tight leading-tight min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center line-clamp-2">
                            {prod.title}
                          </span>
                          <span className="w-full text-[0.65rem] sm:text-xs font-black text-black bg-[#FFD200] py-2 rounded-xl group-hover:bg-black group-hover:text-white transition-all uppercase tracking-widest text-center">
                            Claim Offer
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>
 
      {/* 2.7 Korean Glass Skin Skincare Range Section */}
      <section className="py-12 bg-[#FAF8F5] border-b border-gray-100">
        <div className="container">
          {/* Banner Image */}
          {koreanBanner && (
            <div className="w-full relative overflow-hidden rounded-3xl shadow-sm mb-8">
              <Link to={koreanBanner.link_url || "/shop?category=k-derma"} className="block">
                <img 
                  src={koreanBanner.image_url} 
                  alt={koreanBanner.title || "NO DRAMA, ONLY FLAWLESS GLOW!"} 
                  className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-700" 
                />
              </Link>
            </div>
          )}
 
          {/* Offer Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {koreanCards.map((card, idx) => (
              <div key={card.id || idx} className="vip-card bg-white border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <Link to={card.link_url || "/shop?category=k-derma"} className="block relative overflow-hidden aspect-[3/4]">
                  <img 
                    src={card.image_url} 
                    alt={card.title || `Offer Card ${idx + 1}`} 
                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.8 Shop Our Bestsellers Custom Grid Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container">
          {/* Shop our Bestsellers Header */}
          <div className="flex justify-center mb-8">
            <div className="relative group select-none">
              {/* 3D Black shadow block */}
              <div className="absolute inset-0 bg-black rounded-r-3xl rounded-l-full translate-x-1 translate-y-1 sm:translate-x-1.5 sm:translate-y-1.5 transition-transform duration-300"></div>
              
              {/* Main Banner block */}
              <div className="relative bg-[#FFD200] text-black text-lg sm:text-2xl md:text-3.5xl font-serif font-black px-12 py-3 rounded-r-3xl rounded-l-full border-2 sm:border-[3px] border-black text-center max-w-xl uppercase tracking-wider flex items-center justify-center">
                <span className="font-serif italic font-black whitespace-nowrap">Shop our Bestsellers</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 px-4">
            {categories.map((c) => c.name).concat('View All').map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveBestsellerCategory(cat)}
                className={`text-xs sm:text-sm font-bold px-5 py-2 rounded-full border transition-all ${
                  activeBestsellerCategory === cat
                    ? 'bg-[#FFD200] text-black border-[#FFD200] shadow-sm hover:opacity-90'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bestseller Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {shopBestsellers.map((prod) => (
              <div 
                key={prod.id} 
                className="vip-card bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative cursor-pointer"
                onClick={() => navigate(`/product/${prod.slug}`)}
              >
                {/* Blue Tilted Discount Ribbon */}
                <div className="absolute top-0 left-0 bg-[#00A5EC] text-white text-[10px] font-black px-3.5 py-1.5 rounded-br-2xl shadow-sm z-10 uppercase">
                  {prod.discount}
                </div>

                {/* Product Image Wrapper */}
                <div className="relative overflow-hidden aspect-square bg-white flex items-center justify-center p-4">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {prod.name}
                    </h3>

                    {/* Rating stars */}
                    <div className="flex items-center gap-0.5 my-2">
                      {[...Array(Math.min(5, Math.max(0, Math.round(prod.rating || 5))))].map((_, i) => (
                        <Star key={i} size={12} className="fill-[#FFC107] text-[#FFC107]" />
                      ))}
                      <span className="text-[10px] text-gray-500 font-semibold ml-1">({prod.reviews})</span>
                    </div>
                  </div>

                  {/* Pricing and Button */}
                  <div className="mt-2">
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-sm sm:text-base font-extrabold text-gray-900">₹{prod.sale_price}</span>
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{prod.price}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, prod.variants[0], 1);
                      }}
                      className="w-full bg-[#00A5EC] text-white text-[10px] sm:text-xs font-black py-2.5 rounded-xl hover:bg-black transition-all uppercase tracking-widest text-center"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.9 Super Saver Combos Grid Section */}
      <section className="py-16 bg-[#FAF8F5] border-b border-gray-100">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-center mb-12">
            <div className="relative group select-none">
              {/* 3D Black shadow block */}
              <div className="absolute inset-0 bg-black rounded-r-3xl rounded-l-full translate-x-1 translate-y-1 sm:translate-x-1.5 sm:translate-y-1.5 transition-transform duration-300"></div>
              
              {/* Main Banner block */}
              <div className="relative bg-[#FFD200] text-black text-lg sm:text-2xl md:text-3xl font-serif font-black px-12 py-3.5 rounded-r-3xl rounded-l-full border-2 sm:border-[3px] border-black text-center max-w-xl uppercase tracking-wider flex items-center justify-center">
                <span className="font-serif italic font-black whitespace-nowrap">Super Saver Combos</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-0 max-w-6xl mx-auto">
            {superSaverCombos.map((combo) => (
              <div key={combo.id} className="vip-card bg-white border border-gray-200/60 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <Link to={combo.link_url || "/shop?tag=Super+Saver"} className="block w-full h-full relative overflow-hidden">
                  <img 
                    src={combo.image} 
                    alt={combo.title} 
                    className="w-full h-auto hover:scale-[1.03] transition-transform duration-500" 
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.10 Rice Water Hero Slider Section (Full-width Clickable Banner) */}
      <section className="relative w-full overflow-hidden bg-gray-100 border-b border-gray-100">
        {riceBanners.length > 0 && (
          <Link to={riceBanners[activeRiceSlide]?.link_url || "/shop?search=Rice"} className="block w-full">
            <img
              src={riceBanners[activeRiceSlide]?.image_url || riceBanners[activeRiceSlide]}
              alt="Rice Water Hero Banner"
              className="w-full h-auto object-cover block transition-all duration-1000"
            />
          </Link>
        )}

        {/* Slide navigation controls */}
        {riceBanners.length > 1 && (
          <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-10">
            {riceBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveRiceSlide(idx)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === activeRiceSlide ? 'bg-[#FFD200] scale-125 shadow-md' : 'bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2.11 Rice Water Range Products Slider Section */}
      <section 
        className="py-16 bg-white border-b border-gray-100 overflow-hidden"
        onMouseEnter={() => setIsRiceSliderPaused(true)}
        onMouseLeave={() => setIsRiceSliderPaused(false)}
      >
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 px-4 sm:px-0 gap-6">
            {/* Empty spacer or logo alignment */}
            <div className="hidden sm:block w-32"></div>

            {/* Branded Yellow 3D Title */}
            <div className="relative group select-none">
              {/* 3D Black shadow block */}
              <div className="absolute inset-0 bg-black rounded-r-3xl rounded-l-full translate-x-1 translate-y-1 sm:translate-x-1.5 sm:translate-y-1.5 transition-transform duration-300"></div>
              
              {/* Main Banner block */}
              
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex gap-2">
              <button 
                onClick={handlePrevRiceProducts}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#FFD200] hover:border-[#FFD200] hover:text-black transition-all"
              >
                &larr;
              </button>
              <button 
                onClick={handleNextRiceProducts}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#FFD200] hover:border-[#FFD200] hover:text-black transition-all"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Slider Container */}
          {(() => {
            const displayProducts = [...riceProducts, ...riceProducts.slice(0, riceVisibleCount)];
            return (
              <div className="relative overflow-hidden w-full px-4 sm:px-0">
                <div 
                  className={`flex ${riceTransitionEnabled ? 'transition-transform duration-700 ease-out' : ''}`}
                  style={{ 
                    transform: `translateX(-${riceSlideIndex * (100 / displayProducts.length)}%)`,
                    width: `${(displayProducts.length / riceVisibleCount) * 100}%`
                  }}
                  onTransitionEnd={handleRiceTransitionEnd}
                >
                  {displayProducts.map((prod, idx) => (
                    <div 
                      key={`${prod.id}-${idx}`} 
                      className="px-2"
                      style={{ width: `${100 / displayProducts.length}%` }}
                    >
                      <div 
                        className="vip-card bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative cursor-pointer"
                        onClick={() => navigate(`/product/${prod.slug}`)}
                      >
                        {/* Discount Sticker */}
                        <div className="absolute top-0 left-0 bg-[#00A5EC] text-white text-[10px] font-black px-3.5 py-1.5 rounded-br-2xl shadow-sm z-10 uppercase">
                          {prod.discount}
                        </div>

                        {/* Product Image Wrapper */}
                        <div className="relative overflow-hidden aspect-square bg-white flex items-center justify-center p-4">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Title */}
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
                              {prod.name}
                            </h3>

                            {/* Rating stars */}
                            <div className="flex items-center gap-0.5 my-2">
                              {[...Array(Math.min(5, Math.max(0, Math.round(prod.rating || 5))))].map((_, i) => (
                                <Star key={i} size={12} className="fill-[#FFC107] text-[#FFC107]" />
                              ))}
                              <span className="text-[10px] text-gray-500 font-semibold ml-1">({prod.reviews})</span>
                            </div>
                          </div>

                          {/* Pricing and Button */}
                          <div className="mt-2">
                            <div className="flex items-baseline gap-1.5 mb-3">
                              <span className="text-sm sm:text-base font-extrabold text-gray-900">₹{prod.sale_price}</span>
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{prod.price}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(prod, prod.variants[0], 1);
                              }}
                              className="w-full bg-[#00A5EC] text-white text-[10px] sm:text-xs font-black py-2.5 rounded-xl hover:bg-black transition-all uppercase tracking-widest text-center"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 3. Promo Banner (Top Bar promo highlight) */}
      {banners.length > 0 && (
        <section className="bg-gradient-to-r from-[#D4AF37] to-[#FFC107] text-white py-3 text-center text-xs font-bold tracking-widest uppercase">
          {banners[0]?.title} &mdash; <Link to={banners[0]?.link_url || '/shop'} className="underline hover:text-dark">Explore Now</Link>
        </section>
      )}
    </div>
  );
};

export default Home;
