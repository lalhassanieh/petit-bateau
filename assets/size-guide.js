const sizeGuideModal = document.getElementById('sizeGuideModal');
const sizeGuideSteps = document.getElementById('sizeGuideSteps');
let stepStack = [];

function showStep(html) {
  sizeGuideSteps.innerHTML = html;
}

function goToStep(stepHtml) {
  stepStack.push(sizeGuideSteps.innerHTML);
  showStep(stepHtml);
}

function goBack() {
  if (stepStack.length > 0) {
    showStep(stepStack.pop());
  }
}

// document.getElementById('openSizeGuide').onclick = () => {
//   document.getElementById('sizeGuideModal').setAttribute('aria-hidden', 'false');
//   showStep('univers-step');
//   updateNav('univers');
// };

// document.getElementById('closeSizeGuide').onclick = () => {
//   document.getElementById('sizeGuideModal').setAttribute('aria-hidden', 'true');
// };

window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('sizeGuideModal').setAttribute('aria-hidden', 'true');
});

const stepsContainer = document.getElementById('sizeGuideSteps');
let stepHistory = [];
let lastUnivers = null;

function showStep(className, dataCategory = null) {
  // Hide all steps
  Array.from(stepsContainer.children).forEach(child => child.style.display = 'none');
  // Show the requested step
  let step;
  if (dataCategory) {
    step = stepsContainer.querySelector('.' + className + '[data-category="' + dataCategory + '"]');
  } else {
    step = stepsContainer.querySelector('.' + className);
  }
  if (step) step.style.display = '';
}

function updateNav(level) {
  const navUnivers = document.querySelector('.nav-univers');
  const navVetement = document.querySelector('.nav-vetement');
  const navTaille = document.querySelector('.nav-taille');
  navUnivers.classList.remove('active');
  navVetement.classList.remove('active');
  navTaille.classList.remove('active');
  if (level === 'univers') {
    navUnivers.classList.add('active');
  } else if (level === 'vetement') {
    navUnivers.classList.add('active');
    navVetement.classList.add('active');
  } else if (level === 'taille') {
    navUnivers.classList.add('active');
    navVetement.classList.add('active');
    navTaille.classList.add('active');
  }
}

stepsContainer.addEventListener('click', function(e) {
  // Univers selection
  const universBtn = e.target.closest('button[data-univers]');
  if (universBtn) {
    const univers = universBtn.getAttribute('data-univers');
    lastUnivers = univers;
    stepHistory.push('univers-step');
    if (univers === 'baby') {
      showStep('category-step');
      updateNav('vetement');
    } else if (univers === 'woman') {
      showStep('step-woman-categories'); // keep as is for now
      updateNav('vetement');
    }
    // Add similar logic for girl, boy if needed
    return;
  }
  // Category selection (baby)
  const catBtn = e.target.closest('button[data-category]');
  if (catBtn) {
    const cat = catBtn.getAttribute('data-category');
    const currentStep = stepsContainer.querySelector('.category-step:not([style*="display: none"])');
    if (currentStep && lastUnivers === 'baby') {
      stepHistory.push('category-step');
      showStep('table-step', cat); // Fix: use data-category for table-step
      updateNav('taille');
    }
    // Add similar logic for woman, girl, boy if needed
    return;
  }
  // Back button
  if (e.target.matches('[data-back]')) {
    const prev = stepHistory.pop() || 'univers-step';
    if (prev === 'univers-step') {
      showStep('univers-step');
      updateNav('univers');
    } else if (prev === 'category-step') {
      showStep('category-step');
      updateNav('vetement');
    }
    // Hide all table steps if going back to categories
    Array.from(stepsContainer.querySelectorAll('.table-step')).forEach(div => div.style.display = 'none');
    return;
  }
});

// Navigation bar click handlers for back navigation
const navUnivers = document.querySelector('.nav-univers');
const navVetement = document.querySelector('.nav-vetement');
// Only allow going back, not forward
navUnivers.addEventListener('click', function() {
  showStep('univers-step');
  updateNav('univers');
  stepHistory = [];
  // Hide all tables and categories
  Array.from(stepsContainer.querySelectorAll('.table-step, .category-step')).forEach(div => div.style.display = 'none');
});
navVetement.addEventListener('click', function() {
  // Only go back if on taille
  if (navVetement.classList.contains('active') && document.querySelector('.nav-taille.active')) {
    showStep('category-step');
    updateNav('vetement');
    Array.from(stepsContainer.querySelectorAll('.table-step')).forEach(div => div.style.display = 'none');
    if (stepHistory.length > 0) stepHistory.pop();
  }
});
