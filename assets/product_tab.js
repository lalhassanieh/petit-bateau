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
      // Try both container types (product description and custom content)
      const metafieldContainer = document.getElementById('variant-metafield-content') || document.getElementById('variant-metafield-content-custom');
      const metafieldValue = document.getElementById('variant-metafield-value') || document.getElementById('variant-metafield-value-custom');
      
      console.log('Checking containers:', {
        main: document.getElementById('variant-metafield-content') ? 'FOUND' : 'NOT FOUND',
        custom: document.getElementById('variant-metafield-content-custom') ? 'FOUND' : 'NOT FOUND'
      });
      
      if (!metafieldContainer || !metafieldValue) {
        console.log('❌ No metafield containers found at all');
        return;
      }
      
      if (!variantId || variantId === '' || variantId === 'undefined' || variantId === 'null') {
        console.log('Invalid variant ID:', variantId);
        metafieldContainer.style.display = 'none';
        return;
      }
      
      console.log('Updating metafield for variant:', variantId);
      updateDebugVariant(variantId);
      
      // Try to get metafield from data attributes on variant options first
      let variantOption = document.querySelector(`option[data-variant-id="${variantId}"]`);
      
      if (variantOption && variantOption.dataset.variantMetafield) {
        const erpCode = variantOption.dataset.variantMetafield;
        metafieldValue.textContent = erpCode;
        metafieldContainer.style.display = 'block';
        console.log('✅ Variant metafield found via data attribute:', erpCode);
        updateDebugStatus('SUCCESS - Metafield displayed');
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

  // Immediate initialization - No waiting for DOM
  console.log('🚀 SCRIPT LOADED - Metafield system starting...');
  
  // Update debug status immediately
  function updateDebugStatus(message) {
    const debugStatus = document.getElementById('debug-script-status');
    if (debugStatus) {
      debugStatus.textContent = message;
      debugStatus.style.color = message.includes('SUCCESS') ? 'green' : 'orange';
    }
  }
  
  // Update debug current variant
  function updateDebugVariant(variantId) {
    const debugVariant = document.getElementById('debug-current-variant');
    if (debugVariant) {
      debugVariant.textContent = variantId || 'None';
    }
  }
  
  // Simple immediate test
  setTimeout(function() {
    console.log('🔍 Testing metafield containers...');
    updateDebugStatus('Testing containers...');
    
    const testContainer = document.getElementById('variant-metafield-content');
    const testValue = document.getElementById('variant-metafield-value');
    
    console.log('Container found:', testContainer ? 'YES' : 'NO');
    console.log('Value element found:', testValue ? 'YES' : 'NO');
    
    if (testContainer && testValue) {
      console.log('✅ SUCCESS - Containers found');
      updateDebugStatus('SUCCESS - System ready');
      
      testValue.textContent = 'METAFIELD SYSTEM READY';
      testContainer.style.display = 'block';
      
      setTimeout(() => {
        testContainer.style.display = 'none';
      }, 3000);
      
      // Setup variant detection
      setupVariantDetection();
    } else {
      console.log('❌ FAILED - Containers not found');
      updateDebugStatus('FAILED - Containers not found');
      console.log('All elements with ID:', document.querySelectorAll('[id]'));
    }
  }, 2000);
  
  // Setup variant detection function
  function setupVariantDetection() {
    console.log('🔧 Setting up variant detection...');
    
    // Method 1: Monitor select changes
    document.addEventListener('change', function(e) {
      if (e.target.name === 'id' || e.target.classList.contains('product-sticky-js')) {
        const variantId = e.target.value;
        console.log('📋 Select changed to:', variantId);
        if (variantId) {
          updateVariantMetafield(variantId);
        }
      }
    });
    
    // Method 2: Monitor input changes
    document.addEventListener('input', function(e) {
      if (e.target.name === 'id') {
        const variantId = e.target.value;
        console.log('⌨️ Input changed to:', variantId);
        if (variantId) {
          updateVariantMetafield(variantId);
        }
      }
    });
    
    // Method 3: Polling fallback
    let lastVariantId = null;
    setInterval(() => {
      const input = document.querySelector('input[name="id"]');
      if (input && input.value !== lastVariantId) {
        console.log('🔄 Polling detected:', input.value);
        lastVariantId = input.value;
        if (input.value) {
          updateVariantMetafield(input.value);
        }
      }
    }, 2000);
    
    // Get initial variant
    setTimeout(() => {
      const initialInput = document.querySelector('input[name="id"]');
      if (initialInput && initialInput.value) {
        console.log('🎯 Initial variant found:', initialInput.value);
        updateVariantMetafield(initialInput.value);
      }
    }, 1000);
  }