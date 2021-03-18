'use strict'

// 스크롤이 될 때마다 등록한 이 함수를 호출해줘
// Arrow function : 아무런 인자를 받지 않고
// 우리가 원하는 블럭을 실행 

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    // console.log(window.scrollY);
    // console.log('navbarHeight >>> '+    navbarHeight);

    if (window.scrollY > navbarHeight) {
        // navbar에 있는 클래스 리스트에 클래스를 추가해 줄건데
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

// Handle scrolling when tapping on the navbar menu
// 클릭했을때 원하는 아이디를 알아야한다.
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {

    const target = event.target;
    const link = target.dataset.link;

    if (link == null) {
        return;
    }

    // console.log(event.target.dataset.link);
    // console.log(event.target.dataset);
    // console.log(event.target);
    navbarMenu.classList.remove('open'); //메뉴를 눌러서 지점으로 가면 창이 닫힐수 있도록
    scrollIntoView(link);
    selectNavItem(target);
});

//Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
    navbarMenu.classList.toggle('open');

});

// Handle click on "contact me" buttom on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', (event) => {
    scrollIntoView('#contact');
});

// Make home slowly fade to transparent as the window scrolls down
// home의 요소가져옴
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {

    // console.log(`homeHeight>>> ${homeHeight}`);
    // console.log(1 - window.scrollY / homeHeight);
    // opacity >> 0(투명) 1(불투명)

    home.style.opacity = 1 - window.scrollY / homeHeight;

});

// "Show arrow up" button when scrolling down (스크롤링이 되면 나타나게)
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    // 현재 스크롤 상태가 home의 절반 높이를 넘어 섰을때
    if (window.scrollY > homeHeight / 2) {
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
});

//Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
});

//Projects
//work 버튼들이 들어있는 컨테이너
const workBtnContainer = document.querySelector('.work__categories');
//프로젝트가 들어있는 컨테이너
const projectContainer = document.querySelector('.work__projects');
//각각의 프로젝트들을 배열로 전부의 프로젝트를
const projects = document.querySelectorAll('.project');

workBtnContainer.addEventListener('click', (e) => {
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;

    if (filter == null) {
        return;
    }

    //Remove selection from the previous item and select the new one
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    // 노드이름이 버튼이면 그냥 타겟 but 아니라면( span 이라면) 부모노드 버튼으로 타겟
    const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
    target.classList.add('selected');

    projectContainer.classList.add('anim-out');

    //0.3초가 지나고 settimeout안에 함수 실행
    setTimeout(() => {
        //projects array의 아이템들을 foreach하나당 각각 번갈아 가면서 하나씩!
        projects.forEach((project) => {
            // console.log(project.dataset.type);

            //all이거나 filter가 project에 있는 dataset.type이 똑같으면
            if (filter === '*' || filter === project.dataset.type) {
                //프로젝트의 클래스 제거
                project.classList.remove('invisible');
            } else {
                project.classList.add('invisible');
            }
        });

        projectContainer.classList.remove('anim-out');

    }, 300);

});



// 1. 모든 섹션 요소들과 메뉴 아이템을 가지고 온다.
// 2. IntersectionObserver을 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.


// 우리가 사용하는 모든 아이디들을 배열로 저장
const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#work',
    '#contact'
];

// 모든 섹션 요소들을 sections라는 배열에 할당
const sections = sectionIds.map(id => document.querySelector(id));
// 동일한 내비게이션 메뉴아이템 요소들을 navitems에 할당
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

// 현재 선택된 메뉴 인덱스와 메뉴 요소를 변수에 저장
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];

//새로운 메뉴 아이템을 선택할 때마다 이전에 활성된 active 지워주고
//다시 새롭게 할당하고 나서 다시 active 지정
function selectNavItem(selected) {

    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

// 선택된 요소로 스크롤
function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
    root: null, // 기본적인 값 viewport(윈도우 부분) 항상 null로 표시 
    rootMargin: '0px', //viewport에서 위치 변경 (부모컨테이너이후에서 미리 준비해 놓겠다는 의미)
    threshold: 0.3, // 얼마만큼 보여야 콜백함수가 호출될지를 결정 0 ~ 1 (100%)
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting && entry.intersectionRatio > 0) {

            // console.log(entry);
            const index = sectionIds.indexOf(`#${entry.target.id}`);

            //스크롤링이 아래로 되어서 페이지가 올라옴
            //섹션이 밖으로 나갈때마다 그 다음에 해당하는 인덱스 계산해서 할당
            if (entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {
    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if (Math.round(window.scrollY + window.innerHeight) >=
        document.body.clientHeight) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);

});

// Modal을 가져옵니다.
const modals = document.getElementsByClassName("modal");
// Modal을 띄우는 클래스 이름을 가져옵니다.
const openModal = document.getElementsByClassName("project");
// Modal을 닫는 close 클래스를 가져옵니다.
const closeModal = document.getElementsByClassName("close");
const funcs = [];

// Modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
function Modal(num) {
    return function () {
        // 해당 클래스의 내용을 클릭하면 Modal을 띄웁니다.
        openModal[num].onclick = function () {
            modals[num].style.display = "block";
            console.log(num);
        };

        // <span> 태그(X 버튼)를 클릭하면 Modal이 닫습니다.
        closeModal[num].onclick = function () {
            modals[num].style.display = "none";
        };
    };
}

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
for (let i = 0; i < openModal.length; i++) {
    funcs[i] = Modal(i);

}

// 원하는 Modal 수만큼 funcs 함수를 호출합니다.
for (let j = 0; j < openModal.length; j++) {
    funcs[j]();

}

// Modal 영역 밖을 클릭하면 Modal을 닫습니다.
window.onclick = function (event) {
    if (event.target.className == "modal") {
        event.target.style.display = "none";
    }
};