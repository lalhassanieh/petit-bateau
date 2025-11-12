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
    const metafieldContainer = document.getElementById('variant-metafield-content');
    const metafieldValue = document.getElementById('variant-metafield-value');
    
    if (!metafieldContainer || !metafieldValue) return;
    
    // Try to get metafield from data attributes on variant options first
    let variantOption = document.querySelector(`[data-variant-id="${variantId}"]`);
    if (!variantOption) {
      // Fallback: try to find by value (for variant titles)
      variantOption = document.querySelector(`option[value]:not([value=""]):not([value="-1"])`);
      if (variantOption) {
        const options = document.querySelectorAll(`option[data-variant-id="${variantId}"]`);
        variantOption = options.length > 0 ? options[0] : null;
      }
    }
    
    if (variantOption && variantOption.dataset.variantMetafield) {
      const erpCode = variantOption.dataset.variantMetafield;
      metafieldValue.textContent = erpCode;
      metafieldContainer.style.display = 'block';
      console.log('Variant metafield updated:', erpCode);
      return;
    }
    
    // Fallback: Try to parse from product JSON
    const productJson = document.querySelector('[data-product-json]');
    if (!productJson) {
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
      } else {
        metafieldContainer.style.display = 'none';
      }
    } catch (error) {
      console.error('Error parsing product data:', error);
      metafieldContainer.style.display = 'none';
    }
  }

  // Listen for variant changes from main product forms
  document.addEventListener('DOMContentLoaded', function() {
    // Listen for variant selector changes (various selectors)
    const variantSelectors = document.querySelectorAll('select[name="id"], [name="id"], .product-sticky-js, variant-radios-sticky select, variant-group-sticky select');
    
    variantSelectors.forEach(selector => {
      selector.addEventListener('change', function(e) {
        let variantId = e.target.value;
        
        // If it's an option element, get the variant ID from data attribute
        if (e.target.tagName === 'OPTION' || e.target.dataset.variantId) {
          variantId = e.target.dataset.variantId || variantId;
        }
        
        // For select elements, get the selected option's variant ID
        if (e.target.tagName === 'SELECT' && e.target.selectedOptions.length > 0) {
          const selectedOption = e.target.selectedOptions[0];
          variantId = selectedOption.dataset.variantId || selectedOption.value;
        }
        
        if (variantId) {
          updateVariantMetafield(variantId);
        }
      });
    });
    
    // Listen for click events on variant options (for cases where change doesn't fire)
    document.addEventListener('click', function(e) {
      if (e.target.matches('.product-sticky-js, variant-radios-sticky option, variant-group-sticky option')) {
        const variantId = e.target.dataset.variantId || e.target.value;
        if (variantId) {
          setTimeout(() => updateVariantMetafield(variantId), 50); // Small delay to ensure selection is processed
        }
      }
    });
    
    // Listen for variant change events from other product components
    document.addEventListener('variant:changed', function(e) {
      if (e.detail && e.detail.variant && e.detail.variant.id) {
        updateVariantMetafield(e.detail.variant.id);
      }
    });
    
    // Listen for Shopify section events  
    document.addEventListener('shopify:section:load', function() {
      // Re-initialize when sections are loaded
      setTimeout(() => {
        const currentVariantInput = document.querySelector('[name="id"]:checked, [name="id"], .product-sticky-js:checked');
        if (currentVariantInput) {
          const variantId = currentVariantInput.dataset.variantId || currentVariantInput.value;
          if (variantId) {
            updateVariantMetafield(variantId);
          }
        }
      }, 100);
    });
    
    // Initialize on page load with current variant
    const currentVariantInput = document.querySelector('[name="id"]:checked, [name="id"], .product-sticky-js:checked');
    if (currentVariantInput) {
      const variantId = currentVariantInput.dataset.variantId || currentVariantInput.value;
      if (variantId) {
        updateVariantMetafield(variantId);
      }
    }
  });