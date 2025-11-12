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

  // Completely independent variant detection system - Initialize immediately
  console.log('🚀 SCRIPT LOADED - Metafield system starting...');
  
  // Test immediately without waiting for DOM
  function initializeMetafieldSystem() {
    console.log('🔍 Initializing metafield system...');
    
    // Test containers immediately
    const testContainer = document.getElementById('variant-metafield-content');
    const testValue = document.getElementById('variant-metafield-value');
    
    console.log('Container check:', testContainer ? 'FOUND' : 'NOT FOUND');
    console.log('Value check:', testValue ? 'FOUND' : 'NOT FOUND');
    
    if (testContainer && testValue) {
      console.log('✅ Metafield containers found');
      
      // Show a test message immediately
      testValue.textContent = 'TEST - System Ready';
      testContainer.style.display = 'block';
      
      // Hide after 3 seconds
      setTimeout(() => {
        testContainer.style.display = 'none';
        console.log('Test message hidden');
      }, 3000);
    } else {
      console.log('❌ Metafield containers NOT found');
      // Show all elements with IDs containing 'variant' or 'metafield'
      const allElements = document.querySelectorAll('[id*="variant"], [id*="metafield"]');
      console.log('Found elements with variant/metafield IDs:', allElements);
    }
    
    return testContainer && testValue;
  }

      setupVariantDetection();
    } else {
      // Retry after DOM loads
      document.addEventListener('DOMContentLoaded', function() {
        console.log('📋 DOM Loaded - Retrying...');
        if (initializeMetafieldSystem()) {
          setupVariantDetection();
        }
      });
      
      // Also try after window loads  
      window.addEventListener('load', function() {
        console.log('🌐 Window Loaded - Final retry...');
        if (initializeMetafieldSystem()) {
          setupVariantDetection();
        }
      });
    }
  }
  
  // Setup variant detection methods
  function setupVariantDetection() {
    console.log('🔧 Setting up variant detection...');
    
    // Method 1: Direct click monitoring on variant selectors
    function setupClickMonitoring() {
      console.log('Setting up click monitoring...');
      
      // Monitor all clickable elements that might change variants
      document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check if it's a variant option
        if (target.matches('option[data-variant-id], .product-sticky-js option, select.product-sticky-js option')) {
          const variantId = target.dataset.variantId || target.getAttribute('data-variant-id');
          console.log('📱 Clicked variant option:', variantId);
          
          if (variantId) {
            setTimeout(() => updateVariantMetafield(variantId), 200);
          }
        }
        
        // Check if it's a select element
        if (target.matches('select.product-sticky-js, select[name="id"]')) {
          setTimeout(() => {
            const selectedOption = target.selectedOptions[0];
            if (selectedOption) {
              const variantId = selectedOption.dataset.variantId || selectedOption.getAttribute('data-variant-id');
              console.log('📋 Selected from dropdown:', variantId);
              
              if (variantId) {
                updateVariantMetafield(variantId);
              }
            }
          }, 100);
        }
      });
    }
    
    // Method 2: Watch for DOM changes (when variant inputs update)
    function setupDOMWatcher() {
      console.log('Setting up DOM watcher...');
      
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // Watch for changes to hidden inputs
          if (mutation.target.name === 'id' && mutation.target.type === 'hidden') {
            console.log('🔄 Hidden input changed:', mutation.target.value);
            updateVariantMetafield(mutation.target.value);
          }
          
          // Watch for attribute changes
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            if (mutation.target.name === 'id') {
              console.log('🔄 Input value changed:', mutation.target.value);
              updateVariantMetafield(mutation.target.value);
            }
          }
        });
      });
      
      // Observe the entire document for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value']
      });
    }
    
    // Method 3: Manual polling as ultimate fallback
    function setupPolling() {
      console.log('Setting up polling fallback...');
      
      let lastVariantId = null;
      
      setInterval(() => {
        const hiddenInput = document.querySelector('input[name="id"]');
        if (hiddenInput && hiddenInput.value && hiddenInput.value !== lastVariantId) {
          console.log('🔄 Polling detected change:', hiddenInput.value);
          lastVariantId = hiddenInput.value;
          updateVariantMetafield(hiddenInput.value);
        }
      }, 1000);
    }
    
    // Initialize all methods
    setupClickMonitoring();
    setupDOMWatcher();  
    setupPolling();
    
    // Try to get initial variant
    const initialInput = document.querySelector('input[name="id"]');
    if (initialInput && initialInput.value) {
      console.log('🎯 Initial variant:', initialInput.value);
      updateVariantMetafield(initialInput.value);
    }
  }
  
  // Start the initialization process immediately
  tryInitialization();