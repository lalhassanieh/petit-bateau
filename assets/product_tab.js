const options = {
    navTabs: ".nav-tabs a",
    accorditionTabs: ".data.accordition",
    productInfomationTab: ".bls__product-tabs-content",
    productInfomationTabLayoutSecond: ".bls__products-tabs",
    tabContent: ".tab-content .tab-item",
    tabContentActive: ".tab-content .tab-item.active",
  };
   
  var BlsTab = (function(){
     return {
      eventProductTabs: function () {
        document.querySelectorAll(options.navTabs).forEach((tabToggle) => {
          tabToggle.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              const target = e.currentTarget;
              const tab_id = target.getAttribute("data-block-id");
              if (!target.closest(".data.item").classList.contains("active")) {
                for (var item of document.querySelectorAll(".data.item")) {
                  item.classList.remove("active");
                }
                for (var item of document.querySelectorAll(options.tabContent)) {
                  item.classList.remove("active");
                  item.querySelector(".tab-panel").style.display = "none";
                }
                const conditions = document.getElementById(tab_id);
                conditions.classList.add("active");
                conditions.querySelector(".tab-panel").style.display = "block";
                target.closest(".data.item").classList.add("active");
              }
            },
            false
          );
        });
      }
     }
  })()
  BlsTab.eventProductTabs();

  // Handle variant changes for metafield display
  function updateVariantMetafield(variantId) {
    try {
      const metafieldContainer = document.getElementById('variant-metafield-content');
      const metafieldValue = document.getElementById('variant-metafield-value');
      
      if (!metafieldContainer || !metafieldValue) {
        console.log('Metafield containers not found');
        return;
      }
      
      if (!variantId || variantId === '' || variantId === 'undefined' || variantId === 'null') {
        console.log('Invalid variant ID:', variantId);
        metafieldContainer.style.display = 'none';
        return;
      }
      
      console.log('Updating metafield for variant:', variantId);
      
      // Try to get metafield from data attributes on variant options first
      let variantOption = document.querySelector(`option[data-variant-id="${variantId}"]`);
      
      if (variantOption && variantOption.dataset.variantMetafield) {
        const erpCode = variantOption.dataset.variantMetafield;
        metafieldValue.textContent = erpCode;
        metafieldContainer.style.display = 'block';
        console.log('✅ Variant metafield found via data attribute:', erpCode);
        return;
      }
      
      // Fallback: Try to parse from product JSON
      const productJson = document.querySelector('[data-product-json]');
      if (!productJson) {
        console.log('❌ Product JSON not found');
        metafieldContainer.style.display = 'none';
        return;
      }
      
      try {
        const product = JSON.parse(productJson.textContent);
        const variant = product.variants.find(v => v.id == variantId);
        
        if (variant && variant.metafields && variant.metafields.global && variant.metafields.global.product_additional_erp_variantcode) {
          const erpCode = variant.metafields.global.product_additional_erp_variantcode;
          metafieldValue.textContent = erpCode;
          metafieldContainer.style.display = 'block';
          console.log('✅ Variant metafield found via JSON:', erpCode);
        } else {
          console.log('❌ Metafield not found for variant:', variantId);
          console.log('Available variant data:', variant);
          metafieldContainer.style.display = 'none';
        }
      } catch (jsonError) {
        console.error('❌ Error parsing product JSON:', jsonError);
        metafieldContainer.style.display = 'none';
      }
      
    } catch (error) {
      console.error('❌ Error in updateVariantMetafield:', error);
    }
  }

  // Listen for variant changes from main product forms
  document.addEventListener('DOMContentLoaded', function() {
    // Safer approach: Hook into existing theme variant change system
    // Listen for the specific variant change events that the theme already fires
    
    // Method 1: Listen for form input changes with debouncing
    function safeUpdateMetafield(variantId) {
      try {
        if (variantId && variantId !== '' && variantId !== 'undefined') {
          setTimeout(() => updateVariantMetafield(variantId), 100);
        }
      } catch (error) {
        console.log('Safe metafield update error:', error);
      }
    }
    
    // Listen for hidden input changes (most reliable method)
    const hiddenInputs = document.querySelectorAll('input[name="id"][type="hidden"], input[name="id"]:not([type])');
    hiddenInputs.forEach(input => {
      if (input) {
        // Use MutationObserver to watch for value changes
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
              safeUpdateMetafield(mutation.target.value);
            }
          });
        });
        
        observer.observe(input, {
          attributes: true,
          attributeFilter: ['value']
        });
        
        // Also listen for direct property changes
        let lastValue = input.value;
        setInterval(() => {
          if (input.value !== lastValue) {
            lastValue = input.value;
            safeUpdateMetafield(input.value);
          }
        }, 500);
      }
    });
    
    // Method 2: Listen for select changes in variant selectors
    const selectors = document.querySelectorAll('select.product-sticky-js, select[data-variants]');
    selectors.forEach(select => {
      if (select) {
        select.addEventListener('change', function(e) {
          try {
            const selectedOption = e.target.selectedOptions[0];
            if (selectedOption) {
              const variantId = selectedOption.dataset.variantId || selectedOption.getAttribute('data-variant-id');
              safeUpdateMetafield(variantId);
            }
          } catch (error) {
            console.log('Select change error:', error);
          }
        });
      }
    });
    
    // Method 3: Listen for custom events that might be fired by the theme
    const eventNames = ['variant:change', 'variant:changed', 'variantChange', 'product:variant-change'];
    eventNames.forEach(eventName => {
      document.addEventListener(eventName, function(e) {
        try {
          let variantId = null;
          if (e.detail) {
            variantId = e.detail.variant?.id || e.detail.variantId || e.detail.id;
          }
          if (variantId) {
            safeUpdateMetafield(variantId);
          }
        } catch (error) {
          console.log('Custom event error:', error);
        }
      });
    });
    
    // Initialize with current variant (safely)
    try {
      setTimeout(() => {
        const hiddenInput = document.querySelector('input[name="id"]');
        if (hiddenInput && hiddenInput.value) {
          safeUpdateMetafield(hiddenInput.value);
        }
      }, 1000); // Wait for theme to initialize
    } catch (error) {
      console.log('Initialization error:', error);
    }
  });