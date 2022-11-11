'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const header = document.querySelector('.header');
const message = document.createElement('div');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSection = document.querySelectorAll('.section');

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal); // by clicking cross in the modal
overlay.addEventListener('click', closeModal); //by clicking an outside of the modal

//by pressing esc btn
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

message.classList.add('cookie-message');
message.innerHTML =
  'we use cookied for improved functionality and analytics, <button class="btn  btn--close-cookie">Got it </button>';

header.prepend(message);
// header.append(message.cloneNode(true));
// header.append(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
    //
  });

message.style.backgroundColor = '#37383d';
message.style.width = '110%';
// document.documentElement.style.setProperty('--color-primary', 'brown');

//scrollling the first section on clicking down arrow
btnScrollTo.addEventListener('click', function (e) {
  // console.log(e.target.getBoundingClientRect()); //this will give us data of that click target
  // console.log('current Scroll (x/y)', window.pageXOffset, window.pageYOffset);

  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     console.log('link');
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//scrolling the page on clicking the navbar lelement
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //gaurd class for show modal ; kunki vahan pr click karne pr koi bhi scroll nhi hoga
  if (e.target.classList.contains('btn--show-modal')) return;

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //console.log(clicked);

  // Guard clause
  if (!clicked) return;

  //pahle active vala class hata jayega phir 'clicked vale me active class sambadhh kr diya jayega
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // iske asth hame content bhi to karna h isilliye
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab -> ckicked vale ko chuna aur active class sambadhh kiya
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); //data-tab="x"
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Menu//navbar fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // this means bind value
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//sticky navigation
/*
const initialCords = section1.getBoundingClientRect();
// disclaimer scroll event is never a good method to use sticky positions
//bcz it fire all the changes if miner scroll happens
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCords.top)
    nav.classList.add('sticky'); //sticky is a class of html
  else nav.classList.remove('sticky');
});
*/
/*
Sticky Navigation: Intersection Observer API
const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOption = {
  root: null,
  threshold: [0, 0.2], //percentage of intersection
};

const observer = new IntersectionObserver(obsCallBack, obsOption);
observer.observe(section1);
*/

//other cool method for sticky nav

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; //entries[0]
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////////////////////////////////////////////

//Reveal section
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden'); //hidden opacity 0 and 8rem se niche dhakel do
});

//lazy images

const imgTargets = document.querySelectorAll('img[data-src]');
const lazyImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyImage, {
  root: null,
  threshold: 0,
});
imgTargets.forEach(img => imgObserver.observe(img));

//////////////********************____________________________---*******************//////////////////////

//slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  //creating dots on the basis of images
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  let currSlide = 0;
  const maxSlide = slides.length;

  const moveSlide = function (slideNo) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slideNo) * 100}%)`)
    );

    //activate dot on move
    const activateDot = function (slide) {
      document
        .querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'));
      document
        .querySelector(`.dots__dot[data-slide="${slideNo}"]`)
        .classList.add('dots__dot--active');
    };
    activateDot(slideNo);
  };

  moveSlide(0); // starting point

  // next slide
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) currSlide = 0;
    else currSlide++;

    moveSlide(currSlide);
  };
  //prev slide
  const prevSlide = function () {
    if (currSlide === 0) currSlide = maxSlide - 1;
    else currSlide--;

    moveSlide(currSlide);
  };

  //through button
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', nextSlide);

  //through Arrow key
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //through click
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      moveSlide(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////////////////////////////////////////
