package com.ecommerce.platform.config;

import com.ecommerce.platform.entity.Category;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.entity.enums.Role;
import com.ecommerce.platform.repository.CategoryRepository;
import com.ecommerce.platform.repository.ProductRepository;
import com.ecommerce.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.admin.email}")
    private String adminEmail;

    @Value("${app.seed.admin.password}")
    private String adminPassword;

    @Value("${app.seed.customer.email}")
    private String customerEmail;

    @Value("${app.seed.customer.password}")
    private String customerPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (!seedEnabled) {
            return;
        }
        seedUsers();
        List<Category> categories = seedCategories();
        seedProducts(categories);
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .phone("9999999999")
                    .address("Platform HQ")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Seeded admin user: {}", adminEmail);
        }

        if (!userRepository.existsByEmail(customerEmail)) {
            User customer = User.builder()
                    .firstName("Demo")
                    .lastName("Customer")
                    .email(customerEmail)
                    .password(passwordEncoder.encode(customerPassword))
                    .phone("8888888888")
                    .address("123 Demo Street, Sample City")
                    .role(Role.CUSTOMER)
                    .build();
            userRepository.save(customer);
            log.info("Seeded customer user: {}", customerEmail);
        }
    }

    private List<Category> seedCategories() {
        if (categoryRepository.count() > 0) {
            return categoryRepository.findAll();
        }

        List<Category> categories = List.of(
                Category.builder().name("Electronics").imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661").build(),
                Category.builder().name("Fashion").imageUrl("https://images.unsplash.com/photo-1445205170230-053b83016050").build(),
                Category.builder().name("Home & Kitchen").imageUrl("https://images.unsplash.com/photo-1556911220-bff31c812dba").build(),
                Category.builder().name("Footwear").imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff").build(),
                Category.builder().name("Books").imageUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794").build(),
                Category.builder().name("Beauty & Personal Care").imageUrl("https://images.unsplash.com/photo-1556228720-195a672e8a03").build()
        );

        List<Category> saved = categoryRepository.saveAll(categories);
        log.info("Seeded {} categories", saved.size());
        return saved;
    }

    private void seedProducts(List<Category> categories) {
        if (productRepository.count() > 0) {
            return;
        }

        Category electronics = findByName(categories, "Electronics");
        Category fashion = findByName(categories, "Fashion");
        Category home = findByName(categories, "Home & Kitchen");
        Category footwear = findByName(categories, "Footwear");
        Category books = findByName(categories, "Books");
        Category beauty = findByName(categories, "Beauty & Personal Care");

        List<Product> products = List.of(
                // ---------------- Electronics ----------------
                Product.builder().name("Wireless Bluetooth Headphones").description("Over-ear wireless headphones with active noise cancellation and 30-hour battery life.")
                        .brand("SoundMax").imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e")
                        .price(new BigDecimal("2999.00")).discount(new BigDecimal("20")).stock(150).rating(new BigDecimal("4.5")).category(electronics).build(),
                Product.builder().name("Smartphone 128GB").description("6.5-inch display, 128GB storage, triple camera setup, 5G ready.")
                        .brand("Nexora").imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9")
                        .price(new BigDecimal("18999.00")).discount(new BigDecimal("12")).stock(80).rating(new BigDecimal("4.3")).category(electronics).build(),
                Product.builder().name("Smartwatch Series 5").description("Fitness tracking, heart rate monitor, AMOLED display, water resistant.")
                        .brand("PulseTech").imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30")
                        .price(new BigDecimal("4499.00")).discount(new BigDecimal("15")).stock(120).rating(new BigDecimal("4.4")).category(electronics).build(),
                Product.builder().name("Laptop 14-inch i5").description("14-inch FHD display, Intel i5, 16GB RAM, 512GB SSD.")
                        .brand("Compura").imageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853")
                        .price(new BigDecimal("52999.00")).discount(new BigDecimal("8")).stock(40).rating(new BigDecimal("4.6")).category(electronics).build(),
                Product.builder().name("Wireless Earbuds Pro").description("True wireless earbuds with active noise cancellation and wireless charging case.")
                        .brand("SoundMax").imageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df")
                        .price(new BigDecimal("3499.00")).discount(new BigDecimal("18")).stock(200).rating(new BigDecimal("4.4")).category(electronics).build(),
                Product.builder().name("4K Smart LED TV 43-inch").description("Ultra HD smart TV with built-in streaming apps and voice remote.")
                        .brand("Visiora").imageUrl("https://images.unsplash.com/photo-1593359677879-a4bb92f829d1")
                        .price(new BigDecimal("24999.00")).discount(new BigDecimal("14")).stock(35).rating(new BigDecimal("4.5")).category(electronics).build(),
                Product.builder().name("Portable Bluetooth Speaker").description("Waterproof portable speaker with 12-hour battery and deep bass.")
                        .brand("SoundMax").imageUrl("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1")
                        .price(new BigDecimal("1899.00")).discount(new BigDecimal("22")).stock(180).rating(new BigDecimal("4.3")).category(electronics).build(),
                Product.builder().name("Gaming Mechanical Keyboard").description("RGB backlit mechanical keyboard with hot-swappable switches.")
                        .brand("Compura").imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3")
                        .price(new BigDecimal("3299.00")).discount(new BigDecimal("10")).stock(90).rating(new BigDecimal("4.6")).category(electronics).build(),
                Product.builder().name("Wireless Mouse").description("Ergonomic wireless mouse with adjustable DPI and silent clicks.")
                        .brand("Compura").imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46")
                        .price(new BigDecimal("799.00")).discount(new BigDecimal("15")).stock(250).rating(new BigDecimal("4.2")).category(electronics).build(),
                Product.builder().name("Power Bank 20000mAh").description("Fast-charging power bank with dual USB output and LED indicator.")
                        .brand("PulseTech").imageUrl("https://images.unsplash.com/photo-1609592424862-e6d6b4a0b1f1")
                        .price(new BigDecimal("1499.00")).discount(new BigDecimal("20")).stock(220).rating(new BigDecimal("4.3")).category(electronics).build(),

                // ---------------- Fashion ----------------
                Product.builder().name("Men's Casual Shirt").description("100% cotton slim-fit casual shirt, available in multiple colors.")
                        .brand("UrbanThreads").imageUrl("https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf")
                        .price(new BigDecimal("899.00")).discount(new BigDecimal("30")).stock(300).rating(new BigDecimal("4.1")).category(fashion).build(),
                Product.builder().name("Women's Summer Dress").description("Lightweight floral summer dress, breathable fabric.")
                        .brand("Bellisa").imageUrl("https://images.unsplash.com/photo-1595777457583-95e059d581b8")
                        .price(new BigDecimal("1299.00")).discount(new BigDecimal("25")).stock(200).rating(new BigDecimal("4.2")).category(fashion).build(),
                Product.builder().name("Denim Jacket").description("Classic blue denim jacket, unisex fit.")
                        .brand("UrbanThreads").imageUrl("https://images.unsplash.com/photo-1551028719-00167b16eac5")
                        .price(new BigDecimal("1999.00")).discount(new BigDecimal("18")).stock(150).rating(new BigDecimal("4.0")).category(fashion).build(),
                Product.builder().name("Men's Slim Fit Jeans").description("Stretchable slim-fit denim jeans for everyday wear.")
                        .brand("UrbanThreads").imageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d")
                        .price(new BigDecimal("1599.00")).discount(new BigDecimal("20")).stock(220).rating(new BigDecimal("4.2")).category(fashion).build(),
                Product.builder().name("Women's Knit Sweater").description("Soft knit pullover sweater, perfect for layering in cooler weather.")
                        .brand("Bellisa").imageUrl("https://images.unsplash.com/photo-1576566588028-4147f3842f27")
                        .price(new BigDecimal("1399.00")).discount(new BigDecimal("15")).stock(160).rating(new BigDecimal("4.3")).category(fashion).build(),
                Product.builder().name("Men's Formal Blazer").description("Tailored fit formal blazer suitable for office and events.")
                        .brand("Claritone").imageUrl("https://images.unsplash.com/photo-1593032465175-481ac7f401a0")
                        .price(new BigDecimal("3499.00")).discount(new BigDecimal("12")).stock(70).rating(new BigDecimal("4.4")).category(fashion).build(),
                Product.builder().name("Women's Handbag").description("Premium faux-leather handbag with adjustable strap and multiple compartments.")
                        .brand("Bellisa").imageUrl("https://images.unsplash.com/photo-1584917865442-de89df76afd3")
                        .price(new BigDecimal("1899.00")).discount(new BigDecimal("22")).stock(140).rating(new BigDecimal("4.3")).category(fashion).build(),
                Product.builder().name("Unisex Sunglasses").description("UV-protected polarized sunglasses with a lightweight frame.")
                        .brand("UrbanThreads").imageUrl("https://images.unsplash.com/photo-1577803645773-f96470509666")
                        .price(new BigDecimal("799.00")).discount(new BigDecimal("28")).stock(260).rating(new BigDecimal("4.1")).category(fashion).build(),

                // ---------------- Home & Kitchen ----------------
                Product.builder().name("Non-Stick Cookware Set").description("5-piece non-stick cookware set with heat-resistant handles.")
                        .brand("HomeCraft").imageUrl("https://images.unsplash.com/photo-1556909212-d5b604d0c90d")
                        .price(new BigDecimal("2499.00")).discount(new BigDecimal("22")).stock(90).rating(new BigDecimal("4.3")).category(home).build(),
                Product.builder().name("LED Table Lamp").description("Adjustable brightness LED desk lamp with USB charging port.")
                        .brand("Lumino").imageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057f782c")
                        .price(new BigDecimal("799.00")).discount(new BigDecimal("10")).stock(220).rating(new BigDecimal("4.2")).category(home).build(),
                Product.builder().name("Memory Foam Pillow Set").description("Set of 2 ergonomic memory foam pillows for neck support.")
                        .brand("CloudRest").imageUrl("https://images.unsplash.com/photo-1584100936595-c0654b55a2e2")
                        .price(new BigDecimal("1199.00")).discount(new BigDecimal("15")).stock(180).rating(new BigDecimal("4.4")).category(home).build(),
                Product.builder().name("Electric Kettle 1.8L").description("Stainless steel electric kettle with auto shut-off and boil-dry protection.")
                        .brand("HomeCraft").imageUrl("https://images.unsplash.com/photo-1585664811087-47f65abbad64")
                        .price(new BigDecimal("1299.00")).discount(new BigDecimal("18")).stock(160).rating(new BigDecimal("4.3")).category(home).build(),
                Product.builder().name("Cotton Bedsheet Set").description("Queen-size 100% cotton bedsheet set with two pillow covers.")
                        .brand("CloudRest").imageUrl("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af")
                        .price(new BigDecimal("1599.00")).discount(new BigDecimal("25")).stock(200).rating(new BigDecimal("4.4")).category(home).build(),
                Product.builder().name("Wall Clock — Minimalist").description("Silent sweep wall clock with a clean minimalist design.")
                        .brand("Lumino").imageUrl("https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c")
                        .price(new BigDecimal("699.00")).discount(new BigDecimal("12")).stock(190).rating(new BigDecimal("4.1")).category(home).build(),
                Product.builder().name("Air Purifier Compact").description("HEPA filter air purifier suitable for rooms up to 250 sq ft.")
                        .brand("HomeCraft").imageUrl("https://images.unsplash.com/photo-1585771724684-38269d6639fd")
                        .price(new BigDecimal("4999.00")).discount(new BigDecimal("16")).stock(60).rating(new BigDecimal("4.5")).category(home).build(),
                Product.builder().name("Ceramic Dinnerware Set").description("16-piece ceramic dinnerware set for 4, dishwasher and microwave safe.")
                        .brand("HomeCraft").imageUrl("https://images.unsplash.com/photo-1603199506016-b9a594b593c0")
                        .price(new BigDecimal("2199.00")).discount(new BigDecimal("20")).stock(110).rating(new BigDecimal("4.4")).category(home).build(),

                // ---------------- Footwear ----------------
                Product.builder().name("Running Shoes").description("Lightweight breathable running shoes with cushioned sole.")
                        .brand("Stridex").imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff")
                        .price(new BigDecimal("2799.00")).discount(new BigDecimal("20")).stock(160).rating(new BigDecimal("4.5")).category(footwear).build(),
                Product.builder().name("Formal Leather Shoes").description("Genuine leather formal shoes for office wear.")
                        .brand("Claritone").imageUrl("https://images.unsplash.com/photo-1614252369475-531eba835eb1")
                        .price(new BigDecimal("3299.00")).discount(new BigDecimal("12")).stock(100).rating(new BigDecimal("4.3")).category(footwear).build(),
                Product.builder().name("Casual Canvas Sneakers").description("Everyday canvas sneakers with a comfortable rubber sole.")
                        .brand("Stridex").imageUrl("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77")
                        .price(new BigDecimal("1499.00")).discount(new BigDecimal("25")).stock(210).rating(new BigDecimal("4.2")).category(footwear).build(),
                Product.builder().name("Women's Block Heel Sandals").description("Comfortable block heel sandals suitable for daily and festive wear.")
                        .brand("Claritone").imageUrl("https://images.unsplash.com/photo-1543163521-1bf539c55dd2")
                        .price(new BigDecimal("1899.00")).discount(new BigDecimal("18")).stock(140).rating(new BigDecimal("4.1")).category(footwear).build(),
                Product.builder().name("Men's Sports Slides").description("Cushioned sports slides ideal for post-workout recovery and casual wear.")
                        .brand("Stridex").imageUrl("https://images.unsplash.com/photo-1603808033192-082d6919d3e1")
                        .price(new BigDecimal("999.00")).discount(new BigDecimal("22")).stock(230).rating(new BigDecimal("4.0")).category(footwear).build(),
                Product.builder().name("Hiking Boots Waterproof").description("Rugged waterproof hiking boots with reinforced ankle support.")
                        .brand("Stridex").imageUrl("https://images.unsplash.com/photo-1551798507-629020c81463")
                        .price(new BigDecimal("3999.00")).discount(new BigDecimal("15")).stock(75).rating(new BigDecimal("4.6")).category(footwear).build(),

                // ---------------- Books ----------------
                Product.builder().name("The Art of Programming").description("A comprehensive guide to modern software engineering practices.")
                        .brand("TechPress").imageUrl("https://images.unsplash.com/photo-1532012197267-da84d127e765")
                        .price(new BigDecimal("599.00")).discount(new BigDecimal("10")).stock(250).rating(new BigDecimal("4.7")).category(books).build(),
                Product.builder().name("Mystery Novel Collection").description("Box set of 3 best-selling mystery novels.")
                        .brand("Pageturn").imageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f")
                        .price(new BigDecimal("899.00")).discount(new BigDecimal("18")).stock(170).rating(new BigDecimal("4.5")).category(books).build(),
                Product.builder().name("Personal Finance Basics").description("A practical, beginner-friendly guide to budgeting, saving, and investing.")
                        .brand("Pageturn").imageUrl("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23")
                        .price(new BigDecimal("499.00")).discount(new BigDecimal("15")).stock(220).rating(new BigDecimal("4.4")).category(books).build(),
                Product.builder().name("Science Fiction Anthology").description("A curated collection of award-winning short science fiction stories.")
                        .brand("TechPress").imageUrl("https://images.unsplash.com/photo-1495640388908-05fa85288e61")
                        .price(new BigDecimal("649.00")).discount(new BigDecimal("12")).stock(190).rating(new BigDecimal("4.6")).category(books).build(),
                Product.builder().name("Mindfulness & Wellbeing").description("A guided introduction to mindfulness practices for everyday calm.")
                        .brand("Pageturn").imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c")
                        .price(new BigDecimal("449.00")).discount(new BigDecimal("20")).stock(200).rating(new BigDecimal("4.3")).category(books).build(),
                Product.builder().name("Kids' Picture Book Bundle").description("Set of 5 colorful picture books for early readers.")
                        .brand("Pageturn").imageUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794")
                        .price(new BigDecimal("799.00")).discount(new BigDecimal("25")).stock(180).rating(new BigDecimal("4.7")).category(books).build(),

                // ---------------- Beauty & Personal Care ----------------
                Product.builder().name("Vitamin C Face Serum").description("Brightening face serum with vitamin C and hyaluronic acid.")
                        .brand("GlowEssence").imageUrl("https://images.unsplash.com/photo-1620916566398-39f1143ab7be")
                        .price(new BigDecimal("649.00")).discount(new BigDecimal("25")).stock(300).rating(new BigDecimal("4.4")).category(beauty).build(),
                Product.builder().name("Hair Care Combo Pack").description("Shampoo and conditioner combo for damaged hair repair.")
                        .brand("Silkara").imageUrl("https://images.unsplash.com/photo-1571781926291-c477ebfd024b")
                        .price(new BigDecimal("549.00")).discount(new BigDecimal("20")).stock(280).rating(new BigDecimal("4.2")).category(beauty).build(),
                Product.builder().name("Moisturizing Body Lotion").description("24-hour hydrating body lotion with shea butter and aloe vera.")
                        .brand("GlowEssence").imageUrl("https://images.unsplash.com/photo-1556228720-195a672e8a03")
                        .price(new BigDecimal("399.00")).discount(new BigDecimal("18")).stock(320).rating(new BigDecimal("4.3")).category(beauty).build(),
                Product.builder().name("Matte Lipstick Set").description("Set of 4 long-lasting matte lipsticks in everyday shades.")
                        .brand("Silkara").imageUrl("https://images.unsplash.com/photo-1586495777744-4413f21062fa")
                        .price(new BigDecimal("899.00")).discount(new BigDecimal("30")).stock(240).rating(new BigDecimal("4.5")).category(beauty).build(),
                Product.builder().name("Electric Hair Dryer").description("Lightweight electric hair dryer with multiple heat and speed settings.")
                        .brand("Silkara").imageUrl("https://images.unsplash.com/photo-1522338242992-e1a54906a8da")
                        .price(new BigDecimal("1299.00")).discount(new BigDecimal("15")).stock(130).rating(new BigDecimal("4.2")).category(beauty).build(),
                Product.builder().name("Men's Grooming Kit").description("All-in-one trimmer and grooming kit with multiple attachments.")
                        .brand("GlowEssence").imageUrl("https://images.unsplash.com/photo-1503951914875-452162b0f3f1")
                        .price(new BigDecimal("1799.00")).discount(new BigDecimal("22")).stock(110).rating(new BigDecimal("4.4")).category(beauty).build()
        );

        List<Product> saved = productRepository.saveAll(products);
        log.info("Seeded {} products", saved.size());
    }

    private Category findByName(List<Category> categories, String name) {
        return categories.stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Category not found during seeding: " + name));
    }
}
